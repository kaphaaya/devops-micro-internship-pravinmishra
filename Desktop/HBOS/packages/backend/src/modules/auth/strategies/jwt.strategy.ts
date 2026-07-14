import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import type { IJwtPayload } from '@hbos/core'
import { User } from '../entities/user.entity'

/**
 * JWT Strategy for Passport
 * Validates JWT tokens and extracts user information
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
    })
  }

  async validate(payload: IJwtPayload) {
    // Verify user still exists and is active
    const user = await this.usersRepository.findOne({
      where: {
        id: payload.userId,
        tenantId: payload.tenantId,
        status: 'active',
      },
    })

    if (!user) {
      throw new UnauthorizedException('User not found or inactive')
    }

    return {
      userId: payload.userId,
      tenantId: payload.tenantId,
      email: payload.email,
      roles: payload.roles || [],
      permissions: payload.permissions || [],
    }
  }
}
