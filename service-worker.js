// Minimal service worker: exists mainly so Chrome counts this app as
// "installable" (real standalone app, no address bar). It deliberately does
// NOT do offline-first caching of the app shell — every open, while online,
// goes straight to the network so a new version published here shows up
// immediately, with no reinstall and no manual cache-clearing.
// If you're offline, it falls back to the last successful response.

var CACHE = "carnet-fitness-park-v1";

self.addEventListener("install", function (event) {
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request)
      .then(function (response) {
        var copy = response.clone();
        caches.open(CACHE).then(function (cache) { cache.put(event.request, copy); });
        return response;
      })
      .catch(function () {
        return caches.match(event.request);
      })
  );
});
