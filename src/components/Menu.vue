<template>
  <div class="menu">
    <div class="menu__words">
      <ChevronLeftIcon :color="!wordIndex ? '#bebebe' : 'black'" class="menu__icon" @click="prevWord" />
      <div
        class="menu__word"
        :class="{ menu__win: !availableWords.length }"
        @click="availableWords.length ? crossWord() : ''"
      >
        {{ availableWords.length ? availableWords[wordIndex] : 'Wygrałeś!' }}
      </div>
      <ChevronRightIcon :color="reachedEnd ? '#bebebe' : 'black'" class="menu__icon" @click="nextWord" />
    </div>
    <div class="menu__wrapper">
      <Maximize2Icon size="20" color="#0043ff" class="menu__icon" v-if="!fullscreen" @click="toggleFullscreen" />
      <Minimize2Icon size="20" color="#a800ed" class="menu__icon" v-else @click="toggleFullscreen" />
      <SettingsIcon size="21" color="#ed6300" class="menu__icon" @click="$emit('show-settings')" />
    </div>
  </div>
</template>

<script>
import { Maximize2Icon, Minimize2Icon, SettingsIcon, ChevronLeftIcon, ChevronRightIcon } from 'vue-feather-icons'

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
    }
  },

  mounted () {
    document.onfullscreenchange = (f) => {
      this.fullscreen = document.fullscreen
    }
  },

  methods: {
    toggleFullscreen () {
      if (!document.fullscreen) {
        document.documentElement.requestFullscreen()
      } else {
        document.exitFullscreen()
      }
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
  border: 1px solid #ebe9e9;
  padding: 10px;
  border-radius: 10px 10px 0 0;
  background: white;
  border-left: none;
  border-right: none;

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
    margin-left: -5px;
    margin-right: 15px;
    align-items: center;
  }

  &__word {
    cursor: pointer;
    text-transform: uppercase;
    font-weight: 500;
    font-size: 1rem;
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
