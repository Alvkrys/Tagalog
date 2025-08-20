const CACHE = 'talalog-v1';
const ASSETS = [
  './',
  './index.html',
  './tagalog.html',
  './coming-en.html',
  './coming-zh.html',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(k => k !== CACHE).map(k => caches.delete(k))
  )));
  self.clients.claim();
});
self.addEventListener('fetch', (e) => {
  const { request } = e;
  const isSupabase = /supabase\.co|supabase-js/.test(request.url);
  if (isSupabase) {
    e.respondWith(fetch(request).catch(() => caches.match(request)));
  } else {
    e.respondWith(
      caches.match(request).then(resp => resp || fetch(request).then(r => {
        const clone = r.clone();
        caches.open(CACHE).then(c => c.put(request, clone));
        return r;
      }).catch(() => resp))
    );
  }
});
