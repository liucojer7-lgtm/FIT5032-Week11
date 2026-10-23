<template>
  <div class="container mt-5">
    <h1>Add Book</h1>
    <form @submit.prevent="addBook" style="max-width: 420px">
      <div class="mb-3">
        <label for="isbn" class="form-label">ISBN:</label>
        <input id="isbn" v-model="isbn" type="text" class="form-control" required />
      </div>
      <div class="mb-3">
        <label for="name" class="form-label">Name:</label>
        <input id="name" v-model="name" type="text" class="form-control" required />
      </div>
      <button type="submit" class="btn btn-primary" :disabled="pending">Add Book</button>
      <p v-if="message" class="mt-3 text-success" role="status">{{ message }}</p>
      <p v-if="errorMessage" class="mt-3 text-danger" role="alert">{{ errorMessage }}</p>
    </form>
    <BookList :key="bookListVersion" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BookList from '../components/BookList.vue'
import db from '../firebase/init.js'
import { collection, addDoc } from 'firebase/firestore'

const bookListVersion = ref(0)
const isbn = ref('')
const name = ref('')
const pending = ref(false)
const message = ref('')
const errorMessage = ref('')

const addBook = async () => {
  if (pending.value) return
  message.value = ''
  errorMessage.value = ''
  const isbnNumber = Number(isbn.value)
  if (!isbn.value.trim() || !Number.isSafeInteger(isbnNumber) || isbnNumber < 0) {
    errorMessage.value = 'Please enter a valid ISBN number.'
    return
  }
  if (!name.value.trim()) {
    errorMessage.value = 'Please enter a book name.'
    return
  }
  pending.value = true
  try {
    await addDoc(collection(db, 'books'), {
      isbn: isbnNumber,
      name: name.value.trim()
    })
    isbn.value = ''
    name.value = ''
    message.value = 'Book added successfully!'
    bookListVersion.value += 1
  } catch (error) {
    console.error('Error adding book:', error.code)
    errorMessage.value = `Error adding book: ${error.code || 'Please try again.'}`
  } finally {
    pending.value = false
  }
}
</script>
