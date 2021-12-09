# 1. PWA nedir, ne değildir

PWA, Progressive Web App. İsim havalı ama altındaki şey basit: normal bir web sitesine
iki dosya ekliyorsun, tarayıcı o siteyi uygulama gibi davranmaya başlıyor.

- Ana ekrana ikon olarak ekleniyor
- Açılınca adres çubuğu olmadan, tam ekran açılıyor
- İnternet yokken de açılıyor (sen ne kadar izin verdiysen o kadar)
- Android'de uygulama listesinde, görev yöneticisinde ayrı pencere olarak görünüyor

Mağazaya yüklemiyorsun, Google'a Apple'a para vermiyorsun, kullanıcı "yükle" dediği
anda zaten yüklenmiş oluyor çünkü site zaten açık.

## Ne değil

Native uygulama değil. Bluetooth, NFC, arka planda sürekli çalışma gibi şeyler ya yok ya
da sınırlı. iPhone'da push bildirimi de yok (2021 itibariyle, Apple ileride ekleyecekmiş
deniyor ama henüz bir şey yok). Kamera, konum, dosya seçme gibi normal web API'leri neyse
PWA'da da o.

React Native ya da Flutter alternatifi de değil. Onlar native kod üretiyor. PWA hâlâ bir
web sitesi, sadece tarayıcı onu daha iyi paketliyor.

## Gereken şeyler

Üç şey yeterli:

1. **HTTPS.** Service worker sadece güvenli bağlantıda çalışıyor. `localhost` istisna,
   geliştirirken sorun olmuyor.
2. **manifest dosyası.** Uygulamanın adı, ikonu, rengi, hangi adresten açılacağı.
   Bir JSON. [2. bölüm](02-manifest.md)
3. **service worker.** Sayfadan bağımsız çalışan bir JS dosyası. İstekleri araya girip
   önbellekten cevaplıyor, çevrimdışı çalışmanın sırrı bu. [3. bölüm](03-service-worker.md)

Bunlar olunca Chrome "bu site yüklenebilir" diyor ve kullanıcıya teklif ediyor.
Teklifi kendi butonuna bağlamak da mümkün, [4. bölüm](04-ana-ekrana-ekle.md).

## Framework şart mı

Hayır. Bu repodaki `html/` klasöründe tek bir kütüphane yok, 5 dosya. PWA olmak için
React'e, webpack'e ihtiyaç yok. React kısmını ekledim çünkü gerçek projelerde genelde bir
framework oluyor ve orada işler biraz değişiyor (build adımı, dosya isimlerindeki hash'ler
falan). Ama mantık aynı.

Önce `html/` klasörünü anlamanı öneririm. Orada her şey elle yazıldığı için ne olup
bittiği görülüyor. React tarafında workbox çoğunu gizliyor, ne gizlediğini bilmeden
kullanınca bir yerde patlıyor.
