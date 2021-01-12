module.exports = {
  pwa: {
    workboxPluginMode: 'GenerateSW',
    themeColor: '#FFFFFF',
    manifestOptions: {
      icons: [
        { "src":"./img/icons/android-chrome-192x192.png","sizes":"192x192","type":"image/png" },
        { "src":"./img/icons/android-chrome-512x512.png","sizes":"512x512","type":"image/png" },
        { "src":"./img/icons/android-chrome-maskable-192x192.png","sizes":"192x192","type":"image/png","purpose":"maskable" }
      ]
    }
  },
  publicPath: process.env.NODE_ENV === 'production'
  ? '/words/'
  : '/'
}