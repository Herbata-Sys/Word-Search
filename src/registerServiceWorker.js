import { register } from 'register-service-worker'

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    updated (registration) {
      const worker = registration.waiting
      worker.postMessage({ action: 'SKIP_WAITING' })
    }
  })
}
