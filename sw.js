const CACHE_VERSION = 'v3';
const CACHE_FILES = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/fallback.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => cache.addAll(CACHE_FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .then(response => {
        // Cache successful responses
        const clone = response.clone();
        caches.open(CACHE_VERSION)
          .then(cache => cache.put(e.request, clone));
        return response;
      })
      .catch(() => caches.match(e.request))
  );
});
