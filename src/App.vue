<script lang="ts">
  import { computed, defineComponent } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import Navbar from './components/Navbar.vue'
  import Footer from './components/Footer.vue'

  export default defineComponent({
    name: 'App',
    components: {
      Navbar,
      Footer
    },
    setup() {
      const route = useRoute();
      const router = useRouter();

      const menuItems = computed(
        () => {
          const routes = router.getRoutes()
          return routes.filter(item => item.meta.menuVisible)
        }
      );

      return {
        menuItems,
        routeFull: computed(() => route.fullPath)
      }
    }
  })
</script>

<template>
  <div id="app" class="flex h-full flex-col">
    <Navbar :menuItems="menuItems" />
    <div class="container flex-grow flex-shrink-0 px-4 md:mt-6 lg:mt-12 mx-auto">
      <router-view :key="routeFull" />
    </div>
    <Footer />
  </div>
</template>