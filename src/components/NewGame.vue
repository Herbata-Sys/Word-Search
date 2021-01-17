<template>
  <div class="newGame">
    <h2>Wygrałeś!</h2>
    <div class="newGame__time">
      {{ formatTime(time) }}
    </div>
    <div class="newGame__breakRecord" v-if="breakRecord">
      <AwardIcon class="newGame__icon" size="20" />
      Pobiłeś swój rekord
    </div>
    <div class="newGame__button" @click="$emit('restart')">
      Nowa gra
    </div>
    <canvas id="confetti" class="newGame__confetti" />
  </div>
</template>

<script>
import ConfettiGenerator from 'confetti-js'
import { AwardIcon } from 'vue-feather-icons'
import time from '../mixins/time'

export default {
  name: 'NewGame',

  mixins: [
    time
  ],

  props: {
    breakRecord: Boolean,
    time: Number
  },

  components: {
    AwardIcon
  },

  mounted () {
    const confettiSettings = {
      target: 'confetti',
      max: '80',
      size: '1',
      animate: true,
      props: ['square', 'line'],
      colors: [[165, 104, 246], [230, 61, 135], [0, 199, 228], [253, 214, 126]],
      clock: '20',
      rotate: false,
      width: document.querySelector('#confetti').offsetWidth,
      height: document.querySelector('#confetti').offsetHeight,
      start_from_edge: true,
      respawn: true
    }
    const confetti = new ConfettiGenerator(confettiSettings)
    confetti.render()
  }
}
</script>

<style scoped lang="scss">
.newGame {
  position: absolute;
  top: 43px;
  background: rgba(255, 255, 255, 0.938);
  width: 100%;
  height: calc(100% - 72px);
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  h2 {
    font-weight: 600;
    font-size: 1.2rem;
    margin-top: 0;
    margin-bottom: 0;
    padding-bottom: 10px;
  }

  &__confetti {
    pointer-events: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  &__button {
    width: fit-content;
    margin: 5px auto 0 auto;
    padding: 4px 15px;
    border-radius: 5px;
    background: #076aff;
    color: white;
    cursor: pointer;
  }

  &__breakRecord {
    display: flex;
    margin-bottom: 10px;
  }

  &__time {
    margin-bottom: 10px;
  }

  &__icon {
    margin-right: 10px;
  }
}
</style>
