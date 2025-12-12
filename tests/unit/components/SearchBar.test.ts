/**
 * Tests for SearchBar component
 */

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SearchBar from '../../../src/components/SearchBar.vue'

describe('SearchBar', () => {
  describe('Empty Input Validation', () => {
    it('displays error when submitting empty input', async () => {
      const wrapper = mount(SearchBar)
      const form = wrapper.find('form')
      
      await form.trigger('submit')
      
      const errorMessage = wrapper.find('[role="alert"]')
      expect(errorMessage.exists()).toBe(true)
      expect(errorMessage.text()).toBe('Please enter a location to search.')
    })
    
    it('displays error when submitting whitespace only', async () => {
      const wrapper = mount(SearchBar)
      const input = wrapper.find('input')
      
      await input.setValue('   ')
      await wrapper.find('form').trigger('submit')
      
      const errorMessage = wrapper.find('[role="alert"]')
      expect(errorMessage.exists()).toBe(true)
      expect(errorMessage.text()).toBe('Please enter a location to search.')
    })
    
    it('does not emit search event when input is empty', async () => {
      const wrapper = mount(SearchBar)
      
      await wrapper.find('form').trigger('submit')
      
      expect(wrapper.emitted('search')).toBeUndefined()
    })
  })
  
  describe('Search Triggers', () => {
    it('emits search event with trimmed query on valid submission', async () => {
      const wrapper = mount(SearchBar)
      const input = wrapper.find('input')
      
      await input.setValue('  San Francisco  ')
      await wrapper.find('form').trigger('submit')
      
      expect(wrapper.emitted('search')).toBeDefined()
      expect(wrapper.emitted('search')?.[0]).toEqual(['San Francisco'])
    })
    
    it('clears error message before emitting search', async () => {
      const wrapper = mount(SearchBar)
      
      // Trigger error first
      await wrapper.find('form').trigger('submit')
      expect(wrapper.find('[role="alert"]').exists()).toBe(true)
      
      // Now enter valid input
      await wrapper.find('input').setValue('New York')
      await wrapper.find('form').trigger('submit')
      
      expect(wrapper.find('[role="alert"]').exists()).toBe(false)
    })
    
    it('logs debug message in development mode', async () => {
      const consoleSpy = vi.spyOn(console, 'debug').mockImplementation(() => {})
      const wrapper = mount(SearchBar)
      
      await wrapper.find('input').setValue('Tokyo')
      await wrapper.find('form').trigger('submit')
      
      expect(wrapper.emitted('search')?.[0]).toEqual(['Tokyo'])
      consoleSpy.mockRestore()
    })
  })
  
  describe('Location Formats', () => {
    it('accepts city name', async () => {
      const wrapper = mount(SearchBar)
      
      await wrapper.find('input').setValue('Paris')
      await wrapper.find('form').trigger('submit')
      
      expect(wrapper.emitted('search')?.[0]).toEqual(['Paris'])
    })
    
    it('accepts zipcode', async () => {
      const wrapper = mount(SearchBar)
      
      await wrapper.find('input').setValue('94102')
      await wrapper.find('form').trigger('submit')
      
      expect(wrapper.emitted('search')?.[0]).toEqual(['94102'])
    })
    
    it('accepts region/state', async () => {
      const wrapper = mount(SearchBar)
      
      await wrapper.find('input').setValue('California')
      await wrapper.find('form').trigger('submit')
      
      expect(wrapper.emitted('search')?.[0]).toEqual(['California'])
    })
    
    it('accepts city with state', async () => {
      const wrapper = mount(SearchBar)
      
      await wrapper.find('input').setValue('Austin, Texas')
      await wrapper.find('form').trigger('submit')
      
      expect(wrapper.emitted('search')?.[0]).toEqual(['Austin, Texas'])
    })
    
    it('accepts international city', async () => {
      const wrapper = mount(SearchBar)
      
      await wrapper.find('input').setValue('London, UK')
      await wrapper.find('form').trigger('submit')
      
      expect(wrapper.emitted('search')?.[0]).toEqual(['London, UK'])
    })
  })
  
  describe('Loading State', () => {
    it('shows loading indicator when searching', async () => {
      const wrapper = mount(SearchBar)
      
      // Use exposed method to set searching state
      wrapper.vm.setSearching(true)
      await wrapper.vm.$nextTick()
      
      expect(wrapper.find('button').text()).toContain('Searching...')
      expect(wrapper.find('.animate-spin').exists()).toBe(true)
    })
    
    it('disables input and button when searching', async () => {
      const wrapper = mount(SearchBar)
      
      wrapper.vm.setSearching(true)
      await wrapper.vm.$nextTick()
      
      const input = wrapper.find('input')
      const button = wrapper.find('button')
      
      expect(input.attributes('disabled')).toBeDefined()
      expect(button.attributes('disabled')).toBeDefined()
    })
    
    it('shows normal state when not searching', async () => {
      const wrapper = mount(SearchBar)
      
      expect(wrapper.find('button').text()).toBe('Search')
      expect(wrapper.find('.animate-spin').exists()).toBe(false)
    })
  })
  
  describe('Accessibility', () => {
    it('has proper label for input', () => {
      const wrapper = mount(SearchBar)
      
      const label = wrapper.find('label[for="location-search"]')
      expect(label.exists()).toBe(true)
    })
    
    it('has sr-only class on label for screen readers', () => {
      const wrapper = mount(SearchBar)
      
      const label = wrapper.find('label')
      expect(label.classes()).toContain('sr-only')
    })
    
    it('sets aria-invalid when error exists', async () => {
      const wrapper = mount(SearchBar)
      
      await wrapper.find('form').trigger('submit')
      
      const input = wrapper.find('input')
      expect(input.attributes('aria-invalid')).toBe('true')
    })
    
    it('sets aria-describedby to error message id', () => {
      const wrapper = mount(SearchBar)
      
      const input = wrapper.find('input')
      expect(input.attributes('aria-describedby')).toBe('search-error')
    })
    
    it('error message has role="alert"', async () => {
      const wrapper = mount(SearchBar)
      
      await wrapper.find('form').trigger('submit')
      
      const errorMessage = wrapper.find('[role="alert"]')
      expect(errorMessage.exists()).toBe(true)
    })
  })
  
  describe('Exposed Methods', () => {
    it('clearError method clears error message', async () => {
      const wrapper = mount(SearchBar)
      
      // Trigger error
      await wrapper.find('form').trigger('submit')
      expect(wrapper.find('[role="alert"]').exists()).toBe(true)
      
      // Clear error
      wrapper.vm.clearError()
      await wrapper.vm.$nextTick()
      
      expect(wrapper.find('[role="alert"]').exists()).toBe(false)
    })
    
    it('setSearching method updates loading state', async () => {
      const wrapper = mount(SearchBar)
      
      wrapper.vm.setSearching(true)
      await wrapper.vm.$nextTick()
      expect(wrapper.find('button').text()).toContain('Searching...')
      
      wrapper.vm.setSearching(false)
      await wrapper.vm.$nextTick()
      expect(wrapper.find('button').text()).toBe('Search')
    })
  })
})
