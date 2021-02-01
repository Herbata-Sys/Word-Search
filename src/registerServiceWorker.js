import { register } from 'register-service-worker'

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    updated (registration) {
      // window.location.reload(true)
      // const worker = registration.waiting
      // worker.postMessage({ action: 'SKIP_WAITING' })
      if (registration.waiting) {
        const accept = confirm('Nowa wersja jest dostępna, zainstalować?')
        if (accept) {
          registration.waiting.postMessage('SKIP_WAITING')
        }
      }
    }
  })
}
