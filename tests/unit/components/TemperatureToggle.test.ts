import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TemperatureToggle from '../../../src/components/TemperatureToggle.vue'

describe('TemperatureToggle', () => {
  it('renders with Fahrenheit as active', () => {
    const wrapper = mount(TemperatureToggle, {
      props: {
        currentUnit: 'F'
      }
    })

    const button = wrapper.find('button')
    const unitSpans = button.findAll('span')
    expect(unitSpans[0].classes()).toContain('bg-blue-600')
    expect(unitSpans[0].classes()).toContain('text-white')
    expect(unitSpans[1].classes()).not.toContain('bg-blue-600')
  })

  it('renders with Celsius as active', () => {
    const wrapper = mount(TemperatureToggle, {
      props: {
        currentUnit: 'C'
      }
    })

    const button = wrapper.find('button')
    const unitSpans = button.findAll('span')
    expect(unitSpans[0].classes()).not.toContain('bg-blue-600')
    expect(unitSpans[1].classes()).toContain('bg-blue-600')
    expect(unitSpans[1].classes()).toContain('text-white')
  })

  it('emits toggle event when clicked', async () => {
    const wrapper = mount(TemperatureToggle, {
      props: {
        currentUnit: 'F'
      }
    })

    const button = wrapper.find('button')
    await button.trigger('click')

    expect(wrapper.emitted()).toHaveProperty('toggle')
    expect(wrapper.emitted('toggle')).toHaveLength(1)
  })

  it('has proper ARIA label for accessibility', () => {
    const wrapper = mount(TemperatureToggle, {
      props: {
        currentUnit: 'F'
      }
    })

    const button = wrapper.find('button')
    expect(button.attributes('aria-label')).toBe('Toggle temperature unit')
  })

  it('displays both F and C labels', () => {
    const wrapper = mount(TemperatureToggle, {
      props: {
        currentUnit: 'F'
      }
    })

    const text = wrapper.text()
    expect(text).toContain('°F')
    expect(text).toContain('°C')
  })
})
