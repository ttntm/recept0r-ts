<script setup lang="ts"> 
  const props = defineProps<{
    modelValue: string | undefined
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', val: string): void
  }>()

  const onInput = (evt: Event) => emit('update:modelValue', (evt.target as HTMLInputElement).value)
</script>

<template>
  <div class="search flex flex-row items-center flex-1" :class="{ 'input-group': modelValue }">
    <label for="search-input" class="sr-only">Search</label>
    <svg xmlns="http://www.w3.org/2000/svg" class="flex ml-4" width="25" height="25" viewBox="0 0 24 24" stroke-width="1.5" stroke="#234cad" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z"/>
      <circle cx="10" cy="10" r="7" />
      <line x1="21" y1="21" x2="15" y2="15" />
    </svg>
    <input :value="modelValue" type="text" class="w-full search-input" id="search-input" placeholder="What do you want to eat?" @input="onInput">
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