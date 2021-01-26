import Vue from 'vue'
export default {
  methods: {
    fillBoard (empty) {
      this.board = []
      const board = this.boardWithLetters
      this.setLetterSize(this.difficultyLevels, this.settings.difficulty)
      this.h = this.difficultyLevels[this.settings.difficulty - 1].size
      this.w = this.difficultyLevels[this.settings.difficulty - 1].size
      const w = this.w
      const h = this.h
      this.createEmptyBoard(this.board, w, h, true)
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
      const heightSize = (window.innerHeight - 60) / d[dLvl - 1].size
      const widthSize = (window.innerWidth - 20) / d[dLvl - 1].size
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

      let location = locations.reduce((p, c) => (p.overlap > c.overlap) ? p : c)
      // if max overlap location overlap is 0 then get random location
      // to prevent taking last location every time
      if (location.overlap === 0) {
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
    }
  }
}
