<script setup lang="ts">
  import { computed, onMounted, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useStore } from '@/store'
  import type { DebugInfo } from '@/types'

  import Auth from '@/components/conditional/Auth.vue'
  import Footer from '@/components/Footer.vue'
  import Navbar from '@/components/Navbar.vue'
  import MobileMenu from '@/components/conditional/MobileMenu.vue'
  import ToastMessage from '@/components/conditional/ToastMessage.vue'

  const route = useRoute()
  const router = useRouter()
  const store = useStore()

  const debugInfo = computed<DebugInfo>(() => store.getters['app/debugInfo'])
  const loggedIn = computed<boolean>(() => store.getters['user/loggedIn'])
  const menuItems = computed(() => {
    const routes = router.getRoutes()
    return routes.filter(item => { 
      if (!item.meta.authRequired) {
        return item.meta.menuVisible
      } else {
        return loggedIn.value ? item.meta.menuVisible : false
      }
    })
  })
  const routeFull = computed<string>(() => route.fullPath)
  const windowOpen = computed<number>(() => store.getters['app/windowOpen'])

  watch(loggedIn, () => {
    if (!loggedIn.value && route.meta.authRequired) router.push({ name: 'All Recipes' })
  })

  onMounted(() => {
    const app = document.getElementById('app')
    if (app) {
      app.style.opacity = '1'
      app.style.transition = 'opacity 1.5s ease'
    }
  })
</script>

<template>
  <div id="app" class="flex h-full flex-col">
    <Navbar :loggedIn="loggedIn" :menuItems="menuItems" />
    <MobileMenu :loggedIn="loggedIn" :menuItems="menuItems" :show="windowOpen === 1" />
    <Auth :loggedIn="loggedIn" :show="windowOpen === 2" />
    <div class="container flex-grow flex-shrink-0 px-4 md:mt-6 lg:mt-12 mx-auto">
      <router-view :key="routeFull" />
    </div>
    <ToastMessage />
    <Footer :debug="debugInfo" :loggedIn="loggedIn" />
  </div>
</template>