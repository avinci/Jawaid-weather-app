import { describe, it, expect } from 'vitest'
import { fetchWeatherByLocation } from '../../../src/services/weatherApi'

describe('weatherApi', () => {
  describe('fetchWeatherByLocation', () => {
    it('is defined and exported', () => {
      expect(fetchWeatherByLocation).toBeDefined()
      expect(typeof fetchWeatherByLocation).toBe('function')
    })

    it('is defined as a function', () => {
      // API key check will be fully implemented in Phase 2
      expect(fetchWeatherByLocation).toBeDefined()
      expect(typeof fetchWeatherByLocation).toBe('function')
    })
  })
})
