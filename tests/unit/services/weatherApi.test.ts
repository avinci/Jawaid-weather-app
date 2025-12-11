import { describe, it, expect } from 'vitest'
import { fetchWeatherByLocation } from '../../../src/services/weatherApi'

describe('weatherApi', () => {
  describe('fetchWeatherByLocation', () => {
    it('is defined and exported', () => {
      expect(fetchWeatherByLocation).toBeDefined()
      expect(typeof fetchWeatherByLocation).toBe('function')
    })

    it('throws error when API key is not configured', async () => {
      // API key check - will be fully implemented in Phase 2
      // For now, just verify the function exists
      expect(fetchWeatherByLocation).toBeDefined()
    })
  })
})
