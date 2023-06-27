<script setup lang="ts">
  import { showWindow, useLogout } from '@/utils'

  import ButtonX from '@/components/button/ButtonX.vue'

  const props = defineProps<{
    show: boolean
  }>()

  const onCloseMenu = () => showWindow(0)
</script>

<template>
  <transition name="modal">
    <div v-if="show" class="user-button-modal" v-click-outside="onCloseMenu" v-esc="onCloseMenu">
      <div class="flex items-center justify-end leading-none">
        <ButtonX size="20" class="rounded-full p-1 mt-2 mx-2" @click="onCloseMenu" />
      </div>
      <div class="text-center mb-4">
        <router-link :to="{ name: 'Profile'}" class="menu-item text-blue-600 text-sm rounded-none mb-2 mx-auto">Profile</router-link>
        <button class="menu-item w-full text-blue-600 text-sm rounded-none mx-auto" @click="useLogout">Logout</button>
      </div>
    </div>
  </transition>
</template>

<style lang="postcss" scoped>
  .user-button-modal {
    @apply absolute bg-white border border-gray-500 rounded-lg shadow-lg z-10;
    width: 250px;
    top: 7rem;
  }
</style>