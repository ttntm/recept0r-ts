<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { useStore } from '../store'

  const route = useRoute()
  const store = useStore()

  const isLoading = ref(true)
  const myRecipes = computed(() => store.getters['data/userRecipes'])
  const user = computed(() => store.getters['user/currentUser'])

  const getMyRecipes = () => {
    const forceUpdate = route.query.force || null

    if (myRecipes.value.length === 0 || forceUpdate) {
      store.dispatch('data/readUser', user.value.id)
    }

    setTimeout(() => isLoading.value = false, 1500)
  }

  getMyRecipes()
</script>

<template>
  <div id="my-recipes" class="w-full lg:w-4/5 flex flex-col mx-auto">
    <h3 class="text-center mb-8">Recipes You Created</h3>
    <div v-if="isLoading && myRecipes.length === 0" class="text-center">
      <img src="/img/loading.svg" alt="Loading..." class="mx-auto">
      <p class="text-cool-gray-500 mt-12">Loading data...</p>
    </div>
    <div v-if="!isLoading && myRecipes.length === 0" class="text-center">
      <p class="">It seems like you haven't created any recipes yet...</p>
      <p class="mb-12">How about giving it a try?</p>
      <router-link
        :to="{ name: 'Add Recipe' }"
        class="btn btn-gray"
      >Add Recipe</router-link>
    </div>
    <div v-for="recipe in myRecipes.slice().reverse()" :key="recipe.data.id" :class="{ 'bg-gray-600 bg-opacity-25' : recipe.data.draft }" class="list-card flex flex-col md:flex-row mb-8" style="min-height: 200px;">
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
  </div>
</template>