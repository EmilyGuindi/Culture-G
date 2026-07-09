/**
 * Service worker — Culture G Daily
 * Met l'app en cache pour un fonctionnement hors-ligne (PWA installable).
 * Stratégie : cache-first pour le shell, retour réseau, fallback index.html
 * pour les navigations (SPA).
 *
 * Pense à incrémenter CACHE_VERSION à chaque changement d'assets.
 */

const CACHE_VERSION = "culture-g-v1";

// Chemins relatifs au scope du SW (fonctionne aussi sous /Culture-G/ sur Pages)
const APP_SHELL = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "css/styles.css",
  "js/app.js",
  "js/router.js",
  "js/store.js",
  "js/components/nav.js",
  "js/data/lessons.js",
  "js/data/provider.js",
  "js/pages/home.js",
  "js/pages/lesson.js",
  "js/pages/quiz.js",
  "js/pages/library.js",
  "js/pages/profile.js",
  "assets/favicon.svg",
  "assets/icon-192.png",
  "assets/icon-512.png",
  "assets/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Navigations (changement de page / ouverture) → shell en fallback
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).catch(() => caches.match("index.html", { ignoreSearch: true }))
    );
    return;
  }

  // Ne gère que le même origine (les polices externes passent en réseau direct)
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(req, { ignoreSearch: false }).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          // Met en cache les nouvelles ressources same-origin
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() => cached);
    })
  );
});
