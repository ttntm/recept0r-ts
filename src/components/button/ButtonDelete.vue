<script setup lang="ts">
  import { reactive } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useStore } from '@/store'

  import ButtonDefault from '@/components/button/ButtonDefault.vue'
  import Loading from '@/components/icon/loading.vue'

  const props = defineProps<{
    id: string,
    title: string
  }>()

  const emit = defineEmits<{
    (e: 'event:delete', val: boolean): void
  }>()

  const route = useRoute()
  const router = useRouter()
  const store = useStore()

  const btnState = reactive({
    disabled: false,
    loading: false
  })

  const deleteRecipe = async () => {
    const confirmDelete = window.confirm(`Deleting the recipe "${props.title}" - are you sure?`)
    if (confirmDelete) {
      btnState.disabled = true
      btnState.loading = true

      const deleted = await store.dispatch('data/delete', props.id)

      if (deleted && deleted !== 'error') {
        // avoid hitting 'onBeforeRouteLeave' in the parent
        emit('event:delete', true)
        // redirect home if currently viewing the deleted recipe's dedicated view/edit route
        let redirect = route.params.refId?.toString()?.length > 0 || ''
        if (redirect) router.push({ name: 'All Recipes', replace: true })
      } else {
        btnState.disabled = false
        btnState.loading = false
      }
    }
  }
</script>

<template>
  <ButtonDefault class="opacity-75 hover:opacity-100" title="Delete recipe" @click="deleteRecipe">
    <Loading v-if="btnState.loading" size="24" />
    <svg v-else xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-trash pointer-events-none" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
      <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
      <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
    </svg>
  </ButtonDefault>
</template>