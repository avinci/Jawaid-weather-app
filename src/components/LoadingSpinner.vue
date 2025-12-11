<script setup lang="ts">
defineProps<{
  message?: string
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center p-8" role="status" aria-live="polite">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" aria-hidden="true"></div>
    <p v-if="message" class="mt-4 text-gray-600">{{ message }}</p>
    <span class="sr-only">Loading...</span>
  </div>
</template>
