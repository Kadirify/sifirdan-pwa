/* eslint-disable no-restricted-globals */

// CRA'nın pwa şablonundan gelen service worker, biraz sadeleştirdim.
// Build sırasında workbox-webpack-plugin (InjectManifest) bu dosyayı alıp
// self.__WB_MANIFEST yerine build klasöründeki dosyaların listesini koyuyor.
// Yani html örneğindeki DOSYALAR dizisini elle yazmıyoruz, hash'li isimlerle
// otomatik geliyor. Sürüm artırma derdi de yok, hash değişince önbellek yenileniyor.

import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

clientsClaim();

// build çıktısındaki her şey (js, css, html, manifest...) önbelleğe alınıyor
precacheAndRoute(self.__WB_MANIFEST);

// SPA olduğu için her sayfa isteğine index.html dönüyoruz (App Shell)
const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$');
registerRoute(({ request, url }) => {
  if (request.mode !== 'navigate') return false;
  if (url.pathname.startsWith('/_')) return false;
  if (url.pathname.match(fileExtensionRegexp)) return false;
  return true;
}, createHandlerBoundToURL(process.env.PUBLIC_URL + '/index.html'));

// public/ altındaki png'ler precache'e girmiyor (sadece src'den import edilenler giriyor),
// onlar için ayrı bir kural: önce önbellekten ver, arkada güncelle
registerRoute(
  ({ url }) => url.origin === self.location.origin && url.pathname.endsWith('.png'),
  new StaleWhileRevalidate({
    cacheName: 'resimler',
    plugins: [new ExpirationPlugin({ maxEntries: 50 })],
  })
);

// App'teki "Yenile" butonu bu mesajı gönderiyor
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
