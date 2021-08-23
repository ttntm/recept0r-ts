<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { useStore } from '../store'

  import { showWindow } from '../utils'

  import ButtonFilter from '../components/button/ButtonFilter.vue'
  import HomeFilterMenu from '../components/home/HomeFilterMenu.vue'
  import HomeRecipeCard from '../components/home/HomeRecipeCard.vue'
  import HomeSearchBar from '../components/home/HomeSearchBar.vue'

  const route = useRoute()
  const store = useStore()

  const allRecipes = computed(() => store.getters['data/allRecipes'])
  const isLoading = computed(() => allRecipes.value.length > 0 ? false : true)
  const searchTerm = ref('')
  const windowOpen = computed(() => store.getters['app/windowOpen'])

  const displayedRecipes = computed(() => {
    const reversed: any[] = allRecipes.value.slice().reverse()
    const term = searchTerm.value
    if (term && term.length > 0) {
      return reversed.filter((item: any) => {
        if (item.data.title.toLowerCase().indexOf(term.toLowerCase()) === -1) { //if there was no match for the title...
          return item.data.description.toLowerCase().indexOf(term.toLowerCase()) !== -1 ? true : false //...evaluate the description
        } else { return true }
      })
    } else {
      return reversed
    }
  })

  const getAllRecipes = () => {
    const forceUpdate = route.query.force || null
    const lastUpdated = computed(() => store.getters['data/lastUpdated'])
    const now = new Date
    
    const diff = Math.round((Number(now) - Number(lastUpdated.value)) / (1000 * 60)) // time difference between now (view init) and last read operation

    if (allRecipes.value.length === 0 || !lastUpdated.value || diff > 60 || forceUpdate) {
      store.dispatch('data/readAll')
    }
  }

  const onFilterBtnClick = () => windowOpen.value === 0 ? showWindow(3) : showWindow(0)

  const setSearchTerm = (val: string) => searchTerm.value = val

  getAllRecipes()
</script>

<template>
  <div v-if="isLoading" class="text-center my-12">
    <img src="/img/loading.svg" alt="Loading..." class="mx-auto">
    <p class="text-cool-gray-500 mt-12">Loading recipes...</p>
  </div>
  <section v-else class="">
    <div class="w-full xl:w-2/3 flex flex-row justify-center mb-12 mx-auto">
      <HomeSearchBar v-model.trim="searchTerm" @update:modelValue="setSearchTerm($event)" />
      <ButtonFilter :window="windowOpen" @click="onFilterBtnClick" />
    </div>
    <transition name="slide-fade">
      <HomeFilterMenu v-if="windowOpen === 3" />
    </transition>
    <transition name="fade">
      <p v-if="searchTerm && displayedRecipes.length === 0" class="text-center text-cool-gray-500 m-0">No results for your search query :(</p>
    </transition>
    <transition-group name="list" tag="div" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <HomeRecipeCard v-for="recipe in displayedRecipes" :recipe="recipe" :key="recipe.data.id" />
    </transition-group>
  </section>
</template>

<style lang="postcss" scoped>
  .list-enter-active, 
  .list-leave-active {
    transition: all .5s;
  }

  .list-enter-from, 
  .list-leave-to {
    opacity: 0;
  }

  .list-move {
    transition: transform .5s;
  }

  .slide-fade-enter-active,
  .slide-fade-leave-active {
    transition: all 0.5s;
  }

  .slide-fade-enter-from,
  .slide-fade-leave-to {
    transform: translateY(-200px);
    opacity: 0;
  }
</style>