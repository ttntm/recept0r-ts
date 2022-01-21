<script setup lang="ts">
  import { nextTick, ref, watch } from 'vue'
  import draggable from 'vuedraggable'

  import ButtonDefault from '@/components/button/ButtonDefault.vue'
  import ButtonX from '@/components/button/ButtonX.vue'

  const props = defineProps<{
    input: string[],
    mode: string
  }>()

  const emit = defineEmits<{
    (e: 'update:ingredients', val?: string[]): void
  }>()

  const drag = ref(false)
  // create a new array based on the input prop so we don't run into problems with reactivity
  const ingredients = ref<{ id: number, name: string }[]>([])
  // the Vue 3 way of handling refs based on v-for -- see: https://v3.vuejs.org/guide/composition-api-template-refs.html#usage-inside-v-for
  const inputs = ref<{ [el: string]: any }[]>([])

  watch(() => props.input, currentVal => ingredients.value = objectify(currentVal))

  const objectify = (arr: string[]) => {
    return arr.map((el, index) => { 
      return { id: index, name: el }
    })
  }

  const valuefy = (arr: { id: number, name: string }[]) => arr.map(el => el.name)

  const events = {
    async onAddItem(index?: number) {
      let currentEl = null
      let ing = ingredients.value
      let inputEls = inputs.value
      
      if (index !== undefined && index > -1) {
        ing.splice(index + 1, 0, { id: index+1, name: '' })
        await nextTick() // await next tick to avoid 'x is undefined...' errors
        currentEl = inputEls[index+1]
      } else {
        ing.push({ id: ing.length, name: '' })
        await nextTick() // await next tick to avoid 'x is undefined...' errors
        currentEl = inputEls[inputEls.length-1]
      }
      
      if (currentEl) currentEl.focus()
    },

    onRemoveItem(index: number) {    
      ingredients.value.splice(index, 1)
      inputs.value.splice(index, 1)
      emit('update:ingredients', valuefy(ingredients.value))
    }
  }

  ingredients.value = objectify(props.input)
</script>

<template>
  <div id="recipe-ingredients">
    <draggable
      tag="ul"
      :list="ingredients"
      item-key="id"
      class="ing-list mb-0"
      @start="drag=true"
      @end="drag=false"
    >
      <template #item="{ element, index }">
        <li>
          <span class="flex flex-row items-center mb-4">
            <input type="text"
              v-model.trim="element.name"
              :placeholder="`Ingredient ${index + 1}`"
              :ref="el => { if (el) inputs[index] = el }"
              class="inline-block form-control text-sm"
              @input="$emit('update:ingredients', valuefy(ingredients))"
              @keydown.enter="events.onAddItem(index)"
            >
            <ButtonX size="20" class="rounded-full text-gray-700 hover:text-gray-900 focus:text-gray-900 p-1 ml-2" @click="events.onRemoveItem(index)" />
          </span>
        </li>
      </template>
    </draggable>
    <ButtonDefault class="block text-sm mx-auto" @click="events.onAddItem()">Add Ingredient</ButtonDefault>
  </div>
</template>