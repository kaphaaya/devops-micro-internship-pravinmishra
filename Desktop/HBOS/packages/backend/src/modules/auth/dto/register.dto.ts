import { IsEmail, IsString, MinLength, MaxLength, Matches } from 'class-validator'

/**
 * DTO for user registration
 */
export class RegisterDto {
  @IsEmail()
  @MaxLength(255)
  email: string

  @IsString()
  @MinLength(12, { message: 'Password must be at least 12 characters' })
  @MaxLength(128)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    {
      message:
        'Password must contain uppercase, lowercase, number, and special character',
    },
  )
  password: string

  @IsString()
  @MinLength(2)
  @MaxLength(255)
  fullName: string

  @IsString()
  @MinLength(2)
  @MaxLength(255)
  tenantName?: string
}
