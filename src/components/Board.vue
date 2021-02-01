<template>
  <div class="board" v-show="loaded" :style="boardStyles">
    <div class="board__row" v-for="(row, y) in board" :key="y">
      <div class="board__letter" :data-x="x" :data-y="y" v-for="(letter, x) in row" :key="letter + x" :style="letterStyle">
        <span>{{ letter }}</span>
      </div>
    </div>
    <div class="board__highlights">
      <div v-for="(highlight, index) in highlights" :key="index" class="board__highlight" :style="highlightStyle(highlight)" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Board',

  props: {
    loaded: Boolean,
    board: Array,
    highlights: Array,
    letterSize: Number,
    borderColor: String
  },

  computed: {
    letterStyle () {
      return {
        width: this.letterSize + 'px',
        height: this.letterSize + 'px',
        fontSize: this.letterSize * 0.044 + 'rem',
        fontWeight: 600
      }
    },

    boardStyles () {
      return {
        '--borderColor': this.borderColor
      }
    }
  },

  methods: {
    highlightStyle (highlight) {
      const transformX = 0.34 * this.letterSize
      const transformY = 0.35 * this.letterSize
      const styles = Object.assign({}, highlight)
      styles.transformOrigin = `${transformX}px ${transformY}px`
      return styles
    }
  }
}
</script>

<style scoped lang="scss">
.board {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: -2;
    background-color: rgba(255, 255, 255, .34);
    backdrop-filter: blur(5px);
  }

  &__row {
    display: flex;

    &:first-of-type .board__letter:after {
      height: calc(100% - 1px);
      border-bottom: 1px solid var(--borderColor);
    }

    &:not(:first-of-type) .board__letter:after {
      height: calc(100% - 1px);
      border-bottom: 1px solid var(--borderColor);
    }

    &:nth-last-of-type(2) {

      .board__letter {
        &:after {
          height: 100%;
          border-bottom: none;
        }

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
    will-change: transform;
  }

  &__letter {
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
      width: 100%;
    }
  }
}
</style>
