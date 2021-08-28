<script setup lang="ts">
  interface Props {
    label?: string
    mode?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    label: 'Open menu',
    mode: 'open'
  })
</script>

<template>
  <button class="block lg:hidden focus:outline-none focus:shadow-outline" type="button" :aria-label="label" v-click-blur>
    <svg v-if="mode === 'open'" xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-menu-2 pointer-events-none" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="18" x2="20" y2="18" />
    </svg>
    <svg v-else xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-arrow-bar-left pointer-events-none" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <line x1="4" y1="12" x2="14" y2="12" />
      <line x1="4" y1="12" x2="8" y2="16" />
      <line x1="4" y1="12" x2="8" y2="8" />
      <line x1="20" y1="4" x2="20" y2="20" />
    </svg>
  </button>
</template>