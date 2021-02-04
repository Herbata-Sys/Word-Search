<template>
  <div class="game">
    <div class="game__wrapper">
      <Menu
        :win="win"
        :words="boardWords"
        :crossedWords="crossedWords"
        @hint-clicked="crossWord"
        @show-settings="openSettings"
      />

      <Board
        :loaded="loaded"
        :board="board"
        :highlights="highlights"
        :letterSize="letterSize"
        :borderColor="borderColor"
      />

      <BottomMenu
        ref="bottomMenu"
        :started="started"
        :words="boardWords"
        :crossedWords="crossedWords"
        :settings="settings"
        :categories="categories"
        :difficultyLevels="difficultyLevels"
        :crossedHints="crossedHints"
      />

      <Settings
        v-if="showSettings"
        :categories="categories"
        :settingsInitial="settings"
        :difficultyLevels="difficultyLevels"
        :backgrounds="backgrounds"
        @close-settings="closeSettings"
        @save="saveSettings"
      />

      <NewGame
        v-if="win || firstGame"
        :win="win"
        :time="$refs.bottomMenu ? $refs.bottomMenu.time : 0"
        :breakRecord="false"
        @restart="restartGame"
      />
    </div>
  </div>
</template>

<script>
import game from '../mixins/game'
import Menu from './Menu'
import Board from './Board'
import BottomMenu from './BottomMenu'
import NewGame from './NewGame'
const Settings = () => import('./Settings')

export default {
  name: 'Game',

  mixins: [
    game
  ],

  components: {
    Menu,
    Board,
    BottomMenu,
    Settings,
    NewGame
  },

  data () {
    return {
      firstGame: true,
      started: false,
      win: false,
      showSettings: false,
      letterSize: 30,
      loaded: false,
      board: [],
      boardWithLetters: [],
      words: [],
      boardWords: [],
      crossedWords: [],
      highlights: [],
      settings: {
        difficulty: 1,
        category: 'animals',
        background: 6
      },
      difficultyLevels: require('@/assets/settings/difficultyLevels.json'),
      categories: require('@/assets/settings/categories.json'),
      backgrounds: require('@/assets/settings/backgrounds.json'),
      h: 10,
      w: 10,
      click: null,
      clickLength: 0,
      clickDirection: -1,
      crossedHints: 0
    }
  },

  created () {
    if (localStorage.settings) {
      this.settings = JSON.parse(localStorage.settings)
    }
    this.initiateWords(this.settings)
    this.loadBackground()
  },

  mounted () {
    this.fillBoard(true)
    this.addEvents()
  },

  watch: {
    crossedWords () {
      this.checkWin()
    }
  },

  computed: {
    borderColor () {
      return this.backgrounds[this.settings.background].border
    }
  },

  methods: {
    loadBackground () {
      const bgSet = this.backgrounds[this.settings.background]
      const bg = bgSet.color || `url(${bgSet.url}) no-repeat`
      document.body.style.background = bg
    },

    scrollCenterBoard () {
      document.querySelector('.board').scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
    },

    checkWin () {
      if (this.crossedWords.length === this.boardWords.length && this.started) {
        this.started = false
        this.$refs.bottomMenu.stopTimer()
        this.win = true
      }
    },

    openSettings () {
      this.$refs.bottomMenu.stopTimer()
      this.showSettings = true
    },

    closeSettings () {
      if (!this.win) {
        this.$refs.bottomMenu.startTimer()
      }
      this.showSettings = false
    },

    saveSettings (s) {
      this.settings = Object.assign({}, s)
      localStorage.settings = JSON.stringify(this.settings)
      this.loadBackground()
      this.closeSettings()
      this.restartGame()
    },

    addEvents () {
      document.addEventListener('mousemove', this.boardMouseMove)
      document.addEventListener('touchmove', this.boardMouseMove, { passive: true })
      document.querySelector('.board').addEventListener('pointerdown', this.boardClick)
      document.querySelector('.board').addEventListener('touchmove', this.preventRefresh, { passive: false })
      document.addEventListener('mouseup', this.boardClickRelease)
      document.addEventListener('touchend', this.boardClickRelease, { passive: true })
      document.addEventListener('touchcancel', this.boardClickRelease, { passive: true })
      window.addEventListener('resize', this.onResize)
    },

    preventRefresh (e) {
      e.preventDefault()
    },

    onResize () {
      if (!this.highlights.length) {
        this.setLetterSize(this.difficultyLevels, this.settings.difficulty)
      }
    },

    boardMouseMove (e) {
      if (this.click) {
        e = e.touches ? e.touches[0] : e
        const click = this.click
        let diag = false
        let rotate = 0
        let maxWidth = 0
        const pointX = this.click.clickX < e.clientX ? e.clientX - this.click.clickX : -1 * (this.click.clickX - e.clientX)
        const pointY = this.click.clickY > e.clientY ? (this.click.clickY - e.clientY) : -1 * (e.clientY - this.click.clickY)
        const alpha = Math.atan2(pointY, pointX) * 180 / Math.PI

        for (const index in this.directions) {
          const direction = this.directions[index]
          if (direction.directionCheck(alpha)) {
            const notDiagonals = ['horizontal', 'vertical', 'horizontalBack', 'verticalUp']
            rotate = direction.rotate
            maxWidth = direction.maxWidth(click.x, click.y, this.w, this.h)
            if (notDiagonals.includes(direction.name)) {
              this.clickLength = Math.trunc((Math.sqrt((e.clientX - click.clickX) * (e.clientX - click.clickX) + (e.clientY - click.clickY) * (e.clientY - click.clickY)) - this.letterSize / 2) / this.letterSize + 1)
            } else {
              this.clickLength = Math.trunc((Math.sqrt((e.clientX - click.clickX) * (e.clientX - click.clickX) + (e.clientY - click.clickY) * (e.clientY - click.clickY)) - this.letterSize * Math.sqrt(2) / 2) / (this.letterSize * Math.sqrt(2)) + 1)
              diag = true
            }

            this.clickLength = this.clickLength > maxWidth ? maxWidth : this.clickLength
            this.clickDirection = index
            break
          }
        }

        if (this.clickLength < 1) {
          rotate = 0
        }

        if (this.highlights.length) {
          this.highlights[this.highlights.length - 1].width = 0.7 * this.letterSize + (this.clickLength < maxWidth ? this.clickLength : maxWidth) * (diag ? this.letterSize * Math.sqrt(2) : this.letterSize) + 'px'
          this.highlights[this.highlights.length - 1].transform = 'rotate(' + rotate + 'deg)'
        }
      }
    },

    boardClick (e, coords) {
      if (this.click) {
        this.removeTempHighlight()
        this.click = null
      }
      this.clickLength = 0
      this.clickDirection = -1
      if ((e && e.target.className === 'board__letter') || coords) {
        let rect = null
        if (e) {
          rect = e.target.getBoundingClientRect()
        }
        this.click = {
          x: parseInt(e ? e.target.dataset.x : coords.x),
          y: parseInt(e ? e.target.dataset.y : coords.y),
          clickX: e ? rect.x + e.target.offsetWidth / 2 : 0,
          clickY: e ? rect.y + e.target.offsetHeight / 2 : 0
        }

        this.highlights.push({
          top: this.click.y * this.letterSize + 0.158 * this.letterSize + 'px',
          left: this.click.x * this.letterSize + 0.153 * this.letterSize + 'px',
          width: this.letterSize * 0.7 + 'px',
          height: this.letterSize * 0.7 + 'px',
          transform: 'rotate(0)',
          backgroundColor: this.generateColor(),
          placed: false
        })
      }
    },

    boardClickRelease () {
      if (this.click && (this.clickDirection + 1)) {
        let word = ''

        // Find word that player crossed out
        for (let i = 0; i < this.clickLength + 1; i++) {
          const nextPos = this.directions[this.clickDirection].nextLetterPos(this.click.x, this.click.y, i)
          word += this.board[nextPos.y][nextPos.x]
        }

        // Check if player hit correct word
        const checkedWord = this.checkWord(word)
        if (checkedWord) {
          this.crossedWords.push(checkedWord)
          this.highlights[this.highlights.length - 1].placed = true
        } else {
          this.removeTempHighlight()
        }

        this.click = null
      } else {
        this.removeTempHighlight()
        this.click = null
      }
    },

    checkWord (word) {
      // Return word if word is not crossed out and is included in words on board
      if (this.crossedWords.includes(word) || this.crossedWords.includes(this.reverseString(word))) {
        return false
      } else {
        const reversedWord = this.reverseString(word)
        if (this.boardWords.includes(word)) {
          return word
        } else if (this.boardWords.includes(reversedWord)) {
          return reversedWord
        }
      }
    },

    removeTempHighlight () {
      const index = this.highlights.slice().reverse().findIndex(v => v.placed === false)
      if (index + 1) {
        this.highlights.splice(this.highlights.length - index - 1, 1)
      }
    },

    generateColor () {
      const h = Math.floor(Math.random() * (360 + 1))
      const s = 90
      const l = Math.floor(Math.random() * (55 - 40)) + 40
      return `hsla(${h}, ${s}%, ${l}%, .45)`
    },

    reverseString (s) {
      return (s === '') ? '' : this.reverseString(s.substr(1)) + s.charAt(0)
    }
  }
}
</script>

<style scoped lang="scss">
.game {
  user-select: none;

  &__wrapper {
    box-shadow: 0px 0px 6px 4px #00000014;
    border-radius: 10px;
    position: relative;
    overflow: hidden;
    max-width: 100%;
  }
}
</style>
