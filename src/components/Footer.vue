<script setup lang="ts">
  import type { DebugInfo } from '@/types'

  const props = defineProps<{
    debug: DebugInfo | null
    loggedIn: boolean
  }>()

  const date: Date = new Date()
  const showDebug: Boolean = false
  const year: number = date.getFullYear()
</script>

<template>
  <footer id="app-footer" class="text-cool-gray-500 mt-12">
    <div class="container text-center pt-12 pb-8 mx-auto">
      <p class="text-sm mb-2">
        Made with ♥ by <a class="hover:text-black hover:underline" href="https://sahar.design" target="_blank">Sahar</a> & <a class="hover:text-black hover:underline" href="https://ttntm.me" target="_blank">Tom</a>
      </p>
      <p class="text-xs m-0">
        &copy; {{ year }}, <a class="hover:text-black hover:underline" href="https://codeberg.org/ttntm/recept0r" target="_blank">Code@Codeberg (GPL-3.0)</a>
      </p>
      <p v-if="showDebug && debug && loggedIn" class="text-xs px-8 mt-2">
        Last update: {{debug.lastUpdate}}<br>Update needed: {{debug.updateNeeded}}<br>Force: {{debug.forceUpdate}}
      </p>
    </div>
  </footer>
</template>