import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Importă stilurile CSS
import './App.css';

// Importă componenta principală App (care este exportul default din App.js)
import App from './App';

// Găsește elementul root din HTML
const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

// Randează aplicația
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
