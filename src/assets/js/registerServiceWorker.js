import { register } from 'register-service-worker'

if (process.env.NODE_ENV === 'production') {
  const updateServiceWorker = (registration) => {
    if (registration.waiting) {
      const accept = confirm('Dostępna jest nowsza wersja aplikacji, chcesz ją zainstalować?')
      if (accept) {
        const worker = registration.waiting
        worker.postMessage({ action: 'SKIP_WAITING' })
      }
    }
  }

  let refreshing = false

  register(`${process.env.BASE_URL}service-worker.js`, {
    registered () {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          window.location.reload()
          refreshing = true
        }
      })
    },

    updatefound (registration) {
      if (registration.installing) {
        registration.installing.addEventListener('statechange', () => {
          if (registration.waiting) {
            if (navigator.serviceWorker.controller) {
              updateServiceWorker(registration)
            }
          }
        })
      }
    }
  })
}
