<template>
  <div class="starting-up">
    <div ref="logo" class="logo"></div>
    <i class="ri-shut-down-line" @click="$emit('start')"></i>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { dummyText } from '@/assets/lib/test'

const shuffle = (a: string[]) => {
  for (let i = a.length; i; i--) {
    let j = Math.floor(Math.random() * i)
    ;[a[i - 1], a[j]] = [a[j], a[i - 1]]
  }
  return a
}

const render = (div: HTMLElement): number[] => {
  const fontSize = [20, 12, 12, 14, 12, 10, 12, 12, 14, 20, 10, 12]

  const outWidth = div.getBoundingClientRect().width
  const textLength = 100
  const dummy = dummyText.replace('/\n/g', '')

  const animList: number[] = new Array(fontSize.length * 2)

  for (let i = 0; i < fontSize.length; i++) {
    const a1 = i * 2
    const a2 = i * 2 + 1

    const id = Math.floor(Math.random() * (dummy.length - textLength))
    const text = dummy.substring(id, id + textLength)

    const scrolltextBox = document.createElement('div')
    scrolltextBox.className = 'scrolltext-box'

    const scrolltextText1 = document.createElement('div')
    scrolltextText1.className = 'scrolltext-text'
    scrolltextText1.style.fontSize = `${fontSize[i]}px`
    scrolltextText1.style.width = `${outWidth}px`
    scrolltextText1.style.height = `${fontSize[i]}px`
    scrolltextText1.innerHTML = text

    const scrolltextText2 = document.createElement('div')
    scrolltextText2.className = 'scrolltext-text'
    scrolltextText2.style.width = `${outWidth}px`
    scrolltextText2.style.height = `${fontSize[i]}px`
    scrolltextText2.style.fontSize = `${fontSize[i]}px`
    scrolltextText2.innerHTML = text

    scrolltextBox.appendChild(scrolltextText1)
    scrolltextBox.appendChild(scrolltextText2)

    div.appendChild(scrolltextBox)

    // text moving
    let translate = 0
    const middle = outWidth / 2
    const offset = 2 * Math.pow(-1, i)

    let lastMoveTime = Date.now()
    animList[a1] = requestAnimationFrame(function animate() {
      const now = Date.now()
      if (now - lastMoveTime > 100) {
        lastMoveTime += 100

        if (Math.abs(translate) >= middle) {
          translate = -middle * Math.sign(offset)
        }
        translate += offset

        scrolltextBox.style.transform = `translate3d(${-translate}px,0,0)`
      }
      animList[a1] = requestAnimationFrame(animate)
    })

    // text transition
    const interval = 3000 + Math.random() * 40 * 1000 // text transition interval
    const intervalTyping = 20 // text typing interval

    let lastTransTime = Date.now() // last text transition time
    let lastTypingTime = Date.now() // last new text typing time
    let transText = text // transited to this new text
    let strPos = -1 // current typing position
    animList[a2] = requestAnimationFrame(function animate() {
      const now = Date.now()
      if (now - lastTransTime > interval) {
        lastTransTime += interval
        const index = Math.floor(Math.random() * (dummy.length - textLength))
        transText = dummy.substring(index, index + textLength)
        strPos = 0
      }
      if (now - lastTypingTime > intervalTyping) {
        lastTypingTime += intervalTyping
        if (strPos !== -1) {
          // strPos == -1 means currently not typing
          strPos++
          if (strPos > transText.length) {
            // strPos > transText.length means typing is finished
            strPos = -1
          } else {
            const str =
              transText.substring(0, strPos) +
              shuffle(
                Array.from(transText.substring(strPos, transText.length))
              ).join('')
            scrolltextText1.innerHTML = str
            scrolltextText2.innerHTML = str
          }
        }
      }
      animList[a2] = requestAnimationFrame(animate)
    })
  }

  return animList
}

export default defineComponent({
  name: 'StartingUp',
  data() {
    return {
      animList: [] as number[],
    }
  },
  mounted() {
    this.animList = render(this.$refs.logo as HTMLElement)
  },
  beforeUnmount() {
    for (const a of this.animList) {
      cancelAnimationFrame(a)
    }
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
  display flex
  flex-direction column
  justify-content center
  align-items center
  text-align center
  z-index 100
  > i
    flex 0 0 48px
    height 48px
    margin-top 32px
    color var(--white)
    font-size 48px
    cursor pointer

.starting-up  >>>
  .scrolltext-box
    display flex
    flex-direction row
    transform translate3d(0, 0, 0)
  .scrolltext-text
    white-space nowrap
    color var(--white)
    overflow hidden
    font-family source-code-pro, Menlo, Monaco, Consolas, 'Courier New'
  .logo
    flex 0 0 137px
    width 704px
    height 137px
    display flex
    flex-direction column
    justify-content center
    align-items center
    overflow hidden
    background-color var(--black)

    mask-image url(textlogo.png)
    mask-repeat no-repeat
    mask-size 100%
</style>
