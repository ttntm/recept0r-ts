<script setup lang="ts">
  import { computed } from 'vue'
  import { useStore } from '../store'

  const store = useStore()

  const allRecipes = computed(() => store.getters['data/allRecipes'])
  const isLoading = computed(() => allRecipes.value.length > 0)

  const getAllRecipes = () => store.dispatch('data/readAll')

  getAllRecipes()
</script>

<template>
  <div v-if="isLoading" class="text-center my-12">
    <img src="/img/loading.svg" alt="Loading..." class="mx-auto">
    <p class="text-cool-gray-500 mt-12">Loading recipes...</p>
  </div>
  <div v-else class="w-full xl:w-2/3 flex flex-row justify-center mb-12 mx-auto">
    <ul>
      <li v-for="recipe in allRecipes" :key="recipe.data.id">
        <router-link :to="{ path: `/recipe/${recipe.data.id}/${recipe.ref['@ref'].id}` }">
          {{ recipe.data.title }}
        </router-link>
      </li>
    </ul>
  </div>
</template>