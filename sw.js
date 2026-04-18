/* ═══════════════════════════════════════════════
   NathuraVitae Service Worker v1.0
   Estrategia: Cache-first para assets estáticos
   Network-first para datos dinámicos
═══════════════════════════════════════════════ */

const CACHE_NAME = 'nathuravitae-v1';
const CACHE_AUDIO = 'nathuravitae-audio-v1';

/* Assets del shell de la app — siempre offline */
const SHELL_ASSETS = [
  '/',
  '/index.html',
  '/herbologia-indice.html',
  '/explorador-sintoma.html',
  '/ficha-planta.html',
  '/mindfulness-audio.html',
  '/plantas-15.json',
  '/manifest.json'
];

/* Archivos de audio — se cachean al primer acceso */
const AUDIO_ASSETS = [
  '/audio/olas-playa.mp3',
  '/audio/riachuelo.mp3',
  '/audio/pajaros-manana.mp3',
  '/audio/lluvia-suave.mp3'
];

/* Fuentes de Google — se cachean al primer uso */
const FONT_ORIGINS = [
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com'
];

/* ── INSTALL ── */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      /* Cachear shell — ignorar errores individuales */
      return Promise.allSettled(
        SHELL_ASSETS.map(url =>
          cache.add(url).catch(() => console.warn('SW: no se pudo cachear', url))
        )
      );
    }).then(() => {
      /* Intentar cachear audio si está disponible */
      return caches.open(CACHE_AUDIO).then(cache =>
        Promise.allSettled(
          AUDIO_ASSETS.map(url =>
            cache.add(url).catch(() => console.info('SW: audio no disponible aún:', url))
          )
        )
      );
    })
  );
  self.skipWaiting();
});

/* ── ACTIVATE ── */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME && k !== CACHE_AUDIO)
          .map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

/* ── FETCH ── */
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  /* Audio: cache-first, luego red */
  if (url.pathname.startsWith('/audio/')) {
    event.respondWith(cacheFirst(event.request, CACHE_AUDIO));
    return;
  }

  /* Fuentes Google: cache-first */
  if (FONT_ORIGINS.some(o => url.origin === new URL(o).origin)) {
    event.respondWith(cacheFirst(event.request, CACHE_NAME));
    return;
  }

  /* JSON de datos: stale-while-revalidate */
  if (url.pathname.endsWith('.json')) {
    event.respondWith(staleWhileRevalidate(event.request));
    return;
  }

  /* HTML, CSS, JS — cache-first */
  if (event.request.destination === 'document' ||
      event.request.destination === 'script' ||
      event.request.destination === 'style') {
    event.respondWith(cacheFirst(event.request, CACHE_NAME));
    return;
  }

  /* Todo lo demás: red con fallback a cache */
  event.respondWith(networkWithCacheFallback(event.request));
});

/* ── ESTRATEGIAS ── */

async function cacheFirst(request, cacheName = CACHE_NAME) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('Recurso no disponible offline', { status: 503 });
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  const fetchPromise = fetch(request).then(response => {
    if (response.ok) cache.put(request, response.clone());
    return response;
  }).catch(() => null);
  return cached || await fetchPromise ||
    new Response('{}', { headers: { 'Content-Type': 'application/json' } });
}

async function networkWithCacheFallback(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached || new Response('Sin conexión', { status: 503 });
  }
}

/* ── MENSAJE DE ACTUALIZACIÓN ── */
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
