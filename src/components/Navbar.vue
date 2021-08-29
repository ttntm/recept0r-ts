<script setup lang="ts">
  import type { RouteRecordNormalized } from 'vue-router'

  import { showWindow } from '../utils'

  import ButtonDefault from './button/ButtonDefault.vue'
  import ButtonMenu from './button/ButtonMenu.vue'

  const props = defineProps<{
    loggedIn: boolean,
    menuItems: RouteRecordNormalized[]
  }>()

  const emit = defineEmits<{
    (e: 'action:logout'): void
  }>()
</script>

<template>
  <nav class="container flex flex-row justify-start lg:justify-center items-center pt-4 lg:pt-12 pb-8 px-6 lg:px-4 mx-auto">
    <ButtonMenu class="mr-8" @click="showWindow(1)" />
    <router-link :to="{ name: 'All Recipes' }" class="focus:shadow-none" v-click-blur>
      <img src="/img/logo.svg" class="logo pointer-events-none mb-3" alt="recept0r logo" width="160">
    </router-link>
    <div class="hidden lg:flex flex-row justify-center items-center flex-grow">
      <router-link
        v-for="item in menuItems"
        :key="item.name"
        :to="{ name: item.name }"
        class="menu-item mx-4"
        v-click-blur
      >{{ item.name }}</router-link>
    </div>
    <div class="flex flex-row items-center justify-end" style="width: 160px;">
      <ButtonDefault v-if="!loggedIn" class="hidden lg:block click-outside-ignore" @click="showWindow(2)">Login</ButtonDefault>
      <ButtonDefault v-else class="hidden lg:block" @click="$emit('action:logout')">Logout</ButtonDefault>
    </div>
  </nav>
</template>