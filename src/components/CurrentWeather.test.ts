import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CurrentWeather from './CurrentWeather.vue'
import type { CurrentWeather as CurrentWeatherType } from '../services/weatherApi'

/**
 * BVT: CurrentWeather Component Smoke Tests
 * Verifies critical weather display functionality
 */
describe('CurrentWeather.vue - BVT', () => {
  const mockWeatherData: CurrentWeatherType = {
    location: 'San Francisco, California',
    temperatureF: 65,
    temperatureC: 18,
    feelsLikeF: 63,
    feelsLikeC: 17,
    condition: 'Partly cloudy',
    conditionIcon: 'https://cdn.weatherapi.com/weather/64x64/day/116.png',
    humidity: 70,
    windSpeed: 10,
    windDirection: 'W',
    lastUpdated: '2024-01-15 10:30'
  }

  it('should mount without crashing', () => {
    const wrapper = mount(CurrentWeather, {
      props: {
        weather: mockWeatherData,
        temperatureUnit: 'F'
      }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('should display location name', () => {
    const wrapper = mount(CurrentWeather, {
      props: {
        weather: mockWeatherData,
        temperatureUnit: 'F'
      }
    })
    
    expect(wrapper.text()).toContain('San Francisco, California')
  })

  it('should display temperature in Fahrenheit', () => {
    const wrapper = mount(CurrentWeather, {
      props: {
        weather: mockWeatherData,
        temperatureUnit: 'F'
      }
    })
    
    expect(wrapper.text()).toContain('65°F')
  })

  it('should display temperature in Celsius', () => {
    const wrapper = mount(CurrentWeather, {
      props: {
        weather: mockWeatherData,
        temperatureUnit: 'C'
      }
    })
    
    expect(wrapper.text()).toContain('18°C')
  })

  it('should display weather condition', () => {
    const wrapper = mount(CurrentWeather, {
      props: {
        weather: mockWeatherData,
        temperatureUnit: 'F'
      }
    })
    
    expect(wrapper.text()).toContain('Partly cloudy')
  })

  it('should display weather icon', () => {
    const wrapper = mount(CurrentWeather, {
      props: {
        weather: mockWeatherData,
        temperatureUnit: 'F'
      }
    })
    
    const icon = wrapper.find('img')
    expect(icon.exists()).toBe(true)
    expect(icon.attributes('src')).toBe(mockWeatherData.conditionIcon)
  })

  it('should display humidity and wind data', () => {
    const wrapper = mount(CurrentWeather, {
      props: {
        weather: mockWeatherData,
        temperatureUnit: 'F'
      }
    })
    
    expect(wrapper.text()).toContain('70%')  // humidity
    expect(wrapper.text()).toContain('10 mph')  // wind speed
    expect(wrapper.text()).toContain('W')  // wind direction
  })
})
