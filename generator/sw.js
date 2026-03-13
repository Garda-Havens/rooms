const CACHE_NAME = 'gardahavens-generator-v1';
const FILES_TO_CACHE = [
  '/',             // index.html
  '/generator.html',
  '/manifest.json',
  '/icon.png'
];
// Installa il service worker e aggiunge i file in cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching files for offline use');
        return cache.addAll(FILES_TO_CACHE);
      })
  );
  self.skipWaiting(); // Attiva subito il SW
});
// Attiva il service worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('Removing old cache', key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});
// Intercetta le richieste e serve dalla cache se offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(resp => resp || fetch(event.request))
      .catch(() => caches.match('/generator.html')) // fallback offline
  );
});
