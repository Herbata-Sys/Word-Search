<template>
  <div class="newGame">
    <div v-if="win" class="newGame__win">
      <h2>Wygrałeś!</h2>
      <div class="newGame__time">
        {{ formatTime(time) }}
      </div>
      <div class="newGame__breakRecord" v-if="breakRecord">
        <AwardIcon class="newGame__icon" size="20" />
        Pobiłeś swój rekord
      </div>
    </div>
    <div class="newGame__button" @click="$emit('restart')">
      Nowa gra
      <PlayIcon fill="white" class="newGame__playIcon" size="18" />
    </div>
    <canvas id="confetti" class="newGame__confetti" />
  </div>
</template>

<script>
import confetti from 'canvas-confetti'
import { AwardIcon, PlayIcon } from 'vue-feather-icons'
import time from '../mixins/time'

export default {
  name: 'NewGame',

  mixins: [
    time
  ],

  props: {
    breakRecord: Boolean,
    time: Number,
    win: Boolean
  },

  components: {
    AwardIcon,
    PlayIcon
  },

  mounted () {
    this.throwConfetti()
  },

  methods: {
    throwConfetti () {
      if (!this.win) {
        return
      }
      const myConfetti = confetti.create(document.querySelector('#confetti'), {
        resize: true,
        useWorker: true
      })
      myConfetti({
        particleCount: document.querySelector('#confetti').offsetWidth * 0.8,
        spread: document.querySelector('#confetti').offsetWidth * 0.15,
        origin: { y: 0.4 }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.newGame {
  position: absolute;
  top: 43px;
  background: rgba(255, 255, 255, 0.938);
  width: 100%;
  height: calc(100% - 70px);
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

  &__win {
    display: flex;
    flex-direction: column;
    align-items: center;
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
    font-size: 1.2rem;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
  }

  &__playIcon {
    margin-left: 10px;
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
