<script setup lang="ts">
  import { ref } from 'vue'
  import { QuillEditor } from '@vueup/vue-quill'
  import '@vueup/vue-quill/dist/vue-quill.snow.css'

  const props = defineProps<{
    input: string
  }>()

  const emit = defineEmits<{
    (e: 'update:editor', val: string): void
  }>()

  const editorContent = ref('')

  const editorOptions = {
    bounds: '#editor',
    debug: 'info',
    placeholder: 'Compose an epic...',
    readOnly: false,
    theme: 'snow'
  }

  editorContent.value = props.input
</script>

<template>
  <section id="editor">
    <QuillEditor v-model:content="editorContent"  contentType="html" :options="editorOptions" @update:content="$emit('update:editor', editorContent)" />
  </section>
</template>