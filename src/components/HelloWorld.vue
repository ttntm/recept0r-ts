<template>
  <h1 v-esc="logESC">{{ msg }}</h1>
  <button @click="increment" v-click-blur> count is: </button>
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

      const logESC = () => console.log('esc')

      temp()

      return {
        count,
        increment: () => store.commit('increment'),
        logESC
      }
    }
  })
</script>
