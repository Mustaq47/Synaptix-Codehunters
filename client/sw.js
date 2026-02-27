/**
 * NEXUS ASSESS — Service Worker
 * Provides offline support by caching all app shell assets.
 */

const CACHE_NAME = 'lvlup-v9';
const SHELL_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/src/css/variables.css',
    '/src/css/base.css',
    '/src/css/screens.css',
    '/src/css/create.css',
    '/src/css/lang-select.css',
    '/src/css/game-ui.css',
    '/src/css/questions.css',
    '/src/css/profile.css',
    '/src/css/completion.css',
    '/src/css/overlays.css',
    '/src/css/layout.css',
    '/src/css/responsive.css',
    '/src/js/app.js',
    '/src/js/constants.js',
    '/src/js/data.js',
    '/src/js/storage.js',
    '/src/js/state.js',
    '/src/js/profile.js',
    '/src/js/screens.js',
    '/src/js/game.js',
    '/src/js/ui.js',
    '/src/js/revision.js',
];

// Cache all shell assets on install
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(SHELL_ASSETS))
            .then(() => self.skipWaiting())
    );
});

// Clean up old caches on activate
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        ).then(() => self.clients.claim())
    );
});

// Cache-first strategy: serve from cache, fall back to network
self.addEventListener('fetch', (event) => {
    // Only intercept GET requests for same-origin resources
    if (event.request.method !== 'GET') return;
    if (!event.request.url.startsWith(self.location.origin)) return;

    event.respondWith(
        caches.match(event.request).then(cached => {
            if (cached) return cached;
            return fetch(event.request).then(response => {
                // Only cache successful responses
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }
                const cloned = response.clone();
                caches.open(CACHE_NAME).then(cache => cache.put(event.request, cloned));
                return response;
            });
        })
    );
});
