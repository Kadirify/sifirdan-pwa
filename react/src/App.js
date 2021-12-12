import { useState, useEffect } from 'react';
import './App.css';
import { useCevrimici } from './useCevrimici';
import { useYukleme } from './useYukleme';

const ANAHTAR = 'liste-v1';

function okuListe() {
  try {
    return JSON.parse(localStorage.getItem(ANAHTAR)) || [];
  } catch (e) {
    return [];
  }
}

function App() {
  const [liste, setListe] = useState(okuListe);
  const [girdi, setGirdi] = useState('');
  const [guncelleme, setGuncelleme] = useState(null);

  const cevrimici = useCevrimici();
  const { yuklenebilir, yukle } = useYukleme();

  // her değişiklikte localStorage'a yaz
  useEffect(() => {
    localStorage.setItem(ANAHTAR, JSON.stringify(liste));
  }, [liste]);

  // index.js'ten gelen "yeni sürüm hazır" sinyali
  useEffect(() => {
    const dinle = (e) => setGuncelleme(e.detail);
    window.addEventListener('swGuncelleme', dinle);
    return () => window.removeEventListener('swGuncelleme', dinle);
  }, []);

  function ekle(e) {
    e.preventDefault();
    const ad = girdi.trim();
    if (!ad) return;
    setListe([...liste, { id: Date.now(), ad, alindi: false }]);
    setGirdi('');
  }

  function degistir(id) {
    setListe(liste.map((o) => (o.id === id ? { ...o, alindi: !o.alindi } : o)));
  }

  function sil(id) {
    setListe(liste.filter((o) => o.id !== id));
  }

  function alinanlariSil() {
    setListe(liste.filter((o) => !o.alindi));
  }

  function yenile() {
    // bekleyen sw'ye "artık sen geç" diyoruz, sonra sayfayı yeniliyoruz
    if (guncelleme && guncelleme.waiting) {
      guncelleme.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
    window.location.reload();
  }

  const kalan = liste.filter((o) => !o.alindi).length;

  return (
    <>
      <header className="ust">
        <h1>Alışveriş Listesi</h1>
        <span className={'durum' + (cevrimici ? '' : ' kapali')}>
          {cevrimici ? 'çevrimiçi' : 'çevrimdışı'}
        </span>
      </header>

      <main>
        <form className="ekle" onSubmit={ekle} autoComplete="off">
          <input
            type="text"
            placeholder="Ne alınacak?"
            value={girdi}
            maxLength={60}
            onChange={(e) => setGirdi(e.target.value)}
          />
          <button type="submit" aria-label="Ekle">+</button>
        </form>

        {liste.length === 0 ? (
          <p className="bos">Liste boş. Bir şeyler ekle.</p>
        ) : (
          <ul className="liste">
            {liste.map((o) => (
              <li key={o.id} className={o.alindi ? 'alindi' : ''}>
                <input
                  type="checkbox"
                  checked={o.alindi}
                  onChange={() => degistir(o.id)}
                />
                <span className="ad">{o.ad}</span>
                <button className="sil" title="Sil" onClick={() => sil(o.id)}>
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="alt">
          <span>{liste.length ? `${kalan} / ${liste.length} kaldı` : ''}</span>
          <button className="link" onClick={alinanlariSil}>
            Alınanları sil
          </button>
        </div>
      </main>

      {yuklenebilir && (
        <button className="yukle" onClick={yukle}>
          Ana ekrana ekle
        </button>
      )}

      {guncelleme && (
        <div className="toast">
          Yeni sürüm var.
          <button onClick={yenile}>Yenile</button>
        </div>
      )}
    </>
  );
}

export default App;
