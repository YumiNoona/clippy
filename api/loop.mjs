import { createHash, randomBytes } from 'node:crypto';
import { validItem } from '../app/sync-model.mjs';

const MAX_BYTES = 3 * 1024 * 1024;
const hash = value => createHash('sha256').update(value).digest('hex');
const namespace = () => process.env.LOOP_REDIS_NAMESPACE || `loop-${process.env.VERCEL_ENV || 'development'}`;
const ttl = () => Math.max(3600, Math.min(31536000, Number(process.env.LOOP_SPACE_TTL_SECONDS) || 2592000));
class APIError extends Error { constructor(status, message) { super(message); this.status = status; } }
const reply = (res, status, body) => { res.setHeader('Cache-Control', 'no-store'); res.statusCode = status; res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(body)); };

async function redis(command) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new APIError(503, 'Cloud sync is not configured yet. You can still save clips on this device.');
  const response = await fetch(url, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(command), signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new APIError(503, 'Cloud storage is temporarily unavailable.');
  const result = await response.json();
  if (result.error) throw new APIError(503, 'Cloud storage could not save your changes.');
  return result.result;
}

// Both rate limits and compare-and-set writes are atomic across serverless instances.
const LIMIT = "local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],ARGV[1]) end; return n";
const CAS = "local old=redis.call('GET',KEYS[1]); if not old then return -1 end; if old~=ARGV[1] then return 0 end; redis.call('SET',KEYS[1],ARGV[2],'EX',ARGV[3]); return 1";
async function rate(req, group, count, seconds) {
  const ip = req.headers['x-vercel-forwarded-for'] || req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  const n = await redis(['EVAL', LIMIT, '1', `${namespace()}:rate:${group}:${hash(String(ip).split(',')[0].trim())}`, String(seconds)]);
  if (n > count) throw new APIError(429, 'Too many requests. Please try again shortly.');
}
async function bodyJSON(req) {
  if (!req.headers['content-type']?.startsWith('application/json')) throw new APIError(415, 'JSON required.');
  if (Number(req.headers['content-length']) > MAX_BYTES) throw new APIError(413, 'Send fewer clips at a time.');
  if (req.body !== undefined) {
    const raw = typeof req.body === 'string' ? req.body : Buffer.isBuffer(req.body) ? req.body.toString() : JSON.stringify(req.body);
    if (Buffer.byteLength(raw) > MAX_BYTES) throw new APIError(413, 'Send fewer clips at a time.');
    try { return JSON.parse(raw); } catch { throw new APIError(400, 'Invalid JSON.'); }
  }
  const chunks = []; let size = 0;
  for await (const chunk of req) { size += chunk.length; if (size > MAX_BYTES) throw new APIError(413, 'Send fewer clips at a time.'); chunks.push(chunk); }
  try { return JSON.parse(Buffer.concat(chunks).toString()); } catch { throw new APIError(400, 'Invalid JSON.'); }
}
async function changeSpace(key, update) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const before = await redis(['GET', key]);
    if (!before) throw new APIError(410, 'This shared space expired. Create a new one or use another invite.');
    const { db, result } = update(JSON.parse(before));
    const encoded = JSON.stringify(db);
    if (Buffer.byteLength(encoded) > MAX_BYTES || db.items.length > 2000) throw new APIError(507, 'Shared space is full (3 MB). Create a new space; your local clips are kept.');
    const changed = await redis(['EVAL', CAS, '1', key, before, encoded, String(ttl())]);
    if (changed === -1) throw new APIError(410, 'This shared space expired.');
    if (changed === 1) return result;
  }
  throw new APIError(409, 'Another device is saving. Your changes will retry.');
}

export default async function handler(req, res) {
  try {
    if (req.headers['sec-fetch-site'] === 'cross-site') throw new APIError(403, 'Open Loop directly.');
    const url = new URL(req.url, 'https://loop.invalid');
    const route = url.searchParams.get('route') || url.pathname.replace(/^\/api\//, '');
    if (route === 'health' && req.method === 'GET') return reply(res, 200, { app: 'loop-clipboard', protocol: 1, hosted: true });
    if (route === 'config' && req.method === 'GET') return reply(res, 200, { hosted: true, cloudSync: !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN), retentionDays: Math.round(ttl() / 86400) });
    if (route === 'create-space' && req.method === 'POST') {
      await rate(req, 'create', 10, 3600);
      const accessKey = randomBytes(32).toString('hex');
      await redis(['SET', `${namespace()}:space:${hash(accessKey)}`, JSON.stringify({ items: [], devices: [], removedDevices: [] }), 'EX', String(ttl()), 'NX']);
      return reply(res, 201, { key: accessKey });
    }
    if (!['sync', 'connection', 'remove-device'].includes(route)) throw new APIError(404, 'Not available in the hosted app.');
    const key = (req.headers.authorization || '').replace(/^Bearer /, '');
    if (!/^[a-f0-9]{64}$/.test(key)) throw new APIError(401, 'Open an invite link or create a shared space.');
    const dbKey = `${namespace()}:space:${hash(key)}`;
    await rate(req, `sync:${hash(key).slice(0, 16)}`, 180, 60);
    if (route === 'connection' && req.method === 'GET') {
      if (!await redis(['EXISTS', dbKey])) throw new APIError(410, 'Shared space expired.');
      return reply(res, 200, { addresses: [], canPair: false, hosted: true });
    }
    if (req.method !== 'POST') throw new APIError(405, 'POST required.');
    const body = await bodyJSON(req);
    if (route === 'remove-device') {
      if (typeof body.id !== 'string' || body.id.length > 100) throw new APIError(400, 'Invalid device.');
      const result = await changeSpace(dbKey, db => {
        db.devices = db.devices.filter(d => d.id !== body.id);
        db.removedDevices = [...new Set([...(db.removedDevices || []), body.id])];
        if (db.removedDevices.length > 1000) throw new APIError(507, 'Create a new shared space to reset its device history.');
        return { db, result: { devices: db.devices } };
      });
      return reply(res, 200, result);
    }
    if (!Array.isArray(body.items) || body.items.length > 5000 || !body.items.every(validItem)) throw new APIError(400, 'Invalid clipboard item.');
    const d = body.device;
    if (!d || typeof d.id !== 'string' || d.id.length > 100 || typeof d.name !== 'string' || d.name.length > 100 || !['desktop', 'phone', 'tablet'].includes(d.type)) throw new APIError(400, 'Invalid device.');
    const result = await changeSpace(dbKey, db => {
      if ((db.removedDevices || []).includes(d.id)) throw new APIError(403, 'Device removed. Join the space again to reconnect.');
      const byId = new Map(db.items.map(x => [x.id, x]));
      const acknowledged = [], conflicts = [];
      for (const x of body.items) {
        const prev = byId.get(x.id);
        if (prev?.mutation === x.mutation) { acknowledged.push(x.mutation); continue; }
        if (prev && (prev.deleted || (!x.deleted && (x.rev || 0) !== prev.rev))) { conflicts.push(x.mutation); continue; }
        const next = { id: x.id, type: x.type, title: x.title, content: x.content, device: x.device, ts: x.ts, updatedAt: x.updatedAt, pinned: x.pinned, fav: x.fav, deleted: x.deleted, meta: x.meta, mutation: x.mutation, rev: (prev?.rev || 0) + 1, synced: 'synced' };
        if (next.deleted) { next.content = ''; next.title = 'Deleted item'; delete next.meta; }
        byId.set(x.id, next); acknowledged.push(x.mutation);
      }
      db.items = [...byId.values()];
      db.devices = db.devices.filter(x => x.id !== d.id).concat({ id: d.id, name: d.name, type: d.type, lastSeen: Date.now(), updatedAt: Date.now() }).slice(-100);
      return { db, result: { items: db.items, devices: db.devices, acknowledged, conflicts } };
    });
    return reply(res, 200, result);
  } catch (error) { return reply(res, error.status || 500, { error: error.status ? error.message : 'Cloud sync failed. Your local changes are kept.' }); }
}
