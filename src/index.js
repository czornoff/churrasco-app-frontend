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
  
    <App />
  
);

serviceWorkerRegistration.register({
    onUpdate: (registration) => {
        const waitingServiceWorker = registration.waiting;

        if (waitingServiceWorker) {
        // Alerta para o usuário
        const atualizar = window.confirm("🚀 Nova versão disponível! Deseja atualizar o app agora?");
        
        if (atualizar) {
            waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' });
            waitingServiceWorker.addEventListener('statechange', (event) => {
            if (event.target.state === 'activated') {
                window.location.reload();
            }
            });
        }
        }
    },
});

reportWebVitals();
