const CACHE_NAME = "dbsdv-build-10";

const STATIC_FILES = ["./", "./index.html", "./manifest.json"];

// インストール
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_FILES)),
  );

  self.skipWaiting();
});

// 有効化
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();

      await Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key)),
      );

      await self.clients.claim();
    })(),
  );
});

// 通信
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // http/https 以外はキャッシュしない
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return;
  }

  // index.html は毎回ネット優先
  if (
    event.request.mode === "navigate" ||
    url.pathname.endsWith("index.html")
  ) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put("./index.html", copy);
          });

          return response;
        })
        .catch(() => caches.match("./index.html")),
    );

    return;
  }

  // JS・CSS・画像はキャッシュ優先＋裏で更新
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const networkFetch = fetch(event.request)
        .then((response) => {
          const copy = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, copy);
          });

          return response;
        })
        .catch(() => cached);

      return cached || networkFetch;
    }),
  );
});

// アプリ側から「今すぐ新しい Service Worker を有効化して」と言われたら実行
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
