<script setup lang="ts">
  import { computed, reactive, watch } from 'vue'
  import { useStore } from '../../store'
  import { FilterSelection } from '../../types'

  import { showWindow } from '../../utils'

  import ButtonDefault from '../button/ButtonDefault.vue'
  import ButtonFilterIcon from '../button/ButtonFilterIcon.vue'
  import ButtonX from '../button/ButtonX.vue'

  const store = useStore()

  const filterActive = computed(() => store.getters['data/filterActive'])
  const filterActiveSelection = computed(() => store.getters['data/filterData'])
  const recipeCategory = computed(() => store.getters['data/recipeCategory'])
  const recipeDiet = computed(() => store.getters['data/recipeDiet'])
  const selected: FilterSelection = reactive({
    category: [],
    diet: []
  })

  const findIndex = (arr: string[], item: string) => {
    const target = [...arr]
    return target.indexOf(item.toLowerCase())
  }

  const isActiveFilter = (mode: string, el: string) => findIndex(selected[mode], el) !== -1

  const onClearFilterClick = () => {
    Object.keys(selected).forEach(key => selected[key] = [])
    return store.dispatch('data/clearFilter')
  }

  const onFilterClick = (mode: string, el: string) => {
    const current = selected[mode]
    let idx = findIndex(selected[mode], el)

    if (idx === -1) {
      current.push(el.toLowerCase())
    } else {
      current.splice(idx, 1)
    }

    return store.dispatch('data/applyFilter', [mode, selected[mode]])
  }

  const onFilterClose = () => {
    if (selected.category.length === 0 && selected.diet.length === 0) {
      store.dispatch('data/clearFilter')
    }
    return showWindow(0)
  }

  const updateFilterState = () => {
    if (filterActive.value) {
      return Object.keys(selected).forEach(key => {
        if (filterActiveSelection.value[key] && filterActiveSelection.value[key].length > 0) {
          selected[key] = filterActiveSelection.value[key]
        }
      })
    }
  }

  updateFilterState()
</script>

<template>
  <div id="recipe-filter" class="flex flex-col relative w-full lg:w-3/4 xl:w-2/3 bg-gray-500 rounded-lg shadow-sm py-8 px-12 mb-12 mx-auto">
    <div class="flex items-center justify-end -mt-4 -mr-6">
      <ButtonX class="rounded-full p-2" @click="onFilterClose" />
    </div>
    <div class="w-full -mt-8">
      <h5 class="text-cool-gray-500 text-center">Filter Selection</h5>
    </div>
    <div class="w-full mb-4">
      <h5>Category</h5>
      <div class="flex flex-row flex-wrap justify-between md:justify-start items-center">
        <ButtonFilterIcon
          v-for="(cat, index) in recipeCategory"
          :class="{ 'activeFilter': isActiveFilter('category', cat) }"
          :current="cat"
          :key="index"
          @click="onFilterClick('category', cat)"
        />
      </div>
    </div>
    <div class="w-full mb-4">
      <h5>Diet</h5>
      <div class="flex flex-row flex-wrap justify-between md:justify-start items-center">
        <ButtonFilterIcon
          v-for="(diet, index) in recipeDiet"
          :class="{ 'activeFilter': isActiveFilter('diet', diet) }"
          :current="diet"
          :key="index"
          @click="onFilterClick('diet', diet)"
        />
      </div>
    </div>
    <div class="w-full flex flex-row justify-center lg:justify-end">
      <ButtonDefault class="btn-outline px-8" @click="onClearFilterClick()">Clear Filter</ButtonDefault>
      <ButtonDefault class="btn-outline px-8 ml-4" @click="onFilterClose">Close</ButtonDefault>
    </div>
  </div>
</template>

<style lang="postcss">
  .activeFilter .filter-img,
  .activeFilter .filter-text {
    @apply opacity-100;
  }
</style>