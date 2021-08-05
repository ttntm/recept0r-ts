<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    name: 'Footer',
    setup() {
      const date: Date = new Date()
      const year: Number = date.getFullYear()

      return {
        year
      }
    }
  })
</script>

<template>
  <div id="app-footer" class="text-cool-gray-500 mt-12">
    <div class="container text-center pt-12 pb-8 mx-auto">
      <p class="text-sm mb-2">Made with vue.js, Fauna DB and ♥ by <a class="hover:text-black" href="https://ttntm.me" target="_blank" rel="noopener">ttntm</a></p>
      <p class="text-sm mb-2">Design by <a class="hover:text-black" href="https://sahar.design" target="_blank" rel="noopener">Sahar Heumesser</a></p>
      <p class="text-xs m-0">&copy; recept0r {{ year }}</p>
    </div>
  </div>
</template>