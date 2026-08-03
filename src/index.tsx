import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './ui/App';
import { registerServiceWorker } from './pwa/registerServiceWorker';
import './index.css';

const root = document.getElementById('root');
if (!root) throw new Error('#root not found');

registerServiceWorker();

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
