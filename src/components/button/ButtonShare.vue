<script setup lang="ts">
  import { useStore } from '@/store'

  const store = useStore()

  const onShareRecipe = async () => {
    const url = window.location.href

    if (!navigator.userAgent.includes('Firefox')) {
      // TypeScript does not like the 'clipboard-write' value here...
      /* @ts-ignore */
      const result = await navigator.permissions.query({ name: 'clipboard-write' })

      if (result.state === 'granted' || result.state === 'prompt') {
        await navigator.clipboard.writeText(url)
      }
    } else {
      await navigator.clipboard.writeText(url)
    }

    store.dispatch('app/sendToastMessage', {
      text: 'Recipe URL copied to clipboard, you can paste it anywhere.',
      type: 'info'
    })
  }
</script>

<template>
  <button
    v-click-blur
    class="btn btn-gray focus:outline-none focus:shadow-none rounded-full p-3"
    @click="onShareRecipe"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="icon pointer-events-none" width="32" height="32" viewBox="0 0 200 200">
      <path d="M134.64,114.93c-6.98,0-13.11,3.61-16.68,9.05l-34.17-17.6c.68-2.01,1.06-4.14,1.06-6.38s-.39-4.37-1.06-6.38l34.17-17.6c3.56,5.44,9.7,9.05,16.68,9.05,10.99,0,19.93-8.94,19.93-19.93s-8.94-19.93-19.93-19.93-19.93,8.94-19.93,19.93c0,2.23.39,4.37,1.06,6.38l-34.17,17.6c-3.56-5.44-9.7-9.05-16.68-9.05-10.99,0-19.93,8.94-19.93,19.93s8.94,19.93,19.93,19.93c6.98,0,13.11-3.61,16.68-9.05l34.17,17.6c-.68,2-1.06,4.14-1.06,6.38,0,10.99,8.94,19.93,19.93,19.93s19.93-8.94,19.93-19.93-8.94-19.93-19.93-19.93ZM134.64,50.22c8.23,0,14.93,6.7,14.93,14.93s-6.7,14.93-14.93,14.93-14.93-6.7-14.93-14.93,6.7-14.93,14.93-14.93ZM64.94,114.93c-8.23,0-14.93-6.7-14.93-14.93s6.7-14.93,14.93-14.93c5.94,0,11.06,3.49,13.46,8.52,0,0,0,0,0,0,0,0,0,0,0,0,.93,1.94,1.46,4.11,1.46,6.41,0,8.23-6.7,14.93-14.93,14.93ZM134.64,149.78c-8.23,0-14.93-6.7-14.93-14.93s6.7-14.93,14.93-14.93,14.93,6.7,14.93,14.93-6.7,14.93-14.93,14.93Z" fill="currentColor" stroke-width="5" stroke="currentColor" />
    </svg>
  </button>
</template>