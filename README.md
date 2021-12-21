# Sıfırdan PWA

![Sıfırdan PWA](docs/img/kapak.png)

Bir web sitesini telefona "yüklenebilir" hale getirmek için ne gerekiyor, adım adım.
Önce düz HTML ile, sonra aynı şeyi React ile.

Türkçe kaynak bulamadığım için kendim not alarak öğrendim, notlar da bu repo oldu.
Örnek uygulama olarak internet yokken de çalışan küçük bir alışveriş listesi var.

<p>
  <img src="docs/img/html-ekran.png" width="260" alt="uygulama">
  &nbsp;&nbsp;
  <img src="docs/img/html-cevrimdisi.png" width="260" alt="çevrimdışı ve ana ekrana ekle butonu">
  &nbsp;&nbsp;
  <img src="docs/img/react-guncelleme.png" width="260" alt="react sürümünde güncelleme bildirimi">
</p>

## PWA ne işe yarar

Normal bir siteyle PWA arasındaki fark kullanıcı tarafında şöyle görünüyor:

- Site ana ekrana ikon olarak ekleniyor, ikona basınca adres çubuğu olmadan tam ekran açılıyor.
  Kullanıcı için uygulamadan farkı yok.
- İnternet yokken de açılıyor. Metroda, asansörde, çekmeyen yerde sayfa boş kalmıyor,
  en azından son hali görünüyor. Bu repodaki liste uygulaması tamamen çevrimdışı çalışıyor.
- İkinci açılış çok hızlı, çünkü dosyalar zaten telefonda.
- Android'de bildirim gönderebiliyorsun (bu repoda yok, ayrı bir konu).

Geliştirici tarafında ise:

- Mağazaya yüklemiyorsun, onay beklemiyorsun, yıllık ücret yok.
- Tek kod tabanı. Siten zaten varsa iki dosya ekleyip PWA'ya çeviriyorsun, yeniden yazmıyorsun.
- Güncelleme anında gidiyor, kullanıcının mağazadan güncellemesine gerek yok.

Ne zaman yetmez: Bluetooth, NFC, arka planda sürekli çalışma, iPhone'da bildirim gibi
şeyler lazımsa native'e bakman gerekiyor. İçerik gösteren, form dolduran, liste tutan
uygulamaların çoğu için fazlasıyla yeterli.

## İçindekiler

1. [PWA nedir, ne değildir](docs/01-pwa-nedir.md)
2. [manifest dosyası](docs/02-manifest.md)
3. [service worker ve çevrimdışı çalışma](docs/03-service-worker.md)
4. [Ana ekrana ekle butonu](docs/04-ana-ekrana-ekle.md)
5. [React ile aynı şeyi yapmak](docs/05-react-ile-pwa.md)
6. [Test etmek, Lighthouse](docs/06-test-ve-lighthouse.md)
7. [Başıma gelen sorunlar](docs/sik-sorunlar.md)

## Klasörler

```
html/    düz html + css + js, kütüphane yok, 5 dosya
react/   create-react-app ile aynı uygulama (react 17, workbox)
docs/    anlatımlar ve görseller
```

## Çalıştırmak

HTML sürümü için bir sunucuya ihtiyaç var, dosyaya çift tıklayınca service worker çalışmıyor
(`file://` üzerinde kayıt olmuyor). En kolayı:

```
cd html
npx serve .
```

ya da Python varsa `python -m http.server 8000`. Sonra tarayıcıda `localhost:8000`.

React sürümü:

```
cd react
npm install
npm start
```

Dikkat: `npm start` ile açınca service worker **çalışmaz**, CRA bunu bilerek sadece production
build'de açıyor. Çevrimdışı davranışı görmek için:

```
npm run build
npx serve -s build
```

## Hangi sürümlerle yazdım

- Chrome 96, Android 11 ve iOS 15 Safari'de denedim
- Node 16, npm 8
- react 17.0.2, react-scripts 4.0.3, workbox 5

Bunlar ilerde değişir, özellikle Chrome tarafında yükleme kriterleri sürekli oynuyor.
Takılırsan [sorunlar](docs/sik-sorunlar.md) sayfasına bir bak, yoksa issue aç.

## Lisans

MIT. İstediğin gibi kullan.
