<script setup lang="ts">
  import { computed, ref } from 'vue'
  import InputToggle from '@/components/input/InputToggle.vue'

  const props = defineProps<{
    ingredients: string[]
  }>()

  const modeText = computed<string>(() => showCheckboxes.value ? 'Shopping List' : 'List')
  const showCheckboxes = ref<boolean>(false)

  const events = {
    onChangeModeClick() {
      showCheckboxes.value = !showCheckboxes.value
    }
  }
</script>

<template>
  <h3 class="mb-2">Ingredients</h3>
  <InputToggle :modelValue="showCheckboxes" name="list-mode" @update:modelValue="events.onChangeModeClick()">
    Mode: {{ modeText }}
  </InputToggle>
  <ul :class="{ 'list-none p-0': showCheckboxes }" class="capitalize mb-0">
    <li v-for="(item, index) in ingredients" :key="index" class="text-blue-500 font-semibold mb-2">
      <label v-if="showCheckboxes" :for="`${index}_cb`" class="flex items-start gap-2 cursor-pointer">
        <input :id="`${index}_cb`" class="text-xl flex-shrink-0 mt-1 focus:shadow-outline" type="checkbox">
        <span class="">{{ item }}</span>
      </label>
      <span v-else>
        {{ item }}
      </span>
    </li>
  </ul>
</template>

<style lang="postcss" scoped>
  input[type=checkbox] {
    height: 1rem;
    width: 1rem;
  }

  :checked + span {
    text-decoration: line-through;
  }
</style>
