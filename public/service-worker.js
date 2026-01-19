/* eslint-disable no-restricted-globals */

const CACHE_NAME = 'churrasco-v1';

// O Service Worker vai interceptar as requisições
self.addEventListener('fetch', (event) => {
  // Ignora requisições de extensões do Chrome ou APIs externas se necessário
    if (!(event.request.url.indexOf('http') === 0)) return;

    event.respondWith(
        caches.match(event.request).then((response) => {
        // Retorna o arquivo do cache OU busca na rede
        return response || fetch(event.request);
        })
    );
});

// Limpa caches antigos quando você atualizar o app
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
        return Promise.all(
            cacheNames.map((cacheName) => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
                return caches.delete(cacheName);
            }
            return null;
            })
        );
        })
    );
});