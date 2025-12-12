/**
 * Formatting Utilities
 * Provides consistent formatting for dates, times, and temperatures
 */

import { logger } from './logger'
import type { TemperatureUnit } from '../composables/useWeather'

/**
 * Format ISO date string to readable format
 * @param isoString - ISO 8601 date string (e.g., "2025-12-11")
 * @returns Formatted date (e.g., "Dec 11")
 */
export function formatDate(isoString: string): string {
  try {
    const date = new Date(isoString)
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return isoString
    }
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      timeZone: 'UTC' 
    })
  } catch (error) {
    logger.error('[formatters] Error formatting date:', error)
    return isoString
  }
}

/**
 * Extract day of week from ISO date string
 * @param isoString - ISO 8601 date string (e.g., "2025-12-11")
 * @returns Day name (e.g., "Wednesday")
 */
export function formatDayOfWeek(isoString: string): string {
  try {
    const date = new Date(isoString)
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return ''
    }
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      timeZone: 'UTC' 
    })
  } catch (error) {
    logger.error('[formatters] Error formatting day of week:', error)
    return ''
  }
}

/**
 * Format temperature with unit symbol
 * @param value - Temperature value
 * @param unit - Temperature unit ('F' or 'C')
 * @returns Formatted temperature (e.g., "68°F")
 */
export function formatTemperature(value: number, unit: TemperatureUnit): string {
  const rounded = Math.round(value)
  return `${rounded}°${unit}`
}

/**
 * Format time from ISO string to 12-hour format
 * @param isoString - ISO 8601 timestamp (e.g., "2025-12-11 15:00")
 * @returns Formatted time (e.g., "3:00 PM")
 */
export function formatTime(isoString: string): string {
  try {
    const date = new Date(isoString)
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return isoString
    }
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    })
  } catch (error) {
    logger.error('[formatters] Error formatting time:', error)
    return isoString
  }
}
