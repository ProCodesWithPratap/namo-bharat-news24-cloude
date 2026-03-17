const STATIC_CACHE = "namo-static-v1";
const RUNTIME_CACHE = "namo-bharat-v1";
const PRECACHE_URLS = ["/", "/offline", "/favicon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => (key === RUNTIME_CACHE || key === STATIC_CACHE ? null : caches.delete(key)))),
    ).then(() => self.clients.claim()),
  );
});

const IMAGE_EXT = /\.(png|jpg|jpeg|svg|gif|webp|ico)$/i;
const NETWORK_FIRST_PATHS = [
  "/article/",
  "/national",
  "/states",
  "/politics",
  "/sports",
  "/entertainment",
  "/business",
  "/technology",
  "/education",
  "/lifestyle",
];

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/admin/")) return;

  const isStatic = url.pathname.startsWith("/_next/static/") || IMAGE_EXT.test(url.pathname);
  if (isStatic) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          const copy = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
          return response;
        });
      }),
    );
    return;
  }

  const isNetworkFirst = NETWORK_FIRST_PATHS.some((path) =>
    path === "/article/" ? url.pathname.startsWith(path) : url.pathname === path || url.pathname.startsWith(`${path}/`),
  );

  if (isNetworkFirst) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          return caches.match("/offline");
        }),
    );
    return;
  }

  if (url.pathname === "/") {
    event.respondWith(
      caches.match(request).then((cached) => {
        const networkFetch = fetch(request)
          .then((response) => {
            const copy = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
            return response;
          })
          .catch(() => cached || caches.match("/offline"));

        return cached || networkFetch;
      }),
    );
  }
});
