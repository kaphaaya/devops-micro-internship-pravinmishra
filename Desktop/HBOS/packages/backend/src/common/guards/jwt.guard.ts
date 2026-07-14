import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

/**
 * JWT Authentication Guard
 * Validates JWT token from Authorization header
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
