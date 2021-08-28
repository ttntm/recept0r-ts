<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import { useStore } from '../../store'
  import { validateCredentials } from '../../utils'
  import type { Credentials } from '../../types'

  import ButtonDefault from '../button/ButtonDefault.vue'

  const store = useStore()

  const btnText = ref('Login')
  const credentials: Credentials = reactive({
    email: '',
    password: ''
  })
  const spinner = `<svg class="mx-auto" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; background: none; display: block; shape-rendering: auto;" width="50px" height="50px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
    <circle cx="50" cy="50" r="32" stroke-width="8" stroke="#234cad" stroke-dasharray="50.26548245743669 50.26548245743669" fill="none" stroke-linecap="round" transform="rotate(123.903 50 50)">
      <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" keyTimes="0;1" values="0 50 50;360 50 50"></animateTransform>
    </circle>
  </svg>`
  const validationMsg = ref('')
  
  const clearMsg = () => validationMsg.value = ''

  const handleLogin = () => {
    if (validateCredentials(credentials)) {
      btnText.value = 'Logging in...'
      validationMsg.value = spinner
      store.dispatch('user/attemptLogin', credentials)
    } else {
      validationMsg.value = 'Please enter valid information.'
    }
  }
</script>

<template>
  <form class="" @submit.prevent="handleLogin">
    <div class="form-group">
      <label for="email">Email</label>
      <input class="auth-form-control" id="email" type="email" v-model="credentials.email" placeholder="hey@email.com" autocomplete="off" @input="clearMsg" v-focus />
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