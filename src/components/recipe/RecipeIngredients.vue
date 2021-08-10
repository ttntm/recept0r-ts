<script lang="ts">
  import { defineComponent, nextTick, ref } from 'vue'

  import ButtonDefault from '../button/ButtonDefault.vue'

  export default defineComponent({
    name: 'RecipeIngredients',
    components: {
      ButtonDefault
    },
    directives: {
      focus: {
        mounted(el) {
          el.focus();
        }
      }
    },
    props: {
      input: Array
    },
    emits: ['update:ingredients'],
    setup(props, { emit }) {
      // create a new array based on the input prop
      const ingredients = ref(Array.prototype.concat(props.input))
      
      // the Vue 3 way of handling refs based on v-for -- see:
      // https://v3.vuejs.org/guide/composition-api-template-refs.html#usage-inside-v-for
      const inputs: {[el: string]: any} = ref([])

      const addItem = async (index: number) => {
        let ing = ingredients.value
        let inputEls = inputs.value
        
        if (index > -1) {
          ing.splice(index + 1, 0, '')
          // await next tick to avoid 'x is undefined...' errors
          await nextTick()
          // set focus on the spliced item
          inputEls[index+1].focus()
        } else {
          ing.push('')
        }
      }

      const removeItem = (index: number) => {
        let ing = ingredients.value
        return index > -1 ? ing.splice(index, 1) : ing.splice(ing.length - 1)
      }

      return {
        addItem,
        ingredients,
        inputs,
        removeItem
      }
    },
  })
</script>

<template>
  <div id="recipe-ingredients">
    <ul class="ing-list mb-0">
      <li v-for="(ing, index) in ingredients" :key="index">
        <span class="flex flex-row items-center mb-4">
          <input type="text"
            v-model.trim="ingredients[index]"
            :placeholder="`Ingredient ${index + 1}`"
            :ref="el => { if (el) inputs[index] = el }"
            class="inline-block form-control text-sm"
            @input="$emit('update:ingredients', ingredients)"
            @keydown.enter="addItem(index)"
            v-focus
          >
          <button class="inline-block text-lg focus:outline-none opacity-75 hover:opacity-100 ml-2" @click="removeItem(index)">&times;</button>
        </span>
      </li>
    </ul>
    <ButtonDefault class="block text-sm mx-auto" @click="addItem()">Add Ingredient</ButtonDefault>
  </div>
</template>