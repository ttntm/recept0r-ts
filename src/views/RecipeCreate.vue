<script lang="ts">
  import { computed, defineComponent, reactive, ref, watch } from 'vue'
  import { onBeforeRouteLeave, useRouter } from 'vue-router'
  import { useStore } from '../store'
  import { Recipe } from '../types'

  import { slugify } from '../utils'

  import ButtonDefault from '../components/button/ButtonDefault.vue'

  export default defineComponent({
    name: 'Create',
    components: {
      ButtonDefault
    },
    setup() {
      const router = useRouter()
      const store = useStore()

      const me = computed(() => store.getters['user/currentUser'])
      const loggedIn = computed(() => store.getters['user/loggedIn'])
      const newRecipe: Recipe = reactive({
        id: '',
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

      const isEmpty = ref(true)
      const isSaving = ref(false)

      const cancelCreate = () => router.push({ name: 'Home' })
      const setRecipeId = () => newRecipe.id = slugify(newRecipe.title)

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
        isDisabled: computed(() => isEmpty.value || isSaving.value ? true : false),
        newRecipe,
        saveBtnText: computed(() => isSaving.value ? 'Saving...' : 'Save'),
        setRecipeId
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
      <input type="text" v-model="newRecipe.title" ref="recipeTitle" class="form-control mb-4" placeholder="A great title..." @input="setRecipeId">
      <h4 class="mb-4">Description</h4>
      <input type="text" v-model="newRecipe.description" class="form-control mb-4" placeholder="A fancy description...">
    </div>
    <div class="w-full md:w-1/2">
      <h4 class="mb-4">Metadata</h4>
      <input type="text" v-model="newRecipe.portions" class="form-control text-sm mb-4" placeholder="Portions; how many people does this recipe serve?">
      <input type="text" v-model="newRecipe.duration" class="form-control text-sm mb-4" placeholder="Duration; how long does it take to cook this?">
      <!-- <RecipeDiet :diet="newRecipe.diet" @diet:update="dietUpdate" class="relative mb-4" />
      <RecipeCategory :category="newRecipe.category" @category:update="categoryUpdate" class="relative mb-4" /> -->
    </div>
    <div class="w-full md:w-1/2 md:pl-8 mb-4">
      <h4 class="mb-4">Ingredients</h4>
      <!-- <RecipeIngredients :editing="true" :input="newRecipe.ingredients" @ing:update="ingUpdate" /> -->
    </div>
    <div class="w-full">
      <h4 class="mb-4">Instructions</h4>
      <!-- <RecipeEditor :editing="true" :editorContent="newRecipe.body" @editor:update="editorUpdate" /> -->
      <hr class="my-8">
      <div class="flex flex-row justify-center lg:justify-start">
        <ButtonDefault class="mr-4" :disabled="isDisabled">{{ saveBtnText }}</ButtonDefault>
        <ButtonDefault @click="cancelCreate">Cancel</ButtonDefault>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
  .form-control {
    @apply block w-full;
  }
</style>