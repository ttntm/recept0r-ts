<script setup lang="ts">
  import { computed, onMounted, ref, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { useStore } from '@/store'
  import type { WritableComputedRef } from 'vue'
  import type { Recipe, User } from '@/types'
  import { useRecipeSearch } from '@/utils'

  import ButtonTop from '@/components/button/ButtonTop.vue'
  import LazyWrapper from '@/components/LazyWrapper.vue'
  import LoadingMessage from '@/components/conditional/LoadingMessage.vue'
  import SearchBar from '@/components/SearchBar.vue'
  import UserRecipeCard from '@/components/user/UserRecipeCard.vue'
  import UserRecipeSorting from '@/components/user/UserRecipeSorting.vue'

  const route = useRoute()
  const store = useStore()

  const isLoading = ref(true)
  const myRecipesDisplay = ref<Recipe[]>([])
  const userSearchTerm = ref('')

  const displayList: WritableComputedRef<Recipe[]> = computed({
    get(): Recipe[] {
      const list: Recipe[] = myRecipesDisplay.value
      const term = userSearchTerm.value
      return term && term.length > 0 ? useRecipeSearch(list, term, true) : list
    },
    set(newList: any[]): void {
      myRecipesDisplay.value = newList
    }
  })
  const myRecipes = computed<Recipe[]>(() => store.getters['data/userRecipes'])
  const user = computed<User>(() => store.getters['user/currentUser'])

  watch(myRecipes, (current, old) => {
    if (current.length > 0) {
      displayList.value = myRecipes.value
    }
  })

  onMounted(() => {
    myRecipesDisplay.value = [...myRecipes.value]
  })

  const getMyRecipes = () => {
    const forceUpdate = route.query.force || null

    if (myRecipes.value.length === 0 || forceUpdate) {
      store.dispatch('data/readUser', user.value.id)
    }

    setTimeout(() => isLoading.value = false, 5000)
  }

  const events = {
    onSetSearchTerm(val: string) {
      userSearchTerm.value = val
    },

    onUpdateList(list: Recipe[]) {
      displayList.value = list
    }
  }

  getMyRecipes()
</script>

<template>
  <div id="edit-mode" class="w-full lg:w-4/5 flex flex-col mx-auto">
    <h1 class="h3 text-center mb-8">Recipes You Created</h1>
    <LoadingMessage v-if="isLoading && myRecipesDisplay.length === 0">
      Loading data...
    </LoadingMessage>
    <div v-if="!isLoading && myRecipesDisplay.length === 0" class="text-center">
      <p class="">It seems like you haven't created any recipes yet...</p>
      <p class="mb-12">How about giving it a try?</p>
      <router-link :to="{ name: 'Add Recipe' }" class="btn btn-gray">Add Recipe</router-link>
    </div>
    <div class="w-full xl:w-2/3 flex flex-row justify-center mb-12 mx-auto">
      <SearchBar
        v-if="displayList.length > 0 || userSearchTerm"
        v-model.trim="userSearchTerm"
        placeholder="Use 'draft' to filter or enter title/description to search the list"
        @update:modelValue="events.onSetSearchTerm($event)"
      />
    </div>
    <UserRecipeSorting v-if="myRecipesDisplay.length > 0" :data="myRecipesDisplay" @update:list="events.onUpdateList($event)" />
    <transition name="fade">
      <p v-if="userSearchTerm && displayList.length === 0" class="text-center text-cool-gray-500 m-0">No results for your search query :(</p>
    </transition>
    <transition-group name="list" tag="section">
      <LazyWrapper v-for="recipe in displayList" :key="recipe.id" element="article" className="min-h-200px">
        <UserRecipeCard :recipe="recipe" />
      </LazyWrapper>
    </transition-group>
  </div>
  <ButtonTop />
</template>