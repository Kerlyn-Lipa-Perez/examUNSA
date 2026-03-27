# AGENTS.md — Combo UNSA Coding Standards

## Project Overview

Combo UNSA is an academic preparation platform for UNSA university applicants. Stack: Next.js 14 (App Router) frontend + NestJS 10 backend + PostgreSQL + Drizzle ORM. Monorepo with `frontend/` and `backend/` directories managed by pnpm.

---

## General Rules

- Use TypeScript everywhere. No `any` unless absolutely unavoidable (and add a comment explaining why).
- Use pnpm as the package manager. Never use npm or yarn.
- Follow conventional commits: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`.
- Never commit `.env` files. Use `.env.example` for documentation.
- Never hardcode secrets, API keys, or tokens in source code.
- Keep functions small and focused. One responsibility per function.

---

## Naming Conventions

- **Files (Frontend):** `kebab-case.tsx` for components, `camelCase.ts` for utilities/stores/hooks.
- **Files (Backend):** `kebab-case.ts` following NestJS conventions: `feature.module.ts`, `feature.controller.ts`, `feature.service.ts`.
- **Variables & Functions:** `camelCase`.
- **Types & Interfaces:** `PascalCase`.
- **Constants:** `UPPER_SNAKE_CASE`.
- **Database columns:** `snake_case` in schema, `camelCase` in TypeScript types (Drizzle handles this mapping).

---

## Frontend (Next.js 14 + React 18)

### App Router Structure
- Pages go in `src/app/` using the App Router conventions.
- Use `'use client'` directive only when the component needs interactivity (hooks, event handlers).
- Server components by default. Minimize client component boundaries.

### Components
- Functional components only. No class components.
- Use TypeScript interfaces for props, named `ComponentNameProps`.
- Export named functions, not default exports: `export function QuestionCard(...)` not `export default ...`.
- Keep components in `src/components/` organized by feature: `dashboard/`, `simulacro/`, `layout/`, `ui/`.

### Styling — Combo UNSA Design System

**THIS IS MANDATORY. Follow these rules strictly.**

#### Color Usage
- NEVER use hardcoded hex colors in JSX. ALWAYS use Tailwind classes that reference the config.
- App background: `bg-neutral-900` (`#0D1117`)
- Cards/surfaces: `bg-neutral-800` (`#161B22`) with `rounded-xl` or `rounded-2xl`
- Lighter surfaces: `bg-neutral-700` (`#1E2532`)
- Borders: `border-neutral-border` (`#30363D`) or `border-white/5`
- Primary brand: `text-primary`, `bg-primary` (`#D4A017` — Gold)
- Secondary: `text-secondary`, `bg-secondary` (`#1A3A5C` — Dark Blue)
- Tertiary/links: `text-tertiary` (`#3B82F6` — Bright Blue)
- Status colors: `text-success`/`bg-success` (`#10B981`), `text-error`/`bg-error` (`#EF4444`), `text-warning`/`bg-warning` (`#D4A017`), `text-info`/`bg-info` (`#3B82F6`)
- Text primary: `text-gray-100` or `text-white`
- Text secondary/muted: `text-[#8B949E]` or `text-[#9CA3AF]`

#### Typography
- Body/headings: `font-sans` (Space Grotesk) — default for all text.
- Numbers/stats/exam questions: `font-mono` (JetBrains Mono) — REQUIRED for numeric data, percentages, timers, question text.
- Headings: `font-bold`, large sizes (`text-3xl`, `text-4xl`).

#### Buttons
- Primary: `bg-primary text-neutral-900 hover:bg-yellow-600 rounded-lg px-4 py-2`
- Secondary: `bg-secondary text-white`
- Outlined: `border border-neutral-border text-[#8B949E] hover:text-white`

#### Subject Color Strips (Flashcards)
- Biología: `border-l-4 border-l-success`
- Física/Matemáticas: `border-l-4 border-l-info`
- Historia: `border-l-4 border-l-error`
- Civics: `border-l-4 border-l-warning`

#### Micro-interactions
- Hover transitions: `transition-colors duration-200`
- Button scale: `transform hover:scale-105 transition-transform`

### State Management (Zustand)
- Stores in `src/store/` with `camelCase.ts` filenames.
- Use `persist` middleware with `createJSONStorage(() => localStorage)` for auth state.
- Store names in localStorage use prefix `combo-unsa-*`.
- Keep stores focused: one store per domain (auth, exam, etc.).
- Use TypeScript interfaces for state shapes. No `any` in store definitions.

### Data Fetching (TanStack React Query)
- Use `useQuery` for reads, `useMutation` for writes.
- Set `staleTime` appropriately — don't refetch data that changes rarely.
- Query keys follow array convention: `['simulacros', userId]`.

### Imports
- Use `@/` alias for absolute imports: `import { Question } from '@/types/simulacro'`.
- Group imports: (1) React/Next, (2) third-party, (3) project imports.

---

## Backend (NestJS 10 + Drizzle ORM)

### Module Structure
- Follow NestJS conventions: one feature = one module directory.
- Each module contains: `feature.module.ts`, `feature.controller.ts`, `feature.service.ts`.
- DTOs go in `dto/` subdirectory with `create-*.dto.ts` and `update-*.dto.ts` naming.
- Use `class-validator` decorators on DTOs. Never trust client input.

### Database (Drizzle ORM)
- Schema defined in `src/database/schema.ts`.
- Use `pgTable` with proper types: `uuid`, `varchar`, `text`, `integer`, `real`, `boolean`, `jsonb`, `timestamp`, `date`.
- Primary keys: `uuid('id').primaryKey().defaultRandom()`.
- Timestamps: `timestamp('created_at').defaultNow().notNull()`.
- Foreign keys: `.references(() => otherTable.id, { onDelete: 'cascade' })`.
- Export inferred types: `export type User = typeof users.$inferSelect`.
- Use `relations()` for typed joins.

### Authentication
- JWT-based auth using `@nestjs/jwt` + `passport-jwt`.
- Password hashing with `bcrypt` (salt rounds: 10).
- JWT payload structure: `{ sub: userId, email, plan }`.
- Use `@UseGuards(JwtAuthGuard)` for protected endpoints.
- Never return `passwordHash` in API responses.

### API Responses
- Return clean objects, not raw database rows.
- Remove sensitive fields before responding (passwords, internal IDs when not needed).
- Use NestJS exceptions: `UnauthorizedException`, `BadRequestException`, `NotFoundException`.

### Error Handling
- Use NestJS built-in exceptions (`BadRequestException`, `UnauthorizedException`, etc.).
- Always include meaningful error messages in Spanish (target audience is Peruvian students).
- Log errors appropriately — don't expose stack traces to clients.

---

## Naming in Spanish Context

- UI text, error messages, and user-facing content: Spanish.
- Code identifiers (variables, functions, types): English.
- Database column names: Spanish to match domain (`materia`, `puntaje`, `simulacrosHoy`).
- Comments: Spanish for business logic, English for technical patterns.

---

## Files to Never Modify Without Understanding

- `tailwind.config.ts` — Design system source of truth. Changes affect the entire app.
- `drizzle/` — Migration files. Generated automatically, never edit by hand.
- `src/middleware.ts` — Auth middleware for Next.js routes.
- `drizzle.config.ts` — Database connection config.

---

## What to Reject

- Hardcoded colors not in the Tailwind config.
- `any` type without justification comment.
- Default exports in components.
- Class components.
- Direct SQL queries (use Drizzle ORM).
- Unvalidated DTOs on backend endpoints.
- Missing `'use client'` on components that use hooks.
- npm or yarn commands (project uses pnpm).
