<script setup lang="ts">
  import ButtonDefault from '../button/ButtonDefault.vue'

  const props = defineProps<{
    icon: string,
    tip: string
  }>()
</script>
<template>
  <ButtonDefault class="flex flex-row items-center text-sm" :title="tip">
    <svg v-if="icon === 'desc'" xmlns="http://www.w3.org/2000/svg" class="inline-block pointer-events-none" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z"/>
      <line x1="4" y1="6" x2="13" y2="6" />
      <line x1="4" y1="12" x2="11" y2="12" />
      <line x1="4" y1="18" x2="11" y2="18" />
      <polyline points="15 15 18 18 21 15" />
      <line x1="18" y1="6" x2="18" y2="18" />
    </svg>
    <svg v-if="icon === 'asc'" xmlns="http://www.w3.org/2000/svg" class="inline-block pointer-events-none" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z"/>
      <line x1="4" y1="6" x2="11" y2="6" />
      <line x1="4" y1="12" x2="11" y2="12" />
      <line x1="4" y1="18" x2="13" y2="18" />
      <polyline points="15 9 18 6 21 9" />
      <line x1="18" y1="6" x2="18" y2="18" />
    </svg>
    <span class="inline-block pointer-events-none ml-2">
      <slot></slot>
    </span>
  </ButtonDefault>
</template>