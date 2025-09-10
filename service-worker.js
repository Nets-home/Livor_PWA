const CACHE_NAME = "livora-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/image2.png",
  "/image1.png"
];

// self.addEventListener('install', event => {
//   self.skipWaiting(); // Forces update immediately
// });
// self.addEventListener('activate', event => {
//   clients.claim(); // Takes control of all tabs
// });


self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("activate", (event) => {
  console.log("Service worker activated");
});


self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});
