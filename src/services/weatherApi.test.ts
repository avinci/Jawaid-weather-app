import { describe, it, expect } from 'vitest'
import * as weatherApi from './weatherApi'

/**
 * BVT: Weather API Service Smoke Tests
 * Verifies API service module structure and exports
 */
describe('weatherApi - BVT', () => {
  it('should export searchLocations function', () => {
    expect(weatherApi.searchLocations).toBeDefined()
    expect(typeof weatherApi.searchLocations).toBe('function')
  })

  it('should export fetchWeatherByLocation function', () => {
    expect(weatherApi.fetchWeatherByLocation).toBeDefined()
    expect(typeof weatherApi.fetchWeatherByLocation).toBe('function')
  })

  it('searchLocations should be async', () => {
    const result = weatherApi.searchLocations('test')
    expect(result).toBeInstanceOf(Promise)
  })

  it('fetchWeatherByLocation should be async', () => {
    const result = weatherApi.fetchWeatherByLocation('test')
    expect(result).toBeInstanceOf(Promise)
  })
})
