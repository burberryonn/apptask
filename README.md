# Dayloom

Dayloom is an original, web-first productivity app that combines task planning, habit tracking, calendar context, reminders architecture, and activity history in one screen.

## Stack
- Next.js 14 App Router + TypeScript
- Tailwind CSS + shadcn-compatible component patterns
- Zustand state management
- Prisma + PostgreSQL
- NextAuth (credentials demo)
- date-fns, React Hook Form + Zod ready, Framer Motion

## Information architecture
- **Dashboard** (`/`): habit strip + grouped tasks (Today/Tomorrow/This Week/Later), quick add, filters, task detail drawer.
- **Calendar** (`/calendar`): month/week toggle and day-focused task/habit context.
- **Habit Detail** (`/habits/[id]`): large progress ring, increment/decrement, streak/success metrics, day markers.
- **Logbook** (`/history`): activity timeline with search.
- **Settings** (`/settings`): theme, voice toggle, notification architecture, import/export placeholder.

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure env:
   ```bash
   cp .env.example .env
   # set DATABASE_URL and NEXTAUTH_SECRET
   ```
3. Generate Prisma client + migrate + seed:
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   npm run prisma:seed
   ```
4. Run dev server:
   ```bash
   npm run dev
   ```

## Architecture notes
- Reminders are modeled in DB and support in-app scheduling metadata.
- Browser Notifications are progressive enhancement; denied permission falls back to in-app reminder center.
- Production delivery for reliable reminders should use worker queues (e.g. BullMQ + Redis or cloud scheduler).
- Voice input follows Web Speech API when browser supports it and shows fallback controls otherwise.
- Sharing UI is a future-ready stub via copy-link affordance.

## Keyboard shortcuts (desktop)
- `n`: focus quick-add task input
- `h`: toggle hidden lists
- `g d`: go to dashboard (future extension)

## Seed account
- email: `demo@dayloom.app`

## Legal/design note
Dayloom is an original interface and does not reuse proprietary branding/assets from any third-party product.
