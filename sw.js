const CACHE_NAME = 'vane-kawaii-v1';

// Aquí le decimos qué archivos guardar para usarlos sin internet
const urlsToCache = [
    './',
    './index.html',
    './notas.html',
    './contraseñas.html',
    './manifest.json',
    './icono.png',
    './iconopag.png'
];

// Instalar el Service Worker y guardar en caché
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Archivos cacheados exitosamente');
                return cache.addAll(urlsToCache);
            })
    );
});

// Cuando no hay internet, buscar en el caché
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Si el archivo está en caché, lo devuelve (funciona offline)
                if (response) {
                    return response;
                }
                // Si no, intenta buscarlo en internet
                return fetch(event.request);
            })
    );
});

// Actualizar el caché si haces cambios en el código
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});