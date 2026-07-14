# @hbos/design-system

HBOS Design System - Reusable component library for the hospitality platform.

## Overview

A comprehensive component library built with React and TypeScript, providing consistent UI components across HBOS applications.

## Components

Components are organized by category:

### Primitives
- Button
- Input
- Select
- Checkbox
- Radio
- Badge
- Textarea
- Toggle

### Forms
- Form (React Hook Form wrapper)
- FormField
- FormSelect
- FormDatePicker
- FormMultiSelect

### Layouts
- PageLayout
- CardLayout
- SidebarLayout
- Header
- Sidebar
- Footer
- Breadcrumb

### Data Display
- Table
- DataGrid
- Card
- Stats
- List
- EmptyState

### Feedback
- Alert
- Notification/Toast
- Modal/Dialog
- Drawer
- Tooltip
- Popover

### Navigation
- Tabs
- Stepper
- Menu
- Dropdown
- CommandPalette

### Patterns
- KPICard
- FilterBar
- SearchBar
- Pagination
- LoadingState
- ErrorBoundary
- ConfirmDialog

## Design Tokens

### Colors
- Primary: Blue shades
- Secondary: Purple shades
- Success: Green
- Warning: Amber
- Error: Red
- Info: Blue

### Typography
- Font family: Inter (sans), Fira Code (mono)
- Sizes: xs to 5xl
- Weights: Regular, Medium, Semibold, Bold

### Spacing
- 8-point grid system
- xs (4px) to 4xl (64px)

### Shadows
- xs, sm, md, lg, xl

## Installation

```bash
npm install @hbos/design-system
```

## Usage

```typescript
import { Button, Card, TextField } from '@hbos/design-system'

export function Example() {
  return (
    <Card>
      <h2>Welcome</h2>
      <TextField placeholder="Enter text" />
      <Button variant="primary">Submit</Button>
    </Card>
  )
}
```

## Storybook

View components in Storybook:

```bash
pnpm storybook
```

Visit http://localhost:6006

## Building

```bash
pnpm build
```

## Testing

```bash
pnpm test           # Run tests
pnpm test:watch     # Watch mode
```

## Linting

```bash
pnpm lint           # Check
pnpm lint:fix       # Fix
```

## Structure

```
src/
├── foundation/
│   ├── tokens/                    # Design tokens
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   ├── spacing.ts
│   │   ├── shadows.ts
│   │   └── breakpoints.ts
│   └── layout/
│       ├── Container.tsx
│       ├── Grid.tsx
│       ├── Flex.tsx
│       └── Stack.tsx
├── components/
│   ├── primitives/               # Basic components
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Select/
│   │   └── ...
│   ├── forms/                    # Form components
│   ├── layouts/                  # Layout components
│   ├── data-display/             # Data presentation
│   ├── feedback/                 # Feedback components
│   ├── navigation/               # Navigation components
│   └── patterns/                 # Compound components
├── styles/
│   ├── globals.css
│   └── utilities.css
├── types/                        # TypeScript types
└── index.ts                      # Main export

.storybook/                      # Storybook config
├── main.ts
├── preview.ts
└── manager.ts

stories/                         # Component stories
├── [component].stories.tsx
```

## Design Principles

1. **Simplicity**: Minimal and clean interfaces
2. **Consistency**: Unified design language
3. **Accessibility**: WCAG 2.1 AA compliance
4. **Performance**: Optimized for speed
5. **Flexibility**: Customizable and composable

## Contributing

When adding components:

1. Create component file: `src/components/[category]/[Component]/index.tsx`
2. Add styling with Tailwind CSS
3. Create Storybook story: `src/components/[category]/[Component]/[Component].stories.tsx`
4. Add tests: `src/components/[category]/[Component]/[Component].test.tsx`
5. Export from `src/index.ts`
6. Update this README

## Stack

- **React 18**: UI library
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Storybook 7**: Component development
- **Vitest**: Testing

## License

Proprietary - All rights reserved
