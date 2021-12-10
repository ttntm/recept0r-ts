<script setup lang="ts">
  import type { RecipeDB } from '@/types'

  import ButtonDelete from '@/components/button/ButtonDelete.vue'
  import ButtonDuplicate from '@/components/button/ButtonDuplicate.vue'

  const props = defineProps<{
    recipe: RecipeDB
  }>()

  const target: string = props.recipe.data.draft ? 'Edit Recipe' : 'Recipe'
</script>

<template>
  <div :class="{ 'list-card--draft' : recipe.data.draft }" class="list-card flex flex-col md:flex-row justify-between mb-8" style="min-height: 200px;">
    <div class="w-full md:w-1/2 lg:w-1/3 rounded-t-lg md:rounded-t-none md:rounded-l-lg flex-shrink-0">
      <router-link v-if="recipe.data.image" :to="{ name: target, params: { id: recipe.data.id, refId: recipe.ref['@ref'].id } }" class="block focus:shadow-none" title="View recipe">
        <img :src="recipe.data.image" crossorigin="anonymous" :alt="recipe.data.title" :class="{ 'opacity-75' : recipe.data.draft }" class="w-full rounded-t-lg md:rounded-t-none md:rounded-l-lg img-cover" height="200" loading="lazy">
      </router-link>
      <div v-else class="w-full h-full flex items-center justify-center bg-blue-600 bg-opacity-75 rounded-t-lg md:rounded-t-none md:rounded-l-lg" style="min-height: 200px;">
        <span class="self-center text-white">No Image</span>
      </div>
    </div>
    <div class="flex flex-col md:w-1/2 xl:w-2/3 justify-center p-8 md:py-4 xl:pl-12 xl:ml-12">
      <h4 class="text-2xl">
        <span v-if="recipe.data.draft" class="block text-cool-gray-700 uppercase text-xs font-light">Draft</span>
        <router-link :to="{ name: target, params: { id: recipe.data.id, refId: recipe.ref['@ref'].id } }">
          {{ recipe.data.title }}
        </router-link>
      </h4>
      <p>{{ recipe.data.description }}</p>
      <div class="w-full flex flex-row items-center mt-4">
        <router-link :to="{ name: 'Edit Recipe', params: { refId: recipe.ref['@ref'].id } }" class="btn btn-gray btn-outline rounded-md p-2" :title="recipe.data.draft ? 'Edit Draft' : 'Edit Recipe'">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-edit-circle pointer-events-none" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M12 15l8.385 -8.415a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3z" />
            <path d="M16 5l3 3" />
            <path d="M9 7.07a7.002 7.002 0 0 0 1 13.93a7.002 7.002 0 0 0 6.929 -5.999" />
          </svg>
        </router-link>
        <ButtonDuplicate :recipe="recipe.data" class="btn-outline rounded-md opacity-100 p-2 mx-4" />
        <ButtonDelete :id="recipe.ref['@ref'].id" :title="recipe.data.title" class="btn-outline rounded-md opacity-100 p-2" />
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
    height: 200px;
    max-height: 200px;
    min-width: 333px;
    min-height: 100%;
  }
</style>