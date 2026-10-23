<template>
  <div class="container mt-5 text-center">
    <h1>WEATHER APP</h1>
    <form class="d-flex gap-2 mx-auto my-4" style="max-width: 460px" @submit.prevent="searchByCity">
      <input v-model="city" class="form-control" placeholder="Enter city name" aria-label="City" required />
      <button class="btn btn-primary" :disabled="loading">Search</button>
    </form>
    <p v-if="loading" role="status">Loading weather...</p>
    <p v-if="errorMessage" class="text-danger" role="alert">{{ errorMessage }}</p>
    <main v-if="weatherData">
      <h2>{{ weatherData.name }}, {{ weatherData.sys.country }}</h2>
      <img :src="iconUrl" alt="Weather Icon" width="100" height="100" />
      <p>{{ temperature }} °C</p>
      <p>{{ weatherData.weather[0].description }}</p>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const apikey = import.meta.env.VITE_OPENWEATHER_API_KEY?.trim()
const city = ref('')
const weatherData = ref(null)
const loading = ref(false)
const errorMessage = ref('')
let requestId = 0

const temperature = computed(() => weatherData.value ? Math.round(weatherData.value.main.temp * 100) / 100 : null)
const iconUrl = computed(() => weatherData.value
  ? `https://openweathermap.org/img/wn/${weatherData.value.weather[0].icon}@2x.png`
  : null)

const checkApiKey = () => {
  if (apikey) return true
  errorMessage.value = 'Weather service is not configured yet.'
  return false
}

const fetchWeatherData = async (params) => {
  if (!checkApiKey()) return
  const currentRequest = ++requestId
  loading.value = true
  errorMessage.value = ''
  weatherData.value = null
  try {
    const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: { ...params, appid: apikey, units: 'metric' },
      timeout: 15000
    })
    if (currentRequest === requestId) weatherData.value = response.data
  } catch (error) {
    if (currentRequest !== requestId) return
    const status = error.response?.status
    errorMessage.value = status === 404 ? 'City not found. Please check the city name.'
      : status === 401 ? 'The weather API key is invalid or not active yet.'
        : status === 429 ? 'Too many weather requests. Please try again later.'
          : 'Unable to load weather. Please try again.'
  } finally {
    if (currentRequest === requestId) loading.value = false
  }
}

const searchByCity = () => {
  if (!city.value.trim()) {
    errorMessage.value = 'Please enter a city name.'
    return
  }
  fetchWeatherData({ q: city.value.trim() })
}

const fetchCurrentLocationWeather = () => {
  if (!checkApiKey()) return
  if (!navigator.geolocation) {
    errorMessage.value = 'Location is unavailable. Please search by city.'
    return
  }
  const initialRequest = requestId
  navigator.geolocation.getCurrentPosition((position) => {
    if (requestId !== initialRequest) return
    const { latitude, longitude } = position.coords
    fetchWeatherData({ lat: latitude, lon: longitude })
  }, () => {
    if (requestId === initialRequest) errorMessage.value = 'Unable to access your location. Please search by city.'
  }, { timeout: 10000 })
}

onMounted(fetchCurrentLocationWeather)
</script>
