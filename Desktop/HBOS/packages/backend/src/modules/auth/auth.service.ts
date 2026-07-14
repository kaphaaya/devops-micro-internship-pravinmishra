import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { User } from './entities/user.entity'
import { AuthenticationMethod } from './entities/authentication-method.entity'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import { TokenDto, MfaSetupResponseDto, ChangePasswordDto } from './dto/token.dto'
import { generateBackupCodes, generateUUID } from '@hbos/core'
import type { IJwtPayload } from '@hbos/core'

/**
 * Authentication Service
 * Handles user registration, login, token generation, and password management
 */
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(AuthenticationMethod)
    private authMethodsRepository: Repository<AuthenticationMethod>,
    private jwtService: JwtService,
  ) {}

  /**
   * Register a new user
   */
  async register(registerDto: RegisterDto, tenantId?: string): Promise<TokenDto> {
    const { email, password, fullName, tenantName } = registerDto

    // Check if user already exists
    const existingUser = await this.usersRepository.findOne({
      where: { email },
    })

    if (existingUser) {
      throw new ConflictException('Email already registered')
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Create user
    const user = this.usersRepository.create({
      id: generateUUID() as any,
      tenantId: tenantId || (generateUUID() as any),
      email,
      passwordHash,
      fullName,
      status: 'active',
      emailVerified: false,
      preferredLanguage: 'en',
      timezone: 'UTC',
    })

    const savedUser = await this.usersRepository.save(user)

    // Generate tokens
    return this.generateTokens(savedUser)
  }

  /**
   * Login user with email and password
   */
  async login(loginDto: LoginDto): Promise<TokenDto> {
    const { email, password } = loginDto

    const user = await this.usersRepository.findOne({
      where: { email },
    })

    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    // Check if user is locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new UnauthorizedException(
        'Account is locked. Please try again later.',
      )
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash)

    if (!isPasswordValid) {
      // Increment failed login attempts
      user.failedLoginAttempts += 1

      // Lock account after 5 failed attempts
      if (user.failedLoginAttempts >= 5) {
        user.lockedUntil = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
      }

      await this.usersRepository.save(user)
      throw new UnauthorizedException('Invalid credentials')
    }

    // Reset failed login attempts on successful login
    user.failedLoginAttempts = 0
    user.lastLoginAt = new Date()
    user.lockedUntil = null
    await this.usersRepository.save(user)

    // Generate tokens
    return this.generateTokens(user)
  }

  /**
   * Validate user credentials (used by Local strategy)
   */
  async validateUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({
      where: { email },
    })

    if (!user) {
      return null
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash)

    if (!isPasswordValid) {
      return null
    }

    return user
  }

  /**
   * Generate JWT tokens
   */
  async generateTokens(user: User): Promise<TokenDto> {
    const payload: IJwtPayload = {
      userId: user.id,
      tenantId: user.tenantId,
      email: user.email,
      roles: ['user'], // To be fetched from roles table in Phase 2
      permissions: [], // To be fetched from permissions table in Phase 2
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (parseInt(process.env.JWT_EXPIRY || '900', 10)),
    }

    const accessToken = this.jwtService.sign(payload)
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
    })

    return {
      accessToken,
      refreshToken,
      expiresIn: parseInt(process.env.JWT_EXPIRY || '900', 10),
      tokenType: 'Bearer',
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(refreshToken: string): Promise<TokenDto> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
      })

      const user = await this.usersRepository.findOne({
        where: {
          id: payload.userId,
          tenantId: payload.tenantId,
        },
      })

      if (!user || user.status !== 'active') {
        throw new UnauthorizedException('User not found or inactive')
      }

      return this.generateTokens(user)
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token')
    }
  }

  /**
   * Change password
   */
  async changePassword(
    userId: string,
    tenantId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const { currentPassword, newPassword } = changePasswordDto

    const user = await this.usersRepository.findOne({
      where: { id: userId, tenantId },
    })

    if (!user) {
      throw new UnauthorizedException('User not found')
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.passwordHash,
    )

    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect')
    }

    // Hash new password
    user.passwordHash = await bcrypt.hash(newPassword, 10)
    await this.usersRepository.save(user)
  }

  /**
   * Setup MFA (Multi-Factor Authentication)
   */
  async setupMfa(
    userId: string,
    tenantId: string,
    type: 'totp' | 'sms',
  ): Promise<MfaSetupResponseDto> {
    const user = await this.usersRepository.findOne({
      where: { id: userId, tenantId },
    })

    if (!user) {
      throw new UnauthorizedException('User not found')
    }

    const backupCodes = generateBackupCodes(10)

    // Generate TOTP secret (simplified - use speakeasy library in production)
    const secret = generateUUID().replace(/-/g, '').substring(0, 32)

    // Store backup codes (encrypted in production)
    const authMethod = this.authMethodsRepository.create({
      id: generateUUID() as any,
      tenantId,
      userId,
      type,
      isVerified: false,
      backupCodes,
    })

    await this.authMethodsRepository.save(authMethod)

    return {
      secret: type === 'totp' ? secret : undefined,
      backupCodes,
    }
  }

  /**
   * Verify MFA code
   */
  async verifyMfa(
    userId: string,
    tenantId: string,
    code: string,
    type: 'totp' | 'sms',
  ): Promise<void> {
    const authMethod = await this.authMethodsRepository.findOne({
      where: {
        userId,
        tenantId,
        type,
        isVerified: false,
      },
    })

    if (!authMethod) {
      throw new BadRequestException('MFA not set up')
    }

    // Simplified verification - use speakeasy library in production
    if (code === '000000') {
      // Placeholder
      authMethod.isVerified = true
      authMethod.verifiedAt = new Date()
      await this.authMethodsRepository.save(authMethod)
    } else if (!authMethod.backupCodes?.includes(code)) {
      throw new BadRequestException('Invalid MFA code')
    } else {
      // Remove used backup code
      authMethod.backupCodes = authMethod.backupCodes.filter(c => c !== code)
      await this.authMethodsRepository.save(authMethod)
    }
  }

  /**
   * Disable MFA
   */
  async disableMfa(userId: string, tenantId: string): Promise<void> {
    await this.authMethodsRepository.delete({
      userId,
      tenantId,
    })
  }

  /**
   * Get user profile
   */
  async getUserProfile(userId: string, tenantId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId, tenantId },
    })

    if (!user) {
      throw new UnauthorizedException('User not found')
    }

    return user
  }

  /**
   * Update user profile
   */
  async updateUserProfile(
    userId: string,
    tenantId: string,
    updates: Partial<User>,
  ) {
    const user = await this.usersRepository.findOne({
      where: { id: userId, tenantId },
    })

    if (!user) {
      throw new UnauthorizedException('User not found')
    }

    Object.assign(user, updates)
    return this.usersRepository.save(user)
  }
}
