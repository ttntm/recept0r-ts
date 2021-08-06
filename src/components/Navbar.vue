<script lang="ts">
  import { defineComponent } from 'vue'
  import { useStore } from '../store'

  import ButtonDefault from './button/ButtonDefault.vue'

  export default defineComponent({
    name: 'Navbar',
    components: {
      ButtonDefault
    },
    props: {
      loggedIn: Boolean,
      menuItems: Array
    },
    setup() {
      const store = useStore();

      const handleLogout = () => {
        // trigger logout
      }
      
      return {
        handleLogout,
        showAuth: () => store.dispatch('app/windowActive', 1)
      }
    }
  })
</script>

<template>
  <nav class="container flex flex-row justify-start lg:justify-center items-center pt-4 lg:pt-12 pb-8 px-6 lg:px-4 mx-auto z-10">
    <button class="block lg:hidden focus:outline-none focus:shadow-outline mr-8" type="button" aria-label="Open Menu">
      <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-menu-2 pointer-events-none" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <line x1="4" y1="6" x2="20" y2="6" />
        <line x1="4" y1="12" x2="20" y2="12" />
        <line x1="4" y1="18" x2="20" y2="18" />
      </svg>
    </button>
    <router-link :to="{ name: 'Home' }" class="focus:shadow-none">
      <img src="/img/logo.svg" class="hover:opacity-75 mb-3" alt="recept0r logo" width="160">
    </router-link>
    <div class="hidden lg:flex flex-row justify-center items-center flex-grow">
      <router-link
        v-for="item in menuItems"
        :key="item.name"
        :to="{ name: item.name }"
        class="block font-bold text-lg text-blue-500 rounded-lg hover:bg-gray-500 px-4 py-2 mx-4"
      >{{ item.name }}</router-link>
    </div>
    <ButtonDefault v-if="!loggedIn" class="hidden lg:block click-outside-ignore" @click="showAuth">Login</ButtonDefault>
    <ButtonDefault v-else class="hidden lg:block click-outside-ignore" @click="handleLogout">Logout</ButtonDefault>
  </nav>
</template>