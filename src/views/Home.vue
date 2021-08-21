<script setup lang="ts">
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { useStore } from '../store'

  const route = useRoute()
  const store = useStore()

  const allRecipes = computed(() => store.getters['data/allRecipes'])
  const isLoading = computed(() => allRecipes.value.length > 0 ? false : true)
  const lastUpdated = computed(() => store.getters['data/lastUpdated'])

  const getAllRecipes = () => {
    const now = new Date
    const diff = Math.round((Number(now) - Number(lastUpdated.value)) / (1000 * 60)) // time difference between now (view init) and last read operation
    const forceUpdate = route.query.force || null
    if (allRecipes.value.length === 0 || diff > 60 || forceUpdate) {
      console.log(`updating all recipes, diff = ${diff} minutes`)
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
  <div v-else class="w-full xl:w-2/3 flex flex-row justify-center mb-12 mx-auto">
    <ul>
      <li v-for="recipe in allRecipes.slice().reverse()" :key="recipe.data.id">
        <router-link :to="{ name: 'Recipe', params: { id: recipe.data.id, refId: recipe.ref['@ref'].id } }">
          {{ recipe.data.title }}
        </router-link>
      </li>
    </ul>
  </div>
</template>