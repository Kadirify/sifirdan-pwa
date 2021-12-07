// Basit bir service worker.
// Uygulamanın kabuğunu (html, css, js, ikonlar) kurulumda önbelleğe alıyor,
// sonraki isteklerde önce önbellekten veriyor.
//
// Dosyalardan birini değiştirince CACHE adındaki sürümü artırmayı unutma,
// yoksa kullanıcılar eski dosyaları görmeye devam eder.

var CACHE = 'liste-v3';

var DOSYALAR = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return cache.addAll(DOSYALAR);
    })
  );
  // Yeni sw eski sekmeler kapanmayı beklemeden devreye girsin
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (adlar) {
      return Promise.all(
        adlar.filter(function (ad) {
          return ad !== CACHE;
        }).map(function (ad) {
          return caches.delete(ad);
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function (e) {
  // Sadece GET'lerle ilgileniyoruz
  if (e.request.method !== 'GET') return;

  e.respondWith(
    caches.match(e.request).then(function (cevap) {
      if (cevap) return cevap;

      return fetch(e.request).then(function (agCevap) {
        // Önbellekte olmayan ama aynı origin'den gelen şeyleri de sakla
        if (agCevap.ok && e.request.url.indexOf(self.location.origin) === 0) {
          var kopya = agCevap.clone();
          caches.open(CACHE).then(function (cache) {
            cache.put(e.request, kopya);
          });
        }
        return agCevap;
      });
    })
  );
});
