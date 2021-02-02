<template>
  <div class="menuB">
    <div class="menuB__wrapper">
      <div class="menuB__difficultyIcon">
        <component
          :is="difficulty.iconName"
          size="13"
          :color="difficulty.iconColor"
        />
        <TriangleIcon v-if="difficulty === 1" size="13" color="#00ce06" />
        <SquareIcon v-else-if="difficulty === 2" size="13" color="#d17d00" />
        <HexagonIcon v-else-if="difficulty === 3" size="13" color="#b80000" />
      </div>
      {{ difficulty.name }}
    </div>
    <div class="menuB__wrapper">
      {{ categories.find(c => c.value === settings.category).name }}
      <span v-if="words.length" class="menuB__words">
        ({{ words.length - crossedWords.length }})
      </span>
    </div>
    <div class="menuB__wrapper">
      <div class="menuB__penalty menuB__timer" v-if="penalty">
        +25s
      </div>
      <div class="menuB__timer" v-else>
        {{ formatTime(time) }}
      </div>
      <ClockIcon
        :color="penalty ? 'red' : ''"
        size="12"
        class="menuB__clockIcon"
      />
    </div>
  </div>
</template>

<script>
import { ClockIcon } from 'vue-feather-icons'
import time from '../mixins/time'
const TriangleIcon = () => import('vue-feather-icons/icons/TriangleIcon')
const SquareIcon = () => import('vue-feather-icons/icons/SquareIcon')
const HexagonIcon = () => import('vue-feather-icons/icons/HexagonIcon')

export default {
  name: 'BottomMenu',

  mixins: [
    time
  ],

  components: {
    ClockIcon,
    TriangleIcon,
    SquareIcon,
    HexagonIcon
  },

  props: {
    crossedHints: Number,
    categories: Array,
    difficultyLevels: Array,
    settings: Object,
    words: Array,
    crossedWords: Array
  },

  data () {
    return {
      locked: false,
      time: 0,
      timeInterval: null,
      penalty: false,
      penaltyTimer: null
    }
  },

  watch: {
    crossedHints (val) {
      if (val) {
        this.time += 25
        this.penalty = false

        setTimeout(() => {
          this.penalty = true
        }, 1)

        clearTimeout(this.penaltyTimer)

        this.penaltyTimer = setTimeout(() => {
          this.penalty = false
        }, 1200)
      }
    }
  },

  created () {
    this.initiateTimer()
  },

  computed: {
    difficulty () {
      return this.difficultyLevels[this.settings.difficulty - 1]
    }
  },

  methods: {
    initiateTimer () {
      document.addEventListener('visibilitychange', this.toggleTimer)
    },

    startTimer (windowChange) {
      if (windowChange && this.locked) {
        return
      }
      this.locked = false
      clearInterval(this.timeInterval)
      this.timeInterval = setInterval(() => this.time++, 1000)
    },

    stopTimer (windowChange) {
      clearInterval(this.timeInterval)
      if (!windowChange) {
        this.locked = true
      }
    },

    restartTimer () {
      clearInterval(this.timeInterval)
      this.time = 0
      this.locked = false
      this.startTimer()
    },

    toggleTimer () {
      if (document.hidden) {
        this.stopTimer(true)
      } else {
        this.startTimer(true)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.menuB {
  display: flex;
  justify-content: space-between;
  border: 1px solid #ebe9e9;
  padding: 6px 10px;
  border-radius: 0 0 10px 10px;
  font-size: 0.7rem;
  font-weight: 500;
  background: white;
  border-left: none;
  border-right: none;

  &__wrapper {
    display: flex;
    align-items: center;
  }

  &__timer {
    min-width: 35px;
  }

  &__clockIcon {
    margin-left: 5px;
  }

  &__penalty {
    font-weight: 600;
    color: red;
    text-align: right;
    animation: wobble-hor-bottom 0.8s both;
  }

  &__difficultyIcon {
    margin-right: 5px;
    display: flex;
  }

  &__words {
    padding-left: 5px;
    font-weight: 600;
  }
}

@keyframes wobble-hor-bottom {
  0%,
  100% {
    transform: translateX(0%);
    transform-origin: 50% 50%;
  }
  15% {
    transform: translateX(-20px) rotate(-6deg);
  }
  30% {
    transform: translateX(10px) rotate(6deg);
  }
  45% {
    transform: translateX(-10px) rotate(-3.6deg);
  }
  60% {
    transform: translateX(5px) rotate(2.4deg);
  }
  75% {
    transform: translateX(-3px) rotate(-1.2deg);
  }
}
</style>
