<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'
  import { useStore } from '@/store'

  import ButtonDefault from '@/components/button/ButtonDefault.vue'

  const store = useStore()

  const currentUser = computed(() => store.getters['user/currentUser'])
  const eml = ref('')
  const pwd = ref('')

  onMounted(() => {
    eml.value = currentUser.value.email
  })
</script>

<template>
  <section id="profile" class="w-full md:w-1/2 lg:w-1/3 mx-auto">
    <form id="user-profile-form">
      <h1 class="h3">Profile</h1>
      <div class="mb-8">
        <label class="block mb-2" for="inputEml">Email Address</label>
        <input id="inputEml" class="form-control" v-model="eml" type="email" placeholder="hey@email.com" readonly>
      </div>
      <div class="mb-8">
        <label class="block mb-2" for="inputP">Password</label>
        <input id="inputP" class="form-control" v-model="pwd" type="password" placeholder="************" required>
      </div>
      <ButtonDefault class="btn btn-gray" type="submit" :disabled="!pwd">Update</ButtonDefault>
    </form>
  </section>
</template>