<script lang="ts">
  import { defineComponent, ref } from 'vue'

  export default defineComponent({
    name: 'Home',
    components: {},
    setup() {
      const isLoading = ref(true)

      return {
        isLoading
      }
    }
  })
</script>

<template>
  <div v-if="isLoading" class="text-center my-12">
    <img src="/img/loading.svg" alt="Loading..." class="mx-auto">
    <p class="text-cool-gray-500 mt-12">Loading recipes...</p>
  </div>
  <div v-else class="w-full xl:w-2/3 flex flex-row justify-center mb-12 mx-auto">
    Search<br>
    Filters<br>
    RecipeGrid
  </div>
</template>