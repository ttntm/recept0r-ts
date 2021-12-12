<script setup lang="ts">
  import { onMounted, onUnmounted, ref } from 'vue'

  // based on: https://github.com/caiofsouza/vue-backtotop/blob/master/src/BackToTop.vue
  const visible = ref(false)
  const visibleOffset: number = 1024

  const events = {
    onBackToTop() {
      window.smoothScroll()
    },
    onScroll() {
      visible.value = window.pageYOffset > visibleOffset
    }
  }
  
  window.smoothScroll = () => {
    let currentScroll: number = document.documentElement.scrollTop || document.body.scrollTop
    if (currentScroll > 0) {
      window.requestAnimationFrame(window.smoothScroll as FrameRequestCallback)
      window.scrollTo(0, Math.floor(currentScroll - (currentScroll / 5)))
    }
  }
  
  onMounted(() => window.addEventListener('scroll', events.onScroll))
  
  onUnmounted(() => window.removeEventListener('scroll', events.onScroll))
</script>

<template>
  <transition name="btt-fade">
    <button
      v-show="visible"
      v-click-blur
      class="back-to-top mx-2 my-4 lg:m-6"
      title="Back to Top"
      @click="events.onBackToTop"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none icon icon-tabler icon-tabler-chevron-up" width="25" height="25" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <polyline points="6 15 12 9 18 15" />
      </svg>
    </button>
  </transition>
</template>

<style lang="postcss" scoped>
  .btt-fade-enter-active,
  .btt-fade-leave-active {
    transition: opacity 0.5s;
  }

  .btt-fade-enter-from,
  .btt-fade-leave-to {
    opacity: 0;
  }

  .back-to-top {
    @apply fixed z-10 bottom-0 right-0 rounded-full bg-cool-gray-500 text-blue-500 shadow-lg p-2;
  }

  .back-to-top:focus {
    @apply border-none outline-none shadow-none;
  }

  .back-to-top:hover {
    @apply bg-gray-500;
  }
</style>