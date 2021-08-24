<script setup lang="ts">
  import { computed } from 'vue'

  const props = defineProps<{
    window: number
  }>()

  const filterBtnText = computed(() => props.window === 3 ? 'Hide Filters' : 'Show Filters')
</script>
<template>
  <button class="w-auto flex-0 btn btn-gray border-0 focus:outline-none ml-2 lg:ml-6 mx-auto" aria-label="Select Filter" v-click-blur>
    <span class="block lg:hidden">
      <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="#234cad" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z"/>
        <path d="M5.5 5h13a1 1 0 0 1 0.5 1.5L14 12L14 19L10 16L10 12L5 6.5a1 1 0 0 1 0.5 -1.5" />
      </svg>
    </span>
    <span class="hidden lg:block pointer-events-none">{{ filterBtnText }}</span>
  </button>
</template>