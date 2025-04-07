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

  const onDuplicate = async () => {
    const confirmDuplicate = window.confirm(`This will duplicate the recipe "${props.recipe.title}" - are you sure?`)

    if (confirmDuplicate) {
      btnState.disabled = true
      btnState.loading = true

      const duplicate: Recipe = { ...props.recipe }
      duplicate.status = 'draft'
      duplicate.slug = `${duplicate.slug}-copy`
      duplicate.title = `${duplicate.title} Copy`
      duplicate.updated = (new Date()).toISOString()
      delete duplicate.id

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
  <ButtonDefault class="opacity-75 hover:opacity-100" title="Duplicate recipe" :disabled="btnState.disabled" @click="onDuplicate">
    <Loading v-if="btnState.loading" size="24" />
    <svg v-else xmlns="http://www.w3.org/2000/svg" class="icon pointer-events-none" width="32" height="32" viewBox="0 0 200 200">
      <path d="M136.2,64.45h-5.01v-1.06c0-10.05-8.03-18.22-17.9-18.22h-50.08c-9.87,0-17.9,8.17-17.9,18.22v51.11c0,10.05,8.03,18.22,17.9,18.22h2.86v3.26c0,10.34,8.26,18.75,18.42,18.75h51.72c10.15,0,18.42-8.41,18.42-18.75v-52.79c0-10.34-8.26-18.74-18.42-18.74ZM66.07,127.73h-2.86c-7.12,0-12.9-5.93-12.9-13.22v-51.11c0-7.29,5.79-13.22,12.9-13.22h50.08c7.12,0,12.9,5.93,12.9,13.22v1.06h-41.71c-10.15,0-18.42,8.41-18.42,18.74v44.53ZM149.62,135.98c0,7.58-6.02,13.75-13.42,13.75h-51.72c-7.4,0-13.42-6.17-13.42-13.75v-52.79c0-7.58,6.02-13.74,13.42-13.74h51.72c7.4,0,13.42,6.17,13.42,13.74v52.79Z" fill="currentColor" stroke-width="5" stroke="currentColor" />
    </svg>
  </ButtonDefault>
</template>
