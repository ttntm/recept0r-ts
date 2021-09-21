<script setup lang="ts">
  import type { RouteRecordNormalized } from 'vue-router'

  import { showWindow, useLogout } from '@/utils'

  import ButtonMenu from '@/components/button/ButtonMenu.vue'
  import ButtonX from '@/components/button/ButtonX.vue'

  const props = defineProps<{
    loggedIn: boolean,
    menuItems: RouteRecordNormalized[]
  }>()

  const emit = defineEmits<{
    (e: 'action:logout'): void
  }>()
</script>

<template>
  <div class="w-full min-h-screen max-h-full absolute top-0 bg-white flex flex-col justify-start items-start px-6 py-4 z-10" v-scroll-lock>
    <div class="w-full flex items-center justify-between mt-2">
      <ButtonMenu class="rounded-full opacity-75 hover:opacity-100 p-2 mx-2" mode="close" label="Close menu" @click="showWindow(0)" />
      <ButtonX class="rounded-full p-2 mx-2" @click="showWindow(0)" />
    </div>
    <nav class="w-full flex flex-col justify-center overflow-y-auto">
      <router-link
        v-for="item in menuItems"
        :key="item.name"
        :to="{ name: item.name }"
        class="menu-item mx-auto my-8"
      >{{ item.name }}</router-link>
      <router-link :to="{ name: 'Profile'}" class="menu-item mx-auto my-8">Profile</router-link>
      <button v-if="!loggedIn" class="menu-item mx-auto my-8 click-outside-ignore" @click="showWindow(2)">Login</button>
      <button v-else class="menu-item mx-auto my-8" @click="useLogout">Logout</button>
    </nav>
  </div>
</template>