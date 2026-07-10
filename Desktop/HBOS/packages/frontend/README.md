# @hbos/frontend

HBOS Frontend - Next.js 14 web application for hospitality management.

## Features

- Next.js 14 with App Router
- React 18 with Server/Client Components
- TailwindCSS for styling
- TypeScript for type safety
- React Query for state management
- Zustand for client state
- Recharts for data visualization
- Framer Motion for animations

## Project Structure

```
app/                   # Next.js 14 App Router
├── (auth)/           # Authentication pages
├── (dashboard)/      # Dashboard and main app
├── layout.tsx        # Root layout
├── page.tsx          # Home page
├── providers.tsx     # App providers
└── globals.css       # Global styles

components/          # React components
├── auth/            # Auth components
├── dashboard/       # Dashboard components
├── layout/          # Layout components
├── common/          # Shared components
└── ...

lib/                 # Utilities and helpers
├── api/             # API client
├── hooks/           # React hooks
├── store/           # Zustand stores
└── utils/           # Utility functions

styles/              # CSS modules and globals
public/              # Static assets
```

## Setup

```bash
pnpm install
pnpm dev
```

Visit http://localhost:3000

## Environment Variables

See `.env.example` in root:
- `NEXT_PUBLIC_API_BASE_URL` - Backend API URL
- `NEXT_PUBLIC_WS_URL` - WebSocket URL

## Building

```bash
pnpm build
pnpm start
```

## Testing

```bash
pnpm test           # Run tests
pnpm test:watch     # Watch mode
pnpm test:coverage  # Coverage report
```

## Linting

```bash
pnpm lint           # Check
pnpm lint:fix       # Fix
```

## Key Files

- `next.config.js` - Next.js configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `app/layout.tsx` - Root layout with providers
- `app/globals.css` - Global styles and Tailwind imports

## Stack

- **Framework**: Next.js 14
- **UI Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: TanStack Query + Zustand
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Testing**: Vitest + Playwright

## Contributing

Follow the [CONTRIBUTING.md](../../CONTRIBUTING.md) guide.
