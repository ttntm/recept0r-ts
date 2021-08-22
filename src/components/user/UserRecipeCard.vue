<script setup lang="ts">
  import { Recipe } from '../../types'

  const props = defineProps<{
    recipe: Recipe
  }>()
</script>

<template>
  <div :class="{ 'bg-gray-600 bg-opacity-25' : recipe.data.draft }" class="list-card flex flex-col md:flex-row mb-8" style="min-height: 200px;">
    <div class="w-full sm:w-1/3 rounded-t-lg md:rounded-t-none md:rounded-l-lg">
      <router-link v-if="recipe.data.image" :to="{ name: 'Recipe', params: { id: recipe.data.id, refId: recipe.ref['@ref'].id } }" class="img-link focus:shadow-none" title="View recipe">
        <img :src="recipe.data.image" crossorigin="anonymous" :alt="recipe.data.title" :class="{ 'opacity-75' : recipe.data.draft }" class="w-full rounded-t-lg md:rounded-t-none md:rounded-l-lg img-cover" height="200" loading="lazy">
      </router-link>
      <div v-else class="w-full h-full flex items-center justify-center bg-blue-600 bg-opacity-75 rounded-t-lg md:rounded-t-none md:rounded-l-lg">
        <span class="self-center text-white">No Image</span>
      </div>
    </div>
    <div class="w-full md:w-auto flex flex-col flex-grow justify-center p-4 pt-8 md:py-0 md:pl-12">
      <h4 class="text-2xl">{{ recipe.data.title }}</h4>
      <p class="md:m-0">{{ recipe.data.description }}</p>
    </div>
    <div class="w-full md:w-auto flex-shrink-0 flex flex-row md:flex-col md:justify-center items-center pb-8 px-4 md:p-0 md:pr-8">
      <router-link :to="{ name: 'Edit Recipe', params: { refId: recipe.ref['@ref'].id } }" class="btn-outline px-6 py-2">
        <span v-if="recipe.data.draft">Edit Draft</span>
        <span v-else>Edit Recipe</span>
      </router-link>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
  .list-card {
    @apply flex-no-wrap bg-gray-500 rounded-lg border border-transparent;
  }

  .list-card:hover {
    @apply border-cool-gray-500 shadow;
  }

  .img-cover {
    @apply object-cover;
    height: 200px;
    max-height: 200px;
  }
</style>