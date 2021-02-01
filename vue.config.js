const excludeBackgrounds = () => {
  const bgs = require('./src/assets/settings/backgrounds.json')
  const exclude = []
  bgs.forEach((bg, index) => {
    if (index !== 6 && bg.url) {
      const regex = `${bg.url.replace('/images/', '').replace('.', '\\.')}$`
      exclude.push(new RegExp(regex))
    }
  })
  console.log(exclude)
  return exclude
}

module.exports = {
  pwa: {
    workboxPluginMode: 'InjectManifest',
    themeColor: '#FFFFFF',
    manifestOptions: {
      start_url: "./?installed=true",
      name: "Wykreślanka",
      short_name: "Wykreślanka",
      display: "fullscreen",
      icons: [
        { "src":"./img/icons/android-chrome-192x192.png","sizes":"192x192","type":"image/png" },
        { "src":"./img/icons/android-chrome-512x512.png","sizes":"512x512","type":"image/png" },
        { "src":"./img/icons/android-chrome-maskable-192x192.png","sizes":"192x192","type":"image/png","purpose":"maskable" }
      ],
      background_color: "#FFFFFF"
    },
    workboxOptions: {
      swSrc: 'src/assets/js/service-worker.js',
      exclude: excludeBackgrounds()
    }
  },
  configureWebpack:{
    performance: {
      hints: false
    },
    optimization: {
      splitChunks: {
        minSize: 10000,
        maxSize: 200000,
      }
    }
  }
}
