# nextjs

Aynı alışveriş listesi, Next.js 16 (app router) ile. 2026'da eklendi.
Anlatım: [docs/07-nextjs-ile-pwa.md](../docs/07-nextjs-ile-pwa.md)

```
npm install
npm run dev      # service worker kapalı
npm run build
npm start        # service worker açık, localhost:3000
```

PWA ile ilgili dosyalar:

- `app/manifest.ts` manifest
- `app/layout.tsx` iOS meta'ları ve theme-color
- `public/sw.js` service worker
- `components/SwKayit.tsx` sw kaydı
- `components/useYukleme.ts` ana ekrana ekle butonu
- `next.config.ts` sw.js için cache header'ı
