<script setup lang="ts">
  import {reactive } from 'vue'
  import { useStore } from '@/store'
  import type { Recipe } from '@/types'
  
  import ButtonDefault from '@/components/button/ButtonDefault.vue'
  import Loading from '@/components/icon/loading.vue'

  const props = defineProps<{
    recipe: Recipe
  }>()

  const btnState = reactive({
    disabled: false,
    loading: false
  })

  const store = useStore()

  const duplicate = async () => {
    const confirmDuplicate = window.confirm(`This will duplicate the recipe "${props.recipe.title}" - are you sure?`)
    if (confirmDuplicate) {
      btnState.disabled = true
      btnState.loading = true

      const duplicate: Recipe = { ...props.recipe }
        duplicate.id = `${duplicate.id}-copy`
        duplicate.title = `${duplicate.title} Copy`
        duplicate.draft = true
      
      const duplicated = await store.dispatch('data/create', duplicate)
      
      if (duplicated && duplicated !== 'error') {
        btnState.loading = false
      } else {
        btnState.disabled = false
        btnState.loading = false
      }
    }
  }
</script>

<template>
  <ButtonDefault class="opacity-75 hover:opacity-100" title="Duplicate recipe" :disabled="btnState.disabled" @click="duplicate">
    <Loading v-if="btnState.loading" size="24" />
    <svg v-else xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-copy pointer-events-none" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <rect x="8" y="8" width="12" height="12" rx="2" />
      <path d="M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2" />
    </svg>
  </ButtonDefault>
</template>