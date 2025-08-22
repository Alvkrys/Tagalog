const CACHE_NAME = 'talalog-v5';
const ASSETS = [
  './',
  './index.html',
  './tagalog.html',
  './coming-en.html',
  './coming-zh.html',
  './manifest.webmanifest'
];

self.addEventListener('install', (e)=>{
  e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', (e)=>{
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE_NAME?caches.delete(k):null)))
  );
  self.clients.claim();
});
self.addEventListener('fetch', (e)=>{
  const { request } = e;
  if (request.method !== 'GET') return;
  e.respondWith(
    caches.match(request).then(res => res || fetch(request).then(net => {
      const copy = net.clone();
      caches.open(CACHE_NAME).then(c=>c.put(request, copy));
      return net;
    }).catch(()=>res))
  );
});
