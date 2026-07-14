# Roles & Permissions Module

The Roles & Permissions module implements Role-Based Access Control (RBAC) for HBOS. It manages roles, permissions, and user role assignments.

## Overview

This module provides:
- **Role Management** - Create, update, delete custom roles
- **Permission Management** - Define granular permissions
- **User Assignment** - Assign roles to users (tenant-wide or location-specific)
- **Permission Checking** - Verify user permissions in requests
- **System Roles** - Pre-defined roles (Super Admin, Admin, Manager, Staff)

## Architecture

### Entities

**Role**
- `id` - Unique identifier
- `tenantId` - Tenant ownership
- `name` - Role name (e.g., "Manager")
- `description` - Human-readable description
- `isSystem` - True for system roles (cannot be deleted)
- `permissions` - Many-to-many relationship with Permission
- `createdAt`, `updatedAt`, `deletedAt` - Audit fields

**Permission**
- `id` - Unique identifier
- `tenantId` - Tenant ownership
- `code` - Permission code (e.g., "orders:create") - unique per tenant
- `name` - Human-readable name
- `description` - Details about the permission
- `resource` - What is being accessed (e.g., "orders")
- `action` - What can be done (e.g., "create", "read", "update", "delete")
- `createdAt` - When created

**UserRole** (Junction Table)
- `id` - Unique identifier
- `tenantId` - Tenant ownership
- `userId` - Reference to User
- `roleId` - Reference to Role
- `locationId` - Optional location-specific assignment
- `createdAt`, `deletedAt` - Audit fields

### Services

**RolesService**

Role methods:
- `createRole(tenantId, dto)` - Create new role
- `getRoleById(tenantId, roleId)` - Get role with permissions
- `listRoles(tenantId, skip, take)` - List roles (paginated)
- `updateRole(tenantId, roleId, dto)` - Update role details
- `deleteRole(tenantId, roleId)` - Delete role (if no users assigned)

Permission methods:
- `createPermission(tenantId, dto)` - Create permission
- `getPermissionById(tenantId, permissionId)` - Get permission
- `listPermissions(tenantId, skip, take)` - List permissions (paginated)
- `getPermissionsByResource(tenantId, resource)` - Get all permissions for a resource

User assignment methods:
- `assignRoleToUser(tenantId, dto)` - Assign role to user
- `removeRoleFromUser(tenantId, userId, roleId, locationId)` - Remove role
- `getUserRoles(tenantId, userId, locationId)` - Get all roles for user
- `getUsersWithRole(tenantId, roleId, locationId)` - Get all users with role

Permission checking methods:
- `userHasPermission(tenantId, userId, permissionCode, locationId)` - Check if user has permission
- `getUserPermissions(tenantId, userId, locationId)` - Get all permissions for user
- `getUserPermissionCodes(tenantId, userId, locationId)` - Get permission codes array

System role methods:
- `initializeSystemRoles(tenantId)` - Create default system roles (called on tenant creation)
- `getSystemRole(tenantId, roleName)` - Get system role

## API Endpoints

### Role Management

**Create Role**
```http
POST /roles
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "Supervisor",
  "description": "Can manage team and view reports",
  "permissionIds": ["permission-id-1", "permission-id-2"]
}

Response:
{
  "id": "550e8400-e29b-41d4-a716-446655440002",
  "tenantId": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Supervisor",
  "description": "Can manage team and view reports",
  "isSystem": false,
  "permissions": [...],
  "createdAt": "2026-07-14T00:00:00Z",
  "updatedAt": "2026-07-14T00:00:00Z"
}
```

**Get Role by ID**
```http
GET /roles/:roleId
Authorization: Bearer <jwt_token>

Response: RoleDto (with permissions)
```

**List Roles**
```http
GET /roles?skip=0&take=20
Authorization: Bearer <jwt_token>

Response:
{
  "data": [RoleDto, ...],
  "total": 15
}
```

**Update Role**
```http
PATCH /roles/:roleId
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "Senior Supervisor",
  "permissionIds": ["perm-1", "perm-2", "perm-3"]
}

Response: RoleDto
```

**Delete Role**
```http
DELETE /roles/:roleId
Authorization: Bearer <jwt_token>

Response: 204 No Content
```

### Permission Management

**Create Permission**
```http
POST /roles/permissions/create
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "code": "orders:approve",
  "name": "Approve Orders",
  "description": "Can approve pending orders",
  "resource": "orders",
  "action": "approve"
}

Response: PermissionDto
```

**List Permissions**
```http
GET /roles/permissions/list?skip=0&take=100
Authorization: Bearer <jwt_token>

Response:
{
  "data": [PermissionDto, ...],
  "total": 42
}
```

**Get Permissions by Resource**
```http
GET /roles/permissions/resource/orders
Authorization: Bearer <jwt_token>

Response: [PermissionDto, ...]
```

### User Role Assignment

**Assign Role to User**
```http
POST /roles/assign
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "userId": "550e8400-e29b-41d4-a716-446655440001",
  "roleId": "550e8400-e29b-41d4-a716-446655440002",
  "locationId": "550e8400-e29b-41d4-a716-446655440003" // optional
}

Response: UserRoleDto
```

**Remove Role from User**
```http
DELETE /roles/:roleId/users/:userId?locationId=optional-location-id
Authorization: Bearer <jwt_token>

Response: 204 No Content
```

**Get User's Roles**
```http
GET /roles/users/:userId?locationId=optional-location-id
Authorization: Bearer <jwt_token>

Response: [UserRoleDto, ...]
```

**Get Users with Role**
```http
GET /roles/:roleId/users?locationId=optional-location-id
Authorization: Bearer <jwt_token>

Response:
[
  { "userId": "user-1", "locationId": null },
  { "userId": "user-2", "locationId": "location-1" }
]
```

### Permission Checking

**Check User Permission**
```http
GET /roles/check-permission?permissionCode=orders:create&locationId=optional
Authorization: Bearer <jwt_token>

Response:
{
  "hasPermission": true
}
```

**Get Current User's Permissions**
```http
GET /roles/my-permissions?locationId=optional
Authorization: Bearer <jwt_token>

Response: [PermissionDto, ...]
```

**Get Current User's Roles**
```http
GET /roles/my-roles?locationId=optional
Authorization: Bearer <jwt_token>

Response: [UserRoleDto, ...]
```

## Permission Codes Convention

Permissions follow the `resource:action` pattern:

```
orders:create       - Create new orders
orders:read         - View orders
orders:update       - Edit existing orders
orders:delete       - Delete orders
orders:approve      - Approve pending orders
orders:export       - Export order data

products:create
products:read
products:update
products:delete
products:import

customers:create
customers:read
customers:update
customers:delete
customers:export
customers:segment   - Create customer segments

inventory:create
inventory:read
inventory:update
inventory:count     - Perform inventory count
inventory:adjust    - Adjust stock levels
inventory:transfer  - Transfer between locations

reports:view
reports:create
reports:schedule    - Schedule automated reports
reports:export

users:create
users:read
users:update
users:delete
users:invite        - Invite new users

roles:create
roles:read
roles:update
roles:delete
```

## System Roles

Default system roles created for each tenant:

### Super Admin
- Full access to all features and data
- Can manage all users, roles, and permissions
- Can access all locations
- Cannot be deleted

### Admin
- Full access to location features
- Can manage roles and permissions within location
- Can manage staff within location

### Manager
- Can manage staff and view reports
- Can view and manage orders
- Location-specific scope

### Staff
- Can view assigned features
- Can create orders
- Limited to assigned location

## Integration with Auth Module

When a user authenticates, their permissions are NOT included in JWT by default (Phase 2 enhancement).

Current JWT payload:
```typescript
{
  userId: string
  tenantId: string
  email: string
  roles: ['user']  // placeholder
  permissions: []  // placeholder
  iat: number
  exp: number
}
```

Permissions are fetched from the database on-demand per request.

## Usage in Other Modules

### Check Permission in Service
```typescript
constructor(private rolesService: RolesService) {}

async createOrder(tenantId: string, userId: string, dto: CreateOrderDto) {
  // Check if user has permission
  const hasPermission = await this.rolesService.userHasPermission(
    tenantId,
    userId,
    'orders:create'
  )

  if (!hasPermission) {
    throw new ForbiddenException('You do not have permission to create orders')
  }

  // Proceed with order creation
  return this.ordersRepository.create(dto)
}
```

### Check Permission in Guard (Phase 2)
```typescript
@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private rolesService: RolesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const { tenantId, userId } = request.user
    const requiredPermission = this.reflector.get<string>('permission', context.getHandler())

    if (!requiredPermission) {
      return true
    }

    return this.rolesService.userHasPermission(tenantId, userId, requiredPermission)
  }
}

// Usage: @UseGuards(PermissionGuard) @RequirePermission('orders:create') async createOrder() {}
```

## Database Schema

```sql
-- Roles
CREATE TABLE roles (
  id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id),
  name VARCHAR(100),
  description TEXT,
  is_system BOOLEAN DEFAULT false,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP
)

-- Permissions
CREATE TABLE permissions (
  id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id),
  code VARCHAR(100),
  name VARCHAR(255),
  description TEXT,
  resource VARCHAR(50),
  action VARCHAR(20),
  created_at TIMESTAMP
)

-- Role-Permission Junction
CREATE TABLE role_permissions (
  role_id UUID REFERENCES roles(id),
  permission_id UUID REFERENCES permissions(id),
  PRIMARY KEY (role_id, permission_id)
)

-- User-Role Junction (location-aware)
CREATE TABLE user_roles (
  id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id),
  user_id UUID REFERENCES users(id),
  role_id UUID REFERENCES roles(id),
  location_id UUID NULL,
  created_at TIMESTAMP,
  deleted_at TIMESTAMP
)
```

## Testing

Run tests:
```bash
npm test -- roles.service.spec
```

Test coverage:
- ✅ Create/read/update/delete roles
- ✅ Create/list permissions
- ✅ Assign/remove roles from users
- ✅ Permission checking
- ✅ System role initialization
- ✅ Error handling (conflicts, not found, forbidden)
- ✅ Location-specific assignments
- ✅ Soft deletes

## Next Steps

1. **Permission Guard** - Create @RequirePermission() decorator for routes
2. **Batch Operations** - Assign roles to multiple users at once
3. **Permission Matrix** - View role-permission grid
4. **Audit Logging** - Track role/permission changes
5. **Role Templates** - Pre-built role templates for common use cases

## Related Documentation

- [Database Schema](../../docs/03-database/01-schema.md)
- [Auth Module](../auth/README.md)
- [Tenants Module](../tenants/README.md)
