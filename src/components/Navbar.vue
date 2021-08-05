<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    name: 'Navbar',
    props: {
      menuItems: Array
    },
    setup() {
      return {}
    }
  })
</script>

<template>
  <nav class="container flex flex-row justify-start lg:justify-center items-center pt-4 lg:pt-12 pb-8 px-6 lg:px-4 mx-auto z-10">
    <button class="block lg:hidden mr-8" type="button" aria-label="Open Menu">
      [-]
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
    <button>Login</button>
  </nav>
</template>