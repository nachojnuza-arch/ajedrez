const CACHE_NAME = 'ajedrez-pro-v2';

// Todos los recursos limpios que necesitamos para jugar sin internet
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    '[https://cdn.tailwindcss.com](https://cdn.tailwindcss.com)',
    '[https://cdnjs.cloudflare.com/ajax/libs/chess.js/0.10.3/chess.min.js](https://cdnjs.cloudflare.com/ajax/libs/chess.js/0.10.3/chess.min.js)',
    '[https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.2/stockfish.js](https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.2/stockfish.js)',
    '[https://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg](https://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg)',
    '[https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg](https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg)',
    '[https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg](https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg)',
    '[https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg](https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg)',
    '[https://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg](https://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg)',
    '[https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg](https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg)',
    '[https://upload.wikimedia.org/wikipedia/commons/c/c7/Chess_pdt45.svg](https://upload.wikimedia.org/wikipedia/commons/c/c7/Chess_pdt45.svg)',
    '[https://upload.wikimedia.org/wikipedia/commons/e/ef/Chess_ndt45.svg](https://upload.wikimedia.org/wikipedia/commons/e/ef/Chess_ndt45.svg)',
    '[https://upload.wikimedia.org/wikipedia/commons/9/98/Chess_bdt45.svg](https://upload.wikimedia.org/wikipedia/commons/9/98/Chess_bdt45.svg)',
    '[https://upload.wikimedia.org/wikipedia/commons/f/ff/Chess_rdt45.svg](https://upload.wikimedia.org/wikipedia/commons/f/ff/Chess_rdt45.svg)',
    '[https://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg](https://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg)',
    '[https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg](https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg)'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then((cache) => {
            console.log('Descargando assets para modo offline...');
            return cache.addAll(ASSETS_TO_CACHE);
        })
        .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
        .then((response) => {
            if (response) return response;
            return fetch(event.request).then(fetchRes => {
                return caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request.url, fetchRes.clone());
                    return fetchRes;
                });
            });
        }).catch(() => {
            console.log('Recurso no disponible y sin conexión.');
        })
    );
});
