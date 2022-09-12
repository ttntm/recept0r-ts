<script setup lang="ts">
  import { computed, WritableComputedRef } from 'vue'
  
  const props = defineProps<{
    current: string,
    data: string[],
    name: string
  }>()

  const emit = defineEmits<{
    (e: 'update:select', val: string): void
  }>()
  
  const selected: WritableComputedRef<string> = computed({
    get(): string {
      return props.current
    },
    set(newVal: string): void {
      emit('update:select', newVal)
    }
  })
</script>

<template>
  <div class="relative mb-4">
    <select :name="name" :id="`select${name}`" v-model="selected" class="form-control text-sm appearance-none">
      <option disabled value="">
        <slot></slot>
      </option>
      <option v-for="(item, index) in data" :key="index" :value="item">{{ item }}</option>
    </select>
    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-cool-gray-500">
      <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
      </svg>
    </div>
  </div>
</template>