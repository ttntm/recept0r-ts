<script setup lang="ts">
  import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
  import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router'
  import { useStore } from '@/store'
  import type { Recipe, User } from '@/types'
  import { getRecipeData, slugify } from '@/utils'
  import { isImgUploaded } from '@/utils/useCloudinary'
  import '@vueup/vue-quill/dist/vue-quill.snow.css'

  import ButtonDefault from '@/components/button/ButtonDefault.vue'
  import ButtonDelete from '@/components/button/ButtonDelete.vue'
  import ButtonDuplicate from '@/components/button/ButtonDuplicate.vue'
  import InputSelect from '@/components/input/InputSelect.vue'
  import InputText from '@/components/input/InputText.vue'
  import InputToggle from '@/components/input/InputToggle.vue'
  import { QuillEditor } from '@vueup/vue-quill'
  import RecipeDiet from '@/components/recipe/RecipeDiet.vue'
  import RecipeImage from '@/components/recipe/RecipeImage.vue'
  import RecipeIngredients from '@/components/recipe/RecipeIngredients.vue'

  const route = useRoute()
  const router = useRouter()
  const store = useStore()

  const editor = ref()
  const isDeleted = ref(false)
  const isDraftSelected = ref(true)
  const isSaving = ref(false)
  const noChanges = ref(true)
  const recipe: Recipe = reactive({
    slug: '',
    owner: '',
    title: '',
    description: '',
    image: '',
    portions: '4 portions',
    preparation: '30 min',
    duration: '30 min / 1 h',
    calories: '',
    diet: [],
    category: '',
    ingredients: [],
    body: '<h2>About this Recipe</h2><p>About text</p><h2>Instructions</h2><p>What to do...</p><ol><li>first</li><li>second</li><li>third</li></ol><h2>Notes</h2><p>Notes and remarks</p><p>Also a link: <a href=\"https://other.site\" rel=\"noopener noreferrer\" target=\"_blank\">Link to some other site</a></p>',
    status: 'draft'
  })
  const title = ref()

  const categories = computed<string[]>(() => store.getters['data/recipeCategory'])
  const diets = computed<string[]>(() => store.getters['data/recipeDiet'])
  const draftText = computed<string>(
    () => isDraft.value
      ? 'Draft mode active'
      : 'Draft mode disabled'
  )
  const isDraft = computed<boolean>(() => recipe.status === 'draft')
  const loggedIn = computed<boolean>(() => store.getters['user/loggedIn'])
  const me = computed<User>(() => store.getters['user/currentUser'])
  const mode = computed<string>(() => route.meta.mode ? route.meta.mode : '')
  const saveBtnText = computed<string>(
    () => isSaving.value
      ? 'Saving...'
      : isDraft.value
        ? 'Save Draft'
        : 'Publish'
  )
  const saveDisabled = computed<boolean>(() => noChanges.value || isSaving.value)

  // set owner before starting to watch 'recipe' for changes
  if (me.value) {
    recipe.owner = me.value.id
  }

  watch(isDraftSelected, (current, old) => {
    if (current) {
      recipe.status = current
        ? 'draft'
        : 'published'
    }
  })

  // this WILL ignore the 'onBeforeRouteLeave' guard - we'll accept that for the time being...
  watch(loggedIn, () => {
    if (!loggedIn.value) {
      events.onCancel()
    }
  })

  // check for changes to the initial state of the `recipe` object
  watch(recipe, (current, old) => {
    if (current) {
      noChanges.value = false
    }

    if (current.title && (mode.value && mode.value !== 'create')) {
      document.title = `Editing: ${current.title} - recept0r`
    }
  })

  onMounted(() => {
    if (mode.value && mode.value !== 'edit') {
      title.value.focus()
    }

    window.addEventListener('beforeunload', events.onEditClose)
  })

  onBeforeRouteLeave((to, from) => {
    if (loggedIn.value && !noChanges.value && !isSaving.value) {
      const answer = isDeleted.value
        ? true
        : window.confirm('Do you really want to leave? There might be unsaved changes!')

      if (!answer) {
        return false
      }
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

  const getCurrentRecipeId = () => route.params.id.toString()

  const getCurrentRecipeData = async () => {
    // on component creation: check mode and get recipe data from Vuex or DB if we're in `edit` mode
    if (mode.value && mode.value === 'edit') {
      const currentId = getCurrentRecipeId()
      const currentItem = await getRecipeData(currentId)

      return currentItem !== 'error' && currentItem
        ? updateEditMode(currentItem)
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
      if (recipe[reqKey].length <= 0) {
        return missing += 1
      }
    })

    return missing <= 0
  }

  const events = {
    onCancel(goHome: boolean = true) {
      if (goHome || mode.value === 'create') {
        router.push({ name: 'Recipes' })
      } else {
        return isDraft.value
          ? router.push({ name: 'Edit Mode' })
          : router.push({ name: 'Recipe', params: { slug: recipe.slug, id: getCurrentRecipeId() } })
      }
    },

    onEditClose(e: BeforeUnloadEvent) {
      if (!noChanges.value && !isSaving.value) {
        e.preventDefault()
      }
    },

    async onSaveRecipe() {
      const required = ['title', 'description', 'category', 'diet', 'ingredients', 'body']

      if (recipe.image.length > 0 && !isImgUploaded(recipe.image)) {
        return alert('An image was selected, but not uploaded yet. Please upload or remove the image before saving.')
      }

      if (!isDraft.value && !validateInput(required)) {
        return alert(`Please fill all of the following fields: ${required.toString().replace(/\W/g,', ')}!`)
      }

      if (editorHrPattern.test(recipe.body)) {
        // Replace <hr> marker with valid HTML
        recipe.body = recipe.body.replaceAll(editorHrPattern, '<hr>')
      }

      let publishedId = ''
      events.onUpdateRecipe('updated', (new Date()).toISOString())
      isSaving.value = true

      switch (mode.value) {
        case 'create':
          publishedId = await store.dispatch('data/create', recipe) // returns: new id

          if (publishedId === 'error') {
            // there will be a toast msg; this line will re-enable the save button
            isSaving.value = false
          }

          if (!isDraft.value) {
            router.push({ path: `/recipe/${recipe.slug}/${publishedId}` })
          } else {
            router.push({ path: `/edit/${publishedId}` })
          }

          break

        case 'edit':
          publishedId = route.params.id.toString()
          let updated = await store.dispatch('data/update', [publishedId, recipe])

          if (!isDraft.value && updated !== 'error') {
            // navigate to the published recipe
            router.push({ path: `/recipe/${recipe.slug}/${publishedId}` })
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
      recipe.slug = slugify(recipe.title)
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
      <h2>Image</h2>
      <img v-if="recipe.image" class="rounded-lg mt-4 mb-4" :src="recipe.image" :alt="recipe.title">
      <RecipeImage :currentImage="recipe.image" :recipe="recipe.slug" @update:image="events.onUpdateRecipe('image', $event)" class="mb-4" />
    </div>
    <div class="w-full md:w-1/2 md:pl-8">
      <h2>Recipe Title</h2>
      <input type="text" v-model.trim="recipe.title" ref="title" class="form-control mb-4" placeholder="A great title..." @input="events.onTitleChange">
      <h2 class="mb-4">Description</h2>
      <input type="text" v-model.trim="recipe.description" class="form-control mb-4" placeholder="A fancy description...">
    </div>
    <div class="w-full md:w-1/2">
      <h2 class="mb-4">Metadata</h2>
      <InputToggle v-model="isDraftSelected" name="draft" @update:modelValue="events.onUpdateRecipe('draft', $event)">
        {{ draftText }}
      </InputToggle>
      <InputSelect :current="recipe.category" :data="categories" name="category" class="relative mt-6 mb-4" @update:select="events.onUpdateRecipe('category', $event)">
        Recipe category
      </InputSelect>
      <InputText
        v-model.trim="recipe.portions"
        name="portions"
        class="mb-4"
        placeholder="How many people does this recipe serve?"
      />
      <InputText
        v-model.trim="recipe.duration"
        name="duration"
        class="mb-4"
        placeholder="How long does it take to cook this?"
      />
      <InputText
        v-model.trim="recipe.calories"
        name="calories"
        class="mb-4"
        placeholder="How many calories does this food have?"
      />
      <RecipeDiet :data="diets" :selected="recipe.diet" @update:diet="events.onUpdateRecipe('diet', $event)" />
    </div>
    <div class="w-full md:w-1/2 md:pl-8 mb-4">
      <RecipeIngredients :input="recipe.ingredients" :mode="mode" @update:ingredients="events.onUpdateRecipe('ingredients', $event)" />
    </div>
    <div class="w-full">
      <h2 class="mb-4">Instructions</h2>
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
          <ButtonDelete :id="getCurrentRecipeId()" :title="recipe.title" @event:delete="() => isDeleted = true" class="py-1 mr-4" />
          <ButtonDuplicate :recipe="recipe" class="py-1" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss">
  h2 {
    @apply text-xl;
  }

  h3 {
    @apply text-lg;
  }
</style>