<script setup lang="ts">
import type { HourlyForecast } from '../services/weatherApi'

defineProps<{
  forecasts: HourlyForecast[]
}>()
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-xl font-bold text-gray-900 mb-4">24-Hour Forecast</h2>
    
    <div class="overflow-x-auto -mx-2 px-2">
      <div class="flex gap-4 pb-2" style="scroll-snap-type: x mandatory;">
        <div 
          v-for="hour in forecasts"
          :key="hour.time"
          class="flex-shrink-0 bg-gray-50 rounded-lg p-4 text-center border border-gray-200 hover:border-blue-300 transition-colors w-24"
          style="scroll-snap-align: start;"
        >
          <p class="font-semibold text-gray-900 mb-2 text-sm">
            {{ hour.timeDisplay }}
          </p>
          
          <img 
            :src="hour.conditionIcon" 
            :alt="hour.condition"
            class="w-10 h-10 mx-auto mb-2"
            aria-hidden="true"
          />
          
          <p class="text-lg font-bold text-gray-900 mb-2">
            {{ Math.round(hour.temperature) }}°
          </p>
          
          <p class="text-xs text-gray-600 mb-2 min-h-[2rem] flex items-center justify-center">
            {{ hour.condition }}
          </p>
          
          <div class="flex items-center justify-center gap-1 text-xs text-gray-500">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
            </svg>
            <span>{{ hour.precipitationChance }}%</span>
          </div>
        </div>
      </div>
    </div>
    
    <p class="text-xs text-gray-500 mt-2 text-center">Scroll horizontally to view all hours</p>
  </div>
</template>

<style scoped>
.overflow-x-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.7);
}
</style>
