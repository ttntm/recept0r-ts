<script setup lang="ts">
  import { computed } from 'vue'
  import { useStore } from '../../store'

  const store = useStore();
  
  const toastMessage = computed(() => store.getters['app/toastMessage'])
  
  const closeToastMessage = () => store.dispatch('app/sendToastMessage', null)
</script>

<template>
  <transition name="toast-fade">
    <section v-if="toastMessage" id="toast-message" class="fixed bottom-0 right-0 max-w-md m-8">
      <div class="bg-gray-500 text-blue-500 rounded-lg shadow-md p-6 pr-10" style="min-width: 240px">
        <button
          class="opacity-75 cursor-pointer absolute top-0 right-0 p-3 hover:opacity-100 focus:outline-none"
          @click.prevent="closeToastMessage"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-x" width="18" height="18" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <div class="flex items-center">
          <img v-if="toastMessage.type === 'error'" src="/img/sad.svg" class="smiley block w-6 h-6 mr-4">
          <img v-if="toastMessage.type === 'success'" src="/img/happy.svg" class="smiley block w-6 h-6 mr-4">
          <img v-if="toastMessage.type === 'info'" src="/img/happy.svg" class="smiley block w-6 h-6 mr-4">
          <span class="block font-bold text-sm overflow-hidden" style="text-overflow: ellipsis;">
            {{ toastMessage.text }}
          </span>
        </div>
      </div>
    </section>
  </transition>
</template>

<style lang="css" scoped>
  .smiley {
    animation: roll 1.25s linear infinite;
  }

  @keyframes roll {
    0% {
      transform: rotate(0deg);
    }
    25% {
      transform: rotate(-20deg);
    }
    50% {
      transform: rotate(10deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }
</style>