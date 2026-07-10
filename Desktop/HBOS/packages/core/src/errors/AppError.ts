/**
 * Base application error class
 */
export class AppError extends Error {
  public readonly statusCode: number
  public readonly code: string
  public readonly details?: Record<string, any>
  public readonly timestamp: Date

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'APP_ERROR',
    details?: Record<string, any>,
  ) {
    super(message)
    this.name = 'AppError'
    this.statusCode = statusCode
    this.code = code
    this.details = details
    this.timestamp = new Date()

    // Maintain proper prototype chain
    Object.setPrototypeOf(this, AppError.prototype)
  }

  /**
   * Convert to API response format
   */
  toJSON() {
    return {
      statusCode: this.statusCode,
      error: this.name,
      message: this.message,
      code: this.code,
      details: this.details,
      timestamp: this.timestamp.toISOString(),
    }
  }
}
