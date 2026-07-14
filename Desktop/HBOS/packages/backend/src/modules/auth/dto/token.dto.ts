/**
 * DTO for token response
 */
export class TokenDto {
  accessToken: string
  refreshToken: string
  expiresIn: number
  tokenType: string = 'Bearer'
}

/**
 * DTO for refresh token request
 */
export class RefreshTokenDto {
  refreshToken: string
}

/**
 * DTO for password change
 */
export class ChangePasswordDto {
  currentPassword: string
  newPassword: string
}

/**
 * DTO for password reset request
 */
export class PasswordResetRequestDto {
  email: string
}

/**
 * DTO for password reset confirmation
 */
export class PasswordResetConfirmDto {
  token: string
  newPassword: string
}

/**
 * DTO for MFA setup
 */
export class MfaSetupDto {
  type: 'totp' | 'sms'
}

/**
 * DTO for MFA setup response
 */
export class MfaSetupResponseDto {
  secret?: string
  qrCode?: string
  backupCodes: string[]
}

/**
 * DTO for MFA verification
 */
export class MfaVerifyDto {
  code: string
  type: 'totp' | 'sms'
}

/**
 * DTO for verifying email
 */
export class VerifyEmailDto {
  token: string
}
