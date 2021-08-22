<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { useStore } from '../store'
  
  import UserRecipeCard from '../components/user/UserRecipeCard.vue'

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
    <UserRecipeCard v-for="recipe in myRecipes.slice().reverse()" :key="recipe.data.id" :recipe="recipe" />
  </div>
</template>