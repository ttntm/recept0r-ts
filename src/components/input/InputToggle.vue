<script setup lang="ts">
  const props = defineProps<{
    modelValue: boolean | undefined,
    name: string
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', val: boolean): void
  }>()

  const onInput = (evt: Event) => emit('update:modelValue', (evt.target as HTMLInputElement).checked)
</script>

<template>
  <div class="flex justify-start items-center mb-4">
    <div
      :class="{ 'bg-blue-500' : modelValue, 'bg-cool-gray-500' : !modelValue }"
      class="toggle"
    >
      <label
        :for="name"
        :class="{ 'translate-x-full border-gray-900' : modelValue, 'translate-x-0 border-gray-700' : !modelValue }"
        class="absolute left-0 bg-gray-500 border mb-2 w-6 h-6 rounded-full shadow-sm transition transform duration-100 ease-linear cursor-pointer"
      ></label>
      <input type="checkbox"
        :id="name"
        :name="name"
        :checked="modelValue"
        class="appearance-none w-full h-full outline-none cursor-pointer rounded-full focus:outline-none focus:shadow-none"
        @click="onInput"
      />
    </div>
    <span class="block transition-all duration-200 ml-4">
      <slot></slot>
    </span>
  </div>
</template>

<style lang="postcss" scoped>
  .toggle {
    @apply relative rounded-full w-12 h-6 flex-shrink-0 shadow-inner transition duration-200 ease-linear;
  }

  .toggle:focus-within {
    @apply shadow-outline;
  }
</style>