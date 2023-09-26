<script setup lang="ts">
  import Loading from '@/components/icon/loading.vue'
</script>

<template>
  <div class="text-center">
    <Loading class="mx-auto" />
    <p class="text-cool-gray-500 mt-12">
      <slot/>
    </p>
  </div>
</template>