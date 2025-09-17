const CACHE_NAME = "livora-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/image1.png",
  "/image2.png"
];

// Install: Precache assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[SW] Caching app shell");
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting(); // Activate immediately
});

// Activate: Clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("[SW] Deleting old cache:", cache);
            return caches.delete(cache);
          }
        })
      )
    )
  );
  clients.claim(); // Take control of all pages
});

// Fetch: Network-first for HTML, Cache-first for others
self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    // Network-first for navigation (HTML pages)
    event.respondWith(
      fetch(event.request).catch(() => caches.match("/index.html"))
    );
  } else {
    // Cache-first for everything else
    event.respondWith(
      caches.match(event.request).then((response) => response || fetch(event.request))
    );
  }
});
