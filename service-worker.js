const CACHE_NAME = 'purple-dragon-pwa-v7';

const APP_SHELL = [
  './',
  './index.html',
  './styles.css',
  './config.js',
  './db.js',
  './app.js',
  './admin.js',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png'
];

const CREST_FILE = 'official_crest_good_copy.png';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== 'GET') return;

  // Cache the Purple Dragon crest after the first successful online load.
  // Opaque cross-origin image responses can still be stored by Cache API.
  if (url.pathname.includes(CREST_FILE)) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;

        return fetch(request).then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          return response;
        });
      })
    );
    return;
  }

  // Never intercept Apps Script or other cross-origin API requests.
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;

      return fetch(request).then(response => {
        if (response && response.status === 200 && response.type === 'basic') {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        }
        return response;
      });
    })
  );
});
