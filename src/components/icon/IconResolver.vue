<script setup lang="ts">
  import { computed } from 'vue'
  import type { Component } from 'vue'

  import bread from '@/components/icon/filter/bread.vue'
  import cookies from '@/components/icon/filter/cookies.vue'
  import dessert from '@/components/icon/filter/dessert.vue'
  import dip from '@/components/icon/filter/dip.vue'
  import drink from '@/components/icon/filter/drink.vue'
  import histamine from '@/components/icon/filter/histamine.vue'
  import jam from '@/components/icon/filter/jam.vue'
  import keto from '@/components/icon/filter/keto.vue'
  import lowcal from '@/components/icon/filter/lowcal.vue'
  import main from '@/components/icon/filter/main.vue'
  import other from '@/components/icon/filter/other.vue'
  import pastry from '@/components/icon/filter/pastry.vue'
  import salad from '@/components/icon/filter/salad.vue'
  import sauce from '@/components/icon/filter/sauce.vue'
  import side from '@/components/icon/filter/side.vue'
  import snack from '@/components/icon/filter/snack.vue'
  import soup from '@/components/icon/filter/soup.vue'
  import spread from '@/components/icon/filter/spread.vue'
  import vegan from '@/components/icon/filter/vegan.vue'
  import vegetarian from '@/components/icon/filter/vegetarian.vue'

  const props = defineProps<{
    icon: string
  }>()

  /**
   * This function is required so we can actually get the imported components
   * Placing the 'string' type prop in the ':is' binding below doesn't work at all
   * See: https://stackoverflow.com/a/66960318
   */
   const getIcon = computed<Component>(() => {
    switch (props.icon.toLowerCase()) {
      case 'bread':
        return bread
      case 'cookies':
        return cookies
      case 'dessert':
        return dessert
      case 'dip':
        return dip
      case 'drink':
        return drink
      case 'histamine':
        return histamine
      case 'jam':
        return jam
      case 'lowcal':
        return lowcal
      case 'keto':
        return keto
      case 'main':
        return main
      case 'pastry':
        return pastry
      case 'salad':
        return salad
      case 'sauce':
        return sauce
      case 'side':
        return side
      case 'snack':
        return snack
      case 'soup':
        return soup
      case 'spread':
        return spread
      case 'vegan':
        return vegan
      case 'vegetarian':
        return vegetarian

      default:
        return other
    }
  })
</script>

<template>
  <component :is="getIcon" />
</template>
