import { AppError } from './AppError'
import { ERROR_CODES } from '../constants'

/**
 * Authentication error
 */
export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized', code: string = ERROR_CODES.AUTH.INVALID_CREDENTIALS) {
    super(message, 401, code)
    this.name = 'UnauthorizedError'
    Object.setPrototypeOf(this, UnauthorizedError.prototype)
  }

  static invalidCredentials(): UnauthorizedError {
    return new UnauthorizedError(
      'Invalid email or password',
      ERROR_CODES.AUTH.INVALID_CREDENTIALS,
    )
  }

  static tokenExpired(): UnauthorizedError {
    return new UnauthorizedError(
      'Authentication token has expired',
      ERROR_CODES.AUTH.TOKEN_EXPIRED,
    )
  }

  static invalidToken(): UnauthorizedError {
    return new UnauthorizedError(
      'Invalid or malformed token',
      ERROR_CODES.AUTH.INVALID_TOKEN,
    )
  }

  static mfaRequired(): UnauthorizedError {
    return new UnauthorizedError(
      'Multi-factor authentication required',
      ERROR_CODES.AUTH.MFA_REQUIRED,
    )
  }
}
