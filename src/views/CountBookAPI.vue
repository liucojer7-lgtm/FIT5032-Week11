<template>
  <p v-if="loading" role="status">Loading...</p>
  <p v-else-if="error" role="alert">{{ error }}</p>
  <pre v-else>{{ jsondata }}</pre>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const jsondata = ref(null)
const error = ref(null)
const loading = ref(true)

const getBookCountAPI = async () => {
  loading.value = true
  error.value = null
  jsondata.value = null
  try {
    const url = import.meta.env.VITE_COUNT_BOOKS_URL
    if (!url) throw new Error('Book count service is not configured')
    const response = await axios.get(url, { timeout: 15000 })
    jsondata.value = JSON.stringify(response.data, null, 2)
  } catch {
    error.value = 'Error fetching book count'
  } finally {
    loading.value = false
  }
}

onMounted(getBookCountAPI)
</script>

<style scoped>
pre { white-space: pre-wrap; overflow-wrap: anywhere; }
</style>
