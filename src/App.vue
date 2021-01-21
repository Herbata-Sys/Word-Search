<template>
  <div id="app">
    <Board />
  </div>
</template>

<script>
import Board from './components/Board'

export default {
  name: 'App',

  components: {
    Board
  }
}
</script>

<style lang="scss">
body * {
  box-sizing: border-box;
  font-family: monospace;
}

body.fontLoaded * {
  font-family: 'Roboto Mono', monospace;
}
</style>
