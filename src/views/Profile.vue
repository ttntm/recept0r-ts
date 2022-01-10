<script setup lang="ts">
  import { computed, onMounted, reactive, ref } from 'vue'
  import { useStore } from '@/store'
  import type { User } from '@/types'
  import { validateEmail } from '@/utils'

  import ButtonDefault from '@/components/button/ButtonDefault.vue'

  const store = useStore()

  const btnState = reactive({
    enabled: true,
    text: 'Update Profile'
  })
  const eml = ref('')
  const msg = ref('')
  const pwd = ref('')
  
  const currentUser = computed<User>(() => store.getters['user/currentUser'])

  onMounted(() => {
    eml.value = currentUser.value.email
  })

  const validate = () => {
    msg.value = ''
    
    if(!validateEmail(eml.value)) {
      msg.value = 'Please enter a valid email address'
      return false
    }

    if(pwd.value.length < 6) {
      msg.value = 'Please choose a more secure password'
      return false
    }

    return true
  }

  const events = {
    onUpdateUserAccount() {
      if (!validate()) return alert(msg.value)

      let newData: {
        email: string, 
        password?: string 
      } = {
        email: eml.value
      }

      if (pwd.value !== '') newData.password = pwd.value

      btnState.enabled = false
      btnState.text = `Updating...`

      store.dispatch('user/updateUserAccount', newData)

      setTimeout(() => {
        btnState.enabled = true
        btnState.text = `Update Profile`
      }, 1500)
    }
  }
</script>

<template>
  <section id="profile" class="w-full md:w-1/2 lg:w-1/3 mx-auto">
    <form id="user-profile-form" @submit.prevent="events.onUpdateUserAccount">
      <h1 class="h3">User Profile</h1>
      <div class="mb-6">
        <label class="block mb-1" for="inputEml">Email Address</label>
        <p class="text-xs text-cool-gray-500 mb-3">
          The email address associated with your account.
        </p>
        <input id="inputEml" class="form-control focus:shadow-none pointer-events-none" v-model="eml" type="email" placeholder="hey@email.com" readonly>
      </div>
      <div class="mb-8">
        <label class="block mb-1" for="inputP">Password</label>
        <p class="text-xs text-cool-gray-500 mb-3">
          Optional; fill to change your current password.
        </p>
        <input id="inputP" class="form-control" v-model="pwd" type="password" placeholder="************" required>
      </div>
      <ButtonDefault class="btn btn-gray" type="submit" :disabled="!btnState.enabled || !pwd">{{ btnState.text }}</ButtonDefault>
    </form>
  </section>
</template>