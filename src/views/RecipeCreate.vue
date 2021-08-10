<script lang="ts">
  import { computed, defineComponent, reactive, ref, watch } from 'vue'
  import { onBeforeRouteLeave, useRouter } from 'vue-router'
  import { useStore } from '../store'
  import { Recipe } from '../types'

  import { slugify } from '../utils'

  import ButtonDefault from '../components/button/ButtonDefault.vue'
  import InputSelect from '../components/input/InputSelect.vue'
  import InputToggle from '../components/input/InputToggle.vue'
  import RecipeIngredients from '../components/recipe/RecipeIngredients.vue'

  export default defineComponent({
    name: 'Create',
    components: {
      ButtonDefault,
      InputSelect,
      InputToggle,
      RecipeIngredients
    },
    directives: {
      focus: {
        mounted(el) {
          el.focus();
        }
      }
    },
    setup() {
      const router = useRouter()
      const store = useStore()

      const isEmpty = ref(true)
      const isSaving = ref(false)
      const loggedIn = computed(() => store.getters['user/loggedIn'])
      const me = computed(() => store.getters['user/currentUser'])
      const newRecipe: Recipe = reactive({
        id: '',
        draft: true,
        title: '',
        category: '',
        description: '',
        diet: '',
        duration: '30 min / 1 h',
        image: '',
        ingredients: [],
        owner: me.value ? me.value.id : '', // empty ID should technically be impossible, this is just for DEV purposes
        portions: '4 portions',
        body: {}
      })

      const cancelCreate = () => router.push({ name: 'Home' })
      
      const setRecipeId = () => newRecipe.id = slugify(newRecipe.title)

      const submitRecipe = () => alert(JSON.stringify(newRecipe))

      const updateRecipe = (key: string, value: any) => newRecipe[key] = value

      watch(loggedIn, () => {
        if (!loggedIn.value) cancelCreate()
      })

      // check for changes to the initial state of the `newRecipe` object
      // current will start existing right after the first user interaction,
      // which is reason enough to trigger the navigation guard/cancel confirmation
      watch(newRecipe, (current, old) => {
        if (current) isEmpty.value = false
      })

      onBeforeRouteLeave((to, from) => {
        if (loggedIn.value && !isEmpty.value && !isSaving.value) {
          const answer = window.confirm('Do you really want to leave? There might be unsaved changes!')
          if (!answer) return false
        }
      })

      return {
        cancelCreate,
        category: computed(() => store.getters['data/recipeCategory']),
        diet: computed(() => store.getters['data/recipeDiet']),
        draftText: computed(() => newRecipe.draft ? 'Draft mode active' : 'Draft mode disabled'),
        isDisabled: computed(() => isEmpty.value || isSaving.value ? true : false),
        newRecipe,
        saveBtnText: computed(() => newRecipe.draft ? 'Save Draft' : isSaving.value ? 'Saving...' : 'Save'),
        setRecipeId,
        submitRecipe,
        updateRecipe
      }
    },
  })
</script>

<template>
  <div id="create-recipe" class="w-full md:w-4/5 flex flex-row flex-wrap mx-auto">
    <div class="w-full md:w-1/2">
      <h3>Image</h3>
      <img v-if="newRecipe.image" class="rounded-lg mt-4 mb-4" :src="newRecipe.image" :alt="newRecipe.title">
      <!-- <RecipeImage :recipe="recipe" @image:update="imageUpdate" class="mb-4" /> -->
    </div>
    <div class="w-full md:w-1/2 md:pl-8">
      <h3 class="">Recipe Title</h3>
      <input type="text" v-model="newRecipe.title" ref="recipeTitle" class="form-control mb-4" placeholder="A great title..." @input="setRecipeId" v-focus>
      <h4 class="mb-4">Description</h4>
      <input type="text" v-model="newRecipe.description" class="form-control mb-4" placeholder="A fancy description...">
    </div>
    <div class="w-full md:w-1/2">
      <h4 class="mb-4">Metadata</h4>
      <InputToggle v-model="newRecipe.draft" name="draft" @update:modelValue="updateRecipe('draft', $event)">{{ draftText }}</InputToggle>
      <input type="text" v-model="newRecipe.portions" class="form-control text-sm mb-4" placeholder="Portions; how many people does this recipe serve?">
      <input type="text" v-model="newRecipe.duration" class="form-control text-sm mb-4" placeholder="Duration; how long does it take to cook this?">
      <InputSelect :current="newRecipe.diet" :data="diet" @update:select="updateRecipe('diet', $event)" class="relative mb-4">
        Please select a diet
      </InputSelect>
      <InputSelect :current="newRecipe.category" :data="category" @update:select="updateRecipe('category', $event)" class="relative mb-4">
        Please select a category
      </InputSelect>
    </div>
    <div class="w-full md:w-1/2 md:pl-8 mb-4">
      <h4 class="mb-4">Ingredients</h4>
      <RecipeIngredients :input="newRecipe.ingredients" @update:ingredients="updateRecipe('ingredients', $event)" />
    </div>
    <div class="w-full">
      <h4 class="mb-4">Instructions</h4>
      <!-- <RecipeEditor :editing="true" :editorContent="newRecipe.body" @editor:update="editorUpdate" /> -->
      <hr class="my-8">
      <div class="flex flex-row justify-center lg:justify-start">
        <ButtonDefault class="mr-4" :disabled="isDisabled" @click="submitRecipe">{{ saveBtnText }}</ButtonDefault>
        <ButtonDefault @click="cancelCreate">Cancel</ButtonDefault>
      </div>
    </div>
  </div>
</template>