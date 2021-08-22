<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { useStore } from '../store'

  import HomeRecipeCard from '../components/home/HomeRecipeCard.vue'

  const route = useRoute()
  const store = useStore()

  const allRecipes = computed(() => store.getters['data/allRecipes'])
  const isLoading = computed(() => allRecipes.value.length > 0 ? false : true)
  const searchTerm = ref('')

  const displayedRecipes = computed(() => {
    if (searchTerm.value) {
      // search logic
    } else {
      return allRecipes.value.slice().reverse()
    }
  })

  const getAllRecipes = () => {
    const forceUpdate = route.query.force || null
    const lastUpdated = computed(() => store.getters['data/lastUpdated'])
    const now = new Date
    
    const diff = Math.round((Number(now) - Number(lastUpdated.value)) / (1000 * 60)) // time difference between now (view init) and last read operation

    if (allRecipes.value.length === 0 || !lastUpdated.value || diff > 60 || forceUpdate) {
      store.dispatch('data/readAll')
    }
  }

  getAllRecipes()
</script>

<template>
  <div v-if="isLoading" class="text-center my-12">
    <img src="/img/loading.svg" alt="Loading..." class="mx-auto">
    <p class="text-cool-gray-500 mt-12">Loading recipes...</p>
  </div>
  <section v-else class="">
    <transition-group name="list" tag="div" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <HomeRecipeCard v-for="recipe in displayedRecipes" :recipe="recipe" :key="recipe.data.id" />
    </transition-group>
  </section>
</template>

<style lang="postcss" scoped>
  .list-enter-active, 
  .list-leave-active {
    transition: all .5s;
  }

  .list-enter-from, 
  .list-leave-to {
    opacity: 0;
  }

  .list-move {
    transition: transform .5s;
  }
</style>