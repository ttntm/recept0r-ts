<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import { useStore } from '../../store'
  import { validateCredentials } from '../../utils'
  import { Credentials } from '@/types'

  import ButtonDefault from '../button/ButtonDefault.vue'

  const store = useStore()

  const btnText = ref('Login')
  const credentials: Credentials = reactive({
    email: '',
    password: ''
  })
  const spinner = `<img src="/img/loading.svg" alt="Loading..." class="mx-auto">`
  const validationMsg = ref('')
  
  const clearMsg = () => validationMsg.value = ''

  const handleLogin = () => {
    if (validateCredentials(credentials)) {
      btnText.value = 'Logging in...'
      validationMsg.value = spinner
      store.dispatch('app/sendToastMessage', { text: JSON.stringify(credentials), type: 'error' })
    } else {
      validationMsg.value = 'Please enter valid information.'
    }
  }
</script>

<template>
  <form class="" @submit.prevent="handleLogin">
    <div class="form-group">
      <label for="email">Email</label>
      <input class="auth-form-control" id="email" type="email" v-model="credentials.email" ref="firstInput" placeholder="hey@email.com" @input="clearMsg" />
    </div>
    <div class="form-group">
      <label for="password">Password</label>
      <input class="auth-form-control" id="password" type="password" v-model="credentials.password" placeholder="******" @input="clearMsg" />
    </div>
    <ButtonDefault class="modal-btn mx-auto" type="submit">{{ btnText }}</ButtonDefault>
  </form>
  <transition name="fade">
    <p v-if="validationMsg !== ''" v-html="validationMsg" class="error font-bold text-center mt-8 mb-2" />
  </transition>
</template>