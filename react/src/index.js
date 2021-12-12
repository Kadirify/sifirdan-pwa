import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// CRA'da bu varsayılan olarak unregister(). PWA istiyorsak register() yapıyoruz.
// onUpdate: yeni bir sürüm indirildi ama henüz devrede değil. App bunu yakalayıp
// kullanıcıya "yenile" diyor, yoksa eski sürümde takılı kalıyor.
serviceWorkerRegistration.register({
  onUpdate: (registration) => {
    window.dispatchEvent(new CustomEvent('swGuncelleme', { detail: registration }));
  },
});
