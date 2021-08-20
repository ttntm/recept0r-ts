<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { useStore } from '../../store'

  import AuthLogin from './AuthLogin.vue'
  import AuthSignup from './AuthSignup.vue'
  import ButtonX from '../button/ButtonX.vue'

  const props = defineProps<{
    loggedIn: boolean
  }>()

  const store = useStore()
  const mode = ref('login')

  const closeAuth = () => store.dispatch('app/setWindowOpen', 0)

  watch(() => props.loggedIn, (currentVal) => {
    if (currentVal) closeAuth()
  })

  const toggleMode = (newMode: string) => mode.value = newMode
</script>

<template>
  <div class="user-modal" v-click-outside="closeAuth" v-esc="closeAuth" v-scroll-lock>
    <div class="flex items-center justify-end">
      <ButtonX class="rounded-full p-2 mt-2 mx-2" @click="closeAuth" />
    </div>
    <div class="form px-12 pb-8">
      <div class="w-3/4 flex flex-row justify-around mt-4 mb-6 mx-auto">
        <h3 class="">
          <button class="text-cool-gray-500 font-bold text-lg pb-1 border-b border-transparent focus:outline-none shadow-none"
            :class="{ 'border-blue-500 text-blue-500': mode === 'signup' }"
            @click="toggleMode('signup')"
            v-click-blur
          >
            Sign Up
          </button>
        </h3>
        <h3 class="">
          <button class="text-cool-gray-500 font-bold text-lg pb-1 border-b border-transparent focus:outline-none shadow-none"
            :class="{ 'border-blue-500 text-blue-500': mode === 'login' }"
            @click="toggleMode('login')"
            v-click-blur
          >
            Login
          </button>
        </h3>
      </div>
      <AuthLogin v-if="mode === 'login'" />
      <AuthSignup v-if="mode === 'signup'" />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
  .user-modal {
    @apply fixed left-0 right-0 opacity-100 rounded-lg shadow-lg bg-gray-500 text-left mx-auto;
    width: 450px;
    top: 100px;
    z-index: 99;
  }

  @media(max-width:767px) {
    .user-modal {
      max-height: calc(90vh - 20px);
      max-width: 90%;
      top: 20px;
      overflow-y: auto;
    }
  }
</style>