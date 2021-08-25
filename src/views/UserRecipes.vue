<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { useStore } from '../store'
  
  import UserRecipeCard from '../components/user/UserRecipeCard.vue'
  import UserRecipeSorting from '../components/user/UserRecipeSorting.vue'

  const route = useRoute()
  const store = useStore()

  const isLoading = ref(true)
  const myRecipes = computed(() => store.getters['data/userRecipes'])
  const myRecipesDisplay = ref([...myRecipes.value.slice().reverse()])
  const user = computed(() => store.getters['user/currentUser'])

  const getMyRecipes = () => {
    const forceUpdate = route.query.force || null

    if (myRecipes.value.length === 0 || forceUpdate) {
      store.dispatch('data/readUser', user.value.id)
    }

    setTimeout(() => isLoading.value = false, 1500)
  }

  const updateList = (list: any[]) => myRecipesDisplay.value = list

  getMyRecipes()

  watch(myRecipes, () => {
    if (myRecipes.value.length > 0) myRecipesDisplay.value = myRecipes.value.slice().reverse()
  })
</script>

<template>
  <div id="my-recipes" class="w-full lg:w-4/5 flex flex-col mx-auto">
    <h3 class="text-center mb-8">Recipes You Created</h3>
    <div v-if="isLoading && myRecipesDisplay.length === 0" class="text-center">
      <img src="/img/loading.svg" alt="Loading..." class="mx-auto">
      <p class="text-cool-gray-500 mt-12">Loading data...</p>
    </div>
    <div v-if="!isLoading && myRecipesDisplay.length === 0" class="text-center">
      <p class="">It seems like you haven't created any recipes yet...</p>
      <p class="mb-12">How about giving it a try?</p>
      <router-link
        :to="{ name: 'Add Recipe' }"
        class="btn btn-gray"
      >Add Recipe</router-link>
    </div>
    <UserRecipeSorting v-if="myRecipesDisplay.length > 0" :data="myRecipesDisplay" @update:list="updateList($event)" />
    <UserRecipeCard v-for="recipe in myRecipesDisplay" :key="recipe.data.id" :recipe="recipe" />
  </div>
</template>