import { AppError } from './AppError'
import { ERROR_CODES } from '../constants'

/**
 * Conflict error (duplicate entry, state conflict, etc.)
 */
export class ConflictError extends AppError {
  constructor(message: string = 'Conflict', details?: Record<string, any>) {
    super(message, 409, ERROR_CODES.RESOURCE.CONFLICT, details)
    this.name = 'ConflictError'
    Object.setPrototypeOf(this, ConflictError.prototype)
  }

  static duplicate(resourceName: string, field: string): ConflictError {
    return new ConflictError(
      `${resourceName} with this ${field} already exists`,
      { resourceName, field },
    )
  }

  static invalidState(message: string): ConflictError {
    return new ConflictError(message)
  }
}
