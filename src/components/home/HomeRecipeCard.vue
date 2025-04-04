<script setup lang="ts">
  import { useBlurredPlaceholder } from '@/utils'
  import type { Recipe } from '@/types'

  const props = defineProps<{
    recipe: Recipe
  }>()

  const blurredSrc: string = useBlurredPlaceholder()
</script>

<template>
  <router-link
    :to="{ name: 'Recipe', params: { slug: recipe.slug, id: recipe.id } }"
    class="img-link focus:shadow-none"
  >
    <UnLazyImage
      :src-set="recipe.image"
      :alt="recipe.title"
      :placeholder-src="blurredSrc"
      class="recipe-card-img"
      auto-sizes
    />
  </router-link>
  <div class="px-8 py-4">
    <h2 class="h3 font-bold text-2xl tracking-wide text-blue-500 hover:text-blue-600">
      <router-link
        :to="{ name: 'Recipe', params: { slug: recipe.slug, id: recipe.id } }"
        tabindex="-1"
      >
        {{ recipe.title }}
      </router-link>
    </h2>
    <p class="text-blue-600 mt-4">
      {{ recipe.description }}
    </p>
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