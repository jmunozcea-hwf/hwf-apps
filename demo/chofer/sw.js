/* Siempre intenta la versión nueva; sin internet usa la guardada */
const C = "hwf-chofer-demo";
self.addEventListener("install", e => { self.skipWaiting(); e.waitUntil(caches.open(C).then(c => c.addAll(["./", "manifest.webmanifest", "icon-192.png", "icon-512.png"]))); });
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", e => { const u = new URL(e.request.url); if (e.request.method !== "GET" || u.origin !== location.origin) return;
  e.respondWith(fetch(e.request, { cache: "no-cache" }).then(r => { if (r.ok) { const k = r.clone(); caches.open(C).then(c => c.put(e.request, k)); } return r; }).catch(() => caches.match(e.request).then(r => r || caches.match("./")))); });
