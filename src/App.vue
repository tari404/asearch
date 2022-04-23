<template>
  <div>
    <div v-if="starting" class="starting-up" @click="start">
      <i class="ri-shut-down-line"></i>
    </div>

    <div class="desktop">
      <div class="app" @click="open('aSearch')">
        <img src="" />
        <span>aSearch</span>
      </div>
    </div>

    <div class="as-taskbar">
      <div class="start"></div>
      <div class="minimized">
        <span v-for="(item, i) in minimized" :key="i" @click="reopen(item)">
          {{ item }}
        </span>
      </div>
    </div>

    <!-- WINDOWS -->
    <keep-alive>
      <Window v-if="show" @close="close" @minimize="minimize" />
    </keep-alive>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Window from '@/components/Window.vue'

export default defineComponent({
  name: 'App',
  components: {
    Window,
  },
  data() {
    return {
      starting: true,
      show: false,
      minimized: [] as string[],
    }
  },
  methods: {
    start() {
      this.starting = false
    },
    open() {
      this.show = true
    },
    reopen(name: string) {
      this.minimized = this.minimized.filter((item) => item != name)
      this.show = true
    },
    close() {
      this.show = false
    },
    minimize() {
      this.show = false
      this.minimized.push('aSearch')
    },
  },
})
</script>

<style lang="stylus" scoped>

.starting-up
  position fixed
  top 0
  left 0
  right 0
  bottom 0
  background-color var(--black)
  z-index 100
  display flex
  font-display column
  justify-content center
  align-items center
  > i
    margin-top 16px
    color var(--white)
    font-size 64px
    cursor pointer

.desktop
  padding 24px
  display grid
  grid-template-rows repeat(auto-fill, 160px)
  gap 2px
  .app
    padding 3px
    border dashed 1px transparent
    width 84px
    height 84px
    display flex
    flex-direction column
    align-items center
    &:hover
      background-color #0002
      border dashed 1px #0003
    > img
      width 56px
      height 56px
      background-color #eee
    > span
      margin-top 4px
      font-size 16px
      line-height 16px
      color #fff
      text-shadow 0 0 2px #000

.as-taskbar
  position absolute
  left 0
  right 0
  bottom 0
  height 40px
  padding 4px
  background-color #bababa
  border-top 1px solid #dbdcdc
  display flex
  .start
    width 64px
    height 100%
    background-color #dbdcdc
  .minimized
    margin-left 18px
    display flex
    > span
      margin 0 4px
      width 160px
      padding 8px
      height 100%
      background-color #dbdcdc
      display flex
      align-items center
      cursor pointer
</style>
