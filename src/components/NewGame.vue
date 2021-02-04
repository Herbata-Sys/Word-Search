<template>
  <div class="newGame">
    <div class="newGame__desc">
      <img
        class="newGame__logo"
        alt="Wykreślanka gra logiczna"
        width="190px"
        height="99.68px"
        src="/img/icons/logo_wide.webp"
      />
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
        <PlayIcon fill="white" class="newGame__playIcon" size="45" />
      </div>
      <div v-if="!win">
        <b>Wykreślanka</b> to prosta gra słowna. Twoim zadaniem jest wykreślenie <b>wszystkich słów</b> znajdujących się na planszy w jak <b>najkrótszym czasie</b>.<br>
        Wciśnij przycisk <b>Play</b>, aby zagrać!
      </div>
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
  top: 51px;
  background: rgba(255, 255, 255, 0.938);
  width: 100%;
  height: calc(100% - 78px);
  z-index: 1;
  display: flex;
  align-items: center;
  flex-direction: column;

  &__logo {
    max-width: 90%;
    margin-top: -20px;
    filter: drop-shadow(2px 1px 2px #0000007f);
  }

  &__desc {
    background: rgb(255, 255, 255);
    margin: 0 auto;
    margin-top: 40px;
    width: calc(100% - 80px);
    font-size: 0.72rem;
    padding: 10px;
    border-radius: 10px;
    border: 1px solid #ebe9e9;
    text-align: center;
    margin-bottom: 20px;
    color: black;
    line-height: 0.9rem;
  }

  b {
    position: relative;
    color: #9a0b67;
    display: inline-block;

    &::before {
      position: absolute;
      content: '';
      border-bottom: 5px solid #9a0b683d;
      top: -5px;
      left: 0;
      width: 100%;
      height: 100%;
    }
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
    margin: 10px auto 30px auto;
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
