/**
 * Centralized Logger Utility
 * Provides consistent logging interface across the application
 */

/**
 * Logger interface for application-wide logging
 * Respects DEV environment to avoid production console pollution
 */
export const logger = {
  /**
   * Log debug information (DEV only)
   */
  debug(message: string, ...args: any[]): void {
    if (import.meta.env.DEV) {
      console.debug(message, ...args)
    }
  },

  /**
   * Log error information (DEV only)
   */
  error(message: string, ...args: any[]): void {
    if (import.meta.env.DEV) {
      console.error(message, ...args)
    }
  },

  /**
   * Log warning information (DEV only)
   */
  warn(message: string, ...args: any[]): void {
    if (import.meta.env.DEV) {
      console.warn(message, ...args)
    }
  },

  /**
   * Log info information (DEV only)
   */
  info(message: string, ...args: any[]): void {
    if (import.meta.env.DEV) {
      console.info(message, ...args)
    }
  }
}
