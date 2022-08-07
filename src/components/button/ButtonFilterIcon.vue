<script setup lang="ts">
  import { computed } from 'vue'
  import { useStore } from '@/store'
  import type { FilterSelection } from '@/types'
  import { getArrayIndex } from '@/utils'

  import bread from '@/components/icon/filter/bread.vue'
  import dessert from '@/components/icon/filter/dessert.vue'
  import drink from '@/components/icon/filter/drink.vue'
  import keto from '@/components/icon/filter/keto.vue'
  import main from '@/components/icon/filter/main.vue'
  import pastry from '@/components/icon/filter/pastry.vue'
  import salad from '@/components/icon/filter/salad.vue'
  import snack from '@/components/icon/filter/snack.vue'
  import soup from '@/components/icon/filter/soup.vue'
  import vegan from '@/components/icon/filter/vegan.vue'
  import vegetarian from '@/components/icon/filter/vegetarian.vue'

  const props = defineProps<{
    current: string,
    type: string
  }>()

  const store = useStore()

  const filterActiveSelection = computed<FilterSelection>(() => store.getters['data/filterData'])
  /**
   * This function is required so we can actually get the imported components
   * Placing the 'string' type prop in the ':is' binding below doesn't work at all
   * See: https://stackoverflow.com/a/66960318
  */
  const getFilterImg = computed<string>(() => {
    switch (props.current.toLowerCase()) {
      case 'bread':
        return bread
      case 'dessert':
        return dessert
      case 'drink':
        return drink
      case 'keto':
        return keto
      case 'main':
        return main
      case 'pastry':
        return pastry
      case 'salad':
        return salad
      case 'snack':
        return snack
      case 'soup':
        return soup
      case 'vegan':
        return vegan
      case 'vegetarian':
        return vegetarian
    
      default:
        return keto
    }
  })

  const isActive = computed<boolean>(() => {   
    if (!filterActiveSelection.value)
      return false
    
    let c = props.current.toLowerCase()
    let idx = getArrayIndex(filterActiveSelection.value[props.type.toLowerCase()] || [], c)
    
    return idx !== -1
  })
</script>

<template>
  <button class="filter-group mb-4 md:mr-4" :class="{ 'activeFilter': isActive }" :active="isActive" v-click-blur>
    <component :is="getFilterImg" class="filter-img" />
    <span class="filter-text">{{ current }}</span>
  </button>
</template>

<style lang="postcss" scoped>
  .activeFilter .filter-img,
  .activeFilter .filter-text {
    @apply opacity-100;
  }

  .filter-group {
    @apply cursor-pointer outline-none;
  }

  .filter-group:focus {
    @apply outline-none shadow-none;
  }

  .filter-img,
  .filter-text {
    @apply pointer-events-none;
    transition: opacity .35s ease-in-out;
  }

  .filter-img {
    width: 60px;
    @apply opacity-50 pointer-events-none;
  }

  .filter-text {
    @apply block text-xs font-bold text-center text-blue-500 opacity-50;
  }

  .filter-group:focus .filter-img,
  .filter-group:focus .filter-text {
    @apply opacity-100;
  }

  @media (hover: hover) and (pointer: fine) {
    .filter-group:hover .filter-img,
    .filter-group:hover .filter-text {
      @apply opacity-100;
    }
  }
</style>