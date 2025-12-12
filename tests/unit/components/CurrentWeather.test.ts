import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CurrentWeather from '../../../src/components/CurrentWeather.vue'
import type { CurrentWeather as CurrentWeatherType } from '../../../src/services/weatherApi'

describe('CurrentWeather', () => {
  const mockWeather: CurrentWeatherType = {
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
  }

  it('renders location name', () => {
    const wrapper = mount(CurrentWeather, {
      props: { 
        weather: mockWeather,
        temperatureUnit: 'F'
      }
    })
    
    expect(wrapper.text()).toContain('San Francisco, California')
  })

  it('displays current temperature in Fahrenheit', () => {
    const wrapper = mount(CurrentWeather, {
      props: { 
        weather: mockWeather,
        temperatureUnit: 'F'
      }
    })
    
    expect(wrapper.text()).toContain('65°F')
  })

  it('displays current temperature in Celsius', () => {
    const wrapper = mount(CurrentWeather, {
      props: { 
        weather: mockWeather,
        temperatureUnit: 'C'
      }
    })
    
    expect(wrapper.text()).toContain('18°C')
  })

  it('displays feels-like temperature in Fahrenheit', () => {
    const wrapper = mount(CurrentWeather, {
      props: { 
        weather: mockWeather,
        temperatureUnit: 'F'
      }
    })
    
    expect(wrapper.text()).toContain('Feels like 63°F')
  })

  it('displays feels-like temperature in Celsius', () => {
    const wrapper = mount(CurrentWeather, {
      props: { 
        weather: mockWeather,
        temperatureUnit: 'C'
      }
    })
    
    expect(wrapper.text()).toContain('Feels like 17°C')
  })

  it('displays weather condition', () => {
    const wrapper = mount(CurrentWeather, {
      props: { 
        weather: mockWeather,
        temperatureUnit: 'F'
      }
    })
    
    expect(wrapper.text()).toContain('Partly cloudy')
  })

  it('displays humidity percentage', () => {
    const wrapper = mount(CurrentWeather, {
      props: { 
        weather: mockWeather,
        temperatureUnit: 'F'
      }
    })
    
    expect(wrapper.text()).toContain('72%')
    expect(wrapper.text()).toContain('Humidity')
  })

  it('displays wind speed and direction', () => {
    const wrapper = mount(CurrentWeather, {
      props: { 
        weather: mockWeather,
        temperatureUnit: 'F'
      }
    })
    
    expect(wrapper.text()).toContain('10 mph')
    expect(wrapper.text()).toContain('W')
  })

  it('renders weather icon with correct src and alt', () => {
    const wrapper = mount(CurrentWeather, {
      props: { 
        weather: mockWeather,
        temperatureUnit: 'F'
      }
    })
    
    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('https://example.com/icon.png')
    expect(img.attributes('alt')).toBe('Partly cloudy')
  })

  it('displays last updated timestamp', () => {
    const wrapper = mount(CurrentWeather, {
      props: { 
        weather: mockWeather,
        temperatureUnit: 'F'
      }
    })
    
    expect(wrapper.text()).toContain('Last updated:')
  })

  it('rounds temperature values to whole numbers', () => {
    const weatherWithDecimals: CurrentWeatherType = {
      ...mockWeather,
      temperatureF: 65.7,
      feelsLikeF: 63.4,
      temperatureC: 18.7,
      feelsLikeC: 17.4
    }
    
    const wrapper = mount(CurrentWeather, {
      props: { 
        weather: weatherWithDecimals,
        temperatureUnit: 'F'
      }
    })
    
    expect(wrapper.text()).toContain('66°F') // Rounded up
    expect(wrapper.text()).toContain('Feels like 63°F') // Rounded down
  })

  it('reactively updates when temperature unit changes', async () => {
    const wrapper = mount(CurrentWeather, {
      props: { 
        weather: mockWeather,
        temperatureUnit: 'F'
      }
    })
    
    expect(wrapper.text()).toContain('65°F')
    
    await wrapper.setProps({ temperatureUnit: 'C' })
    
    expect(wrapper.text()).toContain('18°C')
    expect(wrapper.text()).not.toContain('65°F')
  })
})
