import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SevenDayForecast from '../../../src/components/SevenDayForecast.vue'
import type { DailyForecast } from '../../../src/services/weatherApi'

describe('SevenDayForecast', () => {
  const mockForecasts: DailyForecast[] = [
    {
      date: '2025-12-11',
      dayOfWeek: 'Wednesday',
      highTemp: 68,
      lowTemp: 55,
      condition: 'Partly cloudy',
      conditionIcon: 'https://example.com/icon1.png',
      precipitationChance: 20,
      windSpeed: 12
    },
    {
      date: '2025-12-12',
      dayOfWeek: 'Thursday',
      highTemp: 70,
      lowTemp: 57,
      condition: 'Sunny',
      conditionIcon: 'https://example.com/icon2.png',
      precipitationChance: 5,
      windSpeed: 8
    },
    {
      date: '2025-12-13',
      dayOfWeek: 'Friday',
      highTemp: 66,
      lowTemp: 54,
      condition: 'Cloudy',
      conditionIcon: 'https://example.com/icon3.png',
      precipitationChance: 30,
      windSpeed: 15
    }
  ]

  it('renders component title', () => {
    const wrapper = mount(SevenDayForecast, {
      props: { forecasts: mockForecasts }
    })
    
    expect(wrapper.text()).toContain('7-Day Forecast')
  })

  it('renders correct number of forecast cards', () => {
    const wrapper = mount(SevenDayForecast, {
      props: { forecasts: mockForecasts }
    })
    
    const cards = wrapper.findAll('.bg-gray-50')
    expect(cards).toHaveLength(3)
  })

  it('displays "Today" for first day', () => {
    const wrapper = mount(SevenDayForecast, {
      props: { forecasts: mockForecasts }
    })
    
    expect(wrapper.text()).toContain('Today')
  })

  it('displays day of week for subsequent days', () => {
    const wrapper = mount(SevenDayForecast, {
      props: { forecasts: mockForecasts }
    })
    
    expect(wrapper.text()).toContain('Thursday')
    expect(wrapper.text()).toContain('Friday')
  })

  it('displays high and low temperatures', () => {
    const wrapper = mount(SevenDayForecast, {
      props: { forecasts: mockForecasts }
    })
    
    expect(wrapper.text()).toContain('68°')
    expect(wrapper.text()).toContain('55°')
  })

  it('displays weather conditions', () => {
    const wrapper = mount(SevenDayForecast, {
      props: { forecasts: mockForecasts }
    })
    
    expect(wrapper.text()).toContain('Partly cloudy')
    expect(wrapper.text()).toContain('Sunny')
    expect(wrapper.text()).toContain('Cloudy')
  })

  it('displays precipitation chance', () => {
    const wrapper = mount(SevenDayForecast, {
      props: { forecasts: mockForecasts }
    })
    
    expect(wrapper.text()).toContain('20%')
    expect(wrapper.text()).toContain('5%')
    expect(wrapper.text()).toContain('30%')
  })

  it('displays wind speed', () => {
    const wrapper = mount(SevenDayForecast, {
      props: { forecasts: mockForecasts }
    })
    
    expect(wrapper.text()).toContain('12 mph')
    expect(wrapper.text()).toContain('8 mph')
    expect(wrapper.text()).toContain('15 mph')
  })

  it('renders weather icons with correct src and alt', () => {
    const wrapper = mount(SevenDayForecast, {
      props: { forecasts: mockForecasts }
    })
    
    const images = wrapper.findAll('img')
    expect(images).toHaveLength(3)
    expect(images[0].attributes('src')).toBe('https://example.com/icon1.png')
    expect(images[0].attributes('alt')).toBe('Partly cloudy')
    expect(images[1].attributes('alt')).toBe('Sunny')
  })

  it('handles empty forecast array', () => {
    const wrapper = mount(SevenDayForecast, {
      props: { forecasts: [] }
    })
    
    const cards = wrapper.findAll('.bg-gray-50')
    expect(cards).toHaveLength(0)
  })

  it('rounds temperature values to whole numbers', () => {
    const forecastsWithDecimals: DailyForecast[] = [{
      ...mockForecasts[0],
      highTemp: 68.7,
      lowTemp: 55.3
    }]
    
    const wrapper = mount(SevenDayForecast, {
      props: { forecasts: forecastsWithDecimals }
    })
    
    expect(wrapper.text()).toContain('69°')
    expect(wrapper.text()).toContain('55°')
  })
})
