"use client";

import { useEffect, useState } from "react";

// TS'te beforeinstallprompt için hazır tip yok, kendimiz tanımlıyoruz
type YuklemeEventi = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function useYukleme() {
  const [prompt, setPrompt] = useState<YuklemeEventi | null>(null);

  useEffect(() => {
    const yakala = (e: Event) => {
      e.preventDefault();
      setPrompt(e as YuklemeEventi);
    };
    const yuklendi = () => setPrompt(null);

    window.addEventListener("beforeinstallprompt", yakala);
    window.addEventListener("appinstalled", yuklendi);
    return () => {
      window.removeEventListener("beforeinstallprompt", yakala);
      window.removeEventListener("appinstalled", yuklendi);
    };
  }, []);

  async function yukle() {
    if (!prompt) return;
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    console.log("kullanıcı seçimi:", outcome);
    setPrompt(null);
  }

  return { yuklenebilir: prompt !== null, yukle };
}
