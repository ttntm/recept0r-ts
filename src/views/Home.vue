<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { useStore } from '@/store'
  import type { RecipeDB } from '@/types'
  import { showWindow, useRecipeSearch } from '@/utils'

  import ButtonFilter from '@/components/button/ButtonFilter.vue'
  import ButtonTop from '@/components/button/ButtonTop.vue'
  import HomeFilterMenu from '@/components/home/HomeFilterMenu.vue'
  import HomeRecipeCard from '@/components/home/HomeRecipeCard.vue'
  import Loading from '@/components/icon/loading.vue'
  import SearchBar from '@/components/SearchBar.vue'

  const route = useRoute()
  const store = useStore()

  const forceUpdate = route.query.force || null
  const searchTerm = ref('')

  const allRecipes = computed<RecipeDB[]>(() => store.getters['data/allRecipes'])
  const displayedRecipes = computed<RecipeDB[]>(() => {
    const reversed: RecipeDB[] = allRecipes.value.slice().reverse()
    const term = searchTerm.value
    return term && term.length > 0 ? useRecipeSearch(reversed, term) : reversed
  })
  const filterActive = computed<boolean>(() => store.getters['data/filterActive'])
  const isLoading = computed<boolean>(() => allRecipes.value.length > 0 ? false : true)
  const lastUpdated = computed<string>(() => store.getters['data/lastUpdated'])
  const windowOpen = computed<number>(() => store.getters['app/windowOpen'])

  watch(lastUpdated, () => {
    store.dispatch('app/setDebugInfo', { lastUpdate: lastUpdate(), updateNeeded: updateNeeded(), forceUpdate: Boolean(forceUpdate) })
  })

  const getAllRecipes = () => {    
    if ((allRecipes.value.length === 0 && !filterActive.value) || forceUpdate || !lastUpdate() || updateNeeded()) {
      store.dispatch('data/readAll')
    }
  }

  const lastUpdate = () => lastUpdated.value ? new Date(lastUpdated.value) : ''

  const updateNeeded = () => {
    const now: Date = new Date
    const diff: number = Math.round((Number(now) - Number(lastUpdate())) / (1000 * 60)) // time difference between now (view init) and last read operation
    return diff > 60
  }

  const events = {
    onFilterBtnClick() {
      windowOpen.value === 0 ? showWindow(3) : showWindow(0)
    },

    onFilterMsgClick() {
      store.dispatch('data/clearFilter')
    },

    onSetSearchTerm(val: string) {
      searchTerm.value = val
    }
  }

  getAllRecipes()
</script>

<template>
  <div v-if="isLoading && !filterActive" class="text-center my-12">
    <Loading class="mx-auto" />
    <p class="text-cool-gray-500 mt-12">Loading recipes...</p>
  </div>
  <section v-else class="">
    <div class="w-full xl:w-2/3 flex flex-row justify-center mb-12 mx-auto">
      <SearchBar v-model.trim="searchTerm" @update:modelValue="events.onSetSearchTerm($event)" />
      <ButtonFilter :window="windowOpen" @click="events.onFilterBtnClick" />
    </div>
    <HomeFilterMenu :show="windowOpen === 3" />
    <transition name="fade">
      <p v-if="filterActive && windowOpen !== 3" class="text-center mb-10">
        Showing filtered recipes. <span @click.prevent="events.onFilterMsgClick" class="text-cool-gray-500 underline hover:no-underline cursor-pointer">Clear Filter</span>
      </p>
    </transition>
    <transition name="fade">
      <p v-if="searchTerm && displayedRecipes.length === 0" class="text-center text-cool-gray-500 m-0">No results for your search query :(</p>
    </transition>
    <transition-group name="list" tag="div" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <HomeRecipeCard v-for="recipe in displayedRecipes" :recipe="recipe" :key="recipe.data.id" />
    </transition-group>
  </section>
  <ButtonTop />
</template>
