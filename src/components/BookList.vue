<template>
  <section class="mt-5">
    <h1>Books with ISBN &gt; 1000</h1>
    <p v-if="loading" role="status">Loading books...</p>
    <p v-else-if="errorMessage" class="text-danger" role="alert">{{ errorMessage }}</p>
    <p v-else-if="books.length === 0">No books with ISBN &gt; 1000 found.</p>
    <ul v-else>
      <li v-for="book in books" :key="book.id">
        {{ book.name }} (ISBN: {{ book.isbn }})
      </li>
    </ul>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import db from '../firebase/init.js'
import { collection, query, where, getDocs } from 'firebase/firestore'

const books = ref([])
const loading = ref(false)
const errorMessage = ref('')

const fetchBooks = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    const q = query(collection(db, 'books'), where('isbn', '>', 1000))
    const querySnapshot = await getDocs(q)
    books.value = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
  } catch (error) {
    console.error('Error fetching books:', error.code)
    errorMessage.value = `Error fetching books: ${error.code || 'Please try again.'}`
  } finally {
    loading.value = false
  }
}

onMounted(fetchBooks)
</script>
