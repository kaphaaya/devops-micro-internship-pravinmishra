import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

/**
 * Local Authentication Guard
 * Validates email/password credentials using Local strategy
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
