import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import type { UUID } from '@hbos/core'

/**
 * @Tenant() decorator
 * Extracts tenant ID from authenticated user context
 *
 * Usage:
 * @Get()
 * @UseGuards(JwtAuthGuard)
 * async getOrders(@Tenant() tenantId: UUID) {
 *   // Access tenant ID
 * }
 */
export const Tenant = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UUID => {
    const request = ctx.switchToHttp().getRequest()
    return request.user?.tenantId
  },
)
