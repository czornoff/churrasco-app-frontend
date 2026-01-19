import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import App from './App';
import reportWebVitals from './reportWebVitals';

if (window.location.hostname === 'localhost') {
  const originalError = console.error;
  console.error = (...args) => {
    if (args[0]?.includes?.('No checkout popup config') || args[0]?.includes?.('adsbygoogle')) {
      return;
    }
    originalError.apply(console, args);
  };
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

serviceWorkerRegistration.register({
    onUpdate: registration => {
        // Caso você atualize o código do app, isso avisa o usuário
        const waitingServiceWorker = registration.waiting;
        if (waitingServiceWorker) {
        waitingServiceWorker.addEventListener("statechange", event => {
            if (event.target.state === "activated") {
            if (window.confirm("Nova versão disponível! Atualizar agora?")) {
                window.location.reload();
            }
            }
        });
        waitingServiceWorker.postMessage({ type: "SKIP_WAITING" });
        }
    }
});

reportWebVitals();
