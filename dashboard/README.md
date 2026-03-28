# TradePose Dashboard

Modern web dashboard for managing TradePose API keys, monitoring usage, and handling subscriptions.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI**: Tailwind CSS + shadcn/ui
- **Authentication**: Clerk
- **Data Fetching**: TanStack Query
- **Charts**: Recharts

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### Installation

```bash
pnpm install
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clerk publishable key
- `CLERK_SECRET_KEY`: Clerk secret key
- `NEXT_PUBLIC_API_URL`: TradePose Gateway API URL

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
pnpm build
```

## Project Structure

```
src/
├── app/
│   ├── (auth)/           # Authentication pages
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── (dashboard)/      # Protected dashboard pages
│   │   ├── api-keys/
│   │   ├── billing/
│   │   ├── dashboard/
│   │   ├── settings/
│   │   └── usage/
│   ├── layout.tsx        # Root layout with Clerk provider
│   └── page.tsx          # Landing page
├── components/
│   ├── dashboard/        # Dashboard-specific components
│   ├── providers/        # Context providers
│   └── ui/               # shadcn/ui components
└── lib/
    ├── api.ts            # Gateway API client
    ├── date.ts           # Date utilities
    └── utils.ts          # General utilities
```

## Features

- **API Key Management**: Create, list, and revoke API keys
- **Usage Analytics**: Monitor API usage with charts and statistics
- **Billing**: View subscription status and upgrade plans
- **User Settings**: Manage profile and connected accounts

## Design System

- **Dark Mode**: OLED-optimized dark theme
- **Colors**: Slate-based palette with green accents
- **Typography**: Plus Jakarta Sans (UI) + Fira Code (monospace)
