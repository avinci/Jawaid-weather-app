/**
 * Weather Composable
 * Manages weather data state and operations
 */

import { ref, onMounted, type Ref } from 'vue'
import { fetchWeatherByLocation, type WeatherData } from '../services/weatherApi'

export type TemperatureUnit = 'F' | 'C'

export interface WeatherState {
  weatherData: WeatherData | null
  isLoading: boolean
  error: string | null
  temperatureUnit: TemperatureUnit
  currentLocation: string
}

const DEFAULT_LOCATION = 'San Francisco'

/**
 * Composable for managing weather data and state
 * @returns Weather state and operations
 */
export function useWeather() {
  const weatherData: Ref<WeatherData | null> = ref(null)
  const isLoading: Ref<boolean> = ref(false)
  const error: Ref<string | null> = ref(null)
  const temperatureUnit: Ref<TemperatureUnit> = ref('F')
  const currentLocation: Ref<string> = ref('')

  /**
   * Load weather data for a given location
   * @param location - Location query string
   */
  async function loadWeather(location: string): Promise<void> {
    if (import.meta.env.DEV) {
      console.debug(`[useWeather] Loading weather for: ${location}`)
    }
    
    isLoading.value = true
    error.value = null
    
    try {
      const data = await fetchWeatherByLocation(location)
      weatherData.value = data
      currentLocation.value = data.current.location
      
      if (import.meta.env.DEV) {
        console.debug(`[useWeather] Weather loaded successfully for: ${data.current.location}`)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load weather data'
      error.value = errorMessage
      
      if (import.meta.env.DEV) {
        console.error(`[useWeather] Error loading weather:`, err)
      }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Search for weather by location
   * @param query - Location search query
   */
  async function searchLocation(query: string): Promise<void> {
    if (import.meta.env.DEV) {
      console.debug(`[useWeather] Searching location: ${query}`)
    }
    
    // Clear previous errors before new search
    error.value = null
    isLoading.value = true
    
    try {
      const data = await fetchWeatherByLocation(query)
      weatherData.value = data
      currentLocation.value = data.current.location
      
      if (import.meta.env.DEV) {
        console.debug(`[useWeather] Search successful for: ${data.current.location}`)
      }
    } catch (err) {
      // Map errors to user-friendly messages
      let errorMessage: string
      
      if (err instanceof Error) {
        errorMessage = err.message
      } else {
        errorMessage = 'An unexpected error occurred while searching for weather data.'
      }
      
      error.value = errorMessage
      
      if (import.meta.env.DEV) {
        console.error(`[useWeather] Search error:`, err)
      }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Toggle between Fahrenheit and Celsius
   */
  function toggleTemperatureUnit(): void {
    // TODO: Implement in Phase 6
    temperatureUnit.value = temperatureUnit.value === 'F' ? 'C' : 'F'
    if (import.meta.env.DEV) {
      console.debug(`[useWeather] Temperature unit toggled to: ${temperatureUnit.value}`)
    }
  }

  /**
   * Clear current error message
   */
  function clearError(): void {
    error.value = null
  }

  // Auto-load San Francisco weather on component mount
  onMounted(() => {
    if (import.meta.env.DEV) {
      console.debug(`[useWeather] Auto-loading default location: ${DEFAULT_LOCATION}`)
    }
    loadWeather(DEFAULT_LOCATION)
  })

  return {
    // State
    weatherData,
    isLoading,
    error,
    temperatureUnit,
    currentLocation,
    
    // Actions
    loadWeather,
    searchLocation,
    toggleTemperatureUnit,
    clearError,
  }
}
