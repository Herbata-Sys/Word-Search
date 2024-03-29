workbox.setConfig({
  debug: false,
})

workbox.core.setCacheNameDetails({prefix: 'words-search'})

self.addEventListener('message', (event) => {
  if (event.data && event.data.action === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

self.__precacheManifest = [].concat(self.__precacheManifest || [])
workbox.precaching.precacheAndRoute(self.__precacheManifest, {
  ignoreURLParametersMatching: [/.*/]
})
