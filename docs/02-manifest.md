# 2. manifest dosyası

Tarayıcıya "bu site bir uygulama, adı bu, ikonu bu" dediğin dosya. Düz JSON.

Repodaki hali: [`html/manifest.webmanifest`](../html/manifest.webmanifest)

```json
{
  "name": "Alışveriş Listesi",
  "short_name": "Liste",
  "start_url": "./index.html?kaynak=pwa",
  "scope": "./",
  "display": "standalone",
  "background_color": "#f6f6f4",
  "theme_color": "#2f6f4e",
  "icons": [
    { "src": "icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "icons/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "icons/icon-512-maskable.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

HTML'e bağlamak için `<head>` içine:

```html
<link rel="manifest" href="manifest.webmanifest">
<meta name="theme-color" content="#2f6f4e">
```

Uzantı `.json` da olabilir, `.webmanifest` de. React tarafında CRA `manifest.json`
kullanıyor, ikisi de çalışıyor. Sunucu doğru content-type dönmezse (`application/manifest+json`)
bazı sunucular `.webmanifest` için bunu bilmiyor, o zaman `.json` yapmak daha az dert.

## Alanlar

**name / short_name.** `name` yükleme ekranında ve splash'te çıkıyor, `short_name` ana
ekrandaki ikonun altında. İkon altı 12 karakterden sonra kesiliyor, o yüzden kısa tut.

**start_url.** İkona basınca hangi sayfa açılacak. Sonuna `?kaynak=pwa` gibi bir şey
koymak güzel bir numara: analytics'te kaç kişi uygulama olarak açıyor görebiliyorsun.
Başka bir faydası yok.

**scope.** Uygulamanın sınırı. Kullanıcı bu kapsamın dışına bir linke tıklarsa Chrome
üstte adres çubuğu gösteriyor, "sen artık uygulamanın dışındasın" demek için. Genelde `./`
ya da `/`.

**display.** Dört seçenek var:
- `browser`: normal sekme, hiçbir şey değişmiyor
- `minimal-ui`: sadece geri/yenile butonları
- `standalone`: adres çubuğu yok, uygulama gibi. Genelde bunu istiyorsun
- `fullscreen`: status bar bile yok. Oyun değilse gerek yok

**theme_color.** Android'de üst bardaki (status bar) rengi, masaüstünde pencere başlığı.
HTML'deki `<meta name="theme-color">` ile aynı olsun.

**background_color.** Uygulama açılırken ikon gelmeden önce görünen splash ekranının
rengi. Sayfanın arka planıyla aynı yaparsan geçiş fark edilmiyor.

## İkonlar

En az 192 ve 512 lazım, Chrome yüklenebilir saymak için ikisini de istiyor. PNG olsun.

`maskable` olanı Android için. Android 8'den beri ikonlar üreticiye göre farklı şekillerde
kesiliyor (yuvarlak, kare, damla). Normal ikonu kesince kenarları gidiyor ve çirkin
duruyor. Maskable ikon, tüm alanı dolduran ve önemli kısmı ortadaki %80'lik daireye sığan
ikon. Reponun ikonları şöyle:

| normal | maskable |
|---|---|
| ![](../html/icons/icon-192.png) | <img src="../html/icons/icon-512-maskable.png" width="192"> |

Maskable'da yeşil tüm kareyi kaplıyor, kesilince bir şey kaybolmuyor.
[maskable.app](https://maskable.app) sitesinde ikonunu atıp nasıl kesileceğini görebiliyorsun.

## iOS

Safari manifest'i okuyor ama yarım. İkon için `apple-touch-icon` ayrıca lazım,
standalone için de meta etiketi:

```html
<link rel="apple-touch-icon" href="icons/icon-192.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Liste">
```

Bunlar olmadan iPhone'da ana ekrana eklenen şey sayfanın küçük bir ekran görüntüsü
oluyor ve Safari içinde açılıyor. `apple-touch-icon` için 180x180 öneriyorlar ama 192
de sorunsuz çalışıyor, ayrıca üretmeye üşendim.

## Kontrol

Chrome DevTools > Application > Manifest. Hata varsa orada yazıyor, ikonları da
gösteriyor. "Installability" bölümü neyin eksik olduğunu söylüyor, en çok oraya bakacaksın.
