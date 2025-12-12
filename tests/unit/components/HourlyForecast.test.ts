import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HourlyForecast from '../../../src/components/HourlyForecast.vue'
import type { HourlyForecast as HourlyForecastType } from '../../../src/services/weatherApi'

describe('HourlyForecast', () => {
  const mockForecasts: HourlyForecastType[] = [
    {
      time: '2025-12-11 15:00',
      timeDisplay: '3:00 PM',
      temperature: 65,
      condition: 'Partly cloudy',
      conditionIcon: 'https://example.com/icon1.png',
      precipitationChance: 15
    },
    {
      time: '2025-12-11 16:00',
      timeDisplay: '4:00 PM',
      temperature: 66,
      condition: 'Sunny',
      conditionIcon: 'https://example.com/icon2.png',
      precipitationChance: 5
    },
    {
      time: '2025-12-11 17:00',
      timeDisplay: '5:00 PM',
      temperature: 64,
      condition: 'Clear',
      conditionIcon: 'https://example.com/icon3.png',
      precipitationChance: 0
    }
  ]

  it('renders component title', () => {
    const wrapper = mount(HourlyForecast, {
      props: { forecasts: mockForecasts }
    })
    
    expect(wrapper.text()).toContain('24-Hour Forecast')
  })

  it('renders correct number of hour cards', () => {
    const wrapper = mount(HourlyForecast, {
      props: { forecasts: mockForecasts }
    })
    
    const cards = wrapper.findAll('.bg-gray-50')
    expect(cards).toHaveLength(3)
  })

  it('displays time for each hour', () => {
    const wrapper = mount(HourlyForecast, {
      props: { forecasts: mockForecasts }
    })
    
    expect(wrapper.text()).toContain('3:00 PM')
    expect(wrapper.text()).toContain('4:00 PM')
    expect(wrapper.text()).toContain('5:00 PM')
  })

  it('displays temperature for each hour', () => {
    const wrapper = mount(HourlyForecast, {
      props: { forecasts: mockForecasts }
    })
    
    expect(wrapper.text()).toContain('65°')
    expect(wrapper.text()).toContain('66°')
    expect(wrapper.text()).toContain('64°')
  })

  it('displays weather conditions', () => {
    const wrapper = mount(HourlyForecast, {
      props: { forecasts: mockForecasts }
    })
    
    expect(wrapper.text()).toContain('Partly cloudy')
    expect(wrapper.text()).toContain('Sunny')
    expect(wrapper.text()).toContain('Clear')
  })

  it('displays precipitation chance', () => {
    const wrapper = mount(HourlyForecast, {
      props: { forecasts: mockForecasts }
    })
    
    expect(wrapper.text()).toContain('15%')
    expect(wrapper.text()).toContain('5%')
    expect(wrapper.text()).toContain('0%')
  })

  it('renders weather icons with correct src and alt', () => {
    const wrapper = mount(HourlyForecast, {
      props: { forecasts: mockForecasts }
    })
    
    const images = wrapper.findAll('img')
    expect(images).toHaveLength(3)
    expect(images[0].attributes('src')).toBe('https://example.com/icon1.png')
    expect(images[0].attributes('alt')).toBe('Partly cloudy')
    expect(images[1].attributes('alt')).toBe('Sunny')
  })

  it('displays scroll hint message', () => {
    const wrapper = mount(HourlyForecast, {
      props: { forecasts: mockForecasts }
    })
    
    expect(wrapper.text()).toContain('Scroll horizontally to view all hours')
  })

  it('has horizontal scrollable container', () => {
    const wrapper = mount(HourlyForecast, {
      props: { forecasts: mockForecasts }
    })
    
    const scrollContainer = wrapper.find('.overflow-x-auto')
    expect(scrollContainer.exists()).toBe(true)
  })

  it('applies scroll-snap styling', () => {
    const wrapper = mount(HourlyForecast, {
      props: { forecasts: mockForecasts }
    })
    
    const cards = wrapper.findAll('.bg-gray-50')
    cards.forEach(card => {
      expect(card.attributes('style')).toContain('scroll-snap-align: start')
    })
  })

  it('handles empty forecast array', () => {
    const wrapper = mount(HourlyForecast, {
      props: { forecasts: [] }
    })
    
    const cards = wrapper.findAll('.bg-gray-50')
    expect(cards).toHaveLength(0)
  })

  it('rounds temperature values to whole numbers', () => {
    const forecastsWithDecimals: HourlyForecastType[] = [{
      ...mockForecasts[0],
      temperature: 65.7
    }]
    
    const wrapper = mount(HourlyForecast, {
      props: { forecasts: forecastsWithDecimals }
    })
    
    expect(wrapper.text()).toContain('66°')
  })

  it('cards have fixed width for consistent scrolling', () => {
    const wrapper = mount(HourlyForecast, {
      props: { forecasts: mockForecasts }
    })
    
    const cards = wrapper.findAll('.bg-gray-50')
    cards.forEach(card => {
      expect(card.classes()).toContain('w-24')
      expect(card.classes()).toContain('flex-shrink-0')
    })
  })
})
