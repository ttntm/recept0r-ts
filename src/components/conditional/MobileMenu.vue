<script setup lang="ts">
  import type { RouteRecordNormalized } from 'vue-router'
  import { showWindow, useLogout } from '@/utils'

  import ButtonX from '@/components/button/ButtonX.vue'
  import IconResolver from '@/components/icon/IconResolver.vue'

  const props = defineProps<{
    loggedIn: boolean,
    menuItems: RouteRecordNormalized[],
    show: boolean
  }>()

  const emit = defineEmits<{
    (e: 'action:logout'): void
  }>()
</script>

<template>
  <transition name="menu">
    <div v-if="show" class="w-full min-h-screen max-h-full absolute top-0 bg-white flex flex-col justify-start items-start px-6 pt-6 pb-4 z-10" v-scroll-lock>
      <div class="w-full flex items-center justify-between">
        <IconResolver icon="hat" class="w-12 h-12"/>
        <ButtonX class="rounded-full p-2" @click="showWindow(0)" />
      </div>
      <nav class="w-full flex flex-col overflow-y-auto">
        <router-link
          v-for="item in menuItems"
          :key="item.name"
          :to="{ name: item.name }"
          class="menu-item mx-auto my-8"
        >{{ item.name }}</router-link>
        <router-link v-if="loggedIn" :to="{ name: 'Profile'}" class="menu-item mx-auto my-8">Profile</router-link>
        <button v-if="!loggedIn" class="menu-item mx-auto my-8 click-outside-ignore" @click="showWindow(2)">Login</button>
        <button v-else class="menu-item mx-auto my-8" @click="useLogout">Logout</button>
      </nav>
    </div>
  </transition>
</template>