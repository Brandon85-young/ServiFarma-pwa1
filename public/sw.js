// ===== SERVICE WORKER - ServiFarmaSerVel =====
// Cambia la versión cada vez que modifiques los archivos guardados
const CACHE_NAME = 'servifarma-v2';
 
// Archivos que se guardan para que la app abra sin internet
const ARCHIVOS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];
 
// 1) INSTALL: se ejecuta la primera vez. Guarda los archivos en caché.
self.addEventListener('install', (event) => {
  console.log('[SW] Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ARCHIVOS))
  );
  self.skipWaiting(); // activa el SW nuevo sin esperar
});
 
// 2) ACTIVATE: borra cachés viejas de versiones anteriores.
self.addEventListener('activate', (event) => {
  console.log('[SW] Activado');
  event.waitUntil(
    caches.keys().then((nombres) =>
      Promise.all(
        nombres
          .filter((nombre) => nombre !== CACHE_NAME)
          .map((nombre) => caches.delete(nombre))
      )
    )
  );
  self.clients.claim();
});
 
// 3) FETCH: cada vez que la app pide algo.
// Estrategia "red primero, si falla usa caché".
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
 
  event.respondWith(
    fetch(event.request)
      .then((respuesta) => {
        // Guarda una copia de lo que llegó de internet
        const copia = respuesta.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copia));
        return respuesta;
      })
      .catch(() => caches.match(event.request)) // sin internet: usa caché
  );
});
