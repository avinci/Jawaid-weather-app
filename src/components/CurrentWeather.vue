<script setup lang="ts">
import type { CurrentWeather } from '../services/weatherApi'
import type { TemperatureUnit } from '../composables/useWeather'

defineProps<{
  weather: CurrentWeather
  temperatureUnit: TemperatureUnit
}>()

function formatTime(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit', 
    hour12: true 
  })
}

function formatDate(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  })
}

function getTemperature(weather: CurrentWeather, unit: TemperatureUnit): number {
  return unit === 'F' ? weather.temperatureF : weather.temperatureC
}

function getFeelsLike(weather: CurrentWeather, unit: TemperatureUnit): number {
  return unit === 'F' ? weather.feelsLikeF : weather.feelsLikeC
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="flex items-start justify-between mb-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 mb-1">{{ weather.location }}</h2>
        <p class="text-sm text-gray-500">
          Last updated: {{ formatTime(weather.lastUpdated) }} on {{ formatDate(weather.lastUpdated) }}
        </p>
      </div>
      <img 
        :src="weather.conditionIcon" 
        :alt="weather.condition"
        class="w-16 h-16"
        aria-hidden="true"
      />
    </div>

    <div class="grid grid-cols-2 gap-6 mb-6">
      <div>
        <p class="text-5xl font-bold text-gray-900 mb-1">
          {{ Math.round(getTemperature(weather, temperatureUnit)) }}°{{ temperatureUnit }}
        </p>
        <p class="text-lg text-gray-600">
          Feels like {{ Math.round(getFeelsLike(weather, temperatureUnit)) }}°{{ temperatureUnit }}
        </p>
      </div>
      <div class="flex items-center">
        <p class="text-2xl font-medium text-gray-700">
          {{ weather.condition }}
        </p>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
      <div>
        <p class="text-sm text-gray-500 mb-1">Humidity</p>
        <p class="text-lg font-semibold text-gray-900">{{ weather.humidity }}%</p>
      </div>
      <div>
        <p class="text-sm text-gray-500 mb-1">Wind Speed</p>
        <p class="text-lg font-semibold text-gray-900">{{ Math.round(weather.windSpeed) }} mph</p>
      </div>
      <div>
        <p class="text-sm text-gray-500 mb-1">Wind Direction</p>
        <p class="text-lg font-semibold text-gray-900">{{ weather.windDirection }}</p>
      </div>
    </div>
  </div>
</template>
