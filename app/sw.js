const CACHE='clippy-shell-v8';
const ASSETS=['/ui.css','/fonts/JetBrainsMono-Regular.ttf','/fonts/JetBrainsMono-Bold.ttf','/','/app.js','/manifest.webmanifest','/icon.svg','/icon-192.png','/icon-512.png','/apple-touch-icon.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>(k.startsWith('loop-shell-')||k.startsWith('clippy-shell-')) && k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const url=new URL(e.request.url);
  if(e.request.method!=='GET' || url.origin!==location.origin || !ASSETS.includes(url.pathname))return;
  e.respondWith(fetch(e.request).then(response=>{
    if(response.ok){const copy=response.clone();e.waitUntil(caches.open(CACHE).then(c=>c.put(url.pathname,copy)));}
    return response;
  }).catch(()=>caches.match(url.pathname)));
});
