import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LoadingSpinner from '../../../src/components/LoadingSpinner.vue'

describe('LoadingSpinner', () => {
  it('renders spinner element', () => {
    const wrapper = mount(LoadingSpinner)
    
    expect(wrapper.find('[role="status"]').exists()).toBe(true)
    expect(wrapper.find('.animate-spin').exists()).toBe(true)
  })

  it('displays message when provided', () => {
    const message = 'Loading weather data...'
    const wrapper = mount(LoadingSpinner, {
      props: { message }
    })
    
    expect(wrapper.text()).toContain(message)
  })

  it('does not display message when not provided', () => {
    const wrapper = mount(LoadingSpinner)
    
    expect(wrapper.find('p').exists()).toBe(false)
  })

  it('has accessibility attributes', () => {
    const wrapper = mount(LoadingSpinner)
    
    expect(wrapper.find('[role="status"]').exists()).toBe(true)
    expect(wrapper.find('[aria-live="polite"]').exists()).toBe(true)
    expect(wrapper.find('.sr-only').text()).toBe('Loading...')
  })
})
