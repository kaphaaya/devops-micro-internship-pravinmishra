import { AppError } from './AppError'
import { ERROR_CODES } from '../constants'

/**
 * Authorization error
 */
export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 403, ERROR_CODES.AUTHZ.INSUFFICIENT_PERMISSIONS)
    this.name = 'ForbiddenError'
    Object.setPrototypeOf(this, ForbiddenError.prototype)
  }

  static insufficientPermissions(): ForbiddenError {
    return new ForbiddenError('You do not have permission to perform this action')
  }

  static resourceAccessDenied(resourceName: string): ForbiddenError {
    return new ForbiddenError(`You do not have access to ${resourceName}`)
  }
}
