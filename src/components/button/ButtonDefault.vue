<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ButtonDefault',
  props: {
    title: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'button'
    }
  },
})
</script>

<template>
  <button class="btn btn-gray" :title="title" :type="type" v-click-blur>
    <slot></slot>
  </button>
</template>