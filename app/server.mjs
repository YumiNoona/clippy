import { validItem } from './sync-model.mjs';
import http from 'node:http';
import { readFileSync, writeFileSync, renameSync, mkdirSync, existsSync } from 'node:fs';
import { randomBytes, randomInt, timingSafeEqual } from 'node:crypto';
import QRCode from 'qrcode';
import { fileURLToPath } from 'node:url';
import { join, resolve } from 'node:path';
import { networkInterfaces } from 'node:os';

const root = fileURLToPath(new URL('.', import.meta.url));
const MAX_BODY = 16 * 1024 * 1024;
const MAX_STORE = 64 * 1024 * 1024;
async function readSmallJSON(req){
  const chunks=[];let size=0;
  for await(const chunk of req){size+=chunk.length;if(size>1024)throw new Error('Too large');chunks.push(chunk);}
  return JSON.parse(Buffer.concat(chunks).toString());
}
function localRequest(req){
  const ip=req.socket.remoteAddress;
  const host=(req.headers.host || '').split(':')[0];
  return ['127.0.0.1','::1','::ffff:127.0.0.1'].includes(ip) && ['localhost','127.0.0.1'].includes(host) &&
    (!req.headers['sec-fetch-site'] || req.headers['sec-fetch-site']==='same-origin');
}
export function lanAddresses(port){
  return Object.entries(networkInterfaces()).flatMap(([name,list])=>(list || [])
    .filter(a=>a.family==='IPv4' && !a.internal && /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(a.address))
    .map(a=>({name,url:`http://${a.address}:${port}`})));
}
const json = (res, status, value) => {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(value));
};
export function createLoopServer({ dataDir = join(root, 'data') } = {}) {
  mkdirSync(dataDir, { recursive: true });
  const dbPath = join(dataDir, 'clipboard.json');
  const keyPath = join(dataDir, 'access-key.txt');
  if (!existsSync(keyPath)) writeFileSync(keyPath, randomBytes(32).toString('hex'), { mode: 0o600 });
  const key = readFileSync(keyPath, 'utf8').trim();
  let db = existsSync(dbPath) ? JSON.parse(readFileSync(dbPath, 'utf8')) : { items: [], devices: [] };
  const saveDb=next=>{const encoded=JSON.stringify(next);if(Buffer.byteLength(encoded)>MAX_STORE)throw new Error('Storage full');writeFileSync(dbPath+'.tmp',encoded,{mode:0o600});renameSync(dbPath+'.tmp',dbPath);db=next;};
  let pairing=null;
  const server = http.createServer(async (req, res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('X-Frame-Options', 'DENY');
    const path = new URL(req.url, 'http://localhost').pathname;
    if (path.startsWith('/api/')) {
      if(req.headers['sec-fetch-site']==='cross-site')return json(res,403,{error:'Open Loop directly to connect.'});
      if(path==='/api/health' && req.method==='GET')return json(res,200,{app:'loop-clipboard',protocol:1});
      if(path==='/api/local-session' && req.method==='GET'){
        return localRequest(req)?json(res,200,{key}):json(res,403,{error:'PC access only.'});
      }
      if(path==='/api/pair' && req.method==='POST'){
        if(!pairing || pairing.expiresAt<=Date.now())return json(res,410,{error:'Pairing code expired. Generate a new one on the PC.'});
        if(pairing.attempts>=10)return json(res,429,{error:'Too many attempts. Generate a new code on the PC.'});
        pairing.attempts++;
        try{
          if(!req.headers['content-type']?.startsWith('application/json'))return json(res,415,{error:'JSON required.'});
          const body=await readSmallJSON(req);
          if(typeof body?.code!=='string' || body.code!==pairing.code)return json(res,401,{error:'Incorrect pairing code.'});
          pairing=null;return json(res,200,{key});
        }catch{return json(res,400,{error:'Invalid pairing request.'});}
      }
      const provided = Buffer.from((req.headers.authorization || '').replace(/^Bearer /, ''));
      const expected = Buffer.from(key);
      if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) return json(res, 401, { error: 'Enter the access key from your PC.' });
      if(path==='/api/quick' && req.method==='GET'){
        if(!localRequest(req))return json(res,403,{error:'Quick clipboard is available on the PC.'});
        return json(res,200,db.items.filter(x=>!x.deleted && ['text','rich','link'].includes(x.type)).sort((a,b)=>Number(b.pinned)-Number(a.pinned)||b.ts-a.ts).slice(0,50).map(x=>({id:x.id,title:x.title,content:x.content,pinned:x.pinned})));
      }
      if(path==='/api/quick-action' && req.method==='POST'){
        if(!localRequest(req))return json(res,403,{error:'PC access only.'});
        try{
          const body=await readSmallJSON(req);
          if(!['pin','delete','clear'].includes(body.action) || (body.action!=='clear' && typeof body.id!=='string') || (body.action==='pin' && typeof body.pinned!=='boolean'))return json(res,400,{error:'Invalid action.'});
          let changed=0;
          const next=db.items.map(x=>{
            if(x.deleted || (body.action==='clear' ? x.pinned : x.id!==body.id))return x;
            changed++;
            const updated={...x,updatedAt:Date.now(),rev:(x.rev||0)+1,mutation:randomBytes(16).toString('hex'),synced:'synced'};
            if(body.action==='pin')updated.pinned=body.pinned;
            else{updated.deleted=true;updated.title='Deleted item';updated.content='';delete updated.meta;}
            return updated;
          });
          saveDb({...db,items:next});return json(res,200,{changed});
        }catch{return json(res,500,{error:'Could not update clipboard.'});}
      }
      if(path==='/api/remove-device' && req.method==='POST'){
        try{
          const body=await readSmallJSON(req);
          if(typeof body.id!=='string' || body.id.length>100 || ['windows-capture','windows-quick'].includes(body.id))return json(res,400,{error:'Manage Windows capture from the tray.'});
          saveDb({...db,devices:db.devices.filter(d=>d.id!==body.id),removedDevices:[...new Set([...(db.removedDevices||[]),body.id])]});
          return json(res,200,{devices:db.devices});
        }catch{return json(res,500,{error:'Could not remove device.'});}
      }
      if(path==='/api/stop' && req.method==='POST'){
        if(!localRequest(req))return json(res,403,{error:'Stop Loop from this PC.'});
        json(res,200,{stopping:true});
        server.close();server.closeIdleConnections();return;
      }
      if(path==='/api/connection' && req.method==='GET')return json(res,200,{addresses:lanAddresses(server.address().port),canPair:localRequest(req)});
      if(path==='/api/pair-code' && req.method==='POST'){
        if(!localRequest(req))return json(res,403,{error:'Generate pairing codes on the PC.'});
        const current={code:String(randomInt(100000,1000000)),expiresAt:Date.now()+5*60*1000,attempts:0};
        pairing=current;
        try{
          const addresses=await Promise.all(lanAddresses(server.address().port).map(async a=>({...a,
            qr:await QRCode.toDataURL(a.url+'/#pair='+current.code,{width:240,margin:3,errorCorrectionLevel:'M'})})));
          return json(res,200,{code:current.code,expiresAt:current.expiresAt,addresses});
        }catch{return json(res,500,{error:'Could not generate pairing code. Try again.'});}
      }
      if (path !== '/api/sync' || req.method !== 'POST') return json(res, 404, { error: 'Not found' });
      if (!req.headers['content-type']?.startsWith('application/json')) return json(res, 415, { error: 'JSON required' });
      try {
        let size = 0; const chunks = [];
        for await (const chunk of req) {
          size += chunk.length;
          if (size > MAX_BODY) { json(res, 413, { error: 'Sync batch is too large.' }); return; }
          chunks.push(chunk);
        }
        const body = JSON.parse(Buffer.concat(chunks).toString());
        if (!Array.isArray(body?.items) || body.items.length > 5000 || !body.items.every(validItem)) return json(res, 400, { error: 'Invalid clipboard item.' });
        const d = body.device;
        if (!d || typeof d.id !== 'string' || d.id.length > 100 || typeof d.name !== 'string' || d.name.length > 100 || !['desktop','phone','tablet'].includes(d.type)) return json(res, 400, { error: 'Invalid device.' });
        if((db.removedDevices||[]).includes(d.id))return json(res,403,{error:'Device removed. Pair again to reconnect.'});
        const byId = new Map(db.items.map(x => [x.id, x]));
        const acknowledged = [], conflicts = [];
        for (const x of body.items) {
          const prev = byId.get(x.id);
          if (prev?.mutation === x.mutation) { acknowledged.push(x.mutation); continue; }
          // Tombstones are permanent: an old offline device must never restore a deletion.
          if (prev && (prev.deleted || (!x.deleted && (x.rev || 0) !== prev.rev))) {
            conflicts.push(x.mutation); continue;
          }
          const next = { id:x.id, type:x.type, title:x.title, content:x.content, device:x.device,
            ts:x.ts, updatedAt:x.updatedAt, pinned:x.pinned, fav:x.fav, deleted:x.deleted,
            meta:x.meta, mutation:x.mutation, rev:(prev?.rev || 0) + 1, synced:'synced' };
          if (next.deleted) { next.content = ''; next.title = 'Deleted item'; delete next.meta; }
          byId.set(x.id, next); acknowledged.push(x.mutation);
        }
        const devices = db.devices.filter(x => x.id !== d.id);
        devices.push({ id:d.id, name:d.name, type:d.type, lastSeen:Date.now(), updatedAt:Date.now() });
        const nextDb = { ...db, items:[...byId.values()], devices:devices.slice(-100) };
        const encoded = JSON.stringify(nextDb);
        if (Buffer.byteLength(encoded) > MAX_STORE) return json(res, 507, { error:'Clipboard storage is full. Delete some items.' });
        writeFileSync(dbPath + '.tmp', encoded, { mode:0o600 });
        renameSync(dbPath + '.tmp', dbPath);
        db = nextDb;
        return json(res, 200, { ...db, acknowledged, conflicts });
      } catch (error) {
        return json(res, error instanceof SyntaxError ? 400 : 500, { error:error instanceof SyntaxError ? 'Invalid JSON.' : 'Could not save clipboard data.' });
      }
    }
    const assets = { '/':'clipsync.html', '/clipsync.html':'clipsync.html', '/app.js':'app.js', '/sw.js':'sw.js', '/manifest.webmanifest':'manifest.webmanifest', '/icon.svg':'icon.svg' };
    for(const name of ['icon-192.png','icon-512.png','apple-touch-icon.png'])assets['/'+name]=name;
    assets['/ui.css']='ui.css';
    for(const name of ['JetBrainsMono-Regular.ttf','JetBrainsMono-Bold.ttf'])assets['/fonts/'+name]='fonts/'+name;
    const asset = assets[path];
    if (!asset || !['GET','HEAD'].includes(req.method)) return json(res, 404, { error:'Not found' });
    try {
      const content = readFileSync(join(root, asset));
      const ext = asset.split('.').pop();
      res.writeHead(200, { 'Content-Type':({ html:'text/html; charset=utf-8', js:'text/javascript', webmanifest:'application/manifest+json', svg:'image/svg+xml', png:'image/png', css:'text/css', ttf:'font/ttf' })[ext], 'Cache-Control':'no-cache' });
      res.end(req.method === 'HEAD' ? undefined : content);
    } catch { json(res, 404, { error:'Not found' }); }
  });
  return { server, key };
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 4317);
  const { server } = createLoopServer();
  server.on('error', error => { console.error(error.code === 'EADDRINUSE' ? `Loop is already running, or port ${port} is busy.` : error.message); process.exitCode = 1; });
  server.listen(port, process.env.HOST || '0.0.0.0', () => {
    console.log(`Loop is ready: http://localhost:${port}`);
    for(const a of lanAddresses(port))console.log(`Wi-Fi / hotspot: ${a.url}`);
    console.log('On the PC, open Connect devices to pair a phone by QR code.');
  });
}

