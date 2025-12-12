<script setup lang="ts">
import type { DailyForecast } from '../services/weatherApi'

defineProps<{
  forecasts: DailyForecast[]
}>()

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  })
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-xl font-bold text-gray-900 mb-4">7-Day Forecast</h2>
    
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
      <div 
        v-for="(day, index) in forecasts"
        :key="day.date"
        class="bg-gray-50 rounded-lg p-4 text-center border border-gray-200 hover:border-blue-300 transition-colors"
      >
        <p class="font-semibold text-gray-900 mb-1">
          {{ index === 0 ? 'Today' : day.dayOfWeek }}
        </p>
        <p class="text-sm text-gray-500 mb-3">{{ formatDate(day.date) }}</p>
        
        <img 
          :src="day.conditionIcon" 
          :alt="day.condition"
          class="w-12 h-12 mx-auto mb-2"
          aria-hidden="true"
        />
        
        <p class="text-sm text-gray-600 mb-3 min-h-[2.5rem] flex items-center justify-center">
          {{ day.condition }}
        </p>
        
        <div class="flex items-center justify-center gap-2 mb-2">
          <span class="text-lg font-bold text-gray-900">{{ Math.round(day.highTemp) }}°</span>
          <span class="text-gray-400">/</span>
          <span class="text-lg text-gray-600">{{ Math.round(day.lowTemp) }}°</span>
        </div>
        
        <div class="text-xs text-gray-500 space-y-1">
          <div class="flex items-center justify-center gap-1">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
            </svg>
            <span>{{ day.precipitationChance }}%</span>
          </div>
          <div class="flex items-center justify-center gap-1">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clip-rule="evenodd" />
            </svg>
            <span>{{ Math.round(day.windSpeed) }} mph</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
