import { useState, useEffect } from 'react';

// beforeinstallprompt eventini yakalayıp bir butona bağlamak için.
// Event sadece Chrome tabanlı tarayıcılarda geliyor (Chrome, Edge, Samsung Internet).
// Safari'de hiç gelmiyor, orada kullanıcı Paylaş > Ana Ekrana Ekle yapmak zorunda.
export function useYukleme() {
  const [prompt, setPrompt] = useState(null);

  useEffect(() => {
    const yakala = (e) => {
      e.preventDefault(); // tarayıcının kendi mini barını engelle
      setPrompt(e);
    };
    const yuklendi = () => setPrompt(null);

    window.addEventListener('beforeinstallprompt', yakala);
    window.addEventListener('appinstalled', yuklendi);
    return () => {
      window.removeEventListener('beforeinstallprompt', yakala);
      window.removeEventListener('appinstalled', yuklendi);
    };
  }, []);

  async function yukle() {
    if (!prompt) return;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    console.log('kullanıcı seçimi:', outcome);
    setPrompt(null); // event bir kere kullanılıyor
  }

  return { yuklenebilir: prompt !== null, yukle };
}
