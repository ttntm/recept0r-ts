<script setup lang="ts">
  import { computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useStore } from './store'

  import { showWindow } from './utils'

  import Auth from './components/conditional/Auth.vue'
  import Footer from './components/Footer.vue'
  import Navbar from './components/Navbar.vue'
  import NavMobile from './components/NavMobile.vue'
  import ToastMessage from './components/conditional/ToastMessage.vue'

  const route = useRoute()
  const router = useRouter()
  const store = useStore()

  const loggedIn = computed(() => store.getters['user/loggedIn'])
  const routeFull = computed(() => route.fullPath)
  const windowOpen = computed(() => store.getters['app/windowOpen'])

  const handleLogout = () => { 
    store.dispatch('user/attemptLogout')
    showWindow(0)
    if (route.meta.authRequired) router.push({ name: 'Home' })
  }

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
</script>

<template>
  <div id="app" class="flex h-full flex-col">
    <Navbar :loggedIn="loggedIn" :menuItems="menuItems" @action:logout="handleLogout"/>
    <transition name="menu">
      <NavMobile v-if="windowOpen === 1" :loggedIn="loggedIn" :menuItems="menuItems" @action:logout="handleLogout"/>
    </transition>
    <transition name="modal">
      <Auth v-if="windowOpen === 2" :loggedIn="loggedIn" />
    </transition>
    <div class="container flex-grow flex-shrink-0 px-4 md:mt-6 lg:mt-12 mx-auto">
      <router-view :key="routeFull" />
    </div>
    <ToastMessage />
    <Footer />
  </div>
</template>