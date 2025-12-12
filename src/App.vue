<script setup lang="ts">
import { ref } from 'vue'
import { useWeather } from './composables/useWeather'
import SearchBar from './components/SearchBar.vue'
import LoadingSpinner from './components/LoadingSpinner.vue'
import ErrorMessage from './components/ErrorMessage.vue'
import CurrentWeather from './components/CurrentWeather.vue'
import SevenDayForecast from './components/SevenDayForecast.vue'
import HourlyForecast from './components/HourlyForecast.vue'

const { weatherData, isLoading, error, clearError, searchLocation } = useWeather()
const searchBarRef = ref<InstanceType<typeof SearchBar> | null>(null)

/**
 * Handle search from SearchBar component
 * @param query - Location search query
 */
async function handleSearch(query: string) {
  if (import.meta.env.DEV) {
    console.debug(`[App] Handling search for: ${query}`)
  }
  
  // Clear SearchBar error and set searching state
  if (searchBarRef.value) {
    searchBarRef.value.clearError()
    searchBarRef.value.setSearching(true)
  }
  
  // Clear previous weather errors
  clearError()
  
  // Perform search
  await searchLocation(query)
  
  // Reset searching state
  if (searchBarRef.value) {
    searchBarRef.value.setSearching(false)
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <h1 class="text-2xl font-bold text-gray-900">Weather Forecast</h1>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      <!-- Search Bar -->
      <SearchBar 
        ref="searchBarRef"
        @search="handleSearch"
      />

      <!-- Error Message -->
      <ErrorMessage 
        v-if="error"
        :message="error"
        @dismiss="clearError"
      />

      <!-- Loading State -->
      <LoadingSpinner 
        v-if="isLoading"
        message="Loading weather data..."
      />

      <!-- Weather Content -->
      <template v-else-if="weatherData">
        <!-- Current Weather -->
        <CurrentWeather :weather="weatherData.current" />

        <!-- 7-Day Forecast -->
        <SevenDayForecast :forecasts="weatherData.daily" />

        <!-- 24-Hour Forecast -->
        <HourlyForecast :forecasts="weatherData.hourly" />
      </template>
    </main>
  </div>
</template>
