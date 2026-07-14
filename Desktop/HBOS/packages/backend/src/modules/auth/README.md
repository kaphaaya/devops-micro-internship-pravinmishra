# Auth Module

The Auth module handles user authentication, authorization, and account management.

## Features

- **User Registration** - Email-based signup with password validation
- **User Login** - Credential verification and JWT token generation
- **Token Management** - Access tokens (15 min) and refresh tokens (7 days)
- **Password Management** - Change password with current password verification
- **Multi-Factor Authentication (MFA)** - TOTP and SMS support
- **Account Security** - Login attempt tracking and account locking
- **User Profile** - Profile management and user preferences

## API Endpoints

### Registration & Login

```
POST /auth/register
- Register a new user
- Body: { email, password, fullName, tenantName }
- Returns: { accessToken, refreshToken, expiresIn, tokenType }

POST /auth/login
- Login user with credentials
- Body: { email, password }
- Returns: { accessToken, refreshToken, expiresIn, tokenType }

POST /auth/logout
- Logout user (revoke tokens)
- Requires: JWT token
```

### Token Management

```
POST /auth/refresh
- Refresh access token
- Body: { refreshToken }
- Returns: { accessToken, refreshToken, expiresIn, tokenType }
```

### User Profile

```
GET /auth/profile
- Get current user profile
- Requires: JWT token
- Returns: User object

PATCH /auth/profile
- Update user profile (fullName, phone, avatar, language, timezone)
- Requires: JWT token
- Body: { fullName?, phone?, avatarUrl?, preferredLanguage?, timezone? }
- Returns: Updated user object

PATCH /auth/change-password
- Change user password
- Requires: JWT token
- Body: { currentPassword, newPassword }
- Returns: 204 No Content
```

### Multi-Factor Authentication

```
POST /auth/mfa/setup
- Setup MFA (TOTP or SMS)
- Requires: JWT token
- Body: { type: 'totp' | 'sms' }
- Returns: { secret?, qrCode?, backupCodes }

POST /auth/mfa/verify
- Verify MFA code
- Requires: JWT token
- Body: { code, type: 'totp' | 'sms' }
- Returns: 200 OK

POST /auth/mfa/disable
- Disable MFA
- Requires: JWT token
- Returns: 204 No Content
```

## Database Schema

### users table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  phone VARCHAR(20),
  avatar_url VARCHAR(500),
  email_verified BOOLEAN DEFAULT false,
  email_verified_at TIMESTAMP,
  status VARCHAR(50) DEFAULT 'active',
  last_login_at TIMESTAMP,
  failed_login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP,
  preferred_language VARCHAR(10) DEFAULT 'en',
  timezone VARCHAR(50) DEFAULT 'UTC',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,
  UNIQUE(tenant_id, email)
)
```

### authentication_methods table

```sql
CREATE TABLE authentication_methods (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,
  user_id UUID NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'password', 'totp', 'sms', 'oauth'
  provider VARCHAR(50), -- 'google', 'microsoft', 'github'
  backup_codes TEXT[],
  provider_user_id VARCHAR(255),
  provider_access_token TEXT,
  provider_refresh_token TEXT,
  is_primary BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,
  UNIQUE(tenant_id, user_id, type, provider)
)
```

## File Structure

```
auth/
├── auth.module.ts              # Auth module configuration
├── auth.service.ts             # Business logic
├── auth.controller.ts          # HTTP endpoints
├── index.ts                    # Module exports
├── entities/
│   ├── user.entity.ts         # User database entity
│   └── authentication-method.entity.ts
├── dto/
│   ├── register.dto.ts        # Registration request
│   ├── login.dto.ts           # Login request
│   └── token.dto.ts           # Token and other DTOs
├── strategies/
│   ├── jwt.strategy.ts        # JWT validation strategy
│   └── local.strategy.ts      # Email/password strategy
└── README.md                  # This file
```

## Usage Examples

### Register a New User

```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!",
    "fullName": "John Doe",
    "tenantName": "My Restaurant"
  }'
```

Response:
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "expiresIn": 900,
  "tokenType": "Bearer"
}
```

### Login

```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!"
  }'
```

### Access Protected Route

```bash
curl -X GET http://localhost:3001/auth/profile \
  -H "Authorization: Bearer eyJhbGc..."
```

### Refresh Token

```bash
curl -X POST http://localhost:3001/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGc..."
  }'
```

## Security

### Password Requirements
- Minimum 12 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (!@#$%^&* etc.)

### Account Locking
- Account locks after 5 failed login attempts
- Locked for 15 minutes
- Lock is cleared on successful login

### Token Security
- Access tokens expire in 15 minutes
- Refresh tokens expire in 7 days
- Tokens are JWT-signed with HS256
- JWT secret stored in environment variables

### Password Hashing
- Passwords hashed with bcrypt (salt rounds: 10)
- Never stored in plain text
- Never logged or exposed in responses

## Future Enhancements (Phase 2+)

- [ ] OAuth integration (Google, Microsoft, GitHub)
- [ ] Social login with OAuth providers
- [ ] Email verification flow
- [ ] Password reset via email
- [ ] SMS-based MFA
- [ ] TOTP-based MFA with QR codes
- [ ] Device management and tracking
- [ ] Session management
- [ ] Login activity history
- [ ] IP-based access control
- [ ] Suspicious activity alerts
- [ ] Two-step verification

## Testing

```bash
# Run auth module tests
pnpm test --scope=@hbos/backend -- auth

# Watch mode
pnpm test:watch --scope=@hbos/backend -- auth

# Coverage
pnpm test:coverage --scope=@hbos/backend -- auth
```

## Integration with Other Modules

The Auth module is required by all other modules:
- Provides JWT authentication for protected routes
- Supplies user context (userId, tenantId) to other modules
- Manages tenant isolation at the authentication level
- Exports AuthModule for import in other feature modules

Example usage in another module:

```typescript
import { Module } from '@nestjs/common'
import { AuthModule } from '../auth'
import { OrdersController } from './orders.controller'
import { OrdersService } from './orders.service'

@Module({
  imports: [AuthModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
```

Then use JwtAuthGuard in controllers:

```typescript
@Get()
@UseGuards(JwtAuthGuard)
async getOrders(@Tenant() tenantId: UUID, @CurrentUser() userId: UUID) {
  // Handle authenticated request
}
```
