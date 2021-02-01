import Vue from 'vue'
export default {
  data () {
    return {
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

  methods: {
    fillBoard (empty) {
      this.board = []
      const boardPlaceholder = []
      const board = this.boardWithLetters
      this.setLetterSize(this.difficultyLevels, this.settings.difficulty)
      this.h = this.difficultyLevels[this.settings.difficulty - 1].height
      this.w = this.difficultyLevels[this.settings.difficulty - 1].width
      const w = this.w
      const h = this.h
      this.createEmptyBoard(boardPlaceholder, w, h, true)
      this.board = boardPlaceholder
      this.loaded = true
      if (!empty) {
        this.initiateWords(this.settings)
        const words = this.shuffleArray(this.words)
        this.createEmptyBoard(board, w, h)
        this.fillWithWords(board, w, h, words)
        this.fillEmpty(board, w, h)
        this.loadBoard(this.board, board, w, h)
      }
    },

    createEmptyBoard (board, w, h, placeholder) {
      for (let i = 0; i < h; i++) {
        board[i] = []
        for (let j = 0; j < w; j++) {
          board[i][j] = placeholder ? '?' : ''
        }
      }
    },

    loadBoard (board, boardWithLetters, w, h) {
      for (let i = 0; i < h; i++) {
        setTimeout(() => this.loadRow(board, boardWithLetters, i, w, h), i * 5)
      }
    },

    loadRow (board, boardWithLetters, i, w, h) {
      for (let j = 0; j < w; j++) {
        setTimeout(() => this.loadSquare(board, boardWithLetters, i, j, w, h), i * w * 5 + j * 5)
      }
    },

    loadSquare (board, boardWithLetters, i, j, w, h) {
      Vue.set(board[i], j, boardWithLetters[i][j])
      Vue.set(board, i, board[i])
      if (i === h - 1 && j === w - 1) {
        this.$refs.bottomMenu.restartTimer()
      }
    },

    initiateWords (settings) {
      this.words = require(`@/assets/words/${settings.category}.json`)
    },

    setLetterSize (d, dLvl) {
      const heightSize = (window.innerHeight - 60) / d[dLvl - 1].height
      const widthSize = (window.innerWidth - 20) / d[dLvl - 1].width
      const letterSize = heightSize < widthSize ? heightSize : widthSize
      const max = d[dLvl - 1].maxLetterSize
      const min = d[dLvl - 1].minLetterSize
      this.letterSize = letterSize > max ? max : (letterSize < min ? min : letterSize)
    },

    fillWithWords (board, w, h, words) {
      for (let i = 0, len = words.length; i < len; i++) {
        this.placeWordOnBoard(board, w, h, words[i])
      }
    },

    placeWordOnBoard (board, w, h, word) {
      const locations = this.findAllLocations(board, w, h, word)
      this.placeRandom(board, locations, word)
    },

    // finds all possible locations for given word on board
    findAllLocations (board, w, h, word) {
      const locations = []
      const wordLength = word.length
      for (let i = 0, len = this.directions.length; i < len; i++) {
        let x = 0
        let y = 0
        const direction = this.directions[i]
        while (y < h) {
          if (direction.orientationCheck(x, y, h, w, wordLength)) {
            const wordFitOverlap = this.checkWordFit(board, word, x, y, w, h, direction.nextLetterPos)
            if (wordFitOverlap !== -1) {
              locations.push({ x, y, direction, directionNumber: i, overlap: wordFitOverlap })
            }

            x++
            if (x >= w) {
              x = 0
              y++
            }
          } else {
            ({ x, y } = direction.nextWordPos(x, y, wordLength))
          }
        }
      }
      return locations
    },

    checkWordFit (board, word, x, y, w, h, nextLetterPos) {
      let overlap = 0
      for (let i = 0, len = word.length; i < len; i++) {
        const nextPos = nextLetterPos(x, y, i)
        if (nextPos.x > w - 1 || nextPos.y > h - 1) {
          return -1
        } else if (board[nextPos.y][nextPos.x] === word[i]) {
          overlap++
        } else if (board[nextPos.y][nextPos.x] !== '') {
          return -1
        }
      }
      return overlap
    },

    placeRandom (board, locations, word) {
      if (!locations.length) {
        return
      }
      // place random
      // const location = locations[Math.floor(Math.random() * locations.length)]

      // place on best overlap position
      this.boardWords.push(word)

      const max = Math.max.apply(Math, locations.map((o) => o.overlap))
      let location = {}
      if (max) {
        location = locations.find(p => p.overlap === max)
      } else {
        // if max overlap location overlap is 0 then get random location
        // to prevent taking last location every time
        location = locations[Math.floor(Math.random() * locations.length)]
      }

      for (let i = 0, len = word.length; i < len; i++) {
        const nextWordPos = location.direction.nextLetterPos(location.x, location.y, i)
        board[nextWordPos.y][nextWordPos.x] = word[i]
      }
    },

    fillEmpty (board, w, h) {
      const letters = 'aąbcćdeęfghijklłmnńoóprsśtuwyzźż'
      for (let i = 0; i < h; i++) {
        for (let j = 0; j < w; j++) {
          if (!board[i][j]) {
            board[i][j] = letters[Math.floor(Math.random() * letters.length)]
          }
        }
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
