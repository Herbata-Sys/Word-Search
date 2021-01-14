<template>
  <div class="newGame">
    <h2>Wygrałeś!</h2>
    <div class="newGame__time">
      {{ formatTime(time) }}
    </div>
    <div class="newGame__breakRecord" v-if="breakRecord">
      <AwardIcon class="newGame__icon" size="20" />
      Pobiłeś swój rekord
    </div>
    <div class="newGame__button" @click="$emit('restart')">
      Nowa gra
    </div>
  </div>
</template>

<script>
import { AwardIcon } from 'vue-feather-icons'
import time from '../mixins/time'

export default {
  name: 'NewGame',

  mixins: [
    time
  ],

  props: {
    breakRecord: Boolean,
    time: Number
  },

  components: {
    AwardIcon
  }
}
</script>

<style scoped lang="scss">
.newGame {
  position: absolute;
  top: 43px;
  background: rgba(255, 255, 255, 0.938);
  width: 100%;
  height: calc(100% - 72px);
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  h2 {
    font-weight: 600;
    font-size: 1.2rem;
    margin-top: 0;
    margin-bottom: 0;
    padding-bottom: 10px;
  }

  &__button {
    width: fit-content;
    margin: 5px auto 0 auto;
    padding: 4px 15px;
    border-radius: 5px;
    background: #076aff;
    color: white;
    cursor: pointer;
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
</style>
