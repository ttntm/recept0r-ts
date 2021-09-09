<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { useStore } from '@/store'
  import type { WritableComputedRef } from 'vue'
  
  import { useRecipeSearch } from '@/utils'
  
  import ButtonTop from '@/components/button/ButtonTop.vue'
  import Loading from '@/components/icon/loading.vue'
  import SearchBar from '@/components/SearchBar.vue'
  import UserRecipeCard from '@/components/user/UserRecipeCard.vue'
  import UserRecipeSorting from '@/components/user/UserRecipeSorting.vue'

  const route = useRoute()
  const store = useStore()

  const displayList: WritableComputedRef<any[]> = computed({
    // see: https://stackoverflow.com/a/64281689
    get(): any[] {
      const list = myRecipesDisplay.value
      const term = userSearchTerm.value
      if (term && term.length > 0) {
        return useRecipeSearch(list, term)
      } else {
        return list
      }
    },
    set(newList: any[]): void {
      myRecipesDisplay.value = newList
    }
  })
  const isLoading = ref(true)
  const myRecipes = computed(() => store.getters['data/userRecipes'])
  const myRecipesDisplay = ref([...myRecipes.value.slice().reverse()])
  const user = computed(() => store.getters['user/currentUser'])
  const userSearchTerm = ref('')

  const getMyRecipes = () => {
    const forceUpdate = route.query.force || null

    if (myRecipes.value.length === 0 || forceUpdate) {
      store.dispatch('data/readUser', user.value.id)
    }

    setTimeout(() => isLoading.value = false, 5000)
  }

  const setSearchTerm = (val: string) => userSearchTerm.value = val

  const updateList = (list: any[]) => displayList.value = list

  getMyRecipes()

  watch(myRecipes, (current, old) => {
    if (current.length > 0) {
      displayList.value = myRecipes.value.slice().reverse()
    }
  })
</script>

<template>
  <div id="my-recipes" class="w-full lg:w-4/5 flex flex-col mx-auto">
    <h3 class="text-center mb-8">Recipes You Created</h3>
    <div v-if="isLoading && myRecipesDisplay.length === 0" class="text-center">
      <Loading class="mx-auto" />
      <p class="text-cool-gray-500 mt-12">Loading data...</p>
    </div>
    <div v-if="!isLoading && myRecipesDisplay.length === 0" class="text-center">
      <p class="">It seems like you haven't created any recipes yet...</p>
      <p class="mb-12">How about giving it a try?</p>
      <router-link :to="{ name: 'Add Recipe' }" class="btn btn-gray">Add Recipe</router-link>
    </div>
    <div class="w-full xl:w-2/3 flex flex-row justify-center mb-12 mx-auto">
      <SearchBar v-if="displayList.length > 0" v-model.trim="userSearchTerm" @update:modelValue="setSearchTerm($event)" />
    </div>
    <UserRecipeSorting v-if="myRecipesDisplay.length > 0" :data="myRecipesDisplay" @update:list="updateList($event)" />
    <transition name="fade">
      <p v-if="userSearchTerm && displayList.length === 0" class="text-center text-cool-gray-500 m-0">No results for your search query :(</p>
    </transition>
    <transition-group name="list" tag="section">
      <UserRecipeCard v-for="recipe in displayList" :key="recipe.data.id" :recipe="recipe" />
    </transition-group>
  </div>
  <ButtonTop />
</template>