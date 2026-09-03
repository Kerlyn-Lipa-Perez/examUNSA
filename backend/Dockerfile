FROM node:20-alpine AS base
# Habilita pnpm con corepack (viene incluido en Node 20)
RUN corepack enable && corepack prepare pnpm@9.1.0 --activate

FROM base AS deps
WORKDIR /app
# Copiar solo los archivos de dependencias para aprovechar cache de capas
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm-backend,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

FROM deps AS development
WORKDIR /app
COPY . .
ENV NODE_ENV=development
EXPOSE 3001
CMD ["pnpm", "start:dev"]

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts
COPY package.json pnpm-lock.yaml ./
EXPOSE 3001
# Aplica migraciones pendientes y arranca el servidor
CMD ["sh", "-c", "pnpm db:migrate && node dist/src/main.js"]
