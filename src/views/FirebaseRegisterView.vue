<template>
  <div class="container mt-5">
    <h1>Create an Account</h1>
    <form @submit.prevent="register" style="max-width: 420px">
      <p>
        <input v-model.trim="email" type="email" placeholder="Email"
          aria-label="Email" autocomplete="email" class="form-control" required />
      </p>
      <p>
        <input v-model="password" type="password" placeholder="Password"
          aria-label="Password" autocomplete="new-password"
          class="form-control" required />
      </p>
      <p><button type="submit" class="btn btn-primary" :disabled="pending">Save to Firebase</button></p>
      <p v-if="errorMessage" class="text-danger" role="alert">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const pending = ref(false)
const router = useRouter()
const auth = getAuth()

const register = async () => {
  if (pending.value) return
  pending.value = true
  errorMessage.value = ''
  try {
    await createUserWithEmailAndPassword(auth, email.value, password.value)
    console.log('Firebase Register Successful!')
    password.value = ''
    await router.push('/FireLogin')
  } catch (error) {
    console.log(error.code)
    errorMessage.value = `Unable to register: ${error.code || 'Please try again.'}`
  } finally {
    pending.value = false
  }
}
</script>
