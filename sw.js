/* Antes Nota de Pedido vivía en la raíz. Este service worker reemplaza al viejo y se elimina solo. */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k === "hwf-nota-pedido").map(k => caches.delete(k)))).then(() => self.registration.unregister())));
