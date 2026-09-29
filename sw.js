/* FitFlow service worker — precache all assets, cache-first for assets, network-first for index.html.
   Bump CACHE on every release (build.py does it from the content hash). */
const CACHE = 'fitflow-v1.2.1-ff8de87e';
const ASSETS = [
  "./app.js",
  "./engine.js",
  "./index.html",
  "./manifest.webmanifest",
  "./styles.css",
  "./assets/logo-mark.png",
  "./assets/logo-wordmark.png",
  "./fonts/DMSerifDisplay-italic-latin.woff2",
  "./fonts/DMSerifDisplay-latin.woff2",
  "./fonts/IBMPlexMono-latin.woff2",
  "./fonts/Manrope-latin.woff2",
  "./icons/apple-touch-icon.png",
  "./icons/icon-192.png",
  "./icons/icon-512-maskable.png",
  "./icons/icon-512.png",
  "./vendor/dc-runtime.js",
  "./vendor/lucent-ds.js",
  "./vendor/react-dom.production.min.js",
  "./vendor/react.production.min.js"
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('message', (e) => { if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting(); });
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  const isNav = req.mode === 'navigate' || url.pathname.endsWith('/') || url.pathname.endsWith('/index.html');
  if (isNav) {
    // network-first so a new release is picked up; fall back to cache when offline
    e.respondWith(fetch(req).then((res) => { const copy = res.clone(); caches.open(CACHE).then((c) => c.put('./index.html', copy)); return res; })
      .catch(() => caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.match(req, { ignoreSearch: true }).then((hit) => hit || fetch(req).then((res) => {
    if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
    return res;
  })));
});
