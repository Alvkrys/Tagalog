const CACHE_NAME = 'talalog-v2';
const ASSETS = [
  './',
  './index.html',
  './tagalog.html',
  './coming-en.html',
  './coming-zh.html',
  './manifest.webmanifest'
];

self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)));
});

self.addEventListener('activate', e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(
    keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k))
  )));
});

self.addEventListener('fetch', e=>{
  const req = e.request;
  if(req.method!=='GET') return;
  e.respondWith(
    caches.match(req).then(cached=>{
      return cached || fetch(req).then(res=>{
        const clone = res.clone();
        caches.open(CACHE_NAME).then(c=>c.put(req, clone));
        return res;
      }).catch(()=> cached );
    })
  );
});
