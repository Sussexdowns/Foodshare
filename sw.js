// Service Worker — precaches app shell and assets for offline use
const CACHE_VERSION = 'v2::foodshare';
const CACHE_ASSETS = [
  '/',
  'index.html',
  'contact.html',
  'credits.html',
  'submit.html',
  'topics.html',
  'header.html',
  'footer.html',
  'footer-details.html',
  'settings_modal.html',
  // CSS files
  'css/style.css',
  'css/index.css',
  'css/pages.css',
  'css/submit.css',
  'css/topics.css',
  'css/select2-bootstrap.css',
  // JavaScript files
  'scripts/app.js',
  'scripts/base.js',
  'scripts/form.js',
  'scripts/index.js',
  'scripts/submit.js',
  'scripts/topic.js',
  'scripts/topics.js',
  // JSON data files
  'items.json',
  'locations.json',
  'categories.json',
  'uk_counties.json',
  'uk_towns.json',
  // Favicon files
  'favicon/favicon.ico',
  'favicon/favicon.svg',
  'favicon/apple-touch-icon.png',
  'favicon/web-app-manifest-192x192.png',
  'favicon/web-app-manifest-512x512.png',
  // App manifest
  'site.webmanifest',
  // Logo assets
  'assets/logo.png',
  'assets/logo_dark.png',
  // Fonts
  'fonts/Sarina-Regular.ttf',
  'fonts/inter-normal.woff2',
  'fonts/inter-bold.woff2',
  'fonts/Raleway/Raleway-VariableFont_wght.ttf',
  // Font Awesome
  'fonts/fontawesome-free-6.5.0/css/all.min.css',
  'fonts/fontawesome-free-6.5.0/webfonts/fa-brands-400.woff2',
  'fonts/fontawesome-free-6.5.0/webfonts/fa-regular-400.woff2',
  'fonts/fontawesome-free-6.5.0/webfonts/fa-solid-900.woff2'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(cache => {
      return cache.addAll(CACHE_ASSETS);
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
        caches.open(CACHE_VERSION).then(cache => cache.put('index.html', copy));
        return response;
      }).catch(() => caches.match('index.html'))
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
