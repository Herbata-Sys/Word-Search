<template>
  <div class="settings">
    <div>
      <div class="settings__header">
        <h2>Ustawienia</h2>
        <XIcon class="settings__cancel" @click="close" />
      </div>
      <div class="settings__wrapper">
        <h3>Poziom trudności</h3>
        <div class="settings__difficulty">
          <div
            v-for="(diff, index) in difficultyLevels"
            :key="index" class="settings__option"
            :class="{'settings__active': settings.difficulty === index + 1}"
            @click="settings.difficulty = index + 1"
          >
            <component :is="diff.iconName" class="settings__icon" size="16" :color="diff.iconColor" />
            {{ diff.name }}
          </div>
        </div>
      </div>
      <div class="settings__wrapper">
        <h3>Kategoria</h3>
        <select class="settings__category" v-model="settings.category">
          <option
            v-for="cat in categories"
            :key="cat.name"
            :value="cat.value"
          >
            {{ cat.name }}
          </option>
        </select>
      </div>
      <div class="settings__wrapper">
        <h3>Tło</h3>
        <div class="settings__backgroundSelect">
          <ChevronLeftIcon class="settings__backgroundIcon" :color="!settings.background ? '#bebebe' : 'black'" @click="settings.background ? settings.background-- : ''" />
          <div class="settings__backgroundText">
            <div v-if="settings.background !== undefined">
              {{ backgrounds[settings.background].name }}
            </div>
          </div>
          <ChevronRightIcon class="settings__backgroundIcon" :color="reachedEndBackground ? '#bebebe' : 'black'" @click="!reachedEndBackground ? settings.background++ : ''" />
        </div>
      </div>
    </div>
    <div>
      <div class="settings__save" @click="$emit('save', settings)">
        Zapisz
        <SaveIcon class="settings__saveIcon" size="18" />
      </div>
    </div>
  </div>
</template>

<script>
const SaveIcon = () => import('vue-feather-icons/icons/SaveIcon')
const ChevronRightIcon = () => import('vue-feather-icons/icons/ChevronRightIcon')
const ChevronLeftIcon = () => import('vue-feather-icons/icons/ChevronLeftIcon')
const XIcon = () => import('vue-feather-icons/icons/XIcon')
const TriangleIcon = () => import('vue-feather-icons/icons/TriangleIcon')
const SquareIcon = () => import('vue-feather-icons/icons/SquareIcon')
const HexagonIcon = () => import('vue-feather-icons/icons/HexagonIcon')

export default {
  name: 'Settings',

  components: {
    TriangleIcon,
    SquareIcon,
    HexagonIcon,
    XIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    SaveIcon
  },

  props: {
    settingsInitial: Object,
    categories: Array,
    difficultyLevels: Array,
    backgrounds: Array
  },

  data () {
    return {
      settings: {}
    }
  },

  mounted () {
    this.settings = Object.assign({}, this.settingsInitial)
  },

  watch: {
    settingsInitial (val) {
      this.settings = Object.assign({}, val)
    }
  },

  computed: {
    reachedEndBackground () {
      return this.settings.background >= (this.backgrounds.length - 1)
    }
  },

  methods: {
    close () {
      this.$emit('close-settings')
      this.settings = Object.assign({}, this.settingsInitial)
    }
  }
}
</script>

<style scoped lang="scss">
.settings {
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.938);
  width: 100%;
  height: 100%;
  z-index: 2;
  text-align: center;
  padding: 10px 10px 20px 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  h2 {
    font-weight: 600;
    font-size: 1.2rem;
    margin-top: 0;
    margin-bottom: 0;
    padding-bottom: 10px;
  }

  &__header {
    border-bottom: 1px solid rgb(228, 228, 228);
    position: relative;
  }

  &__cancel {
    position: absolute;
    top: 1px;
    right: 0;
    cursor: pointer;
  }

  h3 {
    font-weight: 500;
    font-size: 1rem;
    margin-bottom: 10px;
    margin-top: 10px;
  }

  &__category {
    display: block;
    width: fit-content;
    margin: 0 auto;
  }

  &__difficulty {
    display: flex;
    justify-content: space-between;
  }

  &__option {
    font-size: 0.8rem;
    margin-bottom: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    padding: 5px 10px;
    width: fit-content;
    margin: 0 auto 5px auto;
    border-radius: 5px;
    transition: .5s all;
  }

  &__icon {
    margin-right: 10px;
  }

  &__save {
    width: fit-content;
    margin: 5px auto 0 auto;
    padding: 4px 15px;
    border-radius: 5px;
    background: #076aff;
    color: white;
    min-width: 150px;
    font-size: 1.2rem;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__saveIcon {
    margin-left: 10px;
  }

  &__active {
    background: #7d07ff2e;
  }

  &__backgroundSelect {
    display: flex;
    justify-content: center;
  }

  &__backgroundIcon {
    cursor: pointer;
  }

  &__backgroundText {
    margin: 0 10px;
    font-size: 0.9rem;
  }

  select {
    border: 1px solid rgb(228, 228, 228);
    background: white;
    padding: 5px 0;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    cursor: pointer;

    &:focus {
      outline: none;
    }
  }
}
</style>
