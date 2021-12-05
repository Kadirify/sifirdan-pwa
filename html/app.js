// Alışveriş listesi. Veri localStorage'da, sunucu yok.
// PWA ile ilgili kısımlar en altta (service worker kaydı ve yükleme butonu).

var ANAHTAR = 'liste-v1';

var form = document.getElementById('form');
var girdi = document.getElementById('girdi');
var listeEl = document.getElementById('liste');
var bosEl = document.getElementById('bos');
var sayacEl = document.getElementById('sayac');
var temizleBtn = document.getElementById('temizle');
var durumEl = document.getElementById('durum');
var yukleBtn = document.getElementById('yukle');

var liste = oku();

function oku() {
  try {
    return JSON.parse(localStorage.getItem(ANAHTAR)) || [];
  } catch (e) {
    return [];
  }
}

function kaydet() {
  localStorage.setItem(ANAHTAR, JSON.stringify(liste));
}

function ciz() {
  listeEl.innerHTML = '';

  liste.forEach(function (oge, i) {
    var li = document.createElement('li');
    if (oge.alindi) li.className = 'alindi';

    var cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.checked = oge.alindi;
    cb.addEventListener('change', function () {
      liste[i].alindi = cb.checked;
      kaydet();
      ciz();
    });

    var ad = document.createElement('span');
    ad.className = 'ad';
    ad.textContent = oge.ad;

    var sil = document.createElement('button');
    sil.className = 'sil';
    sil.textContent = '×';
    sil.title = 'Sil';
    sil.addEventListener('click', function () {
      liste.splice(i, 1);
      kaydet();
      ciz();
    });

    li.appendChild(cb);
    li.appendChild(ad);
    li.appendChild(sil);
    listeEl.appendChild(li);
  });

  bosEl.classList.toggle('gizli', liste.length > 0);

  var kalan = liste.filter(function (o) { return !o.alindi; }).length;
  sayacEl.textContent = liste.length
    ? kalan + ' / ' + liste.length + ' kaldı'
    : '';
}

form.addEventListener('submit', function (e) {
  e.preventDefault();
  var ad = girdi.value.trim();
  if (!ad) return;
  liste.push({ ad: ad, alindi: false });
  girdi.value = '';
  kaydet();
  ciz();
});

temizleBtn.addEventListener('click', function () {
  liste = liste.filter(function (o) { return !o.alindi; });
  kaydet();
  ciz();
});

ciz();


/* ---------- Bağlantı durumu ---------- */

function durumGuncelle() {
  var acik = navigator.onLine;
  durumEl.textContent = acik ? 'çevrimiçi' : 'çevrimdışı';
  durumEl.classList.toggle('kapali', !acik);
}

window.addEventListener('online', durumGuncelle);
window.addEventListener('offline', durumGuncelle);
durumGuncelle();


/* ---------- Service worker ---------- */

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('sw.js').then(function (reg) {
      console.log('sw kayıtlı, scope:', reg.scope);
    }).catch(function (err) {
      console.log('sw kaydedilemedi:', err);
    });
  });
}


/* ---------- Yükleme butonu ---------- */

// Chrome, site kriterleri sağlıyorsa bu eventi fırlatıyor.
// Eventi saklayıp kendi butonumuza bağlıyoruz, böylece tarayıcının
// kendi mini bar'ı yerine istediğimiz yerde "ana ekrana ekle" gösterebiliyoruz.
var bekleyenPrompt = null;

window.addEventListener('beforeinstallprompt', function (e) {
  e.preventDefault();
  bekleyenPrompt = e;
  yukleBtn.hidden = false;
});

yukleBtn.addEventListener('click', function () {
  if (!bekleyenPrompt) return;
  bekleyenPrompt.prompt();
  bekleyenPrompt.userChoice.then(function (sonuc) {
    console.log('kullanıcı seçimi:', sonuc.outcome); // accepted / dismissed
    bekleyenPrompt = null;
    yukleBtn.hidden = true;
  });
});

// Zaten yüklendiyse butonu bir daha gösterme
window.addEventListener('appinstalled', function () {
  yukleBtn.hidden = true;
  console.log('uygulama yüklendi');
});
