<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useStore } from '@/store'
  import type { Recipe } from '@/types'
  import { getRecipeData, showWindow, useBlurredPlaceholder } from '@/utils'

  import ButtonShare from '@/components/button/ButtonShare.vue'
  import ButtonTop from '@/components/button/ButtonTop.vue'
  import IconResolver from '@/components/icon/IconResolver.vue'
  import LoadingMessage from '@/components/conditional/LoadingMessage.vue'
  import RecipeDietReadonly from '@/components/recipe/readonly/RecipeDiet.vue'
  import RecipeIngredientsReadonly from '@/components/recipe/readonly/RecipeIngredients.vue'
  import RecipeMetaReadonly from '@/components/recipe/readonly/RecipeMeta.vue'

  const route = useRoute()
  const router = useRouter()
  const store = useStore()

  const errorMsg = ref('')
  const readSuccess = ref(false)
  const recipe = ref<Recipe>()

  const loggedIn = computed<boolean>(() => store.getters['user/loggedIn'])

  watch(recipe, () => {
    if (recipe.value?.title) document.title = `${recipe.value.title} - recept0r`
  })

  const blurredSrc: string = useBlurredPlaceholder()

  const getCurrentRecipeData = async () => {
    const currentId = route.params.id.toString()
    const currentItem = await getRecipeData(currentId)

    if (currentItem !== 'error' && currentItem) {
      recipe.value = Object.assign({}, currentItem)
      currentItem.status === 'draft'
        ? router.push({ name: 'Recipes' })
        : readSuccess.value = true
    } else {
      errorMsg.value = `<h3>Oops, something went wrong :(</h3>
        <p>Error: couldn't load recipe data.<br><br>
        Please try again later or go back to the home page.</p>`
    }
  }

  getCurrentRecipeData()
</script>

<template>
  <div v-if="!readSuccess" class="w-full my-12">
    <LoadingMessage v-if="!errorMsg">
      Loading recipe data...
    </LoadingMessage>
    <div v-else v-html="errorMsg" class="text-center" />
  </div>
  <section v-else id="recipe" class="w-full xl:w-4/5 flex flex-row flex-wrap mx-auto">
    <div class="w-full lg:w-3/5">
      <UnLazyImage
        v-if="recipe?.image"
        :src-set="recipe.image"
        :alt="recipe.title"
        :placeholder-src="blurredSrc"
        class="recipe-img"
        auto-sizes
      />
    </div>
    <div class="w-full lg:w-2/5 lg:pl-8">
      <div class="flex flex-row justify-between items-center mt-6 lg:mt-0 mb-6">
        <div class="flex items-center gap-4">
          <IconResolver :icon="String(recipe?.category)" class="border border-cool-gray-500 rounded shadow-sm"/>
          <p class="text-cool-gray-500 font-semibold m-0">
            {{ recipe?.category }}
          </p>
        </div>
        <div class="flex flex-row justify-end">
          <ButtonShare class="click-outside-ignore" @click="showWindow(4)" />
        </div>
      </div>
      <h2 class="mb-4 lg:my-4">
        {{ recipe?.title }}
      </h2>
      <p class="text-blue-500 mb-8">
        {{ recipe?.description }}
      </p>
      <div class="flex flex-row flex-no-wrap leading-none border-t border-b border-cool-gray-500 py-4">
        <RecipeMetaReadonly
          :text="recipe?.preparation || '-'"
          icon="hat"
        />
        <RecipeMetaReadonly
          :text="recipe?.duration"
          icon="duration"
          class="border-l border-cool-gray-500"
        />
      </div>
      <div class="flex flex-row flex-no-wrap leading-none border-b border-cool-gray-500 mb-8 py-4">
        <RecipeMetaReadonly
          :text="recipe?.portions"
          icon="portions"
        />
        <RecipeMetaReadonly
          :text="`${recipe?.calories || '-'} kcal`"
          icon="calories"
          class="border-l border-cool-gray-500"
        />
      </div>
      <RecipeDietReadonly :diet="recipe?.diet" />
    </div>
    <div v-html="recipe?.body" class="recipe-body w-full lg:w-3/5 order-2 lg:order-1 lg:mt-12" />
    <div class="w-full lg:w-2/5 lg:pl-8 order-1 lg:order-2 my-8 lg:mb-0">
      <div class="bg-gray-500 rounded-lg p-8">
        <RecipeIngredientsReadonly :ingredients="recipe?.ingredients || []" />
      </div>
    </div>
    <div class="w-full order-3">
      <hr class="border-cool-gray-500 mt-2 mb-8" />
      <div class="flex flex-row flex-wrap md:flex-no-wrap justify-center md:justify-start">
        <router-link :to="{ name: 'Recipes' }" class="btn btn-gray flex flex-row items-center mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="inline-block pointer-events-none" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z"/>
            <polyline points="15 6 9 12 15 18" />
          </svg>
          <span class="inline-block">All Recipes</span>
        </router-link>
        <router-link v-if="loggedIn" :to="{ name: 'Edit Recipe', params: { id: recipe?.id } }" class="btn btn-gray">
          Edit Recipe
        </router-link>
      </div>
    </div>
  </section>
  <ButtonTop />
</template>

<style lang="postcss">
  .recipe-img {
    @apply w-full rounded-lg shadow-sm;
    max-height: 300px;
  }

  @media screen and (min-width:768px) {
    .recipe-img {
      max-height: 550px;
    }
  }

  @media screen and (min-width:1024px) {
    .recipe-img {
      max-height: 450px;
    }
  }

  .recipe-body a {
    @apply text-blue-500 font-bold underline;
  }

  .recipe-body a:hover {
    @apply no-underline;
  }

  .recipe-body hr {
    @apply border-cool-gray-500;
    margin: 1.5rem 0;
  }
</style>