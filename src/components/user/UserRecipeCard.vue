<script setup lang="ts">
  import { useBlurredPlaceholder } from '@/utils'
  import type { Recipe } from '@/types'

  import ButtonDelete from '@/components/button/ButtonDelete.vue'
  import ButtonDuplicate from '@/components/button/ButtonDuplicate.vue'

  const props = defineProps<{
    recipe: Recipe
  }>()

  const blurredSrc: string = useBlurredPlaceholder()
  const isDraft: boolean = props.recipe.status === 'draft'
  const target: string = isDraft ? 'Edit Recipe' : 'Recipe'
</script>

<template>
  <div :class="{ 'list-card--draft' : isDraft }" class="list-card flex flex-col md:flex-row justify-between min-h-200px mb-8">
    <div class="w-full md:w-1/2 lg:w-1/3 rounded-t-lg md:rounded-t-none md:rounded-l-lg flex-shrink-0">
      <router-link
        v-if="recipe.image"
        :to="{ name: target, params: { slug: recipe.slug, id: recipe.id } }"
        class="block focus:shadow-none"
        title="View recipe"
      >
        <UnLazyImage
          :class="{ 'opacity-75' : isDraft }"
          :src-set="recipe.image"
          :alt="recipe.title"
          :placeholder-src="blurredSrc"
          class="w-full rounded-t-lg md:rounded-t-none md:rounded-l-lg img-cover"
          height="200"
          auto-sizes
        />
      </router-link>
      <div v-else class="w-full h-full flex items-center justify-center bg-blue-600 bg-opacity-75 rounded-t-lg md:rounded-t-none md:rounded-l-lg min-h-200px">
        <span class="self-center text-white">No Image</span>
      </div>
    </div>
    <div class="flex flex-col md:w-1/2 xl:w-2/3 justify-center p-8 md:py-4 xl:pl-12 xl:ml-12">
      <h2 class="h4 text-2xl">
        <span v-if="isDraft" class="block text-cool-gray-700 uppercase text-xs font-light">
          Draft
        </span>
        <router-link :to="{ name: target, params: { slug: recipe.slug, id: recipe.id } }">
          {{ recipe.title }}
        </router-link>
      </h2>
      <p>{{ recipe.description }}</p>
      <div class="w-full flex flex-row items-center mt-4">
        <router-link
          :to="{ name: 'Edit Recipe', params: { id: recipe.id } }"
          :title="isDraft ? 'Edit Draft' : 'Edit Recipe'"
          class="btn btn-gray btn-outline rounded-md p-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="icon pointer-events-none" width="32" height="32" viewBox="0 0 200 200">
            <path d="M127.77,103.69c-1.38,0-2.5,1.12-2.5,2.5v33.86c0,5.4-4.4,9.8-9.8,9.8h-55.35c-5.4,0-9.8-4.4-9.8-9.8v-55.35c0-5.4,4.4-9.8,9.8-9.8h30.27c1.38,0,2.5-1.12,2.5-2.5s-1.12-2.5-2.5-2.5h-30.27c-8.16,0-14.8,6.64-14.8,14.8v55.35c0,8.16,6.64,14.8,14.8,14.8h55.35c8.16,0,14.8-6.64,14.8-14.8v-33.86c0-1.38-1.12-2.5-2.5-2.5ZM150.1,49.67c-2.74-2.74-6.45-4.15-10.47-3.98-3.93.17-7.69,1.85-10.57,4.73l-2.68,2.68c-.21.11-.4.24-.58.42-.17.17-.3.37-.42.57l-46.88,46.73s-.01.01-.02.02c0,0-.01.01-.02.02l-1.15,1.15c-.3.29-.51.66-.63,1.06l-7.08,23.84c-.26.88-.02,1.82.62,2.47.48.48,1.12.74,1.77.74.23,0,.46-.03.69-.1l23.99-6.92c.41-.12.78-.34,1.08-.64l1.15-1.15s.01-.01.02-.02c0,0,.01-.01.02-.02l46.73-46.88c.2-.11.4-.24.57-.42.17-.17.31-.37.42-.58l2.67-2.68c2.88-2.88,4.57-6.64,4.74-10.57.17-4.02-1.24-7.73-3.98-10.47ZM75.7,123.95l5.12-17.24,12.23,12.23-17.35,5.01ZM97.16,115.98l-13.37-13.37,43.85-43.71,13.23,13.23-43.71,43.85ZM145.81,67.18h0s-1.4,1.41-1.4,1.41l-13.22-13.22,1.41-1.41c2-2,4.57-3.16,7.25-3.28,2.61-.12,4.98.78,6.72,2.52,1.74,1.73,2.63,4.12,2.52,6.72-.12,2.68-1.28,5.26-3.28,7.25Z" fill="currentColor" stroke-width="5" stroke="currentColor" />
          </svg>
        </router-link>
        <ButtonDuplicate
          :recipe="recipe"
          class="btn-outline rounded-md opacity-100 p-1 mx-4"
        />
        <ButtonDelete
          :id="recipe.id"
          :title="recipe.title"
          class="btn-outline rounded-md opacity-100 p-1"
        />
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
  .list-card {
    @apply flex-no-wrap bg-gray-500 rounded-lg border border-transparent;
  }

  @media (hover: hover) and (pointer: fine) {
    .list-card:hover {
      @apply border-cool-gray-500 shadow;
    }
  }

  .list-card--draft {
    @apply bg-gray-600 bg-opacity-25;
  }

  .img-cover {
    @apply object-cover;
    height: 100%;
    max-height: 230px;
    min-width: 333px;
    min-height: 100%;
  }
</style>