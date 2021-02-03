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
    <img class="newGame__logo" width="100%" height="auto" src="/img/icons/logo_wide.webp"/>
    <div class="newGame__button" @click="$emit('restart')">
      <PlayIcon fill="white" class="newGame__playIcon" size="55" />
    </div>
    <canvas id="confetti" class="newGame__confetti" />
  </div>
</template>

<script>
import time from '../mixins/time'
import { PlayIcon } from 'vue-feather-icons'
const confetti = () => import('canvas-confetti')
const AwardIcon = () => import('vue-feather-icons/icons/AwardIcon')

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
      confetti().then((confetti) => {
        const myConfetti = confetti.create(document.querySelector('#confetti'), {
          resize: true,
          useWorker: true
        })
        myConfetti({
          particleCount: document.querySelector('#confetti').offsetWidth * 0.8,
          spread: document.querySelector('#confetti').offsetWidth * 0.15,
          origin: { y: 0.4 }
        })
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
  align-items: center;
  flex-direction: column;

  &__logo {
    max-width: 250px;
    filter: drop-shadow(2px 1px 2px #0000007f);
    margin-top: -10px;
    margin-bottom: 30px;
  }

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
    padding: 8px;
    border-radius: 15px;
    background: #B8007D;
    box-shadow: 0px 0px 11px 2px #9a0b67;
    color: #68074952;
    cursor: pointer;
    display: flex;
    align-items: center;
    animation: float 2s linear infinite both;

    &:hover {
      background: #a80073;
    }
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

@keyframes float {
  0% {
    transform: translateY(0);
  }
  25% {
    transform: translateY(3px);
  }
  50% {
    transform: translateY(0);
  }
  75% {
    transform: translateY(-3px);
  }
  100% {
    transform: translateY(0);
  }
}
</style>
