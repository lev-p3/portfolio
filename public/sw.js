const VERSION = "v2";
const CORE = `detective-core-${VERSION}`;
const STATIC = `detective-static-${VERSION}`;
const CASE_PREFIX = `detective-case-${VERSION}-`;
const CORE_URLS = ["/", "/manifest.json", "/icon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CORE).then((cache) => cache.addAll(CORE_URLS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter((name) =>
      (name.startsWith("detective-core-") && name !== CORE) ||
      (name.startsWith("detective-static-") && name !== STATIC) ||
      (name.startsWith("detective-case-") && !name.startsWith(CASE_PREFIX))
    ).map((name) => caches.delete(name)));
    await self.clients.claim();
  })());
});

async function caseMatch(request) {
  const names = await caches.keys();
  for (const name of names) {
    if (!name.startsWith(CASE_PREFIX)) continue;
    const response = await (await caches.open(name)).match(request);
    if (response) return response;
  }
  return undefined;
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith((async () => {
      let response;
      try {
        response = await fetch(request);
      } catch {
        return (await caches.match(request)) || (await caches.match("/")) || Response.error();
      }
      if (response.ok && !response.redirected && new URL(response.url).origin === self.location.origin) {
        try {
          const cache = await caches.open(CORE);
          await cache.put(request, response.clone());
        } catch { /* Storage may be full; keep serving the network response. */ }
      }
      return response;
    })());
  } else if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith((async () => {
      const cache = await caches.open(STATIC);
      const cached = await cache.match(request);
      if (cached) return cached;
      const response = await fetch(request);
      if (response.ok && !response.redirected && new URL(response.url).origin === self.location.origin) {
        await cache.put(request, response.clone());
      }
      return response;
    })());
  } else {
    event.respondWith((async () => {
      const cached = await caches.match(request, { cacheName: CORE }) || await caseMatch(request);
      if (cached) return cached;
      return fetch(request);
    })());
  }
});

// Messages: {type, caseId, urls?: string[], requestId?}; replies go to the sender.
self.addEventListener("message", (event) => {
  const { type, caseId, urls, requestId } = event.data || {};
  if (!["DOWNLOAD_CASE", "DELETE_CASE", "CASE_STATUS"].includes(type)) return;
  const reply = (payload) => event.source?.postMessage({ ...payload, caseId, requestId });
  event.waitUntil((async () => {
    try {
      if (typeof caseId !== "string" || !/^[a-zA-Z0-9_-]{1,64}$/.test(caseId)) throw new Error("Invalid caseId");
      const name = CASE_PREFIX + caseId;
      if (type === "DELETE_CASE") {
        reply({ type: "CASE_DELETED", deleted: await caches.delete(name) });
      } else if (type === "CASE_STATUS") {
        const exists = (await caches.keys()).includes(name);
        reply({ type: "CASE_STATUS", cached: exists ? (await (await caches.open(name)).keys()).map((key) => key.url) : [] });
      } else {
        if (!Array.isArray(urls) || !urls.length || urls.length > 200) throw new Error("Invalid urls");
        const assets = urls.map((path) => {
          if (typeof path !== "string" || !path.startsWith("/") || path.startsWith("//")) throw new Error("Invalid asset URL");
          const url = new URL(path, self.location.origin);
          if (url.origin !== self.location.origin || !(/\.[a-z0-9]+$/i.test(url.pathname) || url.pathname.startsWith("/_next/static/")) || url.pathname.startsWith("/api/")) {
            throw new Error("Invalid asset URL");
          }
          return url.href;
        });
        const cache = await caches.open(name);
        let completed = 0;
        for (const url of assets) {
          const response = await fetch(url, { credentials: "omit" });
          if (!response.ok || response.redirected || new URL(response.url).origin !== self.location.origin) throw new Error(`Failed to cache ${url}`);
          await cache.put(url, response);
          reply({ type: "CASE_PROGRESS", completed: ++completed, total: assets.length, url });
        }
        reply({ type: "CASE_DOWNLOADED", completed, total: assets.length });
      }
    } catch (error) {
      reply({ type: "CASE_ERROR", error: String(error) });
    }
  })());
});
