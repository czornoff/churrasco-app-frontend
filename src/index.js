import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

if (window.location.hostname === 'localhost') {
  const originalError = console.error;
  console.error = (...args) => {
    // Se a mensagem contiver termos de scripts externos que sabemos que falham no localhost, ignoramos
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

reportWebVitals();
