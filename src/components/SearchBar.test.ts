import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SearchBar from './SearchBar.vue'

/**
 * BVT: SearchBar Component Smoke Tests
 * Verifies critical search component functionality
 */
describe('SearchBar.vue - BVT', () => {
  it('should mount without crashing', () => {
    const wrapper = mount(SearchBar)
    expect(wrapper.exists()).toBe(true)
  })

  it('should render search input field', () => {
    const wrapper = mount(SearchBar)
    const input = wrapper.find('input[type="text"]')
    
    expect(input.exists()).toBe(true)
    expect(input.attributes('placeholder')).toContain('Enter city')
  })

  it('should render search button', () => {
    const wrapper = mount(SearchBar)
    const button = wrapper.find('button[type="submit"]')
    
    expect(button.exists()).toBe(true)
    expect(button.text()).toContain('Search')
  })

  it('should have disabled state when searching', async () => {
    const wrapper = mount(SearchBar)
    const button = wrapper.find('button[type="submit"]')
    const input = wrapper.find('input[type="text"]')
    
    // Initially not disabled
    expect(button.attributes('disabled')).toBeUndefined()
    expect(input.attributes('disabled')).toBeUndefined()
    
    // Set searching state via exposed method
    wrapper.vm.setSearching(true)
    await wrapper.vm.$nextTick()
    
    // Should be disabled when searching
    expect(button.attributes('disabled')).toBeDefined()
    expect(input.attributes('disabled')).toBeDefined()
  })

  it('should emit search event on form submit', async () => {
    const wrapper = mount(SearchBar)
    const input = wrapper.find('input[type="text"]')
    const form = wrapper.find('form')
    
    // Enter search query
    await input.setValue('San Francisco')
    await form.trigger('submit')
    
    // Should emit search event with query
    expect(wrapper.emitted('search')).toBeTruthy()
    expect(wrapper.emitted('search')?.[0]).toEqual(['San Francisco'])
  })
})
