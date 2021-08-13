<script setup lang="ts">
  import { computed, reactive, ref, watch } from 'vue'
  import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router'
  import { useStore } from '../store'
  import { Recipe } from '../types'

  import { slugify } from '../utils'

  import ButtonDefault from '../components/button/ButtonDefault.vue'
  import InputSelect from '../components/input/InputSelect.vue'
  import InputToggle from '../components/input/InputToggle.vue'
  import RecipeImage from '../components/recipe/RecipeImage.vue'
  import RecipeIngredients from '../components/recipe/RecipeIngredients.vue'
  import RecipeTextEditor from '../components/recipe/RecipeTextEditor.vue'

  const route = useRoute()
  const router = useRouter()
  const store = useStore()

  const category = computed(() => store.getters['data/recipeCategory'])
  const diet = computed(() => store.getters['data/recipeDiet'])
  const draftText = computed(() => recipe.draft ? 'Draft mode active' : 'Draft mode disabled')
  const isSaving = ref(false)
  const loggedIn = computed(() => store.getters['user/loggedIn'])
  const me = computed(() => store.getters['user/currentUser'])
  const mode = computed(() => route.meta.mode)
  const noChanges = ref(true)
  const recipe: Recipe = reactive({
    id: '',
    draft: true,
    title: '',
    category: '',
    description: '',
    diet: '',
    duration: '30 min / 1 h',
    image: '',
    ingredients: [],
    owner: me.value ? me.value.id : '', // empty ID should technically be impossible (can't be seeing this omponent without login), this is just for DEV purposes
    portions: '4 portions',
    body: '<h1>About this Recipe</h1><p>About text</p><h1>Instructions</h1><p>What to do...</p><ol><li>first</li><li>second</li><li>third</li></ol><h1>Notes</h1><p>Notes and remarks</p><p>Also a link: <a href=\"https://other.site\" rel=\"noopener noreferrer\" target=\"_blank\">Link to some other site</a></p>'
  })
  const saveBtnText = computed(() => recipe.draft ? 'Save as Draft' : isSaving.value ? 'Saving...' : 'Save & Publish')
  const saveDisabled = computed(() => noChanges.value || isSaving.value ? true : false)

  const cancelCreate = () => router.push({ name: 'Home' })

  const deleteRecipe = () => alert('Deleting...')
  
  // this function must:
  //    - distinguish between `mode` values
  //    - redirect to the readonly recipe when done
  const saveRecipe = () => alert(JSON.stringify(recipe))
  
  const setRecipeId = () => recipe.id = slugify(recipe.title)

  const updateRecipe = (key: string, value: any) => recipe[key] = value

  // on component creation: check mode and get recipe data from Vuex or DB if we're in `edit` mode
  if (mode.value && mode.value === 'edit') {
    const currentId = route.params.refId.toString()
    // const existing = await getRecipeData(currentId)
    // if (existing.refId === currentId) {
    //   Object.assign(recipe, existing)
    //   recipe.draft = false
    // }
    recipe.title = currentId
    recipe.draft = false
  }

  watch(loggedIn, () => {
    if (!loggedIn.value) cancelCreate()
  })

  // check for changes to the initial state of the `recipe` object
  // current will start existing right after the first user interaction,
  // which is reason enough to trigger the navigation guard/cancel confirmation
  watch(recipe, (current, old) => {
    if (current) noChanges.value = false
  })

  onBeforeRouteLeave((to, from) => {
    if (loggedIn.value && !noChanges.value && !isSaving.value) {
      const answer = window.confirm('Do you really want to leave? There might be unsaved changes!')
      if (!answer) return false
    }
  })
</script>

<template>
  <div id="create-recipe" class="w-full md:w-4/5 flex flex-row flex-wrap mx-auto">
    <div class="w-full md:w-1/2">
      <h3>Image</h3>
      <img v-if="recipe.image" class="rounded-lg mt-4 mb-4" :src="recipe.image" :alt="recipe.title">
      <RecipeImage :currentImage="recipe.image" :recipe="recipe.id" @update:image="updateRecipe('image', $event)" class="mb-4" />
    </div>
    <div class="w-full md:w-1/2 md:pl-8">
      <h3 class="">Recipe Title</h3>
      <input type="text" v-model="recipe.title" ref="recipeTitle" class="form-control mb-4" placeholder="A great title..." @input="setRecipeId" v-focus>
      <h4 class="mb-4">Description</h4>
      <input type="text" v-model="recipe.description" class="form-control mb-4" placeholder="A fancy description...">
    </div>
    <div class="w-full md:w-1/2">
      <h4 class="mb-4">Metadata</h4>
      <InputToggle v-model="recipe.draft" name="draft" @update:modelValue="updateRecipe('draft', $event)">{{ draftText }}</InputToggle>
      <input type="text" v-model="recipe.portions" class="form-control text-sm mb-4" placeholder="Portions; how many people does this recipe serve?">
      <input type="text" v-model="recipe.duration" class="form-control text-sm mb-4" placeholder="Duration; how long does it take to cook this?">
      <InputSelect :current="recipe.diet" :data="diet" name="diet" class="relative mb-4" @update:select="updateRecipe('diet', $event)">
        Please select a diet
      </InputSelect>
      <InputSelect :current="recipe.category" :data="category" name="category" class="relative mb-4" @update:select="updateRecipe('category', $event)">
        Please select a category
      </InputSelect>
    </div>
    <div class="w-full md:w-1/2 md:pl-8 mb-4">
      <h4 class="mb-4">Ingredients</h4>
      <RecipeIngredients :input="recipe.ingredients" @update:ingredients="updateRecipe('ingredients', $event)" />
    </div>
    <div class="w-full">
      <h4 class="mb-4">Instructions</h4>
      <RecipeTextEditor :input="recipe.body" @update:editor="updateRecipe('body', $event)" />
      <div class="flex flex-row justify-center lg:justify-start mt-8">
        <ButtonDefault class="mr-4" :disabled="saveDisabled" @click="saveRecipe">{{ saveBtnText }}</ButtonDefault>
        <ButtonDefault @click="cancelCreate">Cancel</ButtonDefault>
        <ButtonDefault v-if="mode === 'edit'" class="opacity-75 hover:opacity-100 ml-4" @click="deleteRecipe">Delete</ButtonDefault>
      </div>
    </div>
  </div>
</template>