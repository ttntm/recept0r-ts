<script setup lang="ts">
  import { computed } from 'vue'

  import IconResolver from '@/components/icon/IconResolver.vue'

  const props = defineProps<{
    diet?: string | string[]
  }>()

  const displayData = computed<string[] | undefined>(() => {
    const d = props.diet
    return typeof d === 'string' ? [d] : d
  })
</script>

<template>
  <ul class="list-none flex items-center gap-4 p-0 m-0">
    <li
      v-for="(item, index) in displayData"
      :key="index"
      :title="item"
    >
      <IconResolver :icon="item" class="diet-img" />
    </li>
  </ul>
</template>

<style lang="postcss" scoped>
  .diet-img {
    --size: 75px;

    @apply border border-cool-gray-500 rounded;
    width: var(--size);
    height: var(--size);
  }
</style>