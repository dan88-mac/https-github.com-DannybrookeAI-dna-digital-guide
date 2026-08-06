const CACHE = "resync-static-v1";
const STATIC = ["/", "/manifest.json", "/pricing", "/templates", "/community"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(STATIC)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.pathname.startsWith("/api/stripe/webhook")) return;
  if (url.pathname.startsWith("/api/runtime") || url.pathname.startsWith("/api/workflows")) {
    event.respondWith(fetch(event.request));
    return;
  }
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(event.request);
      const network = fetch(event.request)
        .then((res) => {
          if (res.ok && url.origin === self.location.origin) {
            cache.put(event.request, res.clone());
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
