/**
 * App Component Tests
 * 
 * Mocking Strategy: useWeather composable mocked for isolated unit testing
 * Purpose: Verify app initialization, component mounting, and error handling
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import App from '../../src/App.vue'
import SearchBar from '../../src/components/SearchBar.vue'
import TemperatureToggle from '../../src/components/TemperatureToggle.vue'

// Mock useWeather composable
vi.mock('../../src/composables/useWeather', () => ({
  useWeather: vi.fn()
}))

// Mock logger to avoid console noise
vi.mock('../../src/utils/logger', () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn()
  }
}))

import { useWeather } from '../../src/composables/useWeather'

describe('App.vue', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks()
  })

  describe('Initialization', () => {
    it('should mount without crashing', () => {
      // Arrange
      const mockUseWeather = vi.mocked(useWeather)
      mockUseWeather.mockReturnValue({
        weatherData: ref(null),
        isLoading: ref(false),
        error: ref(null),
        temperatureUnit: ref('F'),
        clearError: vi.fn(),
        searchLocation: vi.fn(),
        toggleTemperatureUnit: vi.fn()
      })

      // Act
      const wrapper = mount(App)

      // Assert
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('Critical Components', () => {
    beforeEach(() => {
      const mockUseWeather = vi.mocked(useWeather)
      mockUseWeather.mockReturnValue({
        weatherData: ref(null),
        isLoading: ref(false),
        error: ref(null),
        temperatureUnit: ref('F'),
        clearError: vi.fn(),
        searchLocation: vi.fn(),
        toggleTemperatureUnit: vi.fn()
      })
    })

    it('should render header with app title', () => {
      // Arrange
      // (setup in beforeEach)

      // Act
      const wrapper = mount(App)
      const header = wrapper.find('header')

      // Assert
      expect(header.exists()).toBe(true)
      expect(header.text()).toContain('Weather Forecast')
    })

    it('should render SearchBar component', () => {
      // Arrange
      // (setup in beforeEach)

      // Act
      const wrapper = mount(App)
      const searchBar = wrapper.findComponent(SearchBar)

      // Assert
      expect(searchBar.exists()).toBe(true)
    })

    it('should render TemperatureToggle component', () => {
      // Arrange
      // (setup in beforeEach)

      // Act
      const wrapper = mount(App)
      const tempToggle = wrapper.findComponent(TemperatureToggle)

      // Assert
      expect(tempToggle.exists()).toBe(true)
    })
  })

  describe('Error Handling', () => {
    it('should display error message when error state is set', () => {
      // Arrange
      const mockUseWeather = vi.mocked(useWeather)
      mockUseWeather.mockReturnValue({
        weatherData: ref(null),
        isLoading: ref(false),
        error: ref('Unable to fetch weather data'),
        temperatureUnit: ref('F'),
        clearError: vi.fn(),
        searchLocation: vi.fn(),
        toggleTemperatureUnit: vi.fn()
      })

      // Act
      const wrapper = mount(App)

      // Assert
      expect(wrapper.text()).toContain('Unable to fetch weather data')
      expect(wrapper.find('[role="alert"]').exists()).toBe(true)
    })

    it('should not crash when weatherData is null', () => {
      // Arrange
      const mockUseWeather = vi.mocked(useWeather)
      mockUseWeather.mockReturnValue({
        weatherData: ref(null),
        isLoading: ref(false),
        error: ref(null),
        temperatureUnit: ref('F'),
        clearError: vi.fn(),
        searchLocation: vi.fn(),
        toggleTemperatureUnit: vi.fn()
      })

      // Act
      const wrapper = mount(App)

      // Assert
      expect(wrapper.exists()).toBe(true)
      // Weather content should not be visible
      expect(wrapper.find('.current-weather').exists()).toBe(false)
    })
  })

  describe('Loading State', () => {
    it('should display loading spinner when isLoading is true', () => {
      // Arrange
      const mockUseWeather = vi.mocked(useWeather)
      mockUseWeather.mockReturnValue({
        weatherData: ref(null),
        isLoading: ref(true),
        error: ref(null),
        temperatureUnit: ref('F'),
        clearError: vi.fn(),
        searchLocation: vi.fn(),
        toggleTemperatureUnit: vi.fn()
      })

      // Act
      const wrapper = mount(App)

      // Assert
      expect(wrapper.text()).toContain('Loading weather data...')
    })
  })
})
