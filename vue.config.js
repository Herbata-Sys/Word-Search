module.exports = {
  pwa: {
    workboxPluginMode: 'InjectManifest',
    themeColor: '#FFFFFF',
    manifestOptions: {
      icons: [
        { "src":"./img/icons/android-chrome-192x192.png","sizes":"192x192","type":"image/png" },
        { "src":"./img/icons/android-chrome-512x512.png","sizes":"512x512","type":"image/png" },
        { "src":"./img/icons/android-chrome-maskable-192x192.png","sizes":"192x192","type":"image/png","purpose":"maskable" }
      ]
    },
    workboxOptions: {
      swSrc: 'src/service-worker.js'
    }
  }
}