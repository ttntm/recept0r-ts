<script setup lang="ts">
  interface Props {
    modelValue: string | undefined
    placeholder?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: undefined,
    placeholder: 'What do you want to eat?'
  })

  const emit = defineEmits<{
    (e: 'update:modelValue', val: string): void
  }>()

  const onInput = (evt: Event) => emit('update:modelValue', (evt.target as HTMLInputElement).value)
</script>

<template>
  <div class="search flex flex-row items-center flex-1" :class="{ 'input-group': modelValue }">
    <label for="search-input" class="sr-only">Search</label>
    <svg xmlns="http://www.w3.org/2000/svg" class="block flex-shrink-0 ml-4" width="32" height="32" viewBox="0 0 200 200">
      <path d="M154.05,150.51l-33.45-33.45c6.8-7.63,10.95-17.68,10.95-28.68,0-23.8-19.36-43.16-43.16-43.16s-43.16,19.36-43.16,43.16,19.36,43.16,43.16,43.16c11,0,21.05-4.14,28.68-10.94l33.45,33.45c.49.49,1.13.73,1.77.73s1.28-.24,1.77-.73c.98-.98.98-2.56,0-3.54ZM88.38,126.54c-21.04,0-38.16-17.12-38.16-38.16s17.12-38.16,38.16-38.16,38.16,17.12,38.16,38.16-17.12,38.16-38.16,38.16Z" fill="currentColor" stroke-width="5" stroke="currentColor" />
    </svg>
    <input :value="modelValue" type="text" class="w-full search-input" id="search-input" :placeholder="placeholder" @input="onInput">
    <div class="input-group-append">
      <button
        v-if="modelValue"
        @click="$emit('update:modelValue', '')"
        class="btn font-bold text-lg px-4 py-0"
        title="Clear search"
        aria-label="Clear search"
      >&times;</button>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
  .search {
    @apply w-1/2 shadow-sm bg-gray-500 rounded-lg;
  }

  .search:focus-within {
    @apply shadow-outline;
  }

  .search-input {
    @apply rounded-lg bg-gray-500 px-3 py-2;
    z-index: 3;
  }

  .search-input:focus {
    outline: 0;
    @apply shadow-none;
  }

  .input-group {
    @apply relative flex;
  }

  .input-group-append {
    @apply flex;
  }

  .input-group-append button {
    @apply relative rounded-tl-none rounded-bl-none shadow-none bg-gray-500;
    z-index: 2;
  }
</style>