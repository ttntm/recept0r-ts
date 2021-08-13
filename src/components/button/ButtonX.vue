<script setup lang="ts">
  interface Props {
    size?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    size: '24'
  })
</script>

<template>
  <button class="focus:outline-none focus:shadow-outline opacity-75 hover:opacity-100">
    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-x pointer-events-none" :width="size" :height="size" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  </button>
</template>