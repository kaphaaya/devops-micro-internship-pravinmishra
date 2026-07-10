import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import type { UUID } from '@hbos/core'

/**
 * @CurrentUser() decorator
 * Extracts user ID from authenticated user context
 *
 * Usage:
 * @Get()
 * @UseGuards(JwtAuthGuard)
 * async getProfile(@CurrentUser() userId: UUID) {
 *   // Access current user ID
 * }
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UUID => {
    const request = ctx.switchToHttp().getRequest()
    return request.user?.userId
  },
)
