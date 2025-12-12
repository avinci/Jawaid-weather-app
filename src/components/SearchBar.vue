<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { logger } from '../utils/logger'
import { debounce } from '../utils/debounce'
import { searchLocations, type LocationSuggestion } from '../services/weatherApi'
import SearchDropdown from './SearchDropdown.vue'

const emit = defineEmits<{
  search: [query: string]
}>()

const query = ref('')
const errorMessage = ref('')
const isSearching = ref(false)
const suggestions = ref<LocationSuggestion[]>([])
const isLoadingSuggestions = ref(false)
const showDropdown = ref(false)
const selectedIndex = ref(-1)
const dropdownRef = ref<HTMLDivElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)

/**
 * Handle search form submission
 */
function handleSubmit() {
  // Clear previous error
  errorMessage.value = ''
  
  // Validate input
  if (!query.value.trim()) {
    errorMessage.value = 'Please enter a location to search.'
    return
  }
  
  // Emit search event
  logger.debug(`[SearchBar] Searching for: ${query.value}`)
  
  // Hide dropdown on submit
  showDropdown.value = false
  suggestions.value = []
  
  emit('search', query.value.trim())
}

/**
 * Fetch location suggestions
 */
async function fetchSuggestions(searchQuery: string) {
  if (searchQuery.length < 2) {
    suggestions.value = []
    showDropdown.value = false
    return
  }
  
  isLoadingSuggestions.value = true
  showDropdown.value = true
  
  try {
    const results = await searchLocations(searchQuery)
    suggestions.value = results
    selectedIndex.value = -1
  } catch (error) {
    logger.debug(`[SearchBar] Error fetching suggestions: ${error}`)
    suggestions.value = []
  } finally {
    isLoadingSuggestions.value = false
  }
}

/**
 * Debounced search handler
 */
const debouncedSearch = debounce(fetchSuggestions, 400)

/**
 * Handle input change
 */
function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  query.value = target.value
  
  // Clear error on input
  errorMessage.value = ''
  
  // Trigger debounced search
  debouncedSearch(target.value)
}

/**
 * Handle suggestion selection
 */
function handleSuggestionSelect(suggestion: LocationSuggestion) {
  // Format location for search
  const locationQuery = `${suggestion.name}, ${suggestion.region || suggestion.country}`
  query.value = locationQuery
  
  // Hide dropdown
  showDropdown.value = false
  suggestions.value = []
  
  // Emit search
  logger.debug(`[SearchBar] Selected location: ${locationQuery}`)
  emit('search', locationQuery)
}

/**
 * Handle keyboard navigation
 */
function handleKeydown(event: KeyboardEvent) {
  if (!showDropdown.value || suggestions.value.length === 0) {
    return
  }
  
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      selectedIndex.value = Math.min(selectedIndex.value + 1, suggestions.value.length - 1)
      break
      
    case 'ArrowUp':
      event.preventDefault()
      selectedIndex.value = Math.max(selectedIndex.value - 1, -1)
      break
      
    case 'Enter':
      event.preventDefault()
      if (selectedIndex.value >= 0 && selectedIndex.value < suggestions.value.length) {
        handleSuggestionSelect(suggestions.value[selectedIndex.value])
      } else {
        handleSubmit()
      }
      break
      
    case 'Escape':
      event.preventDefault()
      showDropdown.value = false
      suggestions.value = []
      selectedIndex.value = -1
      break
  }
}

/**
 * Handle suggestion hover
 */
function handleSuggestionHover(index: number) {
  selectedIndex.value = index
}

/**
 * Handle click outside to close dropdown
 */
function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    showDropdown.value = false
    suggestions.value = []
  }
}

/**
 * Setup click-outside listener
 */
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

/**
 * Cleanup click-outside listener
 */
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

/**
 * Public API exposed for parent component control
 * 
 * @method setSearching - Control the loading state of the search button
 * @method clearError - Clear any client-side validation errors
 */
defineExpose({
  setSearching: (searching: boolean) => {
    isSearching.value = searching
  },
  clearError: () => {
    errorMessage.value = ''
  }
})
</script>

<template>
  <div ref="dropdownRef" class="bg-white rounded-lg shadow-sm p-4">
    <form @submit.prevent="handleSubmit" class="flex gap-2">
      <div class="flex-1 relative">
        <label for="location-search" class="sr-only">Search location</label>
        <input
          id="location-search"
          ref="inputRef"
          :value="query"
          type="text"
          placeholder="Enter city, zipcode, or region"
          :disabled="isSearching"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          aria-describedby="search-error"
          :aria-invalid="errorMessage ? 'true' : 'false'"
          aria-autocomplete="list"
          :aria-expanded="showDropdown"
          aria-controls="search-dropdown"
          @input="handleInput"
          @keydown="handleKeydown"
        />
        <p 
          v-if="errorMessage" 
          id="search-error"
          class="mt-1 text-sm text-red-600"
          role="alert"
        >
          {{ errorMessage }}
        </p>
        
        <!-- Dropdown -->
        <SearchDropdown
          id="search-dropdown"
          :suggestions="suggestions"
          :is-loading="isLoadingSuggestions"
          :selected-index="selectedIndex"
          @select="handleSuggestionSelect"
          @hover="handleSuggestionHover"
        />
      </div>
      <button
        type="submit"
        :disabled="isSearching"
        class="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        <span v-if="!isSearching">Search</span>
        <span v-else class="flex items-center gap-2">
          <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Searching...
        </span>
      </button>
    </form>
  </div>
</template>
