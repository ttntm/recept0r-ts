<script setup lang="ts">
  import { computed } from 'vue'

  import bread from '../icon/filter/bread.vue'
  import dessert from '../icon/filter/dessert.vue'
  import drink from '../icon/filter/drink.vue'
  import keto from '../icon/filter/keto.vue'
  import main from '../icon/filter/main.vue'
  import pastry from '../icon/filter/pastry.vue'
  import salad from '../icon/filter/salad.vue'
  import snack from '../icon/filter/snack.vue'
  import soup from '../icon/filter/soup.vue'
  import vegan from '../icon/filter/vegan.vue'
  import vegetarian from '../icon/filter/vegetarian.vue'

  const props = defineProps<{
    current: string
  }>()

  /**
   * This function is required so we can actually get the imported components
   * Placing the 'string' type prop in the ':is' binding below doesn't work at all
   * See: https://stackoverflow.com/a/66960318
  */
  const getFilterImg = computed(() => {
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
</script>

<template>
  <button class="filter-group mb-4 md:mr-4" v-click-blur>
    <component :is="getFilterImg" class="filter-img" />
    <span class="filter-text">{{ current }}</span>
  </button>
</template>

<style lang="postcss" scoped>
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