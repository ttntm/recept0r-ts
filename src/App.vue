<script lang="ts">
  import { computed, defineComponent } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useStore } from './store'

  import Auth from './components/conditional/Auth.vue'
  import Footer from './components/Footer.vue'
  import Navbar from './components/Navbar.vue'
  import ToastMessage from './components/conditional/ToastMessage.vue'

  export default defineComponent({
    name: 'App',
    components: {
      Auth,
      Footer,
      Navbar,
      ToastMessage
    },
    setup() {
      const route = useRoute()
      const router = useRouter()
      const store = useStore()

      const authShown = computed(() => store.getters['app/windowOpen'])
      const loggedIn = computed(() => store.getters['user/loggedIn'])

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

      return {
        authShown,
        loggedIn,
        menuItems,
        routeFull: computed(() => route.fullPath)
      }
    }
  })
</script>

<template>
  <div id="app" class="flex h-full flex-col">
    <Navbar :loggedIn="loggedIn" :menuItems="menuItems" />
    <transition name="modal">
      <Auth v-if="authShown === 1" :loggedIn="loggedIn" />
    </transition>
    <div class="container flex-grow flex-shrink-0 px-4 md:mt-6 lg:mt-12 mx-auto">
      <router-view :key="routeFull" />
    </div>
    <ToastMessage />
    <Footer />
  </div>
</template>