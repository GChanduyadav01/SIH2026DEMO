/**
 * SmritiAI - Service Worker for Offline PWA Support
 * Caches core assets and provides offline fallback for remote areas.
 */

const CACHE_NAME = 'SmritiAI-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './login.html',
  './patient.html',
  './games.html',
  './memory-game.html',
  './reminders.html',
  './caregiver.html',
  './healthcare.html',
  './css/style.css',
  './js/main.js',
  './js/patient.js',
  './js/games.js',
  './js/memory-game.js',
  './js/reminders.js',
  './js/dashboard.js',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SmritiAI SW] Caching offline assets...');
      return cache.addAll(ASSETS_TO_CACHE);
    }).catch(err => {
      console.log('[SmritiAI SW] Install caching non-critical error:', err);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        // Return index.html if navigation request fails offline
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
