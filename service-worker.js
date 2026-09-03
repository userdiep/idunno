// Minimal service worker: exists mainly so Chrome counts this app as
// "installable" (real standalone app, no address bar). It deliberately does
// NOT do offline-first caching of the app shell — every open, while online,
// goes straight to the network so a new version published here shows up
// immediately, with no reinstall and no manual cache-clearing.
// If you're offline, it falls back to the last successful response.
//
// v2: fetch(event.request) alone still lets the BROWSER's own HTTP cache
// short-circuit the request and hand back a stale copy without ever hitting
// the network, even though this code always "tries" to fetch — the intent
// was network-first, but the browser could quietly serve cache-first. Adding
// {cache:"no-store"} forces a real round-trip every time, closing that gap.
// It can't fix a separate layer this app doesn't control — GitHub Pages'
// own CDN can take a couple of minutes to pick up a change after you commit
// — but that's a short, one-time delay, not something that needs a reinstall.

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
    fetch(event.request, { cache: "no-store" })
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
