<script setup lang="ts">
  import { computed } from 'vue'
  import type { DietMap } from '@/types'

  import ButtonCheckbox from '@/components/button/ButtonCheckbox.vue'
  import ButtonDefault from '@/components/button/ButtonDefault.vue'

  const props = defineProps<{
    data: string[],
    selected: string | string[]
  }>()

  const emit = defineEmits<{
    (e: 'update:diet', val?: string[]): void
  }>()

  const dietList = computed<DietMap>(() => {
    const o: DietMap = {}

    for (const d of props.data) {
      if (d === props.selected || props.selected?.includes(d)) {
        o[d] = true
      } else {
        o[d] = false
      }
    }

    return o
  })

  const onDietChange = (newVal: { name: string, selected: boolean } | undefined) => {
    const {
      name,
      selected
    } = newVal ?? {}
    const dietSelected: string[] = []

    if (name && !!selected) {
      dietSelected.push(name)
    }

    for (const key in dietList.value) {
      if (key !== name && dietList.value[key] === true) {
        dietSelected.push(key)
      }
    }

    emit('update:diet', dietSelected)
  }
</script>

<template>
  <div id="recipe-ingredients" class="mb-4">
    <h2>Diet Selection</h2>
    <ul class="list-none flex flex-row flex-wrap items-center gap-4 p-0 m-0">
      <ButtonCheckbox
        v-for="(value, name, index) in dietList"
        :key="index"
        :text="String(name)"
        :id="`d_${index}`"
        :model-value="value"
        @update:model-value="onDietChange"
      />
      <ButtonDefault
        title="Clear Diet Selection"
        class="text-sm select-none cursor-pointer px-4 py-1"
        @click="$emit('update:diet', [])"
      >
        &times;
      </ButtonDefault>
    </ul>
  </div>
</template>