// Service Worker — precaches app shell and assets for offline use
const CACHE_VERSION = 'v3::foodshare';
const BASE_PATH = '/Foodshare/';

// Essential assets to cache - only include files that definitely exist
const CACHE_ASSETS = [
  BASE_PATH,
  BASE_PATH + 'index.html',
  BASE_PATH + 'contact.html',
  BASE_PATH + 'credits.html',
  BASE_PATH + 'submit.html',
  BASE_PATH + 'topics.html',
  // CSS files
  BASE_PATH + 'css/style.css',
  BASE_PATH + 'css/index.css',
  BASE_PATH + 'css/pages.css',
  // JavaScript files
  BASE_PATH + 'scripts/app.js',
  BASE_PATH + 'scripts/base.js',
  BASE_PATH + 'scripts/index.js',
  // JSON data files
  BASE_PATH + 'items.json',
  BASE_PATH + 'locations.json',
  BASE_PATH + 'categories.json',
  // Favicon files
  BASE_PATH + 'favicon/favicon.ico',
  BASE_PATH + 'favicon/favicon.svg',
  BASE_PATH + 'favicon/apple-touch-icon.png',
  // App manifest
  BASE_PATH + 'site.webmanifest',
  // Logo assets
  BASE_PATH + 'assets/logo.png',
  BASE_PATH + 'assets/logo_dark.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(cache => {
      // Cache files individually to handle failures gracefully
      return Promise.all(
        CACHE_ASSETS.map(url => {
          return cache.add(url).catch(err => {
            console.warn('Failed to cache:', url, err);
          });
        })
      );
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_VERSION)
          .map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Simple cache-first strategy for requests
self.addEventListener('fetch', event => {
  const request = event.request;

  // Always try navigation requests (HTML) network-first, fallback to cache
  if (request.mode === 'navigate' || (request.method === 'GET' && request.headers.get('accept') && request.headers.get('accept').includes('text/html'))) {
    event.respondWith(
      fetch(request).then(response => {
        // Update the cache with the latest index.html
        const copy = response.clone();
        caches.open(CACHE_VERSION).then(cache => cache.put(BASE_PATH + 'index.html', copy));
        return response;
      }).catch(() => caches.match(BASE_PATH + 'index.html'))
    );
    return;
  }

  // For other requests, use cache-first then network fallback
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(networkResponse => {
        // Put a copy in cache for future requests (optional for third-party requests)
        if (request.method === 'GET' && networkResponse && networkResponse.status === 200) {
          const copy = networkResponse.clone();
          caches.open(CACHE_VERSION).then(cache => cache.put(request, copy));
        }
        return networkResponse;
      }).catch(() => {
        // If image requested and not available, return a transparent fallback or appropriate response
        if (request.destination === 'image') {
          return new Response('', { status: 404, statusText: 'Image not in cache' });
        }
        return new Response('', { status: 503, statusText: 'Service Unavailable' });
      });
    })
  );
});
