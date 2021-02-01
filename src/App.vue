<template>
  <div id="app">
    <Game class="game" />
  </div>
</template>

<script>
import Game from './components/Game'

export default {
  name: 'App',

  components: {
    Game
  }
}
</script>

<style lang="scss">
* {
  -webkit-tap-highlight-color: rgba(0,0,0,0);
}

body {
  margin: 10px;
  padding: 0;
  background-attachment: fixed !important;
  background-size: cover !important;
  background-position: center !important;
  overscroll-behavior: none;

  * {
    box-sizing: border-box;
    font-family: 'Inconsolata', monospace;
  }
}

html {
  font-size: 17px;
}
</style>

<style lang="scss" scoped>
.game {
  min-height: calc(100vh - 20px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
