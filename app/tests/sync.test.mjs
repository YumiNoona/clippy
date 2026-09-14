import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createLoopServer } from '../server.mjs';

test('authenticated durable sync, concurrent devices, retries, conflicts and deletion',async t=>{
  const dataDir=mkdtempSync(join(tmpdir(),'loop-test-'));
  let {server,key}=createLoopServer({dataDir});
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  let url=`http://127.0.0.1:${server.address().port}`;
  t.after(async()=>{await new Promise(r=>server.close(r));rmSync(dataDir,{recursive:true,force:true});});
  const sync=async(items=[],id='a')=>{
    const res=await fetch(url+'/api/sync',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+key},body:JSON.stringify({items,device:{id,name:id,type:'desktop'}})});
    assert.equal(res.status,200);return res.json();
  };
  const item=(id,content=id)=>({id,type:'text',title:id,content,device:'a',ts:Date.now(),updatedAt:Date.now(),pinned:false,fav:false,deleted:false,mutation:id+'-1',rev:0});
  assert.equal((await fetch(url+'/api/sync',{method:'POST'})).status,401);
  assert.equal((await fetch(url+'/data/access-key.txt')).status,404);
  assert.equal((await fetch(url+'/clipsync.original.html')).status,404);
  await Promise.all([sync([item('one')],'a'),sync([item('two')],'b')]);
  let result=await sync();assert.equal(result.items.length,2);assert.equal(result.devices.length,2);
  result=await sync([item('one')]);assert.equal(result.items.find(x=>x.id==='one').rev,1);
  const old=result.items.find(x=>x.id==='one');
  result=await sync([{...old,pinned:true,mutation:'pin'}]);assert.equal(result.items.find(x=>x.id==='one').rev,2);
  result=await sync([{...old,content:'stale',mutation:'stale'}],'b');assert.deepEqual(result.conflicts,['stale']);
  result=await sync([{...old,deleted:true,mutation:'delete'}]);assert.equal(result.items.find(x=>x.id==='one').deleted,true);
  result=await sync([{...old,mutation:'restore'}],'b');assert.equal(result.items.find(x=>x.id==='one').deleted,true);
  assert.equal(result.items.find(x=>x.id==='one').content,'');
  const invalid={...item('bad'),type:'image',meta:{dataUrl:'x\" onerror=alert(1)'}};
  assert.equal((await fetch(url+'/api/sync',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+key},body:JSON.stringify({items:[invalid],device:{id:'a',name:'a',type:'phone'}})})).status,400);
  await new Promise(r=>server.close(r));
  ({server}=createLoopServer({dataDir}));await new Promise(r=>server.listen(0,'127.0.0.1',r));url=`http://127.0.0.1:${server.address().port}`;
  result=await sync();assert.equal(result.items.length,2);assert.equal(result.items.find(x=>x.id==='one').deleted,true);
});
