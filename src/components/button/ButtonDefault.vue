<script setup lang="ts">
  interface Props {
    title?: string
    type?: 'button' | 'submit' | 'reset' | undefined
  }

  const props = withDefaults(defineProps<Props>(), {
    title: '',
    type: 'button'
  })
</script>

<template>
  <button class="btn btn-gray" :title="title" :type="type" v-click-blur>
    <slot></slot>
  </button>
</template>