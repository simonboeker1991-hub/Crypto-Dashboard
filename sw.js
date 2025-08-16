const CACHE_NAME = 'crypto-dash-v10';
const ASSETS = [
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(ASSETS)));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k === CACHE_NAME ? null : caches.delete(k))))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;

  // Für HTML (navigate) immer netzwerk-first -> du bekommst Updates sofort
  if (req.mode === 'navigate' || req.destination === 'document') {
    e.respondWith(
      fetch(req).catch(() => caches.match('./index.html'))
    );
    return;
  }

  // dynamische Daten niemals aus Cache bedienen
  const url = new URL(req.url);
  if (url.pathname.endsWith('/data.json') || url.hostname.includes('cryptopanic.com')) {
    return; // Browser normal machen lassen (kein Intercept)
  }

  // Sonst: cache-first (Icons/Manifest)
  e.respondWith(
    caches.match(req).then((resp) => resp || fetch(req))
  );
});
