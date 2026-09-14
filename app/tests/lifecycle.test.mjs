import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createLoopServer} from '../server.mjs';
test('health identifies Loop; stopping requires this PC and its access key',async t=>{
  const dir=mkdtempSync(join(tmpdir(),'loop-life-'));
  const {server,key}=createLoopServer({dataDir:dir});
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  t.after(()=>{server.close();rmSync(dir,{recursive:true,force:true});});
  const url=`http://127.0.0.1:${server.address().port}`;
  assert.deepEqual(await (await fetch(url+'/api/health')).json(),{app:'loop-clipboard',protocol:1});
  assert.equal((await fetch(url+'/api/stop',{method:'POST'})).status,401);
  const remoteStatus=await new Promise((resolve,reject)=>{
    const req=http.request(url+'/api/stop',{method:'POST',headers:{Host:'192.168.1.2',Authorization:'Bearer '+key}},res=>{res.resume();res.on('end',()=>resolve(res.statusCode));});req.on('error',reject);req.end();
  });
  assert.equal(remoteStatus,403);
  const closed=new Promise(r=>server.once('close',r));
  assert.equal((await fetch(url+'/api/stop',{method:'POST',headers:{Authorization:'Bearer '+key}})).status,200);
  await closed;assert.equal(server.listening,false);
});
