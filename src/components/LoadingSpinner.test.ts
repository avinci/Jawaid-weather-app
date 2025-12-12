import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LoadingSpinner from './LoadingSpinner.vue'

/**
 * BVT: LoadingSpinner Component Smoke Tests
 * Verifies loading state display functionality
 */
describe('LoadingSpinner.vue - BVT', () => {
  it('should mount without crashing', () => {
    const wrapper = mount(LoadingSpinner)
    expect(wrapper.exists()).toBe(true)
  })

  it('should render spinner element', () => {
    const wrapper = mount(LoadingSpinner)
    const spinner = wrapper.find('.animate-spin')
    
    expect(spinner.exists()).toBe(true)
  })

  it('should display custom message when provided', () => {
    const message = 'Loading weather data...'
    const wrapper = mount(LoadingSpinner, {
      props: { message }
    })
    
    expect(wrapper.text()).toContain(message)
  })

  it('should not display message when not provided', () => {
    const wrapper = mount(LoadingSpinner)
    const messageElement = wrapper.find('p')
    
    expect(messageElement.exists()).toBe(false)
  })

  it('should have proper accessibility attributes', () => {
    const wrapper = mount(LoadingSpinner)
    const container = wrapper.find('[role="status"]')
    
    expect(container.exists()).toBe(true)
    expect(container.attributes('aria-live')).toBe('polite')
  })
})
