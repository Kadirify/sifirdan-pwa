import { useState, useEffect } from 'react';

// navigator.onLine'ı state olarak veriyor.
// Not: onLine true olması internetin gerçekten çalıştığı anlamına gelmiyor,
// sadece bir ağ bağlantısı var demek. Yine de gösterge için yeterli.
export function useCevrimici() {
  const [acik, setAcik] = useState(navigator.onLine);

  useEffect(() => {
    const ac = () => setAcik(true);
    const kapa = () => setAcik(false);
    window.addEventListener('online', ac);
    window.addEventListener('offline', kapa);
    return () => {
      window.removeEventListener('online', ac);
      window.removeEventListener('offline', kapa);
    };
  }, []);

  return acik;
}
