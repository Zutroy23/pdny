const CACHE_NAME = 'purple-dragon-pwa-v8';

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
  './icon-512.png',
  './belts/unofficial_white.png',
  './belts/white.png',
  './belts/white_elite.png',
  './belts/white_bar_1.png',
  './belts/white_bar_2.png',
  './belts/yellow.png',
  './belts/yellow_elite.png',
  './belts/yellow_bar_1.png',
  './belts/yellow_bar_2.png',
  './belts/orange.png',
  './belts/orange_elite.png',
  './belts/orange_bar_1.png',
  './belts/orange_bar_2.png',
  './belts/green.png',
  './belts/green_elite.png',
  './belts/green_bar_1.png',
  './belts/green_bar_2.png',
  './belts/blue.png',
  './belts/blue_elite.png',
  './belts/blue_bar_1.png',
  './belts/blue_bar_2.png',
  './belts/purple.png',
  './belts/purple_elite.png',
  './belts/purple_bar_1.png',
  './belts/purple_bar_2.png',
  './belts/red.png',
  './belts/red_elite.png',
  './belts/red_bar_1.png',
  './belts/red_bar_2.png',
  './belts/brown_3_kyu.png',
  './belts/brown_3_kyu_elite.png',
  './belts/brown_2_kyu.png',
  './belts/brown_2_kyu_elite.png',
  './belts/brown_1_kyu.png',
  './belts/brown_1_kyu_elite.png',
  './belts/black_white_stripe.png',
  './belts/black_yellow_stripe.png',
  './belts/black_orange_stripe.png',
  './belts/black_green_stripe.png',
  './belts/black_blue_stripe.png',
  './belts/black_purple_stripe.png',
  './belts/black_brown_stripe.png',
  './belts/jet_black.png',
  './belts/jet_black_red_star_1.png',
  './belts/jet_black_red_star_2.png',
  './belts/jet_black_red_star_3.png',
  './belts/jet_black_gold_star_1.png',
  './belts/jet_black_gold_star_2.png',
  './belts/jet_black_gold_star_3.png',
  './belts/jet_black_purple_star_1.png',
  './belts/jet_black_purple_star_2.png',
  './belts/jet_black_purple_star_3.png',
  './belts/black_2_degree.png',
  './belts/black_2_degree_red_star_1.png',
  './belts/black_2_degree_red_star_2.png',
  './belts/black_2_degree_red_star_3.png',
  './belts/black_2_degree_gold_star_1.png',
  './belts/black_2_degree_gold_star_2.png',
  './belts/black_2_degree_gold_star_3.png',
  './belts/black_2_degree_purple_star_1.png',
  './belts/black_2_degree_purple_star_2.png',
  './belts/black_2_degree_purple_star_3.png',
  './belts/black_3_senpai.png',
  './belts/black_3_senpai_red_star_1.png',
  './belts/black_3_senpai_red_star_2.png',
  './belts/black_3_senpai_red_star_3.png',
  './belts/black_3_senpai_gold_star_1.png',
  './belts/black_3_senpai_gold_star_2.png',
  './belts/black_3_senpai_gold_star_3.png',
  './belts/black_3_senpai_purple_star_1.png',
  './belts/black_3_senpai_purple_star_2.png',
  './belts/black_3_senpai_purple_star_3.png',
  './belts/black_4_sensei.png',
  './belts/black_4_sensei_red_star_1.png',
  './belts/black_4_sensei_red_star_2.png',
  './belts/black_4_sensei_red_star_3.png',
  './belts/black_4_sensei_gold_star_1.png',
  './belts/black_4_sensei_gold_star_2.png',
  './belts/black_4_sensei_gold_star_3.png',
  './belts/black_4_sensei_purple_star_1.png',
  './belts/black_4_sensei_purple_star_2.png',
  './belts/black_4_sensei_purple_star_3.png',
  './belts/black_4_renshi.png',
  './belts/black_5_sensei.png',
  './belts/black_6_shihan.png',
  './belts/black_7_shihan.png',
  './belts/black_8_shihan.png',
  './belts/black_9_professor.png',
  './belts/black_10_grandmaster.png',
  './belts/ranks.json'
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
