<script setup lang="ts">
import type { TemperatureUnit } from '../composables/useWeather'

defineProps<{
  currentUnit: TemperatureUnit
}>()

const emit = defineEmits<{
  toggle: []
}>()

function handleToggle() {
  emit('toggle')
}
</script>

<template>
  <div class="flex items-center gap-2">
    <span class="text-sm text-gray-600">Temperature:</span>
    <button
      type="button"
      @click="handleToggle"
      class="inline-flex rounded-md border border-gray-300 bg-white shadow-sm"
      aria-label="Toggle temperature unit"
    >
      <span
        :class="[
          'px-3 py-1.5 text-sm font-medium transition-colors',
          currentUnit === 'F'
            ? 'bg-blue-600 text-white rounded-l-md'
            : 'text-gray-700 hover:bg-gray-50 rounded-l-md'
        ]"
      >
        °F
      </span>
      <span
        :class="[
          'px-3 py-1.5 text-sm font-medium transition-colors',
          currentUnit === 'C'
            ? 'bg-blue-600 text-white rounded-r-md'
            : 'text-gray-700 hover:bg-gray-50 rounded-r-md'
        ]"
      >
        °C
      </span>
    </button>
  </div>
</template>
