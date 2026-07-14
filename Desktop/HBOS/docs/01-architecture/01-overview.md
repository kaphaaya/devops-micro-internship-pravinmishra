# HBOS Architecture Overview

## System Design Principles

HBOS is designed as a cloud-native, multi-tenant SaaS platform with the following core principles:

### 1. Multi-Tenancy First
- **Tenant Isolation**: Database-level isolation using PostgreSQL Row-Level Security (RLS)
- **Single Database**: All tenants share infrastructure for cost efficiency
- **Secure by Default**: Every query automatically filters by tenant context
- **Scalability**: Easy to add thousands of businesses without code changes

### 2. Modular Architecture
- **Feature Modules**: Each business capability is a self-contained module
- **Independent Scaling**: Modules can be deployed and scaled independently
- **Clear Boundaries**: Well-defined APIs between modules
- **Reusability**: Shared utilities and common services across modules

### 3. Performance First
- **Caching Strategy**: Redis for session, query results, and real-time data
- **Database Optimization**: Indexes, query optimization, connection pooling
- **Frontend Optimization**: Code splitting, lazy loading, image optimization
- **CDN Distribution**: Static assets delivered globally via Cloudflare

### 4. Security by Design
- **Defense in Depth**: Multiple layers of security (app, database, network)
- **Zero Trust**: Verify every request, never assume trust
- **Encryption**: Data at rest and in transit encrypted
- **Audit Trail**: Every change logged for compliance

### 5. Developer Experience
- **TypeScript Everywhere**: Type-safe code across frontend and backend
- **Monorepo**: Single repo for easier management and code sharing
- **Hot Reload**: Instant feedback during development
- **Clear Patterns**: Reusable patterns for common tasks

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                         │
├──────────────────┬──────────────────┬──────────────────┤
│  Web Browser     │  Mobile (iOS)    │  Mobile (Android)│
│  (Next.js)       │  (React Native)  │  (React Native)  │
└────────┬─────────┴────────┬─────────┴────────┬──────────┘
         │                  │                  │
         └──────────────────┼──────────────────┘
                            │
                   ┌────────▼────────┐
                   │   API Gateway   │
                   │   (Load Balancer│
                   │    + WAF)       │
                   └────────┬────────┘
                            │
         ┌──────────────────┼──────────────────┐
         │                  │                  │
    ┌────▼─────┐    ┌──────▼──────┐   ┌──────▼──────┐
    │  Nginx    │    │   NestJS    │   │   NestJS    │
    │ (Reverse  │    │   API       │   │   API       │
    │  Proxy)   │    │  Instance 1 │   │  Instance 2 │
    └────┬─────┘    └──────┬──────┘   └──────┬──────┘
         │                  │                  │
         │   ┌──────────────┼──────────────┐  │
         │   │              │              │  │
         └──►│   ┌──────────▼───────────┐  │  │
             │   │                      │  │  │
             │   │    Redis Cluster     │  │  │
             │   │  (Sessions, Cache,   │  │  │
             │   │   Real-time, Jobs)   │  │  │
             │   │                      │  │  │
             │   └──────────┬───────────┘  │  │
             │              │              │  │
             │   ┌──────────▼──────────────┐ │
             │   │                        │ │
             └──►│  PostgreSQL Cluster    │◄┘
                 │  - Primary DB          │
                 │  - Read Replicas       │
                 │  - Automated Backups   │
                 │                        │
                 └────────┬───────────────┘
                          │
                 ┌────────▼────────┐
                 │   S3-Compatible │
                 │   File Storage  │
                 │   (Backups,     │
                 │    Uploads)     │
                 └─────────────────┘

┌─────────────────────────────────────────────────────────┐
│              OBSERVABILITY & OPERATIONS                  │
├──────────────────┬──────────────────┬──────────────────┤
│   Prometheus     │   Grafana        │    Sentry        │
│   (Metrics)      │   (Dashboards)   │    (Errors)      │
└──────────────────┴──────────────────┴──────────────────┘
```

---

## Deployment Architecture

### Local Development
- Docker Compose with PostgreSQL, Redis, Nginx
- Hot reload enabled for frontend and backend
- Seed data for testing

### Staging
- Kubernetes cluster (1-2 worker nodes)
- PostgreSQL managed database with daily backups
- Redis for caching and real-time features
- GitHub Actions deployment pipeline

### Production
- Kubernetes cluster (3+ worker nodes for HA)
- PostgreSQL with automatic failover and read replicas
- Redis cluster for high availability
- Multi-region disaster recovery
- CDN for static asset delivery
- 24/7 monitoring and automated alerts

---

## API Architecture

### REST API
- RESTful endpoints for all features
- OpenAPI 3.0 specification
- Versioning strategy (v1, v2, etc.)
- Rate limiting per subscription tier
- Webhook support for async events

### Real-Time Features
- WebSocket server (Socket.io)
- Real-time order updates
- Live inventory synchronization
- Staff presence tracking
- Customer queue status

### Authentication
- JWT-based authentication
- OAuth for social login (Phase 2)
- Multi-factor authentication (TOTP, SMS)
- Device management and tracking

---

## Database Architecture

### Multi-Tenancy Model
- **Strategy**: Row-Level Security (RLS) with tenant_id filtering
- **Isolation**: Database enforces tenant separation at SQL level
- **Performance**: No schema overhead, single database instance
- **Scalability**: Easy to add tenants without infrastructure changes

### Core Entity Model

```
Users ──┬──> Roles ──> Permissions
        │
        └──> Tenants ──┬──> Locations
                       │
                       ├──> Products ──┬──> Categories
                       │               │
                       │               └──> Inventory
                       │
                       ├──> Orders ──> OrderItems
                       │
                       ├──> Customers ──> Loyalty
                       │
                       ├──> Suppliers ──> PurchaseOrders
                       │
                       └──> AuditLogs
```

### Key Features
- Row-Level Security for tenant isolation
- Comprehensive indexing for performance
- Full-text search for customers and products
- JSONB fields for flexible data storage
- Audit tables for compliance

---

## Security Architecture

### Authentication Flow
1. User enters email & password
2. System verifies credentials against bcrypt hash
3. Generate JWT access token (15 min) + refresh token (7 days)
4. Store refresh token in HTTPOnly cookie
5. Include access token in Authorization header
6. On expiry, use refresh token to get new access token

### Authorization
- **Role-Based Access Control (RBAC)**
- **Location-Level Permissions** (for multi-location businesses)
- **Resource-Level Permissions** (fine-grained control)
- **Time-Based Access** (access windows)

### Data Protection
- **Encryption at Rest**: Database Transparent Data Encryption (TDE)
- **Encryption in Transit**: TLS 1.3
- **Sensitive Data**: Field-level encryption for PII
- **Backups**: Encrypted and stored in separate region

### Compliance
- GDPR compliance (data deletion, export)
- CCPA compliance (privacy controls)
- PCI DSS ready (payment data handling)
- SOC 2 Type II (Phase 3)
- ISO 27001 (Phase 4)

---

## Scalability Strategy

### Horizontal Scaling
- **Stateless API**: Multiple backend instances behind load balancer
- **Database**: Read replicas for query scaling
- **Cache**: Redis cluster for high availability
- **Storage**: S3 for unlimited file storage

### Performance Optimization
- **Query Optimization**: Indexes, query analysis, connection pooling
- **Caching Strategy**: Query caching, session caching, asset caching
- **CDN**: Cloudflare for global static asset distribution
- **Image Optimization**: Automatic resizing and compression
- **Code Splitting**: Lazy loading of routes and components

### Monitoring & Observability
- **Metrics**: Prometheus for application metrics
- **Dashboards**: Grafana for visualization
- **Logging**: ELK stack for centralized logging
- **Error Tracking**: Sentry for exception monitoring
- **APM**: Application performance monitoring

---

## Module Dependencies

### Phase 1 (MVP)
- Auth Module (foundation)
  - ├── Users Module
  - ├── Tenants Module
  - └── Roles/Permissions Module
- Orders Module
  - ├── Products Module
  - └── Payments Module
- Inventory Module (basic)
- Dashboard Module

### Phase 2
- Restaurant Module
- Inventory Module (advanced)
- CRM Module
- Reporting Module
- Email/SMS Module

### Phase 3
- Hotel Module
- HR Module
- Accounting Module
- Multi-Location Module

### Phase 4
- Analytics Module
- AI Assistant Module
- Workflow Automation Module
- Integrations Module

---

## Technology Justifications

### Next.js for Frontend
- Server Components reduce JavaScript payload
- Built-in API routes for simple endpoints
- Automatic code splitting and optimization
- Excellent TypeScript support
- Great developer experience

### NestJS for Backend
- Enterprise-ready framework
- Modular architecture aligns with feature modules
- Dependency injection for testing
- Strong community and ecosystem
- Built-in validation and transformation

### PostgreSQL for Database
- ACID compliance for financial transactions
- JSON support for flexible schemas
- Row-Level Security for multi-tenancy
- Full-text search capabilities
- Mature and stable for production

### Redis for Caching
- In-memory performance
- Pub/Sub for real-time features
- Queue support (Bull) for async jobs
- Session management
- Rate limiting

### Kubernetes for Orchestration
- Auto-scaling based on load
- Self-healing and high availability
- Rolling updates with zero downtime
- Resource management
- Industry standard

---

## Error Handling & Observability

### Error Categories
1. **Validation Errors** (4xx) – User input issues
2. **Authentication Errors** (401) – Missing or invalid auth
3. **Authorization Errors** (403) – Insufficient permissions
4. **Not Found Errors** (404) – Resource doesn't exist
5. **Server Errors** (5xx) – Unexpected failures

### Error Response Format
```json
{
  "statusCode": 400,
  "error": "BadRequest",
  "message": "Descriptive message",
  "timestamp": "2026-07-10T10:30:00Z",
  "path": "/api/v1/endpoint",
  "details": {
    "field": "email",
    "constraint": "isEmail"
  }
}
```

### Observability
- Structured logging (JSON format)
- Request/response logging
- Performance metrics per endpoint
- Error rate tracking
- User journey tracking

---

## Next Steps

1. Review and approve architecture
2. Proceed to Phase 0: Database Schema Design
3. Setup monorepo and development environment
4. Create API design documentation
5. Build design system in Figma

See [Phase 0 Specification](../05-phases/00-foundation.md) for detailed implementation plan.
