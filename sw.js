const CACHE_NAME = "otsukare-mate-v10";
const ASSET_VERSION = "20260530-bgm-audible-fix";
const CORE_ASSETS = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  `/assets/main.js?v=${ASSET_VERSION}`,
  `/assets/main.css?v=${ASSET_VERSION}`,
  "/assets/app_bg_day.png",
  "/assets/splash_screen.png",
  "/assets/icon-192.png",
  "/assets/icon-512.png",
  "/assets/bgm/otsukare_bgm.mp3",
  "/assets/voice/tsumugi/voice-manifest.json",
  "/assets/character_main_normal.png",
  "/assets/character_main_smile.png",
  "/assets/character_main_gentle.png",
  "/assets/character_main_cheer.png",
  "/assets/character_main_goodnight.png",
  "/assets/characters/character_wave.png",
  "/assets/characters/character_talk_smile.png",
  "/assets/characters/character_talk_gentle.png",
  "/assets/characters/character_talk_cheer.png",
  "/assets/characters/character_talk_rest.png",
  "/assets/characters/character_nod.png",
  "/assets/characters/character_point.png",
  "/assets/characters/character_stretch.png",
  "/assets/characters/character_tea.png",
  "/assets/characters/character_good_job.png",
  "/assets/characters/character_blanket.png",
  "/assets/characters/character_sparkle.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate" || request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put("/index.html", responseClone));
          return response;
        })
        .catch(() => caches.match("/index.html"))
    );
    return;
  }

  if (url.pathname === "/assets/main.js" || url.pathname === "/assets/main.css") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (!response || response.status !== 200) return response;
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match(url.pathname)))
    );
    return;
  }

  if (url.pathname.startsWith("/assets/voice/")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (!response || response.status !== 200) return response;
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          return response;
        })
        .catch(() =>
          caches.match(request).then((cached) => cached || new Response("", { status: 504 }))
        )
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request)
        .then((response) => {
          if (!response || response.status !== 200) return response;
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          return response;
        })
        .catch(() => caches.match("/index.html"));
    })
  );
});
