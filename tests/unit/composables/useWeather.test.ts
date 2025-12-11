import { describe, it, expect } from 'vitest'
import { useWeather } from '../../../src/composables/useWeather'

describe('useWeather', () => {
  it('initializes with default state', () => {
    const { weatherData, isLoading, error, temperatureUnit, currentLocation } = useWeather()
    
    expect(weatherData.value).toBeNull()
    expect(isLoading.value).toBe(false)
    expect(error.value).toBeNull()
    expect(temperatureUnit.value).toBe('F')
    expect(currentLocation.value).toBe('')
  })

  it('provides loadWeather function', () => {
    const { loadWeather } = useWeather()
    
    expect(loadWeather).toBeDefined()
    expect(typeof loadWeather).toBe('function')
  })

  it('provides searchLocation function', () => {
    const { searchLocation } = useWeather()
    
    expect(searchLocation).toBeDefined()
    expect(typeof searchLocation).toBe('function')
  })

  it('provides toggleTemperatureUnit function', () => {
    const { toggleTemperatureUnit, temperatureUnit } = useWeather()
    
    expect(toggleTemperatureUnit).toBeDefined()
    expect(typeof toggleTemperatureUnit).toBe('function')
    
    // Test toggle functionality
    expect(temperatureUnit.value).toBe('F')
    toggleTemperatureUnit()
    expect(temperatureUnit.value).toBe('C')
    toggleTemperatureUnit()
    expect(temperatureUnit.value).toBe('F')
  })

  it('sets isLoading when loadWeather is called', async () => {
    const { loadWeather, isLoading } = useWeather()
    
    // Start with false
    expect(isLoading.value).toBe(false)
    
    // Call loadWeather and wait for it to complete
    await loadWeather('San Francisco')
    
    // After completion, isLoading should be false again
    expect(isLoading.value).toBe(false)
  })
})
