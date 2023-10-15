<script setup lang="ts">
  import type { RecipeDB } from '@/types'

  const props = defineProps<{
    recipe: RecipeDB
  }>()
</script>

<template>
  <router-link
    :to="{ name: 'Recipe', params: { id: recipe.data.id, refId: recipe.ref['@ref'].id } }"
    class="img-link focus:shadow-none"
  >
    <UnLazyImage
      :src-set="recipe.data.image"
      :alt="recipe.data.title"
      class="recipe-card-img"
      placeholder-src="/img/blurred.png"
      auto-sizes
    />
  </router-link>
  <div class="p-8">
    <h3 class="font-bold text-2xl tracking-wide text-blue-500 hover:text-blue-600">
      <router-link
        :to="{ name: 'Recipe', params: { id: recipe.data.id, refId: recipe.ref['@ref'].id } }"
        tabindex="-1"
      >
        {{ recipe.data.title }}
      </router-link>
    </h3>
    <p class="text-blue-600 mt-4">{{ recipe.data.description }}</p>
  </div>
</template>

<style lang="postcss" scoped>
  .recipe-card-img {
    @apply w-full rounded-tl-lg rounded-tr-lg object-cover;
    height: 300px;
    max-height: 300px;
  }

  .img-link {
    @apply block;
  }

  .img-link:focus > img {
    @apply shadow-outline;
  }
</style>