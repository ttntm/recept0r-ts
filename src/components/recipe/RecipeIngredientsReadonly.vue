<script setup lang="ts">
  import { computed, ref } from 'vue'
  import ButtonDefault from '@/components/button/ButtonDefault.vue'
  import InputToggle from '@/components/input/InputToggle.vue'

  const props = defineProps<{
    ingredients: string[]
  }>()

  const modeText = computed<string>(() => showCheckboxes.value ? 'Shopping List' : 'List')
  const showCheckboxes = ref<boolean>(true)

  const events = {
    onChangeModeClick() {
      showCheckboxes.value = !showCheckboxes.value
    },

    onResetButtonClick() {
      Array.from(document.querySelectorAll('.icb')).forEach((c) => (c as HTMLInputElement).checked = false)
    }
  }
</script>

<template>
  <h3 class="mb-2">Ingredients</h3>
  <InputToggle v-if="!showCheckboxes" :modelValue="showCheckboxes" name="list-mode" @update:modelValue="events.onChangeModeClick()">
    Mode: {{ modeText }}
  </InputToggle>
  <ul :class="{ 'list-none p-0': showCheckboxes }" class="capitalize mt-4 mb-0">
    <li v-for="(item, index) in ingredients" :key="index" class="text-blue-500 font-semibold mb-2">
      <label v-if="showCheckboxes" :for="`${index}_cb`" class="flex items-start gap-2 cursor-pointer">
        <input :id="`${index}_cb`" class="icb text-xl flex-shrink-0 mt-1 focus:shadow-outline" type="checkbox">
        <span class="">{{ item }}</span>
      </label>
      <span v-else>
        {{ item }}
      </span>
    </li>
    <li class="mt-6">
      <ButtonDefault class="btn-outline text-xs" @click="events.onResetButtonClick">
        Reset Ingredients
      </ButtonDefault>
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
