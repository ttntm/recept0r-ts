<script setup lang="ts">
  import { computed } from 'vue'
  import type { RouteRecordNormalized } from 'vue-router'
  import { useStore } from '@/store'
  import { showWindow } from '@/utils'

  import ButtonDefault from '@/components/button/ButtonDefault.vue'
  import ButtonMenu from '@/components/button/ButtonMenu.vue'
  import ButtonUser from '@/components/button/ButtonUser.vue'
  import UserMenu from '@/components/conditional/UserMenu.vue'

  const props = defineProps<{
    loggedIn: boolean,
    menuItems: RouteRecordNormalized[]
  }>()

  const store = useStore()

  const windowOpen = computed<number>(() => store.getters['app/windowOpen'])
</script>

<template>
  <nav class="container flex flex-row justify-start lg:justify-center items-center pt-4 lg:pt-12 pb-8 px-6 lg:px-4 mx-auto">
    <ButtonMenu class="mr-8" @click="showWindow(1)" />
    <router-link :to="{ name: 'All Recipes' }" class="focus:shadow-none" v-click-blur>
      <img src="/img/logo.svg" class="logo mb-3" alt="recept0r logo" width="160">
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
      <ButtonUser v-else :window="windowOpen" class="hidden lg:block click-outside-ignore" @click="showWindow(5)" />
      <UserMenu :show="windowOpen === 5" />
    </div>
  </nav>
</template>