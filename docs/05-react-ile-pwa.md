# 5. React ile aynı şeyi yapmak

`react/` klasöründeki uygulama `html/` ile birebir aynı şeyi yapıyor, sadece React ile.
Fark PWA tarafında: service worker'ı elle yazmak yerine workbox kullanıyoruz ve dosya
listesi build sırasında otomatik çıkıyor.

## Neden elle yazmıyoruz

CRA build alınca dosya adlarına hash ekliyor: `main.8a3562b7.chunk.js`. Her build'de hash
değişiyor. `html/sw.js`'teki gibi sabit bir `DOSYALAR` listesi yazamazsın, her build'de
elle güncellemen gerekir.

Workbox bunu çözüyor. Build sırasında `src/service-worker.js` dosyasını alıyor, içindeki
`self.__WB_MANIFEST` yazan yere build klasöründeki tüm dosyaların listesini (hash'leriyle)
koyuyor ve `build/service-worker.js` olarak yazıyor. Sürüm artırma derdi de yok: dosya
değişince hash değişiyor, workbox hangi dosyanın yenilendiğini biliyor, sadece onu
indiriyor.

## Kurulum

CRA'nın PWA şablonu var:

```
npx create-react-app alisveris-listesi --template cra-template-pwa
```

Bu `src/service-worker.js` ve `src/serviceWorkerRegistration.js` dosyalarını ekliyor,
`package.json`'a workbox paketlerini koyuyor. Normal şablondan tek farkı bu.

Şablon olmadan başladıysan iki dosyayı bu repodan kopyalayıp workbox paketlerini
yüklemen yeterli:

```
npm i workbox-core workbox-expiration workbox-precaching workbox-routing workbox-strategies
```

## index.js

Şablon varsayılan olarak `unregister()` çağırıyor, yani sw kapalı geliyor. CRA ekibi
insanlar farkında olmadan önbellekleme sorunu yaşamasın diye böyle yapmış. Açmak için:

```js
serviceWorkerRegistration.register();
```

Ben bir adım ileri gidip `onUpdate` verdim:

```js
serviceWorkerRegistration.register({
  onUpdate: (registration) => {
    window.dispatchEvent(new CustomEvent('swGuncelleme', { detail: registration }));
  },
});
```

`onUpdate`, yeni sürüm indirildi ama henüz devrede değil demek. 3. bölümde anlattığım
"waiting" durumu. HTML tarafında `skipWaiting` ile atlamıştık, burada kullanıcıya soruyoruz.
`App.js` bu eventi dinleyip alta bir bildirim koyuyor:

![yeni sürüm bildirimi](img/react-guncelleme.png)

"Yenile"ye basınca bekleyen sw'ye mesaj gönderiyoruz, o `skipWaiting()` yapıyor,
sayfayı yeniliyoruz:

```js
function yenile() {
  if (guncelleme && guncelleme.waiting) {
    guncelleme.waiting.postMessage({ type: 'SKIP_WAITING' });
  }
  window.location.reload();
}
```

Sw tarafında mesajı dinleyen kısım `src/service-worker.js`'in sonunda.

Neden event ile iletişim kurdum: `register()` `index.js`'te çağrılıyor, React dışında.
Oradan App'in state'ine ulaşmanın temiz bir yolu yok. Window üzerinden custom event
en az uğraştıranı. Context de olurdu ama bu kadarcık şey için fazla.

## service-worker.js

Şablondan gelen dosyayı biraz sadeleştirdim. Üç şey yapıyor:

1. `precacheAndRoute(self.__WB_MANIFEST)` ile build çıktısını önbelleğe al
2. Navigasyon isteklerine (adres çubuğuna yazıp girmek, ikona basmak) her zaman
   `index.html` dön. SPA olduğu için `/liste` gibi bir adrese gidince de index lazım
3. `public/` altındaki png'ler için ayrı bir kural. Bunlar precache'e girmiyor çünkü
   workbox sadece webpack'ten geçen dosyaları biliyor, `public/` altı olduğu gibi
   kopyalanıyor. Onlar için `StaleWhileRevalidate`: önbellekten ver, arkada güncelle.
   Bu kural şablonda zaten var, ben sadece yorumlarını Türkçeleştirdim.

## Hook'lar

`beforeinstallprompt` ve `navigator.onLine` işini iki küçük hook'a ayırdım:

- [`useYukleme.js`](../react/src/useYukleme.js) verdiği şey: `{ yuklenebilir, yukle }`
- [`useCevrimici.js`](../react/src/useCevrimici.js) verdiği şey: `true / false`

Mantık `html/app.js`'tekiyle aynı, sadece `useEffect` içinde event listener ekleyip
cleanup'ta kaldırıyoruz. Başka projeye de kopyalanabilsin diye ayırdım.

## Geliştirirken

`npm start` ile sw **çalışmıyor**. `serviceWorkerRegistration.js` içinde
`process.env.NODE_ENV === 'production'` kontrolü var. Bu bilerek böyle; dev'de sw
olsa her değişiklikte önbellek yüzünden eski kodu görürsün.

Çevrimdışı davranışı görmek için build alıp statik sunmak lazım:

```
npm run build
npx serve -s build
```

`-s` önemli, tüm yolları `index.html`'e yönlendiriyor.

Her build sonrası DevTools'ta "Update on reload" açık olsun, yoksa eski sw'yi görüp
"değişiklik yansımadı" diye saatlerce uğraşırsın. Ben uğraştım.

## Vite kullananlar

Vite ile başladıysan `vite-plugin-pwa` var, aynı işi yapıyor ve workbox'ı sarmalıyor.
Yapılandırması `vite.config.js` içinde, ayrı sw dosyası yazmana gerek kalmıyor.
Bu repoda CRA kullandım çünkü hâlâ en yaygını, ama Vite'a geçiş kolay.
