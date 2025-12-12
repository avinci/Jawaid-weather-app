import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import App from './App.vue'

/**
 * BVT: App Component Smoke Tests
 * Verifies basic app initialization and critical component mounting
 */
describe('App.vue - BVT', () => {
  it('should mount without crashing', () => {
    const wrapper = mount(App)
    expect(wrapper.exists()).toBe(true)
  })

  it('should render the header with app title', () => {
    const wrapper = mount(App)
    const header = wrapper.find('header')
    
    expect(header.exists()).toBe(true)
    expect(header.text()).toContain('Weather Forecast')
  })

  it('should render SearchBar component', () => {
    const wrapper = mount(App)
    const searchBar = wrapper.findComponent({ name: 'SearchBar' })
    
    expect(searchBar.exists()).toBe(true)
  })

  it('should render TemperatureToggle component', () => {
    const wrapper = mount(App)
    const tempToggle = wrapper.findComponent({ name: 'TemperatureToggle' })
    
    expect(tempToggle.exists()).toBe(true)
  })
})
