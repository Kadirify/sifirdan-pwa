// CRA pwa şablonundan olduğu gibi aldım, sadece logları Türkçeleştirdim.
// Ne yaptığı: production build'de ve sayfa yüklendikten sonra service-worker.js'i
// kaydediyor. localhost'ta çalışırken sw'nin gerçekten var olup olmadığını da
// kontrol ediyor (eski bir sw takılı kalmasın diye).

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

export function register(config) {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      // PUBLIC_URL başka bir origin'deyse (CDN gibi) sw çalışmaz
      return;
    }

    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      if (isLocalhost) {
        checkValidServiceWorker(swUrl, config);
        navigator.serviceWorker.ready.then(() => {
          console.log('Bu uygulama bir service worker tarafından önbellekten sunuluyor.');
        });
      } else {
        registerValidSW(swUrl, config);
      }
    });
  }
}

function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // Yeni içerik indirildi ama eski sw hâlâ kontrolde.
              // Tüm sekmeler kapanınca devreye girecek. Biz beklemek yerine
              // kullanıcıya haber veriyoruz (onUpdate).
              console.log('Yeni içerik var, sekmeler kapanınca güncellenecek.');
              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              // İlk kurulum, her şey önbelleğe alındı
              console.log('İçerik çevrimdışı kullanım için önbelleğe alındı.');
              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch((error) => {
      console.error('Service worker kaydı sırasında hata:', error);
    });
}

function checkValidServiceWorker(swUrl, config) {
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then((response) => {
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        // sw dosyası yok, muhtemelen başka bir uygulama. kaydı sil, sayfayı yenile
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log('İnternet yok, uygulama çevrimdışı modda çalışıyor.');
    });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}
