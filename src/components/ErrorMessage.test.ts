import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ErrorMessage from './ErrorMessage.vue'

/**
 * BVT: ErrorMessage Component Smoke Tests
 * Verifies error state display functionality
 */
describe('ErrorMessage.vue - BVT', () => {
  const errorMessage = 'Location not found. Please try again.'

  it('should mount without crashing', () => {
    const wrapper = mount(ErrorMessage, {
      props: { message: errorMessage }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('should display error message', () => {
    const wrapper = mount(ErrorMessage, {
      props: { message: errorMessage }
    })
    
    expect(wrapper.text()).toContain(errorMessage)
  })

  it('should render dismiss button', () => {
    const wrapper = mount(ErrorMessage, {
      props: { message: errorMessage }
    })
    
    const button = wrapper.find('button')
    expect(button.exists()).toBe(true)
  })

  it('should emit dismiss event when button clicked', async () => {
    const wrapper = mount(ErrorMessage, {
      props: { message: errorMessage }
    })
    
    const button = wrapper.find('button')
    await button.trigger('click')
    
    expect(wrapper.emitted('dismiss')).toBeTruthy()
  })

  it('should have proper accessibility attributes', () => {
    const wrapper = mount(ErrorMessage, {
      props: { message: errorMessage }
    })
    
    const alert = wrapper.find('[role="alert"]')
    expect(alert.exists()).toBe(true)
    expect(alert.attributes('aria-live')).toBe('assertive')
  })

  it('should apply error styling by default', () => {
    const wrapper = mount(ErrorMessage, {
      props: { message: errorMessage }
    })
    
    const container = wrapper.find('[role="alert"]')
    expect(container.classes()).toContain('bg-red-50')
  })

  it('should apply warning styling when type is warning', () => {
    const wrapper = mount(ErrorMessage, {
      props: { 
        message: errorMessage,
        type: 'warning'
      }
    })
    
    const container = wrapper.find('[role="alert"]')
    expect(container.classes()).toContain('bg-yellow-50')
  })

  it('should apply info styling when type is info', () => {
    const wrapper = mount(ErrorMessage, {
      props: { 
        message: errorMessage,
        type: 'info'
      }
    })
    
    const container = wrapper.find('[role="alert"]')
    expect(container.classes()).toContain('bg-blue-50')
  })
})
