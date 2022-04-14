<template>
  <div class="as-window" @click="focus">
    <p v-for="(line, i) in logs" :key="i" v-html="line" />
    <p>
      <span class="as-input-line" :class="{ 'as-input-focus': focused }">
        <span>{{ location }} > </span>
        <span v-html="stylizedInput"></span>
        <input ref="vinput" type="text" @input="oninput" />
      </span>
    </p>
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
    document.body.addEventListener('keydown', this.onkey)
    window.addEventListener('blur', this.blur)
  },
  beforeUnmount() {
    document.body.removeEventListener('keydown', this.onkey)
    window.removeEventListener('blur', this.blur)
  },
  methods: {
    blur() {
      this.focused = false
    },
    focus() {
      this.focused = true
      const vinput = this.$refs.vinput as HTMLInputElement
      vinput.focus()
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
  position fixed
  top 0
  left 0
  bottom 0
  right 0
  padding .8em 0
  background-color var(--black)
  color var(--white)
  white-space pre-wrap
  font-size 18px
  line-height 1.1em
  cursor text
  z-index 0

  overflow-y scroll
  &::-webkit-scrollbar
    display none

  >>> p
    padding 0 .8em

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

@media screen and (max-width 1600px)
  .as-window
    font-size 16px

@media screen and (max-width 800px)
  .as-window
    font-size 14px

@media screen and (max-width 400px)
  .as-window
    font-size 12px
</style>
