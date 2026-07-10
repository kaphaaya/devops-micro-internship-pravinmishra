import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common'
import { JwtAuthGuard } from '../../common/guards/jwt.guard'
import { LocalAuthGuard } from '../../common/guards/local.guard'
import { AuthService } from './auth.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import {
  TokenDto,
  RefreshTokenDto,
  MfaSetupDto,
  MfaVerifyDto,
  ChangePasswordDto,
} from './dto/token.dto'

/**
 * Authentication Controller
 * Handles all authentication-related requests
 */
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * POST /auth/register
   * Register a new user
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto): Promise<TokenDto> {
    return this.authService.register(registerDto)
  }

  /**
   * POST /auth/login
   * Login user with email and password
   */
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<TokenDto> {
    return this.authService.login(loginDto)
  }

  /**
   * POST /auth/logout
   * Logout user (client-side token deletion)
   */
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  logout() {
    // Token invalidation handled on client-side
    // In Phase 2, implement token blacklist using Redis
    return null
  }

  /**
   * POST /auth/refresh
   * Refresh access token
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto): Promise<TokenDto> {
    if (!refreshTokenDto.refreshToken) {
      throw new BadRequestException('Refresh token is required')
    }
    return this.authService.refreshToken(refreshTokenDto.refreshToken)
  }

  /**
   * GET /auth/profile
   * Get current user profile
   */
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req: any) {
    return this.authService.getUserProfile(req.user.userId, req.user.tenantId)
  }

  /**
   * PATCH /auth/profile
   * Update user profile
   */
  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Request() req: any,
    @Body() updates: Partial<any>,
  ) {
    // Only allow certain fields to be updated
    const allowedFields = ['fullName', 'phone', 'avatarUrl', 'preferredLanguage', 'timezone']
    const filteredUpdates = Object.keys(updates)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key]
        return obj
      }, {})

    return this.authService.updateUserProfile(
      req.user.userId,
      req.user.tenantId,
      filteredUpdates,
    )
  }

  /**
   * PATCH /auth/change-password
   * Change password
   */
  @Patch('change-password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async changePassword(
    @Request() req: any,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    await this.authService.changePassword(
      req.user.userId,
      req.user.tenantId,
      changePasswordDto,
    )
  }

  /**
   * POST /auth/mfa/setup
   * Setup multi-factor authentication
   */
  @Post('mfa/setup')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async setupMfa(
    @Request() req: any,
    @Body() mfaSetupDto: MfaSetupDto,
  ) {
    return this.authService.setupMfa(
      req.user.userId,
      req.user.tenantId,
      mfaSetupDto.type,
    )
  }

  /**
   * POST /auth/mfa/verify
   * Verify MFA code
   */
  @Post('mfa/verify')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async verifyMfa(
    @Request() req: any,
    @Body() mfaVerifyDto: MfaVerifyDto,
  ) {
    await this.authService.verifyMfa(
      req.user.userId,
      req.user.tenantId,
      mfaVerifyDto.code,
      mfaVerifyDto.type,
    )
  }

  /**
   * DELETE /auth/mfa
   * Disable multi-factor authentication
   */
  @Post('mfa/disable')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async disableMfa(@Request() req: any) {
    await this.authService.disableMfa(req.user.userId, req.user.tenantId)
  }
}
