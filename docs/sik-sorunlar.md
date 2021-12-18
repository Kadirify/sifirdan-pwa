# Başıma gelen sorunlar

Zamanla ekleyeceğim. Başına başka bir şey geldiyse issue aç, buraya koyarım.

## Dosyayı değiştirdim, sayfada eski hali var

En klasik olanı. Sebebi service worker önbellekten veriyor.

- HTML tarafında: `sw.js`'teki `CACHE` adını artırdın mı?
- Hâlâ eskiyse: DevTools > Application > Service Workers > "Update on reload" işaretli mi?
- Hâlâ eskiyse: aynı yerden "Unregister", sonra Application > Storage > "Clear site data"
- React tarafında: `npm start` ile açtıysan sw yok, başka bir şey oluyor. Build alıp
  `serve -s build` ile mi açtın?

## beforeinstallprompt hiç gelmiyor

- Console'da sw hatası var mı? Sw kurulmadıysa event gelmiyor
- Application > Manifest > en altta "Installability" bölümü neyin eksik olduğunu yazıyor
- Daha önce "yükle" teklifini reddettiysen Chrome bir süre bir daha sormuyor.
  Gizli pencerede dene ya da `chrome://flags` içinde `#bypass-app-banner-engagement-checks` aç
- Zaten yüklüyse gelmiyor. `chrome://apps` içinden kaldır
- Safari'de hiç gelmiyor, bu normal

## Sw kayıt olmuyor, console'da hata yok

Dosyaya çift tıklayıp `file://` ile açtıysan olmuyor, sunucu lazım. `npx serve .`

Ya da HTTP'de uzak sunucudasın. HTTPS şart, `localhost` tek istisna.

## "Response body is already used"

`fetch` handler'ında response'u hem önbelleğe koyup hem sayfaya veriyorsun ama `clone()`
yapmamışsın. 3. bölümde var.

## addAll bir dosyada takılıyor, sw hiç kurulmuyor

`DOSYALAR` listesindeki bir yol yanlış. Biri bile 404 dönerse hepsi iptal. Network
sekmesinde kırmızı olanı bul. Yolların `sw.js`'in bulunduğu yere göre olduğunu unutma.

## GitHub Pages'te çalışmıyor

Site `kullanici.github.io/repo-adi/` altında olduğu için kökte değil. Manifest'te
`start_url` ve `scope` `./` olsun, `/` değil. Sw kaydı da `register('sw.js')` olsun,
`register('/sw.js')` değil. Bu repoda hepsi `./` ile yazıldı, o yüzden alt klasörde de
çalışıyor.

React tarafında `package.json`'a `"homepage": "https://kullanici.github.io/repo-adi"`
eklemen lazım, CRA yolları ona göre üretiyor.

## iPhone'da ikon sayfanın ekran görüntüsü çıkıyor

`apple-touch-icon` yok. 2. bölüm.

## iPhone'da Safari içinde açılıyor, tam ekran değil

`<meta name="apple-mobile-web-app-capable" content="yes">` yok.

## Android'de ikon kesik, kenarları gitmiş

Maskable ikon yok ya da normal ikonu maskable diye vermişsin. 2. bölüm, ikonlar.

## Lighthouse "does not register a service worker that controls page and start_url"

Sw kayıtlı ama sayfayı henüz kontrol etmiyor. İlk yüklemede olur, bir kere yenile ve
Lighthouse'u tekrar çalıştır. Ya da `clients.claim()` çağırmamışsın.

## CRA build'de "self.__WB_MANIFEST" hatası

`src/service-worker.js` dosyası var ama `package.json`'da workbox paketleri yok, ya da
dosya adı farklı. CRA tam olarak `src/service-worker.js` adını arıyor, başka ad olmaz.

## Yeni sürüm bildirimi hiç çıkmıyor (React)

`onUpdate` sadece zaten yüklü bir sw varken ve yenisi geldiğinde çalışıyor. İlk kurulumda
`onSuccess` çalışıyor. Denemek için: build al, serve et, sayfayı aç, bir dosyayı değiştir,
tekrar build al, sayfayı yenile. İkinci yenilemede bildirim gelmeli.
