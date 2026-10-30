# Claude veya Codex ile sitene PWA ekle

Bu repo 2021'de elle yapmak için yazılmıştı. 2026'da artık çoğu kişi bu işi Claude Code,
Codex, Cursor gibi bir ajana yaptırıyor. Bu sayfa o ajanlar için yazıldı: linkini verip
"siteme entegre et" demen yeterli, gerisini aşağıdaki talimatlarla kendisi yapıyor.

## Nasıl kullanılır

Projenin klasöründe ajanı aç ve şunu yapıştır:

```
Şu sayfadaki talimatları oku ve bu projeye uygula:
https://raw.githubusercontent.com/Kadirify/sifirdan-pwa/master/docs/ai-ile-ekle.md

Uygulama adı: ......
Tema rengi: ......
Logo/ikon dosyası: ...... (yoksa mevcut favicon'dan üret)
```

İngilizce ajan kullanıyorsan:

```
Read the instructions at the URL below and apply them to this project:
https://raw.githubusercontent.com/Kadirify/sifirdan-pwa/master/docs/ai-ile-ekle.md

App name: ......
Theme color: ......
Icon source: ...... (generate from the existing favicon if none)
```

Üç boşluğu doldurmazsan ajan mevcut `<title>`, CSS'teki ana renk ve favicon'dan
tahmin ediyor. Bitince ne yaptığını listelemesini ve Lighthouse ile doğrulamasını iste.

Aşağısı ajan için. Okumak istersen oku, ama insanlara yönelik anlatım
[README](../README.md)'deki bölümlerde.

---

## Ajan için talimatlar

Sen bir kodlama ajanısın ve kullanıcının mevcut web projesine PWA desteği ekleyeceksin.
Aşağıdaki adımları sırayla uygula. Projenin yapısını bozma, mevcut dosyaları silme,
sadece ekle ve gerekli yerlere küçük dokunuşlar yap. Her adımda ne yaptığını kısa not al,
sonunda kullanıcıya özet ver.

### 0. Projeyi tanı

Önce şunları tespit et ve kullanıcıya tek satırda söyle:

- Proje tipi: düz HTML/CSS/JS, Vite (React/Vue/Svelte), Next.js (app router / pages),
  Create React App, Nuxt, Astro, SvelteKit, başka bir şey
- Çıktının nereye gittiği: `dist/`, `build/`, `.next/`, `out/` ya da doğrudan kök
- Zaten bir service worker, `manifest` linki, `vite-plugin-pwa`, `next-pwa`, `@serwist/next`
  gibi bir şey var mı. Varsa sıfırdan ekleme, mevcut olanı tamamla
- Site HTTPS'te mi yayınlanıyor (Vercel, Netlify, GitHub Pages, Cloudflare Pages hepsi HTTPS).
  Alt klasörde mi yayınlanıyor (`kullanici.github.io/repo/` gibi), bu `start_url` ve `scope`'u etkiler

Kullanıcı ad, renk ve ikon vermediyse: `<title>` ya da `package.json` `name` alanından ad,
CSS'teki en baskın marka renginden tema rengi, mevcut favicon/logo'dan ikon üret.
Tahmin ettiklerini özetinde belirt.

### 1. İkonlar

`public/icons/` (yoksa projenin statik dosya klasörü) altına üç PNG koy:

- `icon-192.png` (192x192)
- `icon-512.png` (512x512)
- `icon-512-maskable.png` (512x512, `purpose: maskable`)

Maskable olan: arka plan tüm kareyi dolduracak, logo ortadaki %80'lik alana sığacak,
kenarlarda en az %10 boşluk. Android ikonu yuvarlak/kare kesince bir şey kaybolmasın.

Kaynak olarak kullanıcının verdiği dosyayı, yoksa en büyük favicon ya da logo SVG'sini
kullan. Elinde sadece 32px favicon varsa büyütme, bunun yerine tema rengi zemin üstüne
sitenin baş harfini koyup basit bir ikon üret ve kullanıcıya "ikonu sonra değiştir"
de. Üretim için `sharp` (Node), `Pillow` (Python) ya da ImageMagick kullanabilirsin;
hangisi projede/ortamda varsa.

### 2. manifest

`public/manifest.webmanifest` (Next.js app router'da `app/manifest.ts` de olur) oluştur:

```json
{
  "name": "UYGULAMA ADI",
  "short_name": "KISA AD (en fazla 12 karakter)",
  "description": "Tek cümle.",
  "lang": "tr",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#TEMA",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icons/icon-512-maskable.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

Alt klasörde yayınlanan sitede `start_url`, `scope` ve ikon yolları `./` ile göreli olsun.
`background_color` sayfanın gerçek arka plan rengiyle aynı olsun, splash geçişi görünmesin.

### 3. head etiketleri

Tüm sayfalarda ortak olan `<head>`'e (layout, `_document`, `index.html`, neresi uygunsa):

```html
<link rel="manifest" href="/manifest.webmanifest">
<meta name="theme-color" content="#TEMA">
<link rel="apple-touch-icon" href="/icons/icon-192.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="KISA AD">
```

Next.js app router'da bunları `metadata` nesnesiyle ver (`manifest`, `themeColor`,
`appleWebApp`, `icons.apple`). `viewport` meta zaten varsa dokunma, yoksa ekle.

### 4. service worker

Proje tipine göre en az müdahaleyi seç:

**Düz HTML / statik site:** Köke `sw.js` koy. Bu repodaki
[`html/sw.js`](../html/sw.js) birebir kullanılabilir; `DOSYALAR` listesini sitenin gerçek
dosyalarıyla doldur (html, css, js, font, ikonlar). API çağrılarını ve üçüncü parti
adresleri listeye alma. Kayıt kodunu ([`html/app.js`](../html/app.js) altındaki bölüm)
ana JS dosyasına ekle. `CACHE` adının her deploy'da artırılması gerektiğini kullanıcıya söyle,
ya da build adımı varsa adı otomatik üretecek küçük bir script ekle.

**Vite:** `vite-plugin-pwa` kur, `vite.config` içine `VitePWA({ registerType: 'autoUpdate', manifest: {...} })`
ekle. Manifesti plugin'e ver, ayrı dosya yazma. `workbox.globPatterns` ile statik dosyaları kapsa.

**Next.js:** Önce projede `next-pwa` ya da `@serwist/next` var mı bak. Yoksa `@serwist/next`
kur (next-pwa artık bakımda değil). `app/sw.ts` ile `next.config` sarmalamasını Serwist'in
güncel dokümanına göre yap; sürüm uyumsuzluğu çıkarsa kullanıcıya söyle, zorla eski sürüm kurma.
Manifest için `app/manifest.ts` kullan, Next linki kendisi ekliyor. Projede `output: 'export'`
varsa statik site gibi davran ve düz `sw.js` yaklaşımını kullan.

**Create React App:** `src/service-worker.js` ve `src/serviceWorkerRegistration.js` dosyalarını
bu repodaki [`react/src/`](../react/src/) klasöründen al, `index.js`'te `register()` çağır,
workbox paketlerini ekle. CRA 5 ve workbox 6 ile de aynı dosyalar çalışıyor.

**Diğer (Nuxt, Astro, SvelteKit):** Her birinin resmi PWA modülü var
(`@vite-pwa/nuxt`, `@vite-pwa/astro`, `@vite-pwa/sveltekit`). Onu kullan.

Genel kurallar:
- Önbelleğe sadece uygulamanın kendi statik dosyalarını al. API cevaplarını, kullanıcıya
  özel sayfaları, `Set-Cookie` dönen şeyleri önbelleğe alma.
- Zaten bir service worker varsa yenisini ekleme, mevcut olanı düzenle.
- `skipWaiting` kullanıyorsan kullanıcıya "yeni sürüm var, yenile" gösteren küçük bir arayüz
  ekle; yoksa eski JS ile yeni önbellek çakışabilir. Örnek: [`react/src/App.js`](../react/src/App.js)
  içindeki `swGuncelleme` akışı.
- Geliştirme ortamında (`npm run dev`) service worker'ı kapalı tut.

### 5. Yükleme butonu (isteğe bağlı)

Kullanıcı istediyse ya da sitede belirgin bir "uygulamayı indir" yeri mantıklıysa
`beforeinstallprompt` ile bir buton ekle. Örnek:
[`react/src/useYukleme.js`](../react/src/useYukleme.js) ya da
[`html/app.js`](../html/app.js) son bölüm. Buton sadece event geldiğinde görünsün,
`display-mode: standalone` ise hiç görünmesin. Safari'de event gelmez; iOS'ta kısa bir
"Paylaş > Ana Ekrana Ekle" ipucu göstermek yeterli.

### 6. Doğrula

Bitirmeden önce:

1. Production build al, statik sunucuyla aç (`npx serve dist` gibi).
2. Lighthouse çalıştır. 2024'ten beri Lighthouse'ta ayrı "PWA" kategorisi yok;
   bunun yerine Chrome DevTools > Application > Manifest altındaki "Installability"
   bölümüne bak, hata olmamalı. Application > Service Workers'ta "activated" görünmeli.
3. DevTools'ta Offline işaretle, sayfayı yenile, açılmalı.
4. Build çıktısında `manifest.webmanifest`, ikonlar ve sw dosyası var mı kontrol et.
5. `git status` ile sadece beklediğin dosyaların değiştiğini doğrula. `node_modules`,
   build klasörü, ikon üretirken kullandığın geçici dosyalar commit'e girmesin.

Doğrulayamadığın bir adım varsa (örneğin tarayıcı çalıştıramıyorsan) bunu özette açıkça yaz,
"çalışıyor" deme.

### 7. Kullanıcıya özet

Şu formatta bitir:

- Eklenen dosyalar (yol listesi)
- Değiştirilen dosyalar ve neden
- Tahmin ederek seçtiğin şeyler (ad, renk, ikon)
- Doğruladıkların ve doğrulayamadıkların
- Kullanıcının yapması gerekenler: HTTPS'te deploy, gerçek telefonda deneme, ikonu değiştirme,
  statik sw kullanıldıysa her deploy'da `CACHE` adını artırma

### Yapma

- Mevcut service worker'ı silip yenisini yazma
- Tüm siteyi `cache-first` yapma; dinamik sayfalar varsa network-first ya da stale-while-revalidate
- `manifest.json` yolunu mutlak yazıp alt klasörde yayınlanan siteyi bozma
- Kullanıcı istemeden bildirim (push) altyapısı ekleme
- Lock dosyasını paket yöneticisini değiştirerek yeniden üretme (npm projesine pnpm lock ekleme gibi)
- Doğrulamadığın bir şeyi çalışıyor diye raporlama

## 2021'den bu yana değişenler

Bu repodaki anlatımlar 2021 sonu itibariyle yazıldı. Ajanın bilmesi gereken farklar:

- Chrome artık yüklenebilirlik için service worker şart koşmuyor (2024). Manifest tek başına
  yetiyor. Ama çevrimdışı çalışma için yine service worker gerekiyor, o yüzden ekliyoruz.
- iOS 16.4'ten beri ana ekrana eklenmiş PWA'lar web push alabiliyor. Safari hâlâ
  `beforeinstallprompt` göndermiyor.
- Lighthouse 12 ile "PWA" kategorisi kaldırıldı. Kontrol DevTools > Application'da.
- `next-pwa` bakımsız, yerine `@serwist/next`. CRA yerine çoğu kişi Vite kullanıyor,
  `vite-plugin-pwa` fiilen standart.
- Manifest'te `id` alanı eklendi; aynı origin'de birden fazla PWA varsa gerekli, tek
  uygulama için şart değil.
