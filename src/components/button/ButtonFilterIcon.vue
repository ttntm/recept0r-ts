<script setup lang="ts">
  import { computed } from 'vue'
  import { useStore } from '@/store'
  import type { FilterSelection } from '@/types'
  import { getArrayIndex } from '@/utils'

  import IconResolver from '@/components/icon/IconResolver.vue'

  const props = defineProps<{
    current: string,
    type: string
  }>()

  const store = useStore()

  const filterActiveSelection = computed<FilterSelection>(() => store.getters['data/filterData'])

  const isActive = computed<boolean>(() => {
    if (!filterActiveSelection.value)
      return false

    return getArrayIndex(filterActiveSelection.value[props.type.toLowerCase()] || [], props.current) !== -1
  })
</script>

<template>
  <button class="filter-group" :class="{ 'activeFilter': isActive }" :active="isActive" v-click-blur>
    <IconResolver :icon="current" class="filter-img" />
    <span class="filter-text">{{ current }}</span>
  </button>
</template>

<style lang="postcss" scoped>
  .activeFilter .filter-img {
    @apply shadow-outline bg-white bg-opacity-50;
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
    width: 60px;
  }

  .filter-img {
    @apply border border-blue-500 rounded-md pointer-events-none;
  }

  .filter-text {
    @apply block text-xs font-bold text-center text-blue-500;
    word-break: normal;
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