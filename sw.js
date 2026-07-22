const CACHE = "speak-easy-v1";
const ASSETS = ["./", "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((cached) => {
      return cached || fetch(e.request).then((res) => {
        const copy = res.clone();
        if (e.request.url.startsWith(self.location.origin) || e.request.url.includes("fonts.g")) {
          caches.open(CACHE).then((cache) => cache.put(e.request, copy)).catch(() => {});
        }
        return res;
      }).catch(() => cached);
    })
  );
});
