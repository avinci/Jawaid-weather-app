import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ErrorMessage from '../../../src/components/ErrorMessage.vue'

describe('ErrorMessage', () => {
  it('renders error message', () => {
    const message = 'Something went wrong'
    const wrapper = mount(ErrorMessage, {
      props: { message }
    })
    
    expect(wrapper.text()).toContain(message)
  })

  it('has error styling by default', () => {
    const wrapper = mount(ErrorMessage, {
      props: { message: 'Error' }
    })
    
    expect(wrapper.find('.bg-red-50').exists()).toBe(true)
    expect(wrapper.find('.text-red-800').exists()).toBe(true)
  })

  it('applies warning styling when type is warning', () => {
    const wrapper = mount(ErrorMessage, {
      props: { message: 'Warning', type: 'warning' }
    })
    
    expect(wrapper.find('.bg-yellow-50').exists()).toBe(true)
    expect(wrapper.find('.text-yellow-800').exists()).toBe(true)
  })

  it('applies info styling when type is info', () => {
    const wrapper = mount(ErrorMessage, {
      props: { message: 'Info', type: 'info' }
    })
    
    expect(wrapper.find('.bg-blue-50').exists()).toBe(true)
    expect(wrapper.find('.text-blue-800').exists()).toBe(true)
  })

  it('emits dismiss event when close button clicked', async () => {
    const wrapper = mount(ErrorMessage, {
      props: { message: 'Error' }
    })
    
    await wrapper.find('button').trigger('click')
    
    expect(wrapper.emitted('dismiss')).toBeTruthy()
    expect(wrapper.emitted('dismiss')).toHaveLength(1)
  })

  it('has accessibility attributes', () => {
    const wrapper = mount(ErrorMessage, {
      props: { message: 'Error' }
    })
    
    expect(wrapper.find('[role="alert"]').exists()).toBe(true)
    expect(wrapper.find('[aria-live="assertive"]').exists()).toBe(true)
    expect(wrapper.find('button[aria-label="Dismiss error"]').exists()).toBe(true)
  })
})
