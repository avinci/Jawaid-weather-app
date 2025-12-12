<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  search: [query: string]
}>()

const query = ref('')
const errorMessage = ref('')
const isSearching = ref(false)

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
  if (import.meta.env.DEV) {
    console.debug(`[SearchBar] Searching for: ${query.value}`)
  }
  
  emit('search', query.value.trim())
}

/**
 * Expose isSearching state for parent to control
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
  <div class="bg-white rounded-lg shadow-sm p-4">
    <form @submit.prevent="handleSubmit" class="flex gap-2">
      <div class="flex-1">
        <label for="location-search" class="sr-only">Search location</label>
        <input
          id="location-search"
          v-model="query"
          type="text"
          placeholder="Enter city, zipcode, or region"
          :disabled="isSearching"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          aria-describedby="search-error"
          :aria-invalid="errorMessage ? 'true' : 'false'"
        />
        <p 
          v-if="errorMessage" 
          id="search-error"
          class="mt-1 text-sm text-red-600"
          role="alert"
        >
          {{ errorMessage }}
        </p>
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
