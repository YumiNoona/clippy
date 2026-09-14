import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createLoopServer} from '../server.mjs';
import http from 'node:http';

test('Wi-Fi pairing is authenticated, one-use, limited and PC-controlled',async t=>{
  const dir=mkdtempSync(join(tmpdir(),'loop-pair-'));
  const {server,key}=createLoopServer({dataDir:dir});
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  t.after(async()=>{await new Promise(r=>server.close(r));rmSync(dir,{recursive:true,force:true});});
  const url=`http://127.0.0.1:${server.address().port}`;
  const create=()=>fetch(url+'/api/pair-code',{method:'POST',headers:{Authorization:'Bearer '+key}});
  const joinCode=code=>fetch(url+'/api/pair',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code})});
  const rawStatus=(path,options)=>new Promise((resolve,reject)=>{
    const request=http.request(url+path,options,res=>{res.resume();res.on('end',()=>resolve(res.statusCode));});
    request.on('error',reject);request.end();
  });
  assert.equal((await fetch(url+'/api/pair-code',{method:'POST'})).status,401);
  assert.equal(await rawStatus('/api/local-session',{headers:{Host:'192.168.1.3'}}),403);
  assert.equal((await fetch(url+'/api/local-session',{headers:{'Sec-Fetch-Site':'cross-site'}})).status,403);
  assert.equal(await rawStatus('/api/pair-code',{method:'POST',headers:{Host:'192.168.1.3',Authorization:'Bearer '+key}}),403);
  assert.equal((await (await fetch(url+'/api/local-session')).json()).key,key);
  assert.equal((await joinCode('123456')).status,410);
  const pair=await (await create()).json();
  assert.match(pair.code,/^\d{6}$/);assert.ok(pair.expiresAt>Date.now());assert.ok(pair.expiresAt<=Date.now()+300000);
  for(const address of pair.addresses){assert.match(address.qr,/^data:image\/png;base64,/);assert.ok(address.url.startsWith('http://'));}
  assert.equal((await joinCode('000000')).status,401);
  assert.equal((await (await joinCode(pair.code)).json()).key,key);
  assert.equal((await joinCode(pair.code)).status,410);
  const locked=await (await create()).json();
  for(let i=0;i<10;i++)assert.equal((await joinCode('000000')).status,401);
  assert.equal((await joinCode(locked.code)).status,429);
  const fresh=await (await create()).json();assert.equal((await joinCode(fresh.code)).status,200);
});
