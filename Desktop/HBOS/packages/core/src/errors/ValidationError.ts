import { AppError } from './AppError'
import { ERROR_CODES } from '../constants'

/**
 * Validation error for invalid input
 */
export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed', details?: Record<string, any>) {
    super(
      message,
      400,
      ERROR_CODES.VALIDATION.REQUIRED_FIELD_MISSING,
      details,
    )
    this.name = 'ValidationError'
    Object.setPrototypeOf(this, ValidationError.prototype)
  }

  /**
   * Create from field errors
   */
  static fromFieldErrors(errors: Record<string, string>): ValidationError {
    return new ValidationError('Validation failed', errors)
  }

  /**
   * Create for missing required field
   */
  static missingRequired(fieldName: string): ValidationError {
    return new ValidationError(`${fieldName} is required`, { field: fieldName })
  }

  /**
   * Create for invalid format
   */
  static invalidFormat(fieldName: string, format: string): ValidationError {
    return new ValidationError(`${fieldName} must be in ${format} format`, { field: fieldName, format })
  }
}
