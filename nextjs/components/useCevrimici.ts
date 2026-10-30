"use client";

import { useEffect, useState } from "react";

// Sunucuda navigator yok, o yüzden true ile başlıyoruz; mount'ta gerçek değeri alıyor.
export function useCevrimici() {
  const [acik, setAcik] = useState(true);

  useEffect(() => {
    setAcik(navigator.onLine);
    const ac = () => setAcik(true);
    const kapa = () => setAcik(false);
    window.addEventListener("online", ac);
    window.addEventListener("offline", kapa);
    return () => {
      window.removeEventListener("online", ac);
      window.removeEventListener("offline", kapa);
    };
  }, []);

  return acik;
}
