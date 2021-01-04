export default {
  methods: {
    formatTime (time) {
      const min = Math.trunc(time / 60)
      const sec = time - min * 60
      return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
    }
  }
}
