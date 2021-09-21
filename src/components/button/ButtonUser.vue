<script setup lang="ts">
  const props = defineProps<{
    window: number
  }>()
</script>
<template>
  <button 
    :class="{ 'bg-white border border-blue-500 pointer-events-none' : window === 5 }"
    class="btn btn-gray border border-transparent focus:outline-none focus:shadow-none rounded-full p-3"
    v-click-blur
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-user pointer-events-none" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <circle cx="12" cy="7" r="4" />
      <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
    </svg>
  </button>
</template>