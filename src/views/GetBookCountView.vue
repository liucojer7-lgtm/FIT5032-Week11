<template>
  <section class="container mt-5">
    <h1>Book Counter</h1>
    <button class="btn btn-primary" @click="getBookCount" :disabled="loading">Get Book Count</button>
    <p v-if="loading" role="status">Loading...</p>
    <p v-if="count !== null" role="status">Total number of books: {{ count }}</p>
    <p v-if="error" role="alert">{{ error }}</p>
  </section>
</template>

<script setup>
import axios from 'axios';
import { ref } from 'vue';

const count = ref(null);
const error = ref(null);
const loading = ref(false);

const getBookCount = async () => {
  count.value = null;
  error.value = null;
  loading.value = true;
  try {
    // Set this URL after deploying countBooks in lab 9.4.
    const url = import.meta.env.VITE_COUNT_BOOKS_URL;
    if (!url) {
      error.value = 'The book count service is not configured yet. Complete lab 9.4 first.';
      return;
    }
    const response = await axios.get(url, { timeout: 15000 });
    if (!Number.isInteger(response.data.count) || response.data.count < 0) {
      throw new Error('Invalid book count response');
    }
    count.value = response.data.count;
    error.value = null;
  } catch {
    error.value = 'Error fetching book count';
    count.value = null;
  } finally {
    loading.value = false;
  }
};
</script>
