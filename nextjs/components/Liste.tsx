"use client";

import { useEffect, useState } from "react";
import { useCevrimici } from "./useCevrimici";
import { useYukleme } from "./useYukleme";

type Oge = { id: number; ad: string; alindi: boolean };

const ANAHTAR = "liste-v1";

function okuListe(): Oge[] {
  try {
    return JSON.parse(localStorage.getItem(ANAHTAR) || "[]");
  } catch {
    return [];
  }
}

export default function Liste() {
  // localStorage sunucuda yok, o yüzden boş başlayıp mount'ta okuyoruz.
  // Yoksa sunucu "boş liste" render ediyor, tarayıcı "dolu liste", hydration hatası.
  const [liste, setListe] = useState<Oge[]>([]);
  const [hazir, setHazir] = useState(false);
  const [girdi, setGirdi] = useState("");

  const cevrimici = useCevrimici();
  const { yuklenebilir, yukle } = useYukleme();

  useEffect(() => {
    setListe(okuListe());
    setHazir(true);
  }, []);

  useEffect(() => {
    if (hazir) localStorage.setItem(ANAHTAR, JSON.stringify(liste));
  }, [liste, hazir]);

  function ekle(e: React.FormEvent) {
    e.preventDefault();
    const ad = girdi.trim();
    if (!ad) return;
    setListe([...liste, { id: Date.now(), ad, alindi: false }]);
    setGirdi("");
  }

  const kalan = liste.filter((o) => !o.alindi).length;

  return (
    <>
      <header className="ust">
        <h1>Alışveriş Listesi</h1>
        <span className={"durum" + (cevrimici ? "" : " kapali")}>
          {cevrimici ? "çevrimiçi" : "çevrimdışı"}
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

        {hazir && liste.length === 0 ? (
          <p className="bos">Liste boş. Bir şeyler ekle.</p>
        ) : (
          <ul className="liste">
            {liste.map((o) => (
              <li key={o.id} className={o.alindi ? "alindi" : ""}>
                <input
                  type="checkbox"
                  checked={o.alindi}
                  onChange={() =>
                    setListe(liste.map((x) => (x.id === o.id ? { ...x, alindi: !x.alindi } : x)))
                  }
                />
                <span className="ad">{o.ad}</span>
                <button
                  className="sil"
                  title="Sil"
                  onClick={() => setListe(liste.filter((x) => x.id !== o.id))}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="alt">
          <span>{liste.length ? `${kalan} / ${liste.length} kaldı` : ""}</span>
          <button className="link" onClick={() => setListe(liste.filter((o) => !o.alindi))}>
            Alınanları sil
          </button>
        </div>
      </main>

      {yuklenebilir && (
        <button className="yukle" onClick={yukle}>
          Ana ekrana ekle
        </button>
      )}
    </>
  );
}
