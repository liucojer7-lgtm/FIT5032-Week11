<template>
  <div class="container mt-5">
    <h1>Sign in</h1>
    <form @submit.prevent="signin" style="max-width: 420px">
      <p>
        <input v-model.trim="email" type="email" placeholder="Email"
          aria-label="Email" autocomplete="email" class="form-control" required />
      </p>
      <p>
        <input v-model="password" type="password" placeholder="Password"
          aria-label="Password" autocomplete="current-password"
          class="form-control" required />
      </p>
      <p><button type="submit" class="btn btn-primary" :disabled="pending">Sign in via Firebase</button></p>
      <p v-if="errorMessage" class="text-danger" role="alert">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const pending = ref(false)
const router = useRouter()
const auth = getAuth()

const signin = async () => {
  if (pending.value) return
  pending.value = true
  errorMessage.value = ''
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value)
    console.log('Firebase Sign in Successful!')
    const user = auth.currentUser
    console.log('Current user:', { uid: user.uid, email: user.email })
    password.value = ''
    await router.push('/')
  } catch (error) {
    console.log(error.code)
    errorMessage.value = `Unable to sign in: ${error.code || 'Please try again.'}`
  } finally {
    pending.value = false
  }
}
</script>
