import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import { applyReducedMotion, loadReducedMotion } from './game/core/presentation/motionSettings';
import { registerServiceWorker } from './pwa/registerServiceWorker';
import './index.css';

const root = document.getElementById('root');
if (!root) throw new Error('#root not found');

applyReducedMotion(loadReducedMotion(), false);
registerServiceWorker();

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
