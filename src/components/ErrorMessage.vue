<script setup lang="ts">
defineProps<{
  message: string
  type?: 'error' | 'warning' | 'info'
}>()

const emit = defineEmits<{
  dismiss: []
}>()
</script>

<template>
  <div 
    :class="[
      'rounded-lg p-4 mb-4',
      type === 'warning' ? 'bg-yellow-50 text-yellow-800 border border-yellow-200' : '',
      type === 'info' ? 'bg-blue-50 text-blue-800 border border-blue-200' : '',
      (type === 'error' || !type) ? 'bg-red-50 text-red-800 border border-red-200' : ''
    ]"
    role="alert"
    aria-live="assertive"
  >
    <div class="flex items-start justify-between">
      <div class="flex items-start">
        <svg 
          class="h-5 w-5 mr-3 mt-0.5" 
          fill="currentColor" 
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path 
            fill-rule="evenodd" 
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
            clip-rule="evenodd" 
          />
        </svg>
        <p class="text-sm font-medium">{{ message }}</p>
      </div>
      <button
        @click="emit('dismiss')"
        type="button"
        class="ml-4 inline-flex text-current hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current"
        aria-label="Dismiss error"
      >
        <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path 
            fill-rule="evenodd" 
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
            clip-rule="evenodd" 
          />
        </svg>
      </button>
    </div>
  </div>
</template>
