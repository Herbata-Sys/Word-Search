<template>
  <div class="menu">
    <div class="menu__words">
      <div class="menu__arrow" @click="prevWord">
        <ChevronLeftIcon size="25" :color="!wordIndex ? '#bebebe' : 'black'" class="menu__icon" />
        <div class="menu__count" v-if="availableWords.length">
          {{ wordIndex + 1 }}
        </div>
      </div>
      <div
        class="menu__word"
        :class="{ menu__win: !availableWords.length && win }"
        @click="availableWords.length ? crossWord() : ''"
      >
        {{ availableWords.length ? availableWords[wordIndex] : (win ?'Wygrałeś!' : welcomeText) }}
      </div>
      <div class="menu__arrow" @click="nextWord">
        <ChevronRightIcon size="25" :color="reachedEnd ? '#bebebe' : 'black'" class="menu__icon" />
        <div class="menu__count" v-if="availableWords.length">
          {{ availableWords.length }}
        </div>
      </div>
    </div>
    <div class="menu__wrapper">
      <Maximize2Icon
        v-if="!fullscreen && isBrowser()"
        size="20"
        color="#0043ff"
        class="menu__icon"
        @click="toggleFullscreen"
      />
      <Minimize2Icon
        v-else-if="fullscreen && isBrowser()"
        size="20"
        color="#a800ed"
        class="menu__icon"
        @click="toggleFullscreen"
      />
      <SettingsIcon size="21" color="#ed6300" class="menu__icon" @click="$emit('show-settings')" />
      <img
        src="/img/icons/android-chrome-192x192.png"
        alt="Wykreślanka logo"
        class="menu__logo"
        width="40px"
        height="40px"
      >
    </div>
  </div>
</template>

<script>
import { SettingsIcon } from 'vue-feather-icons'
const ChevronRightIcon = () => import('vue-feather-icons/icons/ChevronRightIcon')
const ChevronLeftIcon = () => import('vue-feather-icons/icons/ChevronLeftIcon')
const Maximize2Icon = () => import('vue-feather-icons/icons/Maximize2Icon')
const Minimize2Icon = () => import('vue-feather-icons/icons/Minimize2Icon')

export default {
  name: 'Menu',

  components: {
    Maximize2Icon,
    Minimize2Icon,
    SettingsIcon,
    ChevronLeftIcon,
    ChevronRightIcon
  },

  props: {
    win: Boolean,
    words: Array,
    crossedWords: Array
  },

  data () {
    return {
      fullscreen: false,
      wordIndex: 0,
      word: ''
    }
  },

  watch: {
    availableWords (val) {
      if ((this.wordIndex >= val.length - 1) && this.wordIndex !== 0) {
        this.wordIndex--
      } else if (this.wordIndex === 0) {
        this.setWord()
      }

      const pickedWordIndex = this.availableWords.findIndex(v => v.toLowerCase() === this.word.toLowerCase())

      if ((pickedWordIndex + 1) && (this.wordIndex !== pickedWordIndex)) {
        this.wordIndex = pickedWordIndex
      }
    },

    crossedWords (val) {
      if (val && !val.length) {
        this.wordIndex = 0
      }
    }
  },

  computed: {
    availableWords () {
      const arr = []
      this.words.forEach(word => {
        if (!this.crossedWords.includes(word)) {
          arr.push(word)
        }
      })
      return arr
    },

    reachedEnd () {
      return this.wordIndex >= (this.availableWords.length - 1)
    },

    welcomeText () {
      const dateNow = new Date()
      const hoursNow = dateNow.getHours()
      return hoursNow > 5 && hoursNow < 19 ? 'Dzień dobry 🌞' : 'Dobry wieczór 🌕'
    }
  },

  mounted () {
    document.onfullscreenchange = () => {
      this.fullscreen = this.isFullScreenMode()
    }
  },

  methods: {
    isBrowser () {
      const urlParams = new URLSearchParams(window.location.search)
      const isInstalled = urlParams.get('installed')
      return !isInstalled
    },

    toggleFullscreen () {
      if (!this.isFullScreenMode()) {
        document.documentElement.requestFullscreen()
      } else {
        document.exitFullscreen()
      }
    },

    isFullScreenMode () {
      return document.fullscreenElement !== null
    },

    crossWord () {
      const actualIndex = this.wordIndex

      if ((this.wordIndex === this.availableWords.length - 1) && this.wordIndex !== 0) {
        this.wordIndex--
      }

      this.$emit('hint-clicked', this.availableWords[actualIndex])
    },

    prevWord () {
      if (this.wordIndex) {
        this.wordIndex--
        this.setWord()
      }
    },

    nextWord () {
      if (!this.reachedEnd) {
        this.wordIndex++
        this.setWord()
      }
    },

    setWord () {
      this.word = this.availableWords[this.wordIndex]
    }
  }
}
</script>

<style scoped lang="scss">
.menu {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #ebe9e9;
  padding-right: 10px;
  border-radius: 10px 10px 0 0;
  background: white;
  border-left: none;
  border-right: none;
  height: 51px;
  overflow-x: auto;

  &__logo {
    height: 40px;
    margin-left: -8px;
    margin-right: -4px;
  }

  &__arrow {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    padding: 10px 2px;
  }

  &__count {
    display: none;
    font-size: 0.6rem;
    font-weight: bold;
    color: rgb(100, 100, 100);
  }

  &__icon {
    cursor: pointer;
  }

  &__wrapper {
    display: flex;
    align-items: center;

    .menu__icon:not(:last-child) {
      margin-right: 15px;
    }
  }

  &__words {
    display: flex;
    width: 100%;
    justify-content: space-between;
    margin-right: 5px;
    align-items: center;
  }

  &__word {
    cursor: pointer;
    text-transform: uppercase;
    font-weight: 500;
    font-size: 1rem;
    height: 100%;
    display: flex;
    align-items: center;
    white-space: nowrap;
  }

  &__win {
    animation: tada 1.2s infinite both;
  }

  @keyframes tada {
    0% {
      transform: scaleX(1);
    }
    10%, 20% {
      transform: scale3d(.9, .9, .9) rotate(-3deg);
    }
    30%, 50%, 70%, 90% {
      transform: scale3d(1.1, 1.1, 1.1) rotate(3deg);
    }
    40%, 60%, 80% {
      transform:scale3d(1.1, 1.1, 1.1) rotate(-3deg);
    }
    to {
      transform: scaleX(1);
    }
  }
}
</style>
