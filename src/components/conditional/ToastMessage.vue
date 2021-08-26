<script setup lang="ts">
  import { computed } from 'vue'
  import { useStore } from '../../store'

  import ButtonX from '../button/ButtonX.vue'

  import happy from '../icon/happy.vue'
  import sad from '../icon/sad.vue'

  const store = useStore();
  
  const icon = computed(() => toastMessage.value.type === 'error' ? sad : happy)
  const toastMessage = computed(() => store.getters['app/toastMessage'])
  
  const closeToastMessage = () => store.dispatch('app/sendToastMessage', null)
</script>

<template>
  <transition name="toast-fade">
    <section v-if="toastMessage" id="toast-message" class="fixed bottom-0 right-0 max-w-md m-8">
      <div class="bg-gray-500 text-blue-500 rounded-lg shadow-md px-8 py-6 pr-12" style="min-width: 240px">
        <ButtonX size="20" class="absolute top-0 right-0 rounded-full p-3" @click.prevent="closeToastMessage" />
        <div class="flex items-center">
          <component :is="icon" width="24" height="24" class="smiley w-6 h-6 block mr-4" />
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