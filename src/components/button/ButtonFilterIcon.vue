<script setup lang="ts">
  const props = defineProps<{
    current: string
  }>()
  
  const getFilterImg = (item: string) => `/img/filter/${item.toLowerCase()}.svg`
</script>

<template>
  <button class="filter-group mb-4 md:mr-4" v-click-blur>
    <img :src="getFilterImg(current)" :alt="current" class="filter-img" />
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
    transition: opacity .35s ease-in-out;
  }

  .filter-img {
    width: 60px;
    @apply opacity-50 pointer-events-none;
  }

  .filter-text {
    @apply block text-xs font-bold text-center text-blue-500 opacity-50 pointer-events-none;
  }

  .filter-group:hover .filter-img,
  .filter-group:hover .filter-text,
  .filter-group:focus .filter-img,
  .filter-group:focus .filter-text {
    @apply opacity-100;
  }
</style>