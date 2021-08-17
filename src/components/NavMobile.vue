<script setup lang="ts">
  import { computed } from 'vue'
  import { useStore } from '../store';
  import { RouteRecordNormalized } from 'vue-router'

  import ButtonX from './button/ButtonX.vue';

  const props = defineProps<{
    loggedIn: boolean,
    menuItems: RouteRecordNormalized[]
  }>()

  const store = useStore()

  const closeMenu = () => store.dispatch('app/setWindowOpen', 0)
</script>

<template>
  <div class="w-full min-h-screen absolute top-0 bg-white flex flex-col justify-start items-start px-6 py-4 z-10">
    <div class="w-full flex items-center justify-end">
      <ButtonX class="rounded-full p-2 mt-2 mx-2" @click="closeMenu" />
    </div>
    <nav class="w-full flex flex-col justify-center">
      <router-link
        v-for="item in menuItems"
        :key="item.name"
        :to="{ name: item.name }"
        class="block font-bold text-lg text-blue-500 rounded-lg hover:bg-gray-500 px-4 py-2 mx-auto my-8"
      >{{ item.name }}</router-link>
    </nav>
  </div>
</template>