import { describe, it, expect, vi, beforeEach } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { useWeather } from '../../../src/composables/useWeather'
import * as weatherApi from '../../../src/services/weatherApi'

// Mock the weatherApi module
vi.mock('../../../src/services/weatherApi', () => ({
  fetchWeatherByLocation: vi.fn()
}))

// Helper function to test composable in a component context
function mountComposable(setup: () => any) {
  const Component = defineComponent({
    setup,
    render() {
      return h('div')
    }
  })
  const wrapper = mount(Component)
  return wrapper.vm
}

describe('useWeather', () => {
  const mockWeatherData = {
    current: {
      location: 'San Francisco, California',
      temperatureF: 65,
      temperatureC: 18,
      feelsLikeF: 63,
      feelsLikeC: 17,
      condition: 'Partly cloudy',
      conditionIcon: 'https://example.com/icon.png',
      humidity: 72,
      windSpeed: 10,
      windDirection: 'W',
      lastUpdated: '2025-12-11 15:00'
    },
    daily: [
      {
        date: '2025-12-11',
        dayOfWeek: 'Wednesday',
        highTempF: 68,
        lowTempF: 55,
        highTempC: 20,
        lowTempC: 13,
        condition: 'Partly cloudy',
        conditionIcon: 'https://example.com/icon.png',
        precipitationChance: 20,
        windSpeed: 12
      }
    ],
    hourly: [
      {
        time: '2025-12-11 15:00',
        timeDisplay: '3:00 PM',
        temperatureF: 65,
        temperatureC: 18,
        condition: 'Partly cloudy',
        conditionIcon: 'https://example.com/icon.png',
        precipitationChance: 15
      }
    ]
  }

  beforeEach(() => {
    vi.clearAllMocks()
    // Don't auto-call on mount for most tests
    vi.spyOn(weatherApi, 'fetchWeatherByLocation').mockResolvedValue(mockWeatherData)
  })

  it('initializes with default state (before mount completes)', async () => {
    let result: ReturnType<typeof useWeather>
    
    mountComposable(() => {
      result = useWeather()
      return result
    })
    
    // Initially F (default)
    expect(result!.temperatureUnit.value).toBe('F')
    
    // Wait for auto-load to complete
    await vi.waitFor(() => expect(result!.isLoading.value).toBe(false), { timeout: 1000 })
  })

  it('auto-loads San Francisco weather on mount', async () => {
    let result: ReturnType<typeof useWeather>
    
    mountComposable(() => {
      result = useWeather()
      return result
    })
    
    // Wait for the onMounted hook to complete
    await vi.waitFor(() => expect(result!.isLoading.value).toBe(false), { timeout: 1000 })
    
    expect(weatherApi.fetchWeatherByLocation).toHaveBeenCalledWith('San Francisco')
    expect(result!.weatherData.value).not.toBeNull()
    expect(result!.weatherData.value?.current.location).toBe('San Francisco, California')
  })

  it('sets loading state during weather fetch', async () => {
    let resolvePromise: (value: any) => void
    const promise = new Promise(resolve => {
      resolvePromise = resolve
    })
    
    vi.spyOn(weatherApi, 'fetchWeatherByLocation').mockReturnValue(promise as any)
    
    let result: ReturnType<typeof useWeather>
    mountComposable(() => {
      result = useWeather()
      return result
    })
    
    // Wait for mount to complete first (will be stuck loading)
    await vi.waitFor(() => expect(result!.isLoading.value).toBe(true), { timeout: 100 })
    
    resolvePromise!(mockWeatherData)
    await vi.waitFor(() => expect(result!.isLoading.value).toBe(false), { timeout: 1000 })
  })

  it('updates weatherData and currentLocation on successful load', async () => {
    let result: ReturnType<typeof useWeather>
    mountComposable(() => {
      result = useWeather()
      return result
    })
    
    // Wait for initial mount load
    await vi.waitFor(() => expect(result!.isLoading.value).toBe(false), { timeout: 1000 })
    
    await result!.loadWeather('New York')
    
    expect(result!.weatherData.value).toEqual(mockWeatherData)
    expect(result!.currentLocation.value).toBe('San Francisco, California')
  })

  it('sets error message on failed load', async () => {
    const errorMessage = 'Location not found'
    vi.spyOn(weatherApi, 'fetchWeatherByLocation').mockRejectedValue(new Error(errorMessage))
    
    let result: ReturnType<typeof useWeather>
    mountComposable(() => {
      result = useWeather()
      return result
    })
    
    // Wait for initial mount load (which will fail)
    await vi.waitFor(() => expect(result!.isLoading.value).toBe(false), { timeout: 1000 })
    
    expect(result!.error.value).toBe(errorMessage)
    expect(result!.weatherData.value).toBeNull()
  })

  it('clears error before new load attempt', async () => {
    // First load fails
    vi.spyOn(weatherApi, 'fetchWeatherByLocation').mockRejectedValueOnce(new Error('Network error'))
    
    let result: ReturnType<typeof useWeather>
    mountComposable(() => {
      result = useWeather()
      return result
    })
    
    await vi.waitFor(() => expect(result!.isLoading.value).toBe(false), { timeout: 1000 })
    expect(result!.error.value).toBe('Network error')
    
    // Second load succeeds
    vi.spyOn(weatherApi, 'fetchWeatherByLocation').mockResolvedValueOnce(mockWeatherData)
    await result!.loadWeather('San Francisco')
    
    expect(result!.error.value).toBeNull()
  })

  it('provides clearError function', async () => {
    vi.spyOn(weatherApi, 'fetchWeatherByLocation').mockRejectedValue(new Error('Test error'))
    
    let result: ReturnType<typeof useWeather>
    mountComposable(() => {
      result = useWeather()
      return result
    })
    
    await vi.waitFor(() => expect(result!.isLoading.value).toBe(false), { timeout: 1000 })
    expect(result!.error.value).toBe('Test error')
    
    result!.clearError()
    expect(result!.error.value).toBeNull()
  })

  it('toggles temperature unit between F and C', async () => {
    let result: ReturnType<typeof useWeather>
    mountComposable(() => {
      result = useWeather()
      return result
    })
    
    await vi.waitFor(() => expect(result!.isLoading.value).toBe(false), { timeout: 1000 })
    
    expect(result!.temperatureUnit.value).toBe('F')
    result!.toggleTemperatureUnit()
    expect(result!.temperatureUnit.value).toBe('C')
    result!.toggleTemperatureUnit()
    expect(result!.temperatureUnit.value).toBe('F')
  })

  it('toggles temperature unit in less than 100ms', async () => {
    let result: ReturnType<typeof useWeather>
    mountComposable(() => {
      result = useWeather()
      return result
    })
    
    await vi.waitFor(() => expect(result!.isLoading.value).toBe(false), { timeout: 1000 })
    
    const startTime = performance.now()
    result!.toggleTemperatureUnit()
    const endTime = performance.now()
    const duration = endTime - startTime
    
    expect(duration).toBeLessThan(100)
    expect(result!.temperatureUnit.value).toBe('C')
  })

  it('defaults to Fahrenheit on initialization', () => {
    let result: ReturnType<typeof useWeather>
    mountComposable(() => {
      result = useWeather()
      return result
    })
    
    expect(result!.temperatureUnit.value).toBe('F')
  })

  it('does not persist temperature unit between sessions', () => {
    // First instance
    let result1: ReturnType<typeof useWeather>
    mountComposable(() => {
      result1 = useWeather()
      return result1
    })
    
    result1!.toggleTemperatureUnit()
    expect(result1!.temperatureUnit.value).toBe('C')
    
    // New instance (simulating page refresh)
    let result2: ReturnType<typeof useWeather>
    mountComposable(() => {
      result2 = useWeather()
      return result2
    })
    
    // Should be back to default F
    expect(result2!.temperatureUnit.value).toBe('F')
  })

  it('searchLocation calls loadWeather with query', async () => {
    let result: ReturnType<typeof useWeather>
    mountComposable(() => {
      result = useWeather()
      return result
    })
    
    await vi.waitFor(() => expect(result!.isLoading.value).toBe(false), { timeout: 1000 })
    
    vi.clearAllMocks()
    
    await result!.searchLocation('Boston')
    
    expect(weatherApi.fetchWeatherByLocation).toHaveBeenCalledWith('Boston')
  })
})
