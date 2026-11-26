/* Service worker: cache gambar lokal agar reload tidak mengunduh ulang.
 * Hanya gambar same-origin di /assets/photos/; HTML/JS/CSS tetap network
 * supaya update aplikasi langsung terlihat. Memori toast tidak disentuh. */
"use strict";

const CACHE = "limah-photos-v1";
const CORE = [
  "/assets/photos/HOME/BG.jpg",
  "/assets/photos/HOME/pose_dagu_clean2.png",
  "/assets/photos/HOME/pose_berpikir_clean.png",
  "/assets/photos/HOME/pose_menunjuk_transparan.png",
  "/assets/photos/NEW/11_h.jpg"
];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    try {
      const cache = await caches.open(CACHE);
      await Promise.all(CORE.map((url) => cache.add(url).catch(() => {})));
    } catch (_) {}
    try { await self.skipWaiting(); } catch (_) {}
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    try {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => k.indexOf("limah-photos-") === 0 && k !== CACHE)
          .map((k) => caches.delete(k))
      );
    } catch (_) {}
    try { await self.clients.claim(); } catch (_) {}
  })());
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  let url;
  try { url = new URL(req.url); } catch (_) { return; }
  if (url.origin !== self.location.origin) return;
  if (url.pathname.indexOf("/assets/photos/") !== 0) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(req, { ignoreSearch: true });
    if (hit) return hit;
    try {
      const res = await fetch(req);
      if (res && res.ok) {
        try { await cache.put(req, res.clone()); } catch (_) {}
      }
      return res;
    } catch (_) {
      return hit || Response.error();
    }
  })());
});
