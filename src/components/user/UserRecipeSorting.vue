<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useStore } from '@/store'
  import type { RecipeDB, SortOption } from '@/types'
  import { getArrayIndex, objectSort } from '@/utils'

  import ButtonSort from '@/components/button/ButtonSort.vue'

  const emit = defineEmits<{
    (e: 'update:list', val: any[]): void
  }>()

  const store = useStore()

  const currentSortState = ref<string[]>(['date', 'desc'])

  const cachedList = computed<RecipeDB[]>(() => store.getters['data/userRecipes'])
  const sortButtons = computed<SortOption[]>(() => store.getters['data/userSortOptions'])

  const isActiveBtn = (data: string, type: string) => {
    const selected = currentSortState.value
    return getArrayIndex(selected, data) !== -1 && getArrayIndex(selected, type) !== -1
  }

  const onSortButtonClick = (data: string, type: string) => {
    const input = [...cachedList.value.slice()]
    
    currentSortState.value = [data, type]
    
    switch (data) {
      case 'abc':
        if (type === 'asc') {
          emit('update:list', input.sort(objectSort('title', false, (a:string) =>  a.toUpperCase())))
        } else {
          // new -> old = reversed default
          emit('update:list', input.sort(objectSort('title', true, (a:string) =>  a.toUpperCase())))
        }
        break

      case 'date':
        if (type === 'asc') {
          // old -> new = Fauna's default
          emit('update:list', [...input])
        } else {
          // new -> old = reversed default
          emit('update:list', [...input.reverse()])
        }
        break

      default:
        break
    }
  }
</script>

<template>
  <div class="flex flex-row flex-wrap justify-center md:justify-evenly items-center mb-12">
    <h4 class="hidden md:block text-cool-gray-500 m-0">Display:</h4>
    <ButtonSort 
      v-for="(item, index) in sortButtons"
      :class="{ 'bg-cool-gray-500' : isActiveBtn(item.data, item.type) }"
      :disabled="isActiveBtn(item.data, item.type)"
      :icon="item.type" 
      :key="index" 
      :tip="item.tooltip" 
      class="mx-2 mb-4 md:m-0" 
      @click="onSortButtonClick(item.data, item.type)"
    >
      {{ item.text }}
    </ButtonSort>
  </div>
</template>