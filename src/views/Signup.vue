<script setup lang="ts">
  import { ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useStore } from '@/store'

  import ButtonDefault from '@/components/button/ButtonDefault.vue'

  const route = useRoute()
  const router = useRouter()
  const store = useStore()

  const btnText = ref('Create Account')
  const msg = ref('')
  const pwd = ref('')
  const token = route.query.t

  const validate = () => {
    msg.value = ''
    
    if(!token) {
      msg.value = 'Invalid token...'
      return false
    }

    if(pwd.value.length < 6) {
      msg.value = 'Please choose a more secure password'
      return false
    }

    return true
  }

  const events = {
    onSignup() {    
      if (!validate()) return alert(msg.value)

      btnText.value = `Processing...`
      
      store.dispatch('user/processInvite', { token: token, pwd: pwd.value })
        .then(() => {
          store.dispatch('app/sendToastMessage', { text: 'Account created, redirecting...', type: 'success' })
          setTimeout(() => {
            router.push({ name: 'All Recipes' })
          }, 2000)
        })
        .catch(error => {
          store.dispatch('app/sendToastMessage', { text: 'Error processing the invite, please try again later.', type: 'error' })
          btnText.value = 'Create Account'
          pwd.value = ''
        })
    }
  }
</script>

<template>
  <section id="signup" class="w-full md:w-2/3 lg:w-1/2 mx-auto">
    <form id="signup-form" class="signup-form" @submit.prevent="events.onSignup">
      <h1 class="h3">Confirm Signup</h1>
      <p class="text-sm">
        We're almost done processing your invite - please choose a password for your account.
      </p>
      <div class="form-group">
        <label for="inputP">Password</label>
        <input id="inputP" class="auth-form-control" v-model="pwd" type="password" placeholder="************" required>
      </div>
      <ButtonDefault class="btn btn-outline" type="submit" :disabled="!pwd">{{ btnText }}</ButtonDefault>
    </form>
    <p class="text-xs text-center text-cool-gray-500 mt-8">
      Signing up for an account means that you explicitly agree with Netlify processing your email and IP address according to their <a href="https://www.netlify.com/gdpr-ccpa" target="_blank" class="underline">data processing guidelines</a>.
      <br><br>
      We don't use analytics, cookies or tracking and we <em>don't</em> collect and/or store any personally identifiable information.
    </p>
    Token: {{ token }}
  </section>
</template>

<style lang="postcss" scoped>
  .signup-form {
    @apply rounded-lg shadow-lg bg-gray-500 text-left px-12 py-8 mx-auto;
    width: 450px;
    max-width: 90%;
  }
</style>