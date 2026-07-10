import { AppError } from './AppError'
import { ERROR_CODES } from '../constants'

/**
 * Resource not found error
 */
export class NotFoundError extends AppError {
  constructor(resourceName: string = 'Resource', id?: string) {
    const message = id ? `${resourceName} with id ${id} not found` : `${resourceName} not found`
    super(message, 404, ERROR_CODES.RESOURCE.NOT_FOUND, { resourceName, id })
    this.name = 'NotFoundError'
    Object.setPrototypeOf(this, NotFoundError.prototype)
  }
}
