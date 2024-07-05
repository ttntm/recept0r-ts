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

  const onDeleteRecipe = async () => {
    const confirmDelete = window.confirm(`Deleting the recipe "${props.title}" - are you sure?`)
    if (confirmDelete) {
      btnState.disabled = true
      btnState.loading = true

      const deleted = await store.dispatch('data/delete', props.id)

      if (deleted && deleted !== 'error') {
        // avoid hitting 'onBeforeRouteLeave' in the parent
        emit('event:delete', true)
        // redirect home if currently viewing the deleted recipe's dedicated view/edit route
        if (route.params.refId?.toString()?.length > 0) router.push({ name: 'All Recipes', replace: true })
      } else {
        btnState.disabled = false
        btnState.loading = false
      }
    }
  }
</script>

<template>
  <ButtonDefault class="opacity-75 hover:opacity-100" title="Delete recipe" @click="onDeleteRecipe">
    <Loading v-if="btnState.loading" size="24" />
    <svg v-else xmlns="http://www.w3.org/2000/svg" class="icon pointer-events-none" width="32" height="32" viewBox="0 0 200 200">
      <path d="M116.8,129.84c1.38,0,2.5-1.12,2.5-2.5v-21.83c0-1.38-1.12-2.5-2.5-2.5s-2.5,1.12-2.5,2.5v21.83c0,1.38,1.12,2.5,2.5,2.5ZM153.13,70.81h-40.17c0-.08.02-.16.02-.25v-10.99c0-3.4-2.69-6.16-6-6.16h-13.99c-3.31,0-6,2.77-6,6.16v10.99c0,.08.02.16.02.25h-40.17c-1.38,0-2.5,1.12-2.5,2.5s1.12,2.5,2.5,2.5h9.23c-.02.15-.02.31,0,.47l5.91,65.69c.07,7.37,6.47,13.35,14.33,13.35h47.33c7.86,0,14.26-5.98,14.33-13.35l5.91-65.69c.01-.16.01-.32,0-.47h9.23c1.38,0,2.5-1.12,2.5-2.5s-1.12-2.5-2.5-2.5ZM92.01,70.56v-10.99c0-.64.45-1.16,1-1.16h13.99c.55,0,1,.52,1,1.16v10.99c0,.08.02.16.02.25h-16.03c0-.08.02-.16.02-.25ZM138.92,75.84l-5.92,65.79c0,.07,0,.15,0,.22,0,4.67-4.19,8.47-9.33,8.47h-47.33c-5.15,0-9.33-3.8-9.33-8.47,0-.07,0-.15,0-.22l-5.92-65.79s0-.02,0-.02h77.86s0,.02,0,.02ZM100,129.84c1.38,0,2.5-1.12,2.5-2.5v-21.83c0-1.38-1.12-2.5-2.5-2.5s-2.5,1.12-2.5,2.5v21.83c0,1.38,1.12,2.5,2.5,2.5ZM83.2,129.69c1.38,0,2.5-1.12,2.5-2.5v-21.83c0-1.38-1.12-2.5-2.5-2.5s-2.5,1.12-2.5,2.5v21.83c0,1.38,1.12,2.5,2.5,2.5Z" fill="currentColor" stroke-width="5" stroke="currentColor" />
    </svg>
  </ButtonDefault>
</template>