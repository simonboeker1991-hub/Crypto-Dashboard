
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open('crypto-dash-v1').then((c) => c.addAll([
    './index.html',
    './manifest.webmanifest',
    './icons/icon-192.png',
    './icons/icon-512.png'
  ])));
});
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((resp) => resp || fetch(e.request))
  );
});
