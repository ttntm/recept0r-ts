<script setup lang="ts">
  import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
  import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router'
  import { useStore } from '@/store'
  import type { Recipe, User } from '@/types'
  import { getRecipeData, isImgUploaded, slugify } from '@/utils'
  import '@vueup/vue-quill/dist/vue-quill.snow.css'

  import ButtonDefault from '@/components/button/ButtonDefault.vue'
  import ButtonDelete from '@/components/button/ButtonDelete.vue'
  import ButtonDuplicate from '@/components/button/ButtonDuplicate.vue'
  import InputSelect from '@/components/input/InputSelect.vue'
  import InputToggle from '@/components/input/InputToggle.vue'
  import { QuillEditor } from '@vueup/vue-quill'
  import RecipeImage from '@/components/recipe/RecipeImage.vue'
  import RecipeIngredients from '@/components/recipe/RecipeIngredients.vue'

  const route = useRoute()
  const router = useRouter()
  const store = useStore()

  const editor = ref()
  const isDeleted = ref(false)
  const isSaving = ref(false)
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
    owner: '',
    portions: '4 portions',
    body: '<h2>About this Recipe</h2><p>About text</p><h2>Instructions</h2><p>What to do...</p><ol><li>first</li><li>second</li><li>third</li></ol><h2>Notes</h2><p>Notes and remarks</p><p>Also a link: <a href=\"https://other.site\" rel=\"noopener noreferrer\" target=\"_blank\">Link to some other site</a></p>'
  })
  const title = ref()
  
  const category = computed<string[]>(() => store.getters['data/recipeCategory'])
  const diet = computed<string[]>(() => store.getters['data/recipeDiet'])
  const draftText = computed<string>(() => recipe.draft ? 'Draft mode active' : 'Draft mode disabled')
  const loggedIn = computed<boolean>(() => store.getters['user/loggedIn'])
  const me = computed<User>(() => store.getters['user/currentUser'])
  const mode = computed<string>(() => route.meta.mode ? route.meta.mode : '')
  const saveBtnText = computed<string>(() => isSaving.value ? 'Saving...' : recipe.draft ? 'Save Draft' : 'Publish')
  const saveDisabled = computed<boolean>(() => noChanges.value || isSaving.value ? true : false)

  // set owner before starting to watch 'recipe' for changes
  if (me.value) recipe.owner = me.value.id

  // this WILL ignore the 'onBeforeRouteLeave' guard - we'll accept that for the time being...
  watch(loggedIn, () => {
    if (!loggedIn.value) events.onCancel()
  })

  // check for changes to the initial state of the `recipe` object
  watch(recipe, (current, old) => {
    if (current) noChanges.value = false
    if (current.title && (mode.value && mode.value !== 'create')) {
      document.title = `Editing: ${current.title} - recept0r`
    }
  })

  onMounted(() => {
    if (mode.value && mode.value !== 'edit') title.value.focus()
    window.addEventListener('beforeunload', events.onEditClose)
  })

  onBeforeRouteLeave((to, from) => {
    if (loggedIn.value && !noChanges.value && !isSaving.value) {
      const answer = isDeleted.value
        ? true
        : window.confirm('Do you really want to leave? There might be unsaved changes!')
      if (!answer) return false
    }
  })

  onUnmounted(() => window.removeEventListener('beforeunload', events.onEditClose))

  const editorHrPattern = /\<p\>\&lt\;hr\&gt\;\<\/p\>/gi
  const editorOptions = {
    bounds: '#editor',
    debug: 'error',
    placeholder: 'Compose an epic...',
    readOnly: false,
    theme: 'snow'
  }

  const getCurrentRefId = () => route.params.refId.toString()

  const getCurrentRecipeData = async () => {
    // on component creation: check mode and get recipe data from Vuex or DB if we're in `edit` mode
    if (mode.value && mode.value === 'edit') {
      const currentId = getCurrentRefId()
      const currentItem = await getRecipeData(currentId)
      return currentItem !== 'error' && currentItem.data
        ? updateEditMode(currentItem.data)
        : events.onCancel()
    }
  }

  const updateEditMode = (input: Recipe) => { 
    Object.keys(input).map(key => events.onUpdateRecipe(key, input[key]))
    // We've got to add in a marker for <hr> elements that will actually get rendered by Quill
    // `onSaveRecipe()` converts it back to valid HTML
    editor.value.setHTML(recipe.body.replaceAll('<hr>', '<p>&lt;hr&gt;</p>'))
  }

  const validateInput = (requiredFields: string[]) => {
    let missing = 0
    
    requiredFields.forEach((reqKey) => {
      if (recipe[reqKey].length <= 0) return missing += 1
    })
    
    return missing <= 0 ? true : false
  }

  const events = {
    onCancel(goHome: boolean = true) {
      if (goHome || mode.value === 'create') { 
        router.push({ name: 'All Recipes' })
      } else {
        return recipe.draft
          ? router.push({ name: 'My Recipes' })
          : router.push({ name: 'Recipe', params: { id: recipe.id, refId: getCurrentRefId() } })
      }
    },
    
    onEditClose(e: BeforeUnloadEvent) {
      if (!noChanges.value && !isSaving.value) {
        e.preventDefault() // FF
        e.returnValue = '' // Chrome
      } else {
        delete e['returnValue']
      }
    },

    async onSaveRecipe() {
      const required = ['title', 'description', 'category', 'diet', 'ingredients', 'body']

      if (recipe.image.length > 0 && !isImgUploaded(recipe.image)) {
        return alert('An image was selected, but not uploaded yet. Please upload or remove the image before saving.')
      }

      if (!recipe.draft && !validateInput(required)) {
        return alert(`Please fill all of the following fields: ${required.toString().replace(/\W/g,', ')}!`)
      }

      if (editorHrPattern.test(recipe.body)) {
        // Replace <hr> marker with valid HTML
        recipe.body = recipe.body.replaceAll(editorHrPattern, '<hr>')
      }
      
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
    },

    onTitleChange() {
      recipe.id = slugify(recipe.title)
    },

    onUpdateRecipe(key: string, value: any) {
      recipe[key] = value
    }
  }

  getCurrentRecipeData()
</script>

<template>
  <div id="create-recipe" class="w-full md:w-4/5 flex flex-row flex-wrap mx-auto">
    <div class="w-full md:w-1/2">
      <h4>Image</h4>
      <img v-if="recipe.image" class="rounded-lg mt-4 mb-4" :src="recipe.image" :alt="recipe.title">
      <RecipeImage :currentImage="recipe.image" :recipe="recipe.id" @update:image="events.onUpdateRecipe('image', $event)" class="mb-4" />
    </div>
    <div class="w-full md:w-1/2 md:pl-8">
      <h4 class="">Recipe Title</h4>
      <input type="text" v-model.trim="recipe.title" ref="title" class="form-control mb-4" placeholder="A great title..." @input="events.onTitleChange">
      <h4 class="mb-4">Description</h4>
      <input type="text" v-model.trim="recipe.description" class="form-control mb-4" placeholder="A fancy description...">
    </div>
    <div class="w-full md:w-1/2">
      <h4 class="mb-4">Metadata</h4>
      <InputToggle v-model="recipe.draft" name="draft" @update:modelValue="events.onUpdateRecipe('draft', $event)">{{ draftText }}</InputToggle>
      <input type="text" v-model.trim="recipe.portions" class="form-control text-sm mb-4" placeholder="Portions; how many people does this recipe serve?">
      <input type="text" v-model.trim="recipe.duration" class="form-control text-sm mb-4" placeholder="Duration; how long does it take to cook this?">
      <InputSelect :current="recipe.diet" :data="diet" name="diet" class="relative mb-4" @update:select="events.onUpdateRecipe('diet', $event)">
        Please select a diet
      </InputSelect>
      <InputSelect :current="recipe.category" :data="category" name="category" class="relative mb-4" @update:select="events.onUpdateRecipe('category', $event)">
        Please select a category
      </InputSelect>
    </div>
    <div class="w-full md:w-1/2 md:pl-8 mb-4">
      <h4 class="mb-2">Ingredients</h4>
      <RecipeIngredients :input="recipe.ingredients" :mode="mode" @update:ingredients="events.onUpdateRecipe('ingredients', $event)" />
    </div>
    <div class="w-full">
      <h4 class="mb-4">Instructions</h4>
      <section id="editor">
        <QuillEditor v-model:content="recipe.body" ref="editor" contentType="html" :options="editorOptions" />
      </section>
      <div class="flex flex-col md:flex-row items-center justify-between mt-8">
        <div class="flex w-full sm:w-auto">
          <ButtonDefault class="w-full sm:w-auto mr-4" :disabled="saveDisabled" @click="events.onSaveRecipe()">
            {{ saveBtnText }}
          </ButtonDefault>
          <ButtonDefault class="w-full sm:w-auto" @click="events.onCancel(false)">
            Cancel
          </ButtonDefault>
        </div>
        <div v-if="mode === 'edit'" class="flex mt-4 md:mt-0">
          <ButtonDelete :id="getCurrentRefId()" :title="recipe.title" @event:delete="() => isDeleted = true" class="mr-4" />
          <ButtonDuplicate :recipe="recipe" />
        </div>
      </div>
    </div>
  </div>
</template>