// Run with: node tests/browser.mjs (requires Playwright), or set PLAYWRIGHT_MODULE.
import { mkdtempSync, rmSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import assert from 'node:assert/strict';
import { createLoopServer } from '../server.mjs';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const dir=mkdtempSync(join(tmpdir(),'loop-browser-'));
const {server,key}=createLoopServer({dataDir:dir});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const base=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({channel:'msedge',headless:true});
const errors=[];
mkdirSync('test-results',{recursive:true});
try{
  const desktop=await browser.newContext({viewport:{width:1440,height:900}});
  const mobile=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const p=await desktop.newPage(),q=await mobile.newPage();
  for(const page of [p,q]){page.on('pageerror',e=>errors.push(e.message));await page.goto(base+'/#key='+key);await page.waitForFunction(()=>document.getElementById('statusText').textContent==='All changes synced');}
  const fresh=await browser.newContext({viewport:{width:390,height:844}});
  const login=await fresh.newPage();login.on('pageerror',e=>errors.push(e.message));
  await login.route('**/api/local-session',route=>route.fulfill({status:403,body:'{}'}));await login.goto(base);
  await login.locator('#advancedConnection summary').click();
  await login.locator('#accessKey').waitFor({state:'visible'});
  await login.locator('#accessKey').fill('0'.repeat(64));await login.locator('#confirmAddDevice').click();
  await login.waitForFunction(()=>document.getElementById('connectFeedback').textContent==='Access key required');
  await login.locator('#accessKey').fill(key);await login.locator('#confirmAddDevice').click();
  await login.waitForFunction(()=>document.getElementById('connectFeedback').textContent.startsWith('Connected.'));
  await fresh.close();
  await p.getByRole('button',{name:'Type or paste text',exact:true}).click();
  await p.locator('#composerText').fill('  hello from PC\nsecond line  ');
  await p.getByRole('button',{name:'Save to Loop'}).click();
  await p.waitForFunction(()=>document.querySelector('.sync-chip.synced'));
  await q.waitForFunction(()=>document.querySelector('.item-title')?.textContent.includes('hello from PC'),{},{timeout:15000});
  await q.locator('.item').first().click();
  assert.equal(await q.locator('.full-text').textContent(),'  hello from PC\nsecond line  ');
  await q.locator('#closeDetail').click();
  await q.locator('#onlineToggle').click();
  await q.locator('#writeNote').click();await q.locator('#composerText').fill('Offline survives reload');await q.locator('#saveNote').click();
  await q.waitForTimeout(300);
  await mobile.setOffline(true);await q.reload();
  await q.waitForFunction(()=>document.querySelector('#listScroll')?.textContent.includes('Offline survives reload'));
  await mobile.setOffline(false);
  await q.waitForFunction(()=>document.querySelector('#statusText').textContent==='All changes synced',{},{timeout:20000});
  await p.waitForFunction(()=>document.querySelector('#listScroll')?.textContent.includes('Offline survives reload'),{},{timeout:15000});
  // Stale offline device must not resurrect a remotely deleted record.
  await q.locator('#onlineToggle').click();
  await p.locator('.item').filter({hasText:'hello from PC'}).locator('[data-act=delete]').click();
  await p.waitForFunction(()=>document.getElementById('statusText').textContent==='All changes synced');
  await q.locator('.item').filter({hasText:'hello from PC'}).locator('[data-act=pin]').click();
  await q.locator('#onlineToggle').click();
  await q.waitForFunction(()=>!document.querySelector('#listScroll').textContent.includes('hello from PC'));
  await q.locator('#searchInput').fill('no match');assert.equal(await q.locator('.item').count(),0);await q.locator('#searchInput').fill('');
  await q.locator('#fileInput').setInputFiles({name:'sample.txt',mimeType:'text/plain',buffer:Buffer.from('file transfer works')});
  await q.waitForFunction(()=>document.querySelector('.item-title')?.textContent==='sample.txt');
  await q.waitForFunction(()=>document.getElementById('statusText').textContent==='All changes synced');
  await p.waitForFunction(()=>document.querySelector('#listScroll').textContent.includes('sample.txt'),{},{timeout:15000});
  const downloadPromise=p.waitForEvent('download');
  await p.locator('.item').filter({hasText:'sample.txt'}).locator('[data-act=copy]').click();
  assert.equal((await downloadPromise).suggestedFilename(),'sample.txt');
  // Stored HTML remains text in titles, device names, and toasts.
  await p.locator('#writeNote').click();await p.locator('#composerText').fill('<img src=x onerror=window.hacked=1>');await p.locator('#saveNote').click();
  assert.equal(await p.evaluate(()=>window.hacked),undefined);
  await p.waitForFunction(()=>document.getElementById('statusText').textContent==='All changes synced');
  await p.route('**/api/sync',route=>route.fulfill({status:503,body:'unavailable'}));
  await p.locator('#writeNote').click();await p.locator('#composerText').fill('Retry after server failure');await p.locator('#saveNote').click();
  await p.waitForFunction(()=>document.getElementById('statusText').textContent.includes('Sync failed'));
  assert.equal(await p.locator('.item').filter({hasText:'Retry after server failure'}).locator('.sync-chip.pending').count(),1);
  await p.unroute('**/api/sync');
  await p.waitForFunction(()=>document.getElementById('statusText').textContent==='All changes synced',{},{timeout:15000});
  for(const width of [320,390,768,1024,1440]){
    await p.setViewportSize({width,height:900});
    assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`No overflow at ${width}`);
    await p.screenshot({animations:'disabled',path:`test-results/loop-${width}.png`});
  }
  assert.deepEqual(errors,[]);
  console.log('PASS: two-device sync, exact text, offline reload, deletion conflict, search, file transfer, HTML escaping, server-failure retry, 5 viewport widths, no runtime errors');
}finally{await browser.close();await new Promise(r=>server.close(r));rmSync(dir,{recursive:true,force:true});}
