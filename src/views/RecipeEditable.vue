<script setup lang="ts">
  import { computed, reactive, ref, watch } from 'vue'
  import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router'
  import { useStore } from '../store'
  import { Recipe } from '../types'
  import { QuillEditor } from '@vueup/vue-quill'
  import '@vueup/vue-quill/dist/vue-quill.snow.css'

  import { getRecipeData, slugify } from '../utils'

  import ButtonDefault from '../components/button/ButtonDefault.vue'
  import InputSelect from '../components/input/InputSelect.vue'
  import InputToggle from '../components/input/InputToggle.vue'
  import RecipeImage from '../components/recipe/RecipeImage.vue'
  import RecipeIngredients from '../components/recipe/RecipeIngredients.vue'

  const route = useRoute()
  const router = useRouter()
  const store = useStore()

  const category = computed(() => store.getters['data/recipeCategory'])
  const diet = computed(() => store.getters['data/recipeDiet'])
  const draftText = computed(() => recipe.draft ? 'Draft mode active' : 'Draft mode disabled')
  const editor = ref()
  const editorOptions = {
    bounds: '#editor',
    debug: 'error',
    placeholder: 'Compose an epic...',
    readOnly: false,
    theme: 'snow'
  }
  const isImgUploaded = computed(() => {
    const checkImgSrc = RegExp(/^https:\/\//)
    return checkImgSrc.test(recipe.image)
  })
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
  const saveBtnText = computed(() => isSaving.value ? 'Saving...' : recipe.draft ? 'Save as Draft' : 'Save & Publish')
  const saveDisabled = computed(() => noChanges.value || isSaving.value ? true : false)

  const cancel = () => router.push({ name: 'Home' })

  const deleteRecipe = async () => {
    const confirm = window.confirm(`Deleting "${recipe.title}" - are you sure?`)
    if (confirm) {
      noChanges.value = true
      const currentId = route.params.refId.toString()
      const deleted = await store.dispatch('data/delete', currentId)
      return deleted !== 'error' ? cancel() : noChanges.value = false
    }
  }

  const getCurrentRecipeData = async () => {
    // on component creation: check mode and get recipe data from Vuex or DB if we're in `edit` mode
    if (mode.value && mode.value === 'edit') {
      const currentId = route.params.refId.toString()
      const currentItem = await getRecipeData(currentId)
      return currentItem !== 'error' && currentItem.data
        ? updateEditMode(currentItem.data)
        : cancel()
    }
  }

  const saveRecipe = async () => {
    const required = ['title', 'description', 'category', 'diet', 'ingredients', 'body']

    if (recipe.image.length > 0 && !isImgUploaded.value) {
      return alert('An image was selected, but not uploaded yet. Please upload or remove the image before saving.')
    }

    if (!recipe.draft && !validateInput(required)) {
      return alert(`Please fill all of the following fields: ${required.toString().replace(/\W/g,', ')}!`)
    } else {
      let publishedId = ''
      isSaving.value = true
  
      switch (mode.value) {
        case 'create':
          publishedId = await store.dispatch('data/create', recipe) // returns: new refId
          if (publishedId !== 'error') {
            if (!recipe.draft) {
              router.push({ path: `/recipe/${recipe.id}/${publishedId}` })
            } else {
              router.push({ path: `/edit/${publishedId}` })
            }
          } else {
            // error; there will be a toast and the next line will re-enable the save button to try again
            isSaving.value = false
          }
          break
  
        case 'edit':
          publishedId = route.params.refId.toString()
          let updated = await store.dispatch('data/update', [publishedId, recipe])
          if (!recipe.draft && updated !== 'error') {
            // navigate to the published recipe
            router.push({ path: `/recipe/${recipe.id}/${publishedId}` })
          } else {
            // stay on the page and work with local state
            // possibility to try again in case of an error
            isSaving.value = false
          }
          break
      
        default:
          break
      }
    }
  }
  
  const setRecipeId = () => recipe.id = slugify(recipe.title)

  const updateEditMode = (input: any) => { 
    Object.keys(input).map(key => updateRecipe(key, input[key]))
    editor.value.setHTML(recipe.body)
    setTimeout(() => {
      if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
    }, 250)
  }

  const updateRecipe = (key: string, value: any) => recipe[key] = value

  const validateInput = (requiredFields: string[]) => {
    let missing = 0
    
    requiredFields.forEach((reqKey) => {
      if (recipe[reqKey].length <= 0) return missing += 1
    })

    // check recipe for empty fields that should be filled
    // return false if anything's missing
    return missing <= 0 ? true : false
  }

  getCurrentRecipeData()

  watch(loggedIn, () => {
    // this WILL ignore the RouteLeave guard - we'll accept that for the time being
    if (!loggedIn.value) cancel()
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
      <input type="text" v-model="recipe.title" class="form-control mb-4" placeholder="A great title..." @input="setRecipeId" v-focus>
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
      <section id="editor">
        <QuillEditor v-model:content="recipe.body" ref="editor" contentType="html" :options="editorOptions" />
      </section>
      <div class="flex flex-col md:flex-row justify-center lg:justify-start mt-8">
        <ButtonDefault class="md:mr-4" :disabled="saveDisabled" @click="saveRecipe">{{ saveBtnText }}</ButtonDefault>
        <ButtonDefault class="my-4 md:my-0" @click="cancel">Cancel</ButtonDefault>
        <ButtonDefault v-if="mode === 'edit'" class="opacity-75 hover:opacity-100 md:ml-4" @click="deleteRecipe">Delete</ButtonDefault>
      </div>
    </div>
  </div>
</template>