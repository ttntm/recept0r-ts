<script setup lang="ts">
  const date: Date = new Date()
  const year: number = date.getFullYear()
</script>

<template>
  <div id="app-footer" class="text-cool-gray-500 mt-12">
    <div class="container text-center pt-12 pb-8 mx-auto">
      <p class="text-sm mb-2">Made with ♥ by <a class="hover:text-black hover:underline" href="https://sahar.design" target="_blank" rel="noopener">Sahar</a> & <a class="hover:text-black hover:underline" href="https://ttntm.me" target="_blank" rel="noopener">Tom</a></p>
      <p class="text-xs m-0">&copy; {{ year }}, <a class="hover:text-black hover:underline" href="https://github.com/ttntm/recept0r-ts/" target="_blank" rel="noopener">Code@GitHub (GPL-3.0)</a></p>
    </div>
  </div>
</template>