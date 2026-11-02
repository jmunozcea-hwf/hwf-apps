/* Antes la demo de Nota de Pedido vivía en demo/. Este service worker reemplaza al viejo y se elimina solo. */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.registration.unregister()));
