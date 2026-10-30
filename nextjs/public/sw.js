// Next.js için elle yazılmış service worker.
//
// html/sw.js'ten farkı: Next'in ürettiği js/css dosyalarının adları hash'li ve build'den
// önce bilinmiyor. O yüzden kurulumda sadece sayfaları önbelleğe alıyoruz, /_next/static
// altındaki dosyaları ise ilk istendiklerinde yakalayıp saklıyoruz. Bu dosyalar
// içerik değişince ad da değiştiği için cache-first güvenli.
//
// Sayfalar (html) için network-first: internet varsa yeni hali, yoksa önbellektekini ver.

const CACHE = "liste-next-v1";
const SAYFALAR = ["/"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SAYFALAR)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((adlar) =>
      Promise.all(adlar.filter((ad) => ad !== CACHE).map((ad) => caches.delete(ad)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const { request } = e;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // hash'li statik dosyalar ve ikonlar: önce önbellek
  if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/icons/")) {
    e.respondWith(
      caches.match(request).then(
        (c) =>
          c ||
          fetch(request).then((r) => {
            const kopya = r.clone();
            caches.open(CACHE).then((cache) => cache.put(request, kopya));
            return r;
          })
      )
    );
    return;
  }

  // sayfalar: önce ağ, olmazsa önbellek
  if (request.mode === "navigate") {
    e.respondWith(
      fetch(request)
        .then((r) => {
          const kopya = r.clone();
          caches.open(CACHE).then((cache) => cache.put(request, kopya));
          return r;
        })
        .catch(() => caches.match(request).then((c) => c || caches.match("/")))
    );
  }
});
