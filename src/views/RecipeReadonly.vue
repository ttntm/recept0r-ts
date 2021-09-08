<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { useStore } from '@/store'

  import { getRecipeData, showWindow } from '@/utils'

  import ButtonShare from '@/components/button/ButtonShare.vue'
  import ButtonTop from '@/components/button/ButtonTop.vue'
  import Duration from '@/components/icon/duration.vue'
  import Loading from '@/components/icon/loading.vue'
  import Portions from '@/components/icon/portions.vue'
  import RecipeShare from '@/components/recipe/RecipeShare.vue'

  const route = useRoute()
  const store = useStore()

  const errorMsg = ref('')
  const loggedIn = computed(() => store.getters['user/loggedIn'])
  const readSuccess = ref(false)
  const recipe = ref()
  const windowOpen = computed(() => store.getters['app/windowOpen'])

  const getCurrentRecipeData = async () => {
    const currentId = route.params.refId.toString()
    const currentItem = await getRecipeData(currentId)
    if (currentItem !== 'error' && currentItem.data) {
      recipe.value = Object.assign({}, currentItem)
      readSuccess.value = true
    } else {
      errorMsg.value = `<h3>Oops, something went wrong :(</h3>
        <p>Error: couldn't load recipe data.<br><br>
        Please try again later or go back to the home page.</p>`
    }
  }

  getCurrentRecipeData()

  watch(recipe, () => {
    if (recipe.value.data.title) document.title = `${recipe.value.data.title} - recept0r`
  })
</script>

<template>
  <div v-if="!readSuccess" class="w-full">
    <div v-if="!errorMsg" class="text-center my-12">
      <Loading class="mx-auto" />
      <p class="text-cool-gray-500 mt-12">Loading recipe data...</p>
    </div>
    <div v-else v-html="errorMsg" class="text-center my-12" />
  </div>
  <section v-else id="recipe" class="w-full xl:w-4/5 flex flex-row flex-wrap mx-auto">
    <div class="w-full lg:w-3/5">
      <img v-if="recipe.data.image" class="w-full rounded-lg shadow-sm mb-4" :src="recipe.data.image" :alt="recipe.data.title" loading="lazy">
    </div>
    <div class="w-full lg:w-2/5 lg:pl-8">
      <div class="flex justify-end">
        <transition name="share">
          <RecipeShare v-if="windowOpen === 4" />
        </transition>
        <ButtonShare class="click-outside-ignore" @click="showWindow(4)" />
      </div>
      <h2 class="mt-4 mb-4">{{ recipe.data.title }}</h2>
      <p class="text-blue-500 mb-8">{{ recipe.data.description }}</p>
      <div class="flex flex-row flex-no-wrap leading-none border-t border-b border-cool-gray-500 mb-8 py-4">
        <div class="flex-1 flex flex-row items-center justify-center px-4">
          <Portions class="mr-4" />
          <p class="text-blue-500 mb-0">{{ recipe.data.portions }}</p>
        </div>
        <div class="flex-1 flex flex-row items-center justify-center border-l border-cool-gray-500 px-4">
          <Duration class="mr-4" />
          <p class="text-blue-500 mb-0">{{ recipe.data.duration }}</p>
        </div>
      </div>
      <p class="text-blue-500 font-semibold mb-2">
        <span class="inline-block text-cool-gray-500" style="width: 6rem">Diet:</span>
        {{ recipe.data.diet }}
      </p>
      <p class="text-blue-500 font-semibold mb-4">
        <span class="inline-block text-cool-gray-500" style="width: 6rem">Category:</span>
        {{ recipe.data.category }}
      </p>
    </div>
    <div v-html="recipe.data.body" class="recipe-body w-full lg:w-3/5 order-2 lg:order-1 lg:mt-8" />
    <div class="w-full lg:w-2/5 lg:pl-8 order-1 lg:order-2">
      <div class="bg-gray-500 rounded-lg p-8 mt-4 lg:mt-0 mb-8 lg:mb-0">
        <h3 class="mb-4">Ingredients</h3>
        <ul class="mb-0">
          <li v-for="(item, index) in recipe.data.ingredients" :key="index" class="text-blue-500 font-semibold mb-2">
            {{ item }}
          </li>
        </ul>
      </div>
    </div>
    <div class="w-full order-3">
      <hr class="mt-4 mb-8" />
      <div class="flex flex-row flex-wrap md:flex-no-wrap justify-center md:justify-start">
        <router-link :to="{ name: 'All Recipes' }" class="btn btn-gray flex flex-row items-center mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="inline-block pointer-events-none" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z"/>
            <polyline points="15 6 9 12 15 18" />
          </svg>
          <span class="inline-block">All Recipes</span>
        </router-link>
        <router-link v-if="loggedIn" :to="{ name: 'Edit Recipe', params: { refId: recipe.ref['@ref'].id } }" class="btn btn-gray">Edit Recipe</router-link>
      </div>
    </div>
  </section>
  <ButtonTop />
</template>

<style lang="postcss">
  .recipe-body a {
    @apply text-blue-500 font-bold underline;
  }

  .recipe-body a:hover {
    @apply no-underline;
  }

  .share-enter-active,
  .share-leave-active {
    transition: all 0.5s;
  }

  .share-enter-from,
  .share-leave-to {
    transform: translateX(-150px);
    opacity: 0;
  }
</style>