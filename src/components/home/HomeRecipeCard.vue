<script setup lang="ts">
  import type { Recipe } from '../../types'

  const props = defineProps<{
    recipe: Recipe
  }>()
</script>

<template>
  <div class="recipe-card rounded-lg">
    <router-link :to="{ name: 'Recipe', params: { id: recipe.data.id, refId: recipe.ref['@ref'].id } }" class="img-link focus:shadow-none">
      <img class="recipe-card-img" :src="recipe.data.image" crossorigin="anonymous" :alt="recipe.data.title">
    </router-link>
    <div class="p-8">
      <router-link :to="{ name: 'Recipe', params: { id: recipe.data.id, refId: recipe.ref['@ref'].id } }" tabindex="-1">
        <h3 class="font-bold text-2xl tracking-wide text-blue-500 hover:text-blue-600">{{ recipe.data.title }}</h3>
      </router-link>
      <p class="text-blue-600 mt-4">{{ recipe.data.description }}</p>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
  .recipe-card {
    @apply bg-gray-500 shadow-sm;
  }

  .recipe-card-img {
    @apply w-full rounded-tl-lg rounded-tr-lg object-cover;
    height: 300px;
    max-height: 300px;
  }

  @media (hover: hover) and (pointer: fine) {
    .recipe-card:hover {
      box-shadow: 0 0.45rem 0.9rem rgba(0,0,0,.1);
      transition: box-shadow .35s ease-in-out;
    }
  }

  @media screen and (min-width:1024px) {
    .recipe-card:hover {
      transform: scale(1.015);
      transition: transform .25s ease;
    }
  }

  .img-link:focus > img {
    @apply shadow-outline;
  }
</style>