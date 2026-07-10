# @hbos/core

Shared types, utilities, and constants used across all HBOS packages.

## Structure

```
src/
├── types/              # TypeScript interfaces and types
│   ├── common.ts      # Common types (UUID, timestamps, pagination)
│   ├── api.ts         # API request/response types
│   ├── domain.ts      # Business domain entities
│   └── auth.ts        # Authentication types
├── constants/          # Application constants
│   ├── limits.ts      # System limits and quotas
│   ├── endpoints.ts   # API endpoint paths
│   └── error-codes.ts # Error codes and messages
├── utils/              # Utility functions
│   ├── validation.ts  # Input validation
│   ├── formatting.ts  # String formatting utilities
│   ├── date.ts        # Date/time utilities
│   └── crypto.ts      # Cryptography utilities
└── errors/             # Error classes
    ├── AppError.ts    # Base error class
    ├── ValidationError.ts
    ├── NotFoundError.ts
    ├── UnauthorizedError.ts
    ├── ForbiddenError.ts
    └── ConflictError.ts
```

## Usage

### Types

```typescript
import type { IUser, IOrder, IProduct } from '@hbos/core'

const user: IUser = {
  id: '...',
  email: 'user@example.com',
  // ...
}
```

### Constants

```typescript
import { PAGINATION, ERROR_CODES, ENDPOINTS } from '@hbos/core'

// Pagination defaults
const limit = PAGINATION.DEFAULT_LIMIT // 20

// Error codes
const code = ERROR_CODES.AUTH.INVALID_CREDENTIALS

// API endpoints
const loginUrl = ENDPOINTS.AUTH.LOGIN // '/auth/login'
```

### Utilities

```typescript
import {
  isValidEmail,
  formatCurrency,
  addDays,
  generateUUID,
} from '@hbos/core'

// Validation
if (isValidEmail(email)) {
  // Email is valid
}

// Formatting
const price = formatCurrency(99.99, 'USD') // "$99.99"

// Date utilities
const tomorrow = addDays(new Date(), 1)

// Crypto
const id = generateUUID()
```

### Error Classes

```typescript
import { ValidationError, NotFoundError, UnauthorizedError } from '@hbos/core'

throw new ValidationError('Invalid input', { field: 'email' })
throw new NotFoundError('User', '123')
throw UnauthorizedError.invalidCredentials()
```

## Building

```bash
pnpm build
```

## Testing

```bash
pnpm test
```

## Files

- **types/common.ts**: Base types, enums, pagination, responses
- **types/api.ts**: Authentication, tokens, sessions, API models
- **types/domain.ts**: Business entities (User, Order, Product, etc.)
- **types/auth.ts**: Auth methods, MFA, permissions, RBAC

- **constants/limits.ts**: Pagination, auth, file upload, rate limits, DB, cache, business logic
- **constants/endpoints.ts**: RESTful API endpoint definitions
- **constants/error-codes.ts**: Standardized error codes across app

- **utils/validation.ts**: Email, UUID, password, phone validation
- **utils/formatting.ts**: Currency, numbers, dates, phone, slug formatting
- **utils/date.ts**: Date manipulation, time zones, relative times
- **utils/crypto.ts**: UUID generation, hashing, tokens, encryption

- **errors/AppError.ts**: Base error with status code and details
- **errors/ValidationError.ts**: 400 validation failures
- **errors/NotFoundError.ts**: 404 resource not found
- **errors/UnauthorizedError.ts**: 401 authentication failures
- **errors/ForbiddenError.ts**: 403 authorization failures
- **errors/ConflictError.ts**: 409 conflicts/duplicates

## Notes

- All exports are re-exported from `src/index.ts`
- TypeScript strict mode enabled
- No external dependencies (pure TypeScript)
- Suitable for both Node.js and browser environments
