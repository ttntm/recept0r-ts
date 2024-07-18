<script setup lang="ts">
  import IconResolver from '@/components/icon/IconResolver.vue'

  const props = defineProps<{
    icon?: string
    text?: string
  }>()
</script>

<template>
  <div class="recipe-meta">
    <IconResolver :icon="String(icon)" class="icon mr-4" />
    <p class="text-blue-500 m-0">
      {{ text }}
    </p>
  </div>
</template>

<style lang="postcss" scoped>
  .recipe-meta {
    @apply flex-1 flex flex-row items-center justify-start px-4;

    & .icon {
      --size: 32px;

      height: var(--size);
      width: var(--size);
    }
  }
</style>