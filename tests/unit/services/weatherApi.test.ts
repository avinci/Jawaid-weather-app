import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { fetchWeatherByLocation } from '../../../src/services/weatherApi'

describe('weatherApi', () => {
  describe('fetchWeatherByLocation', () => {
    const mockApiResponse = {
      location: {
        name: 'San Francisco',
        region: 'California',
        country: 'United States'
      },
      current: {
        temp_f: 65,
        feelslike_f: 63,
        condition: {
          text: 'Partly cloudy',
          icon: '//cdn.weatherapi.com/weather/64x64/day/116.png'
        },
        humidity: 72,
        wind_mph: 10,
        wind_dir: 'W',
        last_updated: '2025-12-11 15:00'
      },
      forecast: {
        forecastday: [
          {
            date: '2025-12-11',
            day: {
              maxtemp_f: 68,
              mintemp_f: 55,
              condition: {
                text: 'Partly cloudy',
                icon: '//cdn.weatherapi.com/weather/64x64/day/116.png'
              },
              daily_chance_of_rain: 20,
              maxwind_mph: 12
            },
            hour: [
              {
                time: '2025-12-11 14:00',
                temp_f: 64,
                condition: {
                  text: 'Partly cloudy',
                  icon: '//cdn.weatherapi.com/weather/64x64/day/116.png'
                },
                chance_of_rain: 10
              },
              {
                time: '2025-12-11 15:00',
                temp_f: 65,
                condition: {
                  text: 'Partly cloudy',
                  icon: '//cdn.weatherapi.com/weather/64x64/day/116.png'
                },
                chance_of_rain: 15
              },
              {
                time: '2025-12-11 16:00',
                temp_f: 66,
                condition: {
                  text: 'Partly cloudy',
                  icon: '//cdn.weatherapi.com/weather/64x64/day/116.png'
                },
                chance_of_rain: 20
              }
            ]
          }
        ]
      }
    }

    let originalFetch: typeof global.fetch

    beforeEach(() => {
      originalFetch = global.fetch
      vi.clearAllMocks()
    })

    afterEach(() => {
      global.fetch = originalFetch
    })

    it('is defined and exported', () => {
      expect(fetchWeatherByLocation).toBeDefined()
      expect(typeof fetchWeatherByLocation).toBe('function')
    })

    it('fetches and parses weather data successfully', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockApiResponse
      })

      const result = await fetchWeatherByLocation('San Francisco')

      expect(result).toBeDefined()
      expect(result.current).toBeDefined()
      expect(result.current.location).toBe('San Francisco, California')
      expect(result.current.temperature).toBe(65)
      expect(result.current.condition).toBe('Partly cloudy')
      expect(result.daily).toBeInstanceOf(Array)
      expect(result.hourly).toBeInstanceOf(Array)
    })

    it('includes correct weather icon URLs with https protocol', async () => {
      // Mock current time to be before the forecast hours
      const now = new Date('2025-12-11T13:00:00')
      vi.setSystemTime(now)
      
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockApiResponse
      })

      const result = await fetchWeatherByLocation('San Francisco')

      expect(result.current.conditionIcon).toContain('https://')
      expect(result.daily[0].conditionIcon).toContain('https://')
      expect(result.hourly.length).toBeGreaterThan(0)
      expect(result.hourly[0].conditionIcon).toContain('https://')
      
      vi.useRealTimers()
    })

    it('throws error for 400 status (location not found)', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        statusText: 'Bad Request'
      })

      await expect(fetchWeatherByLocation('InvalidLocation123')).rejects.toThrow(
        'Location not found'
      )
    })

    it('throws error for 401 status (invalid API key)', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        statusText: 'Unauthorized'
      })

      await expect(fetchWeatherByLocation('San Francisco')).rejects.toThrow(
        'Invalid API key'
      )
    })

    it('throws error for 403 status (rate limit exceeded)', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 403,
        statusText: 'Forbidden'
      })

      await expect(fetchWeatherByLocation('San Francisco')).rejects.toThrow(
        'Service temporarily unavailable'
      )
    })

    it('throws network error for fetch failure', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

      await expect(fetchWeatherByLocation('San Francisco')).rejects.toThrow(
        'Connection lost. Please check your internet and try again.'
      )
    })

    it('parses daily forecast data correctly', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockApiResponse
      })

      const result = await fetchWeatherByLocation('San Francisco')

      expect(result.daily).toHaveLength(1)
      expect(result.daily[0].date).toBe('2025-12-11')
      expect(result.daily[0].dayOfWeek).toBeDefined()
      expect(result.daily[0].highTemp).toBe(68)
      expect(result.daily[0].lowTemp).toBe(55)
      expect(result.daily[0].precipitationChance).toBe(20)
    })

    it('filters hourly forecast to next 24 hours from current time', async () => {
      // Mock current time
      const now = new Date('2025-12-11T14:30:00')
      vi.setSystemTime(now)

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockApiResponse
      })

      const result = await fetchWeatherByLocation('San Francisco')

      expect(result.hourly).toBeInstanceOf(Array)
      // Should only include hours at or after current time
      result.hourly.forEach(hour => {
        const hourTime = new Date(hour.time).getTime()
        expect(hourTime).toBeGreaterThanOrEqual(now.getTime())
      })

      vi.useRealTimers()
    })
  })
})
