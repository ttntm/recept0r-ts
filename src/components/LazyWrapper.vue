<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { useIntersectionObserver } from '@/utils'

  const props = defineProps<{
    element: string
    className?: string
  }>()

  const shouldRender = ref(false)
  const targetEl = ref()

  onMounted(() => {  
    const { stop } = useIntersectionObserver(
      targetEl,
      ([{ isIntersecting }]) => {
        if (isIntersecting) {
          shouldRender.value = true
          stop()
        }
      },
      {
        rootMargin: '350px',
        threshold: 0.25
      }
    )
  })
</script>

<template>
  <component :is="element" :class="className" ref="targetEl">
    <slot v-if="shouldRender" />
  </component>
</template>