// 版本 b351c3dc80 — 每次重新組裝會變，手機有網路時會自動抓新版
const CACHE='aid-b351c3dc80';
const CORE=['./','index.html','manifest.json','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET') return;
  const u=new URL(r.url);
  if(r.mode==='navigate'||u.pathname.endsWith('index.html')){ // 網路優先：有網路就拿最新版
    e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(CACHE).then(x=>x.put('index.html',c));return res;}).catch(()=>caches.match('index.html')));return;}
  e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{ if(res.ok&&(u.origin===location.origin||u.host.includes('fonts.g'))){const c=res.clone();caches.open(CACHE).then(x=>x.put(r,c));} return res;})));
});
