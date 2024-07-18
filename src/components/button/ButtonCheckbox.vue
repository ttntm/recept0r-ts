<script setup lang="ts">
  const props = defineProps<{
    id: string,
    modelValue: boolean,
    text: string
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', val?: { name: string, selected: boolean}): void
  }>()

  const onInput = (evt: Event) => emit('update:modelValue', {
    name: (evt.target as HTMLInputElement).name,
    selected: (evt.target as HTMLInputElement).checked
  })
</script>

<template>
  <div class="flex">
    <input
      :id="id"
      :checked="modelValue"
      :name="text"
      type="checkbox"
      class="hidden"
      @input="onInput"
    />
    <label :for="id" class="btn btn-gray text-sm select-none cursor-pointer px-4 py-1">
      {{ text }}
    </label>
  </div>
</template>

<style lang="postcss" scoped>
  input[type=checkbox]:checked + label {
    @apply border-cool-gray-500 bg-cool-gray-500;
    transition: transform .25 ease-in-out;
  }

  input[type=checkbox]:active + label {
    transform: translateY(4px);
  }
</style>