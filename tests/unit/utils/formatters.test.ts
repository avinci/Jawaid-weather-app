import { describe, it, expect } from 'vitest'
import { 
  formatDate, 
  formatDayOfWeek, 
  formatTemperature, 
  formatTime 
} from '../../../src/utils/formatters'

describe('formatters', () => {
  describe('formatDate', () => {
    it('formats ISO date to readable format', () => {
      const result = formatDate('2025-12-11')
      expect(result).toBe('Dec 11')
    })

    it('handles different months correctly', () => {
      expect(formatDate('2025-01-05')).toBe('Jan 5')
      expect(formatDate('2025-06-20')).toBe('Jun 20')
      expect(formatDate('2025-12-31')).toBe('Dec 31')
    })

    it('returns original string on invalid input', () => {
      const invalid = 'not-a-date'
      const result = formatDate(invalid)
      expect(result).toBe(invalid)
    })
  })

  describe('formatDayOfWeek', () => {
    it('extracts day of week from ISO date', () => {
      // 2025-12-11 is a Thursday
      const result = formatDayOfWeek('2025-12-11')
      expect(result).toBe('Thursday')
    })

    it('handles different days correctly', () => {
      // 2025-12-08 is a Monday
      expect(formatDayOfWeek('2025-12-08')).toBe('Monday')
      // 2025-12-14 is a Sunday
      expect(formatDayOfWeek('2025-12-14')).toBe('Sunday')
    })

    it('returns empty string on invalid input', () => {
      const result = formatDayOfWeek('invalid-date')
      expect(result).toBe('')
    })
  })

  describe('formatTemperature', () => {
    it('formats temperature with Fahrenheit unit', () => {
      const result = formatTemperature(68, 'F')
      expect(result).toBe('68°F')
    })

    it('formats temperature with Celsius unit', () => {
      const result = formatTemperature(20, 'C')
      expect(result).toBe('20°C')
    })

    it('rounds decimal temperatures', () => {
      expect(formatTemperature(68.7, 'F')).toBe('69°F')
      expect(formatTemperature(68.3, 'F')).toBe('68°F')
      expect(formatTemperature(68.5, 'F')).toBe('69°F')
    })

    it('handles negative temperatures', () => {
      expect(formatTemperature(-5, 'C')).toBe('-5°C')
      expect(formatTemperature(-10.7, 'F')).toBe('-11°F')
    })

    it('handles zero temperature', () => {
      expect(formatTemperature(0, 'F')).toBe('0°F')
    })
  })

  describe('formatTime', () => {
    it('formats ISO timestamp to 12-hour time', () => {
      const result = formatTime('2025-12-11 15:00')
      expect(result).toBe('3:00 PM')
    })

    it('handles morning times correctly', () => {
      expect(formatTime('2025-12-11 09:30')).toBe('9:30 AM')
      expect(formatTime('2025-12-11 00:00')).toBe('12:00 AM')
    })

    it('handles afternoon/evening times correctly', () => {
      expect(formatTime('2025-12-11 12:00')).toBe('12:00 PM')
      expect(formatTime('2025-12-11 18:45')).toBe('6:45 PM')
      expect(formatTime('2025-12-11 23:59')).toBe('11:59 PM')
    })

    it('returns original string on invalid input', () => {
      const invalid = 'not-a-time'
      const result = formatTime(invalid)
      expect(result).toBe(invalid)
    })
  })
})
