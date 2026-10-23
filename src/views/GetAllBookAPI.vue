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

const getAllBookAPI = async () => {
  loading.value = true
  error.value = null
  jsondata.value = null
  try {
    const url = 'https://us-central1-fit5032-137d8.cloudfunctions.net/getAllBooks'
    if (!url) throw new Error('Books service is not configured')
    const response = await axios.get(url, { timeout: 15000 })
    jsondata.value = JSON.stringify(response.data, null, 2)
  } catch {
    error.value = 'Error fetching books'
  } finally {
    loading.value = false
  }
}

onMounted(getAllBookAPI)
</script>

<style scoped>
pre { white-space: pre-wrap; overflow-wrap: anywhere; }
</style>
