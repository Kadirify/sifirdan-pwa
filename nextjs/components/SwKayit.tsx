"use client";

import { useEffect } from "react";

// Service worker'ı kaydeden görünmez bileşen. layout.tsx'te bir kere kullanılıyor.
// Sadece production'da: dev'de sw olsa her değişiklikte eski kodu görürsün.
export default function SwKayit() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => console.log("sw kayıtlı, scope:", reg.scope))
      .catch((err) => console.log("sw kaydedilemedi:", err));
  }, []);

  return null;
}
