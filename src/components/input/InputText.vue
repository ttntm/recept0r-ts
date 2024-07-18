<script setup lang="ts">
  const props = defineProps<{
    modelValue?: string,
    name: string,
    placeholder?: string
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', val: string): void
  }>()

  const onInput = (evt: Event) => emit('update:modelValue', (evt.target as HTMLInputElement).value)
</script>

<template>
  <div class="">
    <label :for="`i_${name}`" class="block text-cool-gray-500 font-semibold mb-1">
      {{ name }}
    </label>
    <input
      :value="modelValue"
      :id="`i_${name}`"
      :name="name"
      :placeholder="placeholder"
      type="text"
      class="form-control text-sm"
      @input="onInput"
    />
  </div>
</template>

<style lang="postcss" scoped>
  label {
    text-transform: capitalize;
  }
</style>