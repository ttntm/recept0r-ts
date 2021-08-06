<script lang="ts">
  import { defineComponent, ref, watch } from 'vue'
  import { useStore } from '../../store'

  import AuthLogin from './AuthLogin.vue'
  import AuthSignup from './AuthSignup.vue'

  export default defineComponent({
    name: 'Auth',
    components: {
      AuthLogin,
      AuthSignup
    },
    props: {
      loggedIn: Boolean
    },
    setup(props) {
      const store = useStore()
      const mode = ref('login')

      const closeAuth = () => store.dispatch('app/windowActive', 0)

      watch(() => props.loggedIn, (currentVal) => {
        if (currentVal) closeAuth()
      })

      return {
        closeAuth,
        mode,
        toggleMode: (newMode: string) => mode.value = newMode
      }
    },
  })
</script>

<template>
  <div class="user-modal" v-click-outside="closeAuth" v-esc="closeAuth" v-scroll-lock>
    <div class="flex items-center justify-end">
      <button class="text-3xl text-cool-gray-500 hover:text-blue-500 leading-none p-2 mt-2 mx-4" @click="closeAuth">&times;</button>
    </div>
    <div class="form px-12 pb-8">
      <div class="w-3/4 flex flex-row justify-around mt-4 mb-6 mx-auto">
        <h3 class="">
          <a href="#"
            class="text-cool-gray-500 text-lg pb-1 border-b border-transparent"
            :class="{ 'border-blue-500 text-blue-500 font-bold': mode === 'signup' }"
            @click="toggleMode('signup')"
            v-click-blur
          >
            Sign Up
          </a>
        </h3>
        <h3 class="">
          <a href="#"
            class="text-cool-gray-500 text-lg pb-1 border-b border-transparent"
            :class="{ 'border-blue-500 text-blue-500 font-bold': mode === 'login' }"
            @click="toggleMode('login')"
            v-click-blur
          >
            Login
          </a>
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

  @media(max-width:767px){
    .user-modal {
      max-width: 90%;
      top: 20px;
    }
  }
</style>