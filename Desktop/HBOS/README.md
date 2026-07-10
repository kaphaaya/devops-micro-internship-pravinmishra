# HBOS – Hospitality Business Operating System

A world-class, enterprise-grade, cloud-native hospitality management platform designed to serve businesses ranging from a single restaurant to multinational hospitality chains.

## Overview

HBOS is **not** a simple POS system. It's a complete operating system for hospitality businesses, combining:

- **Point of Sale (POS)** – Lightning-fast ordering, offline mode, multiple payment methods
- **Restaurant Management** – Table layouts, reservations, menu builder, kitchen display system
- **Hotel Management** – Room inventory, reservations, housekeeping, guest services
- **Inventory Management** – Stock tracking, purchase orders, waste tracking, supplier management
- **Customer Relationship Management (CRM)** – Loyalty programs, customer profiles, segmentation
- **Human Resources** – Shift scheduling, payroll, performance reviews, training
- **Accounting & Finance** – General ledger, P&L, tax compliance, bank reconciliation
- **Analytics & Intelligence** – Real-time dashboards, predictive models, AI recommendations
- **Workflow Automation** – Custom business processes, approvals, notifications

## Philosophy

Inspired by the simplicity of Apple, Stripe, Linear, and Notion – HBOS should be beautiful enough that users enjoy opening it every day.

## Project Structure

```
/HBOS/
├── /docs/                 # Complete documentation
├── /packages/            # Monorepo workspaces
│   ├── /core/           # Shared types, utilities, constants
│   ├── /frontend/       # Next.js 14 web application
│   ├── /backend/        # NestJS API server
│   ├── /design-system/  # Component library + Storybook
│   └── /mobile/         # React Native (Phase 4)
├── /deployment/         # Kubernetes, Terraform configs
├── /scripts/            # Build and deployment scripts
└── docker-compose.yml   # Local development environment
```

## Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- Docker & Docker Compose
- pnpm (package manager)

### Setup

```bash
# 1. Clone repository
git clone https://github.com/hospitality/hbos.git
cd HBOS

# 2. Install dependencies
pnpm install

# 3. Setup local environment
cp .env.example .env.local

# 4. Start database & services
docker-compose up -d

# 5. Run migrations
pnpm db:migrate

# 6. Seed demo data
pnpm db:seed

# 7. Start development servers
pnpm dev

# Frontend: http://localhost:3000
# Backend: http://localhost:3001
# Storybook: http://localhost:6006
```

## Phase Roadmap

### Phase 0: Foundation (Weeks 1-4)
- Database schema & multi-tenancy design
- API design (OpenAPI 3.0)
- Design system & Figma specs
- Monorepo setup & CI/CD

### Phase 1: MVP Core (Weeks 5-12)
- User authentication & MFA
- Dashboard with KPIs
- Basic POS system
- Inventory management
- 1,000 daily users

### Phase 2: Essential Modules (Weeks 13-24)
- Restaurant management (menus, reservations, tables)
- Advanced inventory (purchase orders, suppliers)
- CRM (loyalty, campaigns, segmentation)
- Reporting engine (sales, inventory, customers)
- Staff scheduling
- 10,000 daily users

### Phase 3: Advanced Features (Weeks 25-40)
- Hotel management (rooms, bookings, housekeeping)
- HR & Payroll
- Accounting & Finance
- Multi-location management
- Compliance & audit logging
- 100,000 daily users

### Phase 4: Intelligence (Weeks 41-52)
- Analytics & data warehouse
- AI Assistant (demand forecasting, recommendations)
- Workflow automation engine
- Mobile apps (iOS/Android)
- Real-time features
- 500,000 daily users

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (React 18, TypeScript)
- **Styling**: Tailwind CSS + Design Tokens
- **UI**: Custom Design System + shadcn/ui
- **State**: TanStack Query + Zustand
- **Charts**: Recharts
- **Testing**: Vitest + Playwright

### Backend
- **Framework**: NestJS 10
- **Language**: TypeScript 5
- **Database**: PostgreSQL 15 (with Row-Level Security)
- **ORM**: TypeORM + Prisma
- **Caching**: Redis
- **Jobs**: Bull (Redis Queue)
- **Auth**: Passport.js + JWT

### Infrastructure
- **Containerization**: Docker
- **Orchestration**: Kubernetes
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack
- **CDN**: Cloudflare
- **Payments**: Stripe

## Documentation

- **[Architecture Overview](./docs/01-architecture/01-overview.md)** – System design principles
- **[Database Schema](./docs/03-database/01-schema.md)** – Entity relationships & multi-tenancy
- **[API Design](./docs/02-api/01-authentication.md)** – REST endpoints & webhooks
- **[Design System](./docs/04-design-system/01-overview.md)** – Components & tokens
- **[Development Guide](./docs/07-frontend/01-setup.md)** – Frontend setup & patterns
- **[Backend Guide](./docs/08-backend/01-setup.md)** – Backend setup & modules
- **[Phase Specifications](./docs/05-phases/)** – Detailed phase requirements

## Key Features

### Multi-Tenancy
- Row-level security at database level
- Complete tenant isolation
- Per-tenant customization
- Easy onboarding

### Security
- OAuth + JWT authentication
- Multi-factor authentication (TOTP, SMS)
- Encryption at rest & in transit
- GDPR/CCPA ready
- SOC 2 Type II compliance (Phase 3)

### Scalability
- Horizontal scaling architecture
- Redis caching layer
- Database connection pooling
- CDN integration
- Background job queue

### Performance
- Lighthouse score target: >95
- First Contentful Paint: <1.5s
- Time to Interactive: <2s
- Optimized images & lazy loading
- Query optimization & indexing

## Team

HBOS is built by a world-class team of:
- Product Strategists
- Hospitality Domain Experts
- UX Researchers & Designers
- System Architects
- Full-Stack Engineers
- DevOps Engineers
- QA Engineers
- Security Specialists

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines.

## License

Proprietary – All rights reserved.

## Support

- **Docs**: https://docs.hbos.io
- **Issues**: GitHub Issues
- **Email**: support@hbos.io
- **Discord**: [Community Server]

---

**Status**: Phase 0 – Foundation (In Progress)
**Last Updated**: 2026-07-10
