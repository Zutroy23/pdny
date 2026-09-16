importScripts('./version.js?v=0.63');
const CACHE_NAME = `purple-dragon-pwa-v${self.PD_APP_VERSION}`;

const APP_SHELL = [
  './',
  './index.html?v=0.63',
  './styles.css?v=0.63',
  './config.js',
  './version.js?v=0.63',
  './db.js?v=0.63',
  './belt-images.js?v=0.63',
  './app.js?v=0.63',
  './admin.js?v=0.63',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
];

const CREST_FILE = 'official_crest_good_copy.png';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
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

  // HTML navigation and config are network-first when online. This prevents
  // an old cached index from hiding a newly deployed build. Offline falls
  // back to the cached shell.
  const isNavigation = request.mode === 'navigate';
  const isConfig = url.pathname.endsWith('/config.js');

  if (isNavigation || isConfig) {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          }
          return response;
        })
        .catch(async () => {
          const exact = await caches.match(request);
          if (exact) return exact;
          return caches.match('./index.html?v=0.63');
        })
    );
    return;
  }

  // Versioned static assets remain cache-first for fast/offline operation.
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
