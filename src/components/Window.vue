<template>
  <div
    class="as-window"
    @click="focus"
    :style="{
      top: `${Y}px`,
      left: `${X}px`,
    }"
  >
    <div class="title-bar" @mousedown="ondrag">
      <i @click.stop="close"></i>
      <i @click.stop="minimize"></i>
    </div>
    <section>
      <p v-for="(line, i) in logs" :key="i" v-html="line" />
      <p>
        <span class="as-input-line" :class="{ 'as-input-focus': focused }">
          <span>{{ location }} > </span>
          <span v-html="stylizedInput"></span>
          <input ref="vinput" type="text" @input="oninput" />
        </span>
      </p>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { welcome, errorCmd, result } from '@/assets/lib/dialogue'

interface TypedChat {
  chat: string
  class: string
}

export default defineComponent({
  name: 'Window',
  data() {
    return {
      X: 120,
      Y: 120,

      location: 'aSearch.io',
      logs: [...welcome()],

      focused: false,
      cursorStart: 0,
      cursorEnd: 0,

      input: '',
    }
  },
  computed: {
    stylizedInput() {
      // TODO: use RegExp

      const list: TypedChat[] = []
      let input = this.input + ' '

      if (this.cursorStart < 0) {
        input = input.trimEnd()
      }

      let isFirstWord = true
      for (let i = 0; i < input.length; i++) {
        const chat = input[i]
        if (chat === ' ') {
          isFirstWord = false
        }
        const curL = Math.min(this.cursorStart, this.cursorEnd)
        const curR = Math.max(this.cursorStart, this.cursorEnd)
        const selected = curL <= i && i < curR

        const classnames: string[] = []
        if (selected) {
          classnames.push('S')
        } else if (isFirstWord) {
          classnames.push('y')
        }
        if (this.cursorStart === i) {
          classnames.push('C')
        }

        list.push({
          chat,
          class: classnames.join(' '),
        })
      }
      let output = ''
      const tail = list.reduce((prev: TypedChat | null, item) => {
        if (!prev) {
          return item
        } else if (item.class === prev.class) {
          return {
            chat: prev.chat + item.chat,
            class: prev.class,
          }
        } else {
          output += `<span class="${prev.class}">${prev.chat}</span>`
          return item
        }
      }, null)
      if (tail) {
        output += `<span class="${tail.class}">${tail.chat}</span>`
      }
      return output
    },
  },
  mounted() {
    this.$el.addEventListener('keydown', this.onkey)
    const vinput = this.$refs.vinput as HTMLInputElement
    vinput.addEventListener('blur', this.blur)
  },
  beforeUnmount() {
    this.$el.removeEventListener('keydown', this.onkey)
    const vinput = this.$refs.vinput as HTMLInputElement
    vinput.removeEventListener('blur', this.blur)
  },
  methods: {
    close() {
      this.$emit('close')
    },
    minimize() {
      this.$emit('minimize')
    },
    blur() {
      this.focused = false
    },
    focus() {
      this.focused = true
      const vinput = this.$refs.vinput as HTMLInputElement
      vinput.focus()
    },
    ondrag() {
      let x = this.X
      let y = this.Y
      const { width: w } = (this.$el as HTMLElement).getBoundingClientRect()
      const iw = innerWidth
      const ih = innerHeight
      const onmove = (e: MouseEvent) => {
        x += e.movementX
        y += e.movementY
        this.X = Math.max(80 - w, Math.min(x, iw - 80))
        this.Y = Math.max(0, Math.min(y, ih - 80))
      }
      const onstop = () => {
        console.log(1)
        document.body.removeEventListener('mousemove', onmove)
        document.body.removeEventListener('mouseup', onstop)
      }
      document.body.addEventListener('mousemove', onmove)
      document.body.addEventListener('mouseup', onstop)
    },
    run() {
      const input = this.input
      this.cursorStart = -1
      this.cursorEnd = -1
      const cmd = `${this.location} > ${this.stylizedInput}`
      this.logs.push(cmd)

      const args = input.split(' ')
      switch (args[0] || '') {
        case '':
          break
        case 'reset':
          this.logs = []
          break
        case 'welcome':
          this.logs.push(...welcome(args))
          break
        case 'search':
          this.logs.push(...result(args))
          break
        default:
          this.logs.push(...errorCmd(args))
      }

      this.$nextTick(() => {
        const input = this.$refs.vinput as HTMLInputElement
        input.scrollIntoView()
      })

      this.input = ''
      this.cursorStart = 0
      this.cursorEnd = -0
    },
    delectCurrentSelectedRange() {
      const input = this.input
      const curL = Math.min(this.cursorStart, this.cursorEnd)
      const curR = Math.max(this.cursorStart, this.cursorEnd)

      this.input = input.slice(0, curL) + input.slice(curR)
      this.cursorStart = curL
      this.cursorEnd = curL
    },
    onkey(e: KeyboardEvent) {
      e.preventDefault()

      const vinput = this.$refs.vinput as HTMLInputElement
      vinput.scrollIntoView()

      const key = e.key

      let input = this.input
      let curS = this.cursorStart
      let curE = this.cursorEnd
      const rangeIsSelected = curS !== curE

      if (key === 'Backspace') {
        if (rangeIsSelected) {
          this.delectCurrentSelectedRange()
        } else if (curS > 0) {
          this.input = input.slice(0, curS - 1) + input.slice(curS)
          this.cursorStart--
          this.cursorEnd--
        }
      } else if (key.length === 1) {
        if (e.ctrlKey) {
          // TODO
          return
        }
        if (rangeIsSelected) {
          this.delectCurrentSelectedRange()
          input = this.input
          curS = this.cursorStart
          curE = this.cursorEnd
        }
        this.input = input.slice(0, curS) + key + input.slice(curS)
        this.cursorStart++
        this.cursorEnd++
      } else if (key === 'ArrowLeft') {
        if (this.cursorStart > 0) this.cursorStart--
        if (!e.shiftKey) {
          // select
          this.cursorEnd = this.cursorStart
        }
      } else if (key === 'ArrowRight') {
        if (this.cursorStart < input.length) this.cursorStart++
        if (!e.shiftKey) {
          this.cursorEnd = this.cursorStart
        }
      } else if (key === 'Enter') {
        this.run()
      }
    },
    oninput(e: InputEvent) {
      console.log(e)
      const input = e.target as HTMLInputElement
      input.value = ''
      // const chat = e.data
      // const input = this.input
      // const x = this.cursorStart

      // if (e.inputType) {
      //   this.input = input.slice(0, x) + chat + input.slice(x)
      //   this.cursorStart = x + 1
      //   this.cursorEnd = x + 1
      // }
    },
  },
})
</script>

<style lang="stylus" scoped>
.as-window
  position absolute
  width 1080px
  height 860px
  display flex
  flex-direction column
  border-radius 16px
  background-color rgba(#000, 70%)
  box-shadow 0 20px 60px #0006
  filter drop-shadow(0 10px 20px #0005)
  overflow hidden
  z-index 0

  > section
    flex 1 1 100%
    color var(--white)
    white-space pre-wrap
    cursor text
    font-size 16px
    line-height 1.1em
    padding 1em 0
    overflow-y scroll
    &::-webkit-scrollbar
      display none

  >>> p
    padding 0 1em

.title-bar
  padding 2px 10px 0
  flex 0 0 40px
  height 40px
  width 100%
  display flex
  align-items center
  > i
    width 14px
    height 14px
    border-radius 50%
    margin 5px
    background-color #545454
    cursor pointer
    transition background .1s
  > i:nth-child(1):hover
    background-color #ef4141
  > i:nth-child(2):hover
    background-color #cbb911

.as-window >>>
  .C
    outline 1px solid #ddd
  .S
    color var(--black)
    background-color var(--white)
    &::selection
      background-color var(--white)

.as-input-focus >>>
  .C
    color var(--black)
    background-color #ddd
    &::selection
      background-color #ddd

.as-input-line
  position relative
  z-index 0
  input
    position absolute
    top 0
    right 0
    padding 0
    width 0
    font inherit
    border none
    background transparent
    opacity 0
    z-index -1

  .cursor-start
    position absolute
    display inline-block
    height 1.1em

.as-cursor
  position absolute
  top 0
  left 0
  display inline-block
  height 1.1em
  width 1ch
  border 1px solid var(--white)
  &[active]
    background-color var(--white)

@media screen and (max-width 800px)
  .as-window
    font-size 14px

@media screen and (max-width 400px)
  .as-window
    font-size 12px
</style>
