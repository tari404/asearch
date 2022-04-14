<template>
  <div>
    <Window />
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
})
</script>
