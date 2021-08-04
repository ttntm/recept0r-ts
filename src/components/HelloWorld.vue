<template>
  <h1>{{ msg }}</h1>
  <button @click="increment"> count is: </button>
  <p>{{ count }}</p>
</template>

<script>
  import { defineComponent, computed } from 'vue'
  import { useStore } from '../store'

  import { temp } from '../utils'

  export default defineComponent({
    name: 'HelloWorld',
    props: {
      msg: {
        type: String,
        default: ''
      }
    },
    setup() {
      const store = useStore()

      const count = computed(() => store.state.count)

      temp()

      return {
        count,
        increment: () => store.commit('increment')
      }
    }
  })
</script>
