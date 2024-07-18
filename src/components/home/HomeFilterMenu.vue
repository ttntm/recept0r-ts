<script setup lang="ts">
  import { computed, toRaw, WritableComputedRef } from 'vue'
  import { useStore } from '@/store'
  import type { FilterSelection } from '@/types'
  import { getArrayIndex, showWindow } from '@/utils'

  import ButtonDefault from '@/components/button/ButtonDefault.vue'
  import ButtonFilterIcon from '@/components/button/ButtonFilterIcon.vue'
  import ButtonX from '@/components/button/ButtonX.vue'

  const props = defineProps<{
    show: boolean
  }>()

  const store = useStore()

  const confirmBtnTxt = computed<string>(() => filterActive.value ? 'Apply' : 'Close')
  const filterActive = computed<boolean>(() => store.getters['data/filterActive'])
  const filterActiveSelection: WritableComputedRef<FilterSelection> = computed({
    get(): FilterSelection {
      return store.getters['data/filterData']
    },
    set(val: FilterSelection): void {
      store.dispatch('data/applyFilter', [val])
    }
  })
  const hasFilterSelected = computed<boolean>(() => {
    return filterActiveSelection.value && (filterActiveSelection.value.category?.length >= 1 || filterActiveSelection.value.diet?.length >= 1)
  })
  const recipeCategory = computed<string[]>(() => store.getters['data/recipeCategory'])
  const recipeDiet = computed<string[]>(() => store.getters['data/recipeDiet'])

  const events = {
    onClearFilterClick() {
      if (filterActive.value) {
        return store.dispatch('data/clearFilter')
      }
    },

    onFilterClick(mode: string, el: string) {
      let current = {
        [mode]: toRaw(filterActiveSelection.value[mode]) || []
      }
      let idx = getArrayIndex(current[mode], el)

      if (idx === -1) {
        current[mode].push(el.toLowerCase())
      } else {
        current[mode].splice(idx, 1)
      }

      filterActiveSelection.value = Object.assign(toRaw(filterActiveSelection.value), current)
    },

    onFilterClose() {
      if (filterActive.value && !hasFilterSelected.value) {
        store.dispatch('data/clearFilter')
      }
      return showWindow(0)
    }
  }
</script>

<template>
  <transition name="slide-fade">
    <div v-if="show" id="recipe-filter" class="flex flex-col relative w-full lg:w-3/4 xl:w-2/3 bg-gray-500 rounded-lg shadow-sm py-8 px-12 mb-12 mx-auto">
      <div class="flex items-center justify-end -mt-4 -mr-6">
        <ButtonX class="rounded-full p-2" @click="events.onFilterClose" />
      </div>
      <div class="w-full -mt-8">
        <h2 class="text-base text-cool-gray-500 text-center">Filter Selection</h2>
      </div>
      <div class="w-full mb-8">
        <h5>Category</h5>
        <div class="flex flex-row flex-wrap justify-between md:justify-start items-center gap-4">
          <ButtonFilterIcon
            v-for="(cat, index) in recipeCategory"
            :current="cat"
            :key="index"
            type="category"
            @click="events.onFilterClick('category', cat)"
          />
        </div>
      </div>
      <div class="w-full mb-4">
        <h5>Diet</h5>
        <div class="flex flex-row flex-wrap justify-between md:justify-start items-start gap-4">
          <ButtonFilterIcon
            v-for="(diet, index) in recipeDiet"
            :current="diet"
            :key="index"
            type="diet"
            @click="events.onFilterClick('diet', diet)"
          />
        </div>
      </div>
      <div class="w-full flex flex-row justify-center lg:justify-end">
        <ButtonDefault class="btn-outline px-8" :disabled="!filterActive" @click="events.onClearFilterClick()">Clear</ButtonDefault>
        <ButtonDefault class="btn-outline px-8 ml-4" @click="events.onFilterClose">{{ confirmBtnTxt }}</ButtonDefault>
      </div>
    </div>
  </transition>
</template>

<style lang="postcss">
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