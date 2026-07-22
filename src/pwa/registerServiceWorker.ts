export function registerServiceWorker(): void {
  if (!('serviceWorker' in navigator)) return;

  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') return;

  window.addEventListener('load', () => {
    const serviceWorkerUrl = new URL('sw.js', document.baseURI);
    void navigator.serviceWorker.register(serviceWorkerUrl.href);
  }, { once: true });
}
