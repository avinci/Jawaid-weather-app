import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SearchDropdown from '../../../src/components/SearchDropdown.vue'
import type { LocationSuggestion } from '../../../src/services/weatherApi'

describe('SearchDropdown', () => {
  const mockSuggestions: LocationSuggestion[] = [
    {
      id: 1,
      name: 'San Francisco',
      region: 'California',
      country: 'USA',
      lat: 37.77,
      lon: -122.42,
    },
    {
      id: 2,
      name: 'New York',
      region: 'New York',
      country: 'USA',
      lat: 40.71,
      lon: -74.00,
    },
    {
      id: 3,
      name: 'London',
      region: 'City of London, Greater London',
      country: 'UK',
      lat: 51.52,
      lon: -0.11,
    },
  ]

  describe('Rendering', () => {
    it('does not render when not loading and no suggestions', () => {
      const wrapper = mount(SearchDropdown, {
        props: {
          suggestions: [],
          isLoading: false,
          selectedIndex: -1,
        },
      })

      expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
    })

    it('renders loading state when isLoading is true', () => {
      const wrapper = mount(SearchDropdown, {
        props: {
          suggestions: [],
          isLoading: true,
          selectedIndex: -1,
        },
      })

      expect(wrapper.find('[role="status"]').exists()).toBe(true)
      expect(wrapper.text()).toContain('Searching...')
    })

    it('renders suggestions when provided', () => {
      const wrapper = mount(SearchDropdown, {
        props: {
          suggestions: mockSuggestions,
          isLoading: false,
          selectedIndex: -1,
        },
      })

      const options = wrapper.findAll('[role="option"]')
      expect(options).toHaveLength(3)
    })

    it('formats location display correctly', () => {
      const wrapper = mount(SearchDropdown, {
        props: {
          suggestions: mockSuggestions,
          isLoading: false,
          selectedIndex: -1,
        },
      })

      const options = wrapper.findAll('[role="option"]')
      expect(options[0].text()).toBe('San Francisco, California, USA')
      expect(options[1].text()).toBe('New York, USA') // Region same as name, excluded
      expect(options[2].text()).toBe('London, City of London, Greater London, UK')
    })

    it('highlights selected suggestion', () => {
      const wrapper = mount(SearchDropdown, {
        props: {
          suggestions: mockSuggestions,
          isLoading: false,
          selectedIndex: 1,
        },
      })

      const options = wrapper.findAll('[role="option"]')
      expect(options[1].classes()).toContain('bg-blue-50')
      expect(options[1].attributes('aria-selected')).toBe('true')
    })

    it('shows empty state when no suggestions found', () => {
      const wrapper = mount(SearchDropdown, {
        props: {
          suggestions: [],
          isLoading: false,
          selectedIndex: -1,
        },
      })

      // Dropdown should not show when both loading and suggestions are empty
      expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
    })
  })

  describe('User Interactions', () => {
    it('emits select event when suggestion is clicked', async () => {
      const wrapper = mount(SearchDropdown, {
        props: {
          suggestions: mockSuggestions,
          isLoading: false,
          selectedIndex: -1,
        },
      })

      const options = wrapper.findAll('[role="option"]')
      await options[0].trigger('click')

      expect(wrapper.emitted('select')).toBeTruthy()
      expect(wrapper.emitted('select')?.[0]).toEqual([mockSuggestions[0]])
    })

    it('emits hover event when mouse enters suggestion', async () => {
      const wrapper = mount(SearchDropdown, {
        props: {
          suggestions: mockSuggestions,
          isLoading: false,
          selectedIndex: -1,
        },
      })

      const options = wrapper.findAll('[role="option"]')
      await options[1].trigger('mouseenter')

      expect(wrapper.emitted('hover')).toBeTruthy()
      expect(wrapper.emitted('hover')?.[0]).toEqual([1])
    })

    it('handles multiple click events correctly', async () => {
      const wrapper = mount(SearchDropdown, {
        props: {
          suggestions: mockSuggestions,
          isLoading: false,
          selectedIndex: -1,
        },
      })

      const options = wrapper.findAll('[role="option"]')
      await options[0].trigger('click')
      await options[2].trigger('click')

      expect(wrapper.emitted('select')).toHaveLength(2)
      expect(wrapper.emitted('select')?.[0]).toEqual([mockSuggestions[0]])
      expect(wrapper.emitted('select')?.[1]).toEqual([mockSuggestions[2]])
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA roles', () => {
      const wrapper = mount(SearchDropdown, {
        props: {
          suggestions: mockSuggestions,
          isLoading: false,
          selectedIndex: -1,
        },
      })

      expect(wrapper.find('[role="listbox"]').exists()).toBe(true)
      expect(wrapper.findAll('[role="option"]')).toHaveLength(3)
    })

    it('sets aria-selected on selected option', () => {
      const wrapper = mount(SearchDropdown, {
        props: {
          suggestions: mockSuggestions,
          isLoading: false,
          selectedIndex: 1,
        },
      })

      const options = wrapper.findAll('[role="option"]')
      expect(options[0].attributes('aria-selected')).toBe('false')
      expect(options[1].attributes('aria-selected')).toBe('true')
      expect(options[2].attributes('aria-selected')).toBe('false')
    })

    it('uses aria-live for loading state', () => {
      const wrapper = mount(SearchDropdown, {
        props: {
          suggestions: [],
          isLoading: true,
          selectedIndex: -1,
        },
      })

      const loadingElement = wrapper.find('[role="status"]')
      expect(loadingElement.attributes('aria-live')).toBe('polite')
    })
  })

  describe('Edge Cases', () => {
    it('handles suggestion with no region', () => {
      const suggestionNoRegion: LocationSuggestion = {
        id: 4,
        name: 'Paris',
        region: '',
        country: 'France',
        lat: 48.86,
        lon: 2.35,
      }

      const wrapper = mount(SearchDropdown, {
        props: {
          suggestions: [suggestionNoRegion],
          isLoading: false,
          selectedIndex: -1,
        },
      })

      expect(wrapper.find('[role="option"]').text()).toBe('Paris, France')
    })

    it('handles suggestion where region matches name', () => {
      const wrapper = mount(SearchDropdown, {
        props: {
          suggestions: [mockSuggestions[1]], // New York, New York, USA
          isLoading: false,
          selectedIndex: -1,
        },
      })

      // Region "New York" should be excluded since it matches city name
      expect(wrapper.find('[role="option"]').text()).toBe('New York, USA')
    })

    it('handles empty suggestions array', () => {
      const wrapper = mount(SearchDropdown, {
        props: {
          suggestions: [],
          isLoading: false,
          selectedIndex: -1,
        },
      })

      expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
    })

    it('handles negative selectedIndex', () => {
      const wrapper = mount(SearchDropdown, {
        props: {
          suggestions: mockSuggestions,
          isLoading: false,
          selectedIndex: -1,
        },
      })

      const options = wrapper.findAll('[role="option"]')
      options.forEach(option => {
        expect(option.classes()).not.toContain('bg-blue-50')
      })
    })

    it('handles selectedIndex beyond array length', () => {
      const wrapper = mount(SearchDropdown, {
        props: {
          suggestions: mockSuggestions,
          isLoading: false,
          selectedIndex: 999,
        },
      })

      const options = wrapper.findAll('[role="option"]')
      options.forEach(option => {
        expect(option.classes()).not.toContain('bg-blue-50')
      })
    })
  })
})
