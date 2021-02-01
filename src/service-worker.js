workbox.setConfig({
  debug: false,
});

workbox.core.setCacheNameDetails({prefix: "words-search"});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('activate', event => {
  var cacheKeeplist = [cacheName];
  event.waitUntil(
    caches.keys().then( keyList => {
        return Promise.all(keyList.map( key => {
            if (cacheKeeplist.indexOf(key) === -1) {
                return caches.delete(key);
            }
        }));
    }).then(self.clients.claim()));
});

self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
