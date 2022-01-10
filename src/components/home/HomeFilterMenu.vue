<script setup lang="ts">
  import { computed, reactive } from 'vue'
  import { useStore } from '@/store'
  import type { FilterSelection } from '@/types'
  import { getArrayIndex, showWindow } from '@/utils'

  import ButtonDefault from '@/components/button/ButtonDefault.vue'
  import ButtonFilterIcon from '@/components/button/ButtonFilterIcon.vue'
  import ButtonX from '@/components/button/ButtonX.vue'

  const store = useStore()

  const selected: FilterSelection = reactive({
    category: [],
    diet: []
  })
  
  const confirmBtnTxt = computed<string>(() => filterActive.value ? 'Apply' : 'Close')
  const filterActive = computed<boolean>(() => store.getters['data/filterActive'])
  const filterActiveSelection = computed<FilterSelection>(() => store.getters['data/filterData'])
  const recipeCategory = computed<string[]>(() => store.getters['data/recipeCategory'])
  const recipeDiet = computed<string[]>(() => store.getters['data/recipeDiet'])

  const isActiveFilter = (mode: string, el: string) => getArrayIndex(selected[mode], el) !== -1

  const updateFilterState = () => {
    if (filterActive.value) {
      return Object.keys(selected).forEach(key => {
        if (filterActiveSelection.value[key] && filterActiveSelection.value[key].length > 0) {
          selected[key] = filterActiveSelection.value[key]
        }
      })
    }
  }

  const events = {
    onClearFilterClick() {
      if (filterActive.value) {
        Object.keys(selected).forEach(key => selected[key] = [])
        return store.dispatch('data/clearFilter')
      }
    },

    onFilterClick(mode: string, el: string) {
      const current = selected[mode]
      let idx = getArrayIndex(selected[mode], el)

      if (idx === -1) {
        current.push(el.toLowerCase())
      } else {
        current.splice(idx, 1)
      }

      return store.dispatch('data/applyFilter', [mode, selected[mode]])
    },

    onFilterClose() {
      if (filterActive.value && selected.category.length === 0 && selected.diet.length === 0) {
        store.dispatch('data/clearFilter')
      }
      return showWindow(0)
    }
  }

  updateFilterState()
</script>

<template>
  <div id="recipe-filter" class="flex flex-col relative w-full lg:w-3/4 xl:w-2/3 bg-gray-500 rounded-lg shadow-sm py-8 px-12 mb-12 mx-auto">
    <div class="flex items-center justify-end -mt-4 -mr-6">
      <ButtonX class="rounded-full p-2" @click="events.onFilterClose" />
    </div>
    <div class="w-full -mt-8">
      <h2 class="text-base text-cool-gray-500 text-center">Filter Selection</h2>
    </div>
    <div class="w-full mb-4">
      <h5>Category</h5>
      <div class="flex flex-row flex-wrap justify-between md:justify-start items-center">
        <ButtonFilterIcon
          v-for="(cat, index) in recipeCategory"
          :class="{ 'activeFilter': isActiveFilter('category', cat) }"
          :current="cat"
          :key="index"
          @click="events.onFilterClick('category', cat)"
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
          @click="events.onFilterClick('diet', diet)"
        />
      </div>
    </div>
    <div class="w-full flex flex-row justify-center lg:justify-end">
      <ButtonDefault class="btn-outline px-8" :disabled="!filterActive" @click="events.onClearFilterClick()">Clear</ButtonDefault>
      <ButtonDefault class="btn-outline px-8 ml-4" @click="events.onFilterClose">{{ confirmBtnTxt }}</ButtonDefault>
    </div>
  </div>
</template>

<style lang="postcss">
  .activeFilter .filter-img,
  .activeFilter .filter-text {
    @apply opacity-100;
  }
</style>