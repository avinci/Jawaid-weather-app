<script setup lang="ts">
import { computed } from 'vue'
import type { LocationSuggestion } from '../services/weatherApi'

interface Props {
  suggestions: LocationSuggestion[]
  isLoading: boolean
  selectedIndex: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  select: [suggestion: LocationSuggestion]
  hover: [index: number]
}>()

/**
 * Format location for display
 * Shows: City, Region (if different from City), Country
 */
function formatLocation(suggestion: LocationSuggestion): string {
  const parts = [suggestion.name]
  
  // Add region if it exists and is different from city name
  if (suggestion.region && suggestion.region !== suggestion.name) {
    parts.push(suggestion.region)
  }
  
  parts.push(suggestion.country)
  
  return parts.join(', ')
}

/**
 * Handle suggestion click
 */
function handleSelect(suggestion: LocationSuggestion) {
  emit('select', suggestion)
}

/**
 * Check if we should show the dropdown
 */
const showDropdown = computed(() => {
  return props.isLoading || props.suggestions.length > 0
})
</script>

<template>
  <div 
    v-if="showDropdown"
    class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
    role="listbox"
  >
    <!-- Loading state -->
    <div 
      v-if="isLoading" 
      class="px-4 py-3 text-sm text-gray-600"
      role="status"
      aria-live="polite"
    >
      <span class="flex items-center gap-2">
        <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Searching...
      </span>
    </div>

    <!-- Suggestions list -->
    <ul 
      v-else-if="suggestions.length > 0" 
      class="py-1"
    >
      <li
        v-for="(suggestion, index) in suggestions"
        :key="suggestion.id"
        :class="[
          'px-4 py-2 cursor-pointer transition-colors',
          index === selectedIndex 
            ? 'bg-blue-50 text-blue-900' 
            : 'hover:bg-gray-50 text-gray-900'
        ]"
        role="option"
        :aria-selected="index === selectedIndex"
        @click="handleSelect(suggestion)"
        @mouseenter="$emit('hover', index)"
      >
        {{ formatLocation(suggestion) }}
      </li>
    </ul>

    <!-- Empty state -->
    <div 
      v-else 
      class="px-4 py-3 text-sm text-gray-500"
      role="status"
    >
      No results found
    </div>
  </div>
</template>
