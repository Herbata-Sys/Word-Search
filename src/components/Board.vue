<template>
  <div class="board" :style="boardStyles">
    <div class="board__container">
      <div class="board__wrapper">
        <Menu
          :win="win"
          :words="boardWords"
          :crossedWords="crossedWords"
          @hint-clicked="crossWord"
          @show-settings="openSettings"
        />
        <div class="board__letters" v-show="loaded">
          <div class="board__row" v-for="(row, y) in board" :key="y">
            <div class="board__letter" :data-x="x" :data-y="y" v-for="(letter, x) in row" :key="letter + x" :style="letterStyle">
              <span>{{ letter }}</span>
            </div>
          </div>
          <div class="board__highlights">
            <div v-for="(highlight, index) in highlights" :key="index" class="board__highlight" :style="highlightStyle(highlight)" />
          </div>
        </div>
        <BottomMenu
          ref="bottomMenu"
          :settings="settings"
          :categories="categories"
          :difficultyLevels="difficultyLevels"
          :crossedHints="crossedHints"
        />

        <Settings
          v-show="showSettings"
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
    <br />
  </div>
</template>

<script>
import Menu from './Menu'
import BottomMenu from './BottomMenu'
import Settings from './Settings'
import NewGame from './NewGame'
import game from '../mixins/game'

export default {
  name: 'Board',

  mixins: [
    game
  ],

  components: {
    Menu,
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
        background: 3
      },
      difficultyLevels: [
        { iconName: 'TriangleIcon', iconColor: '#00ce06', name: 'Łatwy', height: 8, width: 6, minLetterSize: 48, maxLetterSize: 50 },
        { iconName: 'SquareIcon', iconColor: '#d17d00', name: 'Średni', height: 13, width: 10, minLetterSize: 30, maxLetterSize: 35 },
        { iconName: 'HexagonIcon', iconColor: '#b80000', name: 'Trudny', height: 15, width: 15, minLetterSize: 20, maxLetterSize: 35 }
      ],
      categories: [
        { name: 'Zwierzęta', value: 'animals' },
        { name: 'Programowanie', value: 'programming' },
        { name: 'Jedzenie', value: 'food' }
      ],
      backgrounds: [
        { name: 'Brak', color: 'white', border: '#a4a4a47a', board: 'transparent' },
        { name: 'Fale', border: '#A8E5FF', url: '/images/just-waves.webp', board: '#ffffff29' },
        { name: 'Liście', border: '#d3e6ab', url: '/images/leaves.webp', board: '#ffffff29' },
        { name: 'Słońce', border: '#FFD1D1', url: '/images/let-there-be-sun.webp', board: '#ffffff29' },
        { name: 'Zmarszczki', border: '#dfdfdf', url: '/images/ripples.webp', board: '#ffffff29' },
        { name: 'Kropki', border: '#FFD1D1', url: '/images/watercolor.webp', board: '#ffffff29' },
        { name: 'Pszenica', border: '#828282', url: '/images/wheat.webp', board: '#ffffff94' },
        { name: 'Czarny', color: 'black', border: '#515151', board: '#ffffff63' }
      ],
      h: 10,
      w: 10,
      click: null,
      clickLength: 0,
      clickDirection: -1,
      crossedHints: 0,
      directions: [
        {
          name: 'horizontal',
          // Highlight rotation in degrees
          rotate: 0,
          // Gives next letter position based on x, y - start position of the word and i - letters already fitted
          nextLetterPos: (x, y, i) => ({ x: x + i, y: y }),
          // Check if word on x, y coords with l length can fit in the board with given h height and w width
          orientationCheck: (x, y, h, w, l) => w >= (x + l),
          // Gives next position if x, y position was invalid from orientationCheck
          nextWordPos: (x, y, l) => ({ x: 0, y: y + 1 }),
          // Check direction by angle alpha return true if direction is horizontal
          directionCheck: (alpha) => alpha < 22.5 && alpha > -22.5,
          // Gives maximum width in grid units which highlight can have to reach the board edge starting from point x, y
          maxWidth: (x, y, w, h) => w - (x + 1)
        },
        {
          name: 'horizontalBack',
          rotate: 180,
          nextLetterPos: (x, y, i) => ({ x: x - i, y: y }),
          orientationCheck: (x, y, h, w, l) => l <= (x + 1),
          nextWordPos: (x, y, l) => ({ x: l - 1, y: y }),
          directionCheck: (alpha) => (alpha > 157.5 && alpha <= 180) || (alpha < -157.5 && alpha >= -180),
          maxWidth: (x, y, w, h) => x
        },
        {
          name: 'vertical',
          rotate: 90,
          nextLetterPos: (x, y, i) => ({ x: x, y: y + i }),
          orientationCheck: (x, y, h, w, l) => h >= y + l,
          nextWordPos: (x, y, l) => ({ x: 0, y: y + 1000 }),
          directionCheck: (alpha) => alpha < -67.5 && alpha > -112.5,
          maxWidth: (x, y, w, h) => h - (y + 1)
        },
        {
          name: 'verticalUp',
          rotate: -90,
          nextLetterPos: (x, y, i) => ({ x: x, y: y - i }),
          orientationCheck: (x, y, h, w, l) => l <= (y + 1),
          nextWordPos: (x, y, l) => ({ x: x, y: l - 1 }),
          directionCheck: (alpha) => alpha > 67.5 && alpha < 112.5,
          maxWidth: (x, y, w, h) => y
        },
        {
          name: 'diagonal',
          rotate: 45,
          nextLetterPos: (x, y, i) => ({ x: x + i, y: y + i }),
          orientationCheck: (x, y, h, w, l) => (x + l <= w) && (y + l <= h),
          nextWordPos: (x, y, l) => ({ x: x, y: y + 1 }),
          directionCheck: (alpha) => alpha >= -67.5 && alpha <= -22.5,
          maxWidth: (x, y, w, h) => y > x ? h - 1 - y : w - 1 - x
        },
        {
          name: 'diagonalBack',
          rotate: 135,
          nextLetterPos: (x, y, i) => ({ x: x - i, y: y + i }),
          orientationCheck: (x, y, h, w, l) => (x + 1 >= l) && (y + l <= h),
          nextWordPos: (x, y, l) => ({ x: l - 1, y: (x >= l - 1) ? y + 1 : y }),
          directionCheck: (alpha) => alpha >= -157.5 && alpha <= -112.5,
          maxWidth: (x, y, w, h) => x > 1 && y >= w - x ? h - 1 - y : x
        },
        {
          name: 'diagonalUp',
          rotate: -45,
          nextLetterPos: (x, y, i) => ({ x: x + i, y: y - i }),
          orientationCheck: (x, y, h, w, l) => (x + l <= w) && (y + 1 >= l),
          nextWordPos: (x, y, l) => ({ x: 0, y: (y < l - 1) ? l - 1 : y + 1 }),
          directionCheck: (alpha) => alpha >= 22.5 && alpha <= 67.5,
          maxWidth: (x, y, w, h) => x > 0 && y >= w - x ? w - 1 - x : y
        },
        {
          name: 'diagonalUpBack',
          rotate: -135,
          nextLetterPos: (x, y, i) => ({ x: x - i, y: y - i }),
          orientationCheck: (x, y, h, w, l) => (x + 1 >= l) && (y + 1 >= l),
          nextWordPos: (x, y, l) => ({ x: l - 1, y: (x >= l - 1) ? y + 1 : y }),
          directionCheck: (alpha) => alpha <= 157.5 && alpha >= 112.5,
          maxWidth: (x, y, w, h) => y > x ? x : y
        }
      ]
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
    this.started = true
  },

  watch: {
    crossedWords () {
      this.checkWin()
    }
  },

  computed: {
    letterStyle () {
      return {
        width: this.letterSize + 'px',
        height: this.letterSize + 'px',
        fontSize: this.letterSize * 0.044 + 'rem',
        fontWeight: 600
        // fontWeight: this.letterSize > 40 ? 600 : 500
      }
    },

    boardStyles () {
      const background = this.backgrounds[this.settings.background]
      return {
        '--background': background.url ? `url("${background.url}")` : 'white',
        '--borderColor': background.border,
        '--boardBackground': background.board
      }
    }
  },

  methods: {
    loadBackground () {
      const bgSet = this.backgrounds[this.settings.background]
      const bg = bgSet.color || `url(${bgSet.url})`
      document.body.style.background = bg
    },

    restartGame () {
      this.highlights = []
      this.boardWords = []
      this.crossedWords = []
      this.win = false
      this.loaded = false
      this.fillBoard()
      this.started = true
      this.firstGame = false
      this.scrollCenterBoard()
    },

    scrollCenterBoard () {
      document.querySelector('.board__letters').scrollIntoView({
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

    highlightStyle (highlight) {
      const transformX = 0.34 * this.letterSize
      const transformY = 0.35 * this.letterSize
      return {
        top: highlight.top,
        left: highlight.left,
        width: highlight.width,
        height: highlight.height,
        transform: highlight.transform,
        background: highlight.background,
        transformOrigin: `${transformX}px ${transformY}px`
      }
    },

    crossWord (word) {
      const location = this.findAllLocations(this.board, this.w, this.h, word)[0]
      if (!location) {
        return
      }
      this.boardClick(null, {
        x: location.x,
        y: location.y
      })
      this.clickDirection = location.directionNumber
      this.clickLength = word.length - 1
      this.highlights[this.highlights.length - 1].width = 2 * this.letterSize / 3 + this.clickLength * (location.direction.name.search('diag') + 1 ? this.letterSize * Math.sqrt(2) : this.letterSize) + 'px'
      this.highlights[this.highlights.length - 1].transform = 'rotate(' + location.direction.rotate + 'deg)'
      this.boardClickRelease({
        target: {
          className: 'board__letter'
        }
      })
      this.crossedHints++
    },

    addEvents () {
      document.addEventListener('mousemove', this.boardMouseMove)
      document.querySelector('.board__letters').addEventListener('touchmove', this.preventRefresh, { passive: false })
      document.addEventListener('touchmove', this.boardMouseMove, { passive: true })
      document.querySelector('.board').addEventListener('pointerdown', this.boardClick)
      document.addEventListener('mouseup', this.boardClickRelease)
      document.addEventListener('touchend', this.boardClickRelease, { passive: true })
      document.addEventListener('touchcancel', this.boardClickRelease, { passive: true })
      window.addEventListener('resize', this.onResize)
    },

    onResize () {
      if (!this.highlights.length) {
        this.setLetterSize(this.difficultyLevels, this.settings.difficulty)
      }
    },

    preventRefresh (e) {
      e.preventDefault()
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
          background: this.generateColor(),
          placed: false
        })
      }
    },

    boardClickRelease (e) {
      if (e.target.className === 'board__letter' && this.click && (this.clickDirection + 1)) {
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
    },

    shuffleArray (array) {
      let m = array.length
      let t
      let i

      while (m) {
        i = Math.floor(Math.random() * m--)
        t = array[m]
        array[m] = array[i]
        array[i] = t
      }

      return array
    }
  }
}
</script>

<style scoped lang="scss">
.board {
  margin: 50px auto;
  user-select: none;
  display: flex;
  justify-content: center;
  flex-direction: column;

  &__container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
  }

  &__wrapper {
    box-shadow: 0px 0px 6px 4px #00000014;
    border-radius: 10px;
    position: relative;
  }

  &__row {
    display: flex;

    &:first-of-type .board__letter:after {
      height: calc(100% - 1px);
      border-bottom: 1px solid var(--borderColor);
      // border-top: 1px solid var(--borderColor);
    }

    &:not(:first-of-type) .board__letter:after {
      height: calc(100% - 1px);
      border-bottom: 1px solid var(--borderColor);
    }

    &:nth-last-of-type(2) {

      .board__letter:after {
        height: 100%;
        border-bottom: none;
      }

      .board__letter {

        &:first-child:after {
          border-bottom-left-radius: 10px;
        }

        &:last-child:after {
          border-bottom-right-radius: 10px;
        }
      }
    }
  }

  &__highlight {
    border-radius: 10px;
    position: absolute;
    pointer-events: none;
    border: 2px solid rgba(0, 0, 0, 0.09);
  }

  &__letters {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin: 20px 0;
    flex-direction: column;
    position: relative;
    overflow: hidden;
    margin: auto;

    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: -2;
      background: var(--boardBackground);
    }
  }

  &__letter {
    font-family: monospace;
    font-size: 1.25rem;
    display: flex;
    justify-content: center;
    align-items: center;
    text-transform: uppercase;
    position: relative;

    span {
      pointer-events: none;
      z-index: 1;
    }

    &:after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: calc(100% - 1px);
      height: calc(100% - 1px);
      pointer-events: none;
      border-right: 1px solid var(--borderColor);
    }

    &:last-child:after {
      border-right: none;
    }

    &:not(:first-child):after {
      border-left: none;
      width: calc(100%);
    }
  }
}
</style>
