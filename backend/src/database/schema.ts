// backend/src/database/schema.ts
import {
  pgTable, uuid, varchar, integer, real,
  boolean, text, jsonb, date, timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

// ─── USERS ───────────────────────────────────────────────────────────────────
export const users = pgTable('users', {
  id:                   uuid('id').primaryKey().defaultRandom(),
  email:                varchar('email', { length: 255 }).unique().notNull(),
  passwordHash:         varchar('password_hash', { length: 255 }).notNull(),
  nombre:               varchar('nombre', { length: 100 }).notNull(),
  plan:                 varchar('plan', { length: 10 }).default('free').notNull(), // 'free' | 'pro'
  simulacrosHoy:        integer('simulacros_hoy').default(0).notNull(),
  streakDias:           integer('streak_dias').default(0).notNull(),
  ultimoAcceso:         date('ultimo_acceso'),
  createdAt:            timestamp('created_at').defaultNow().notNull(),
  
  // Password reset
  passwordResetToken:   varchar('password_reset_token', { length: 255 }),
  passwordResetExpires: timestamp('password_reset_expires'),
  
  // Preferencias del usuario (JSONB)
  preferencias:         jsonb('preferencias').$type<UserPreferences>(),
});

export interface UserPreferences {
  metaDiariaHoras: number;
  flashcardsNuevasDia: number;
  recordatorioActivo: boolean;
  horaRecordatorio: string;
  notificacionesEmail: boolean;
  sonidosTimer: boolean;
  vibracion: boolean;
}

// ─── SIMULACRO RESULTS ────────────────────────────────────────────────────────
export const simulacroResults = pgTable('simulacro_results', {
  id:             uuid('id').primaryKey().defaultRandom(),
  userId:         uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  examId:         varchar('exam_id', { length: 100 }),
  materia:        varchar('materia', { length: 50 }).notNull(),
  puntaje:        integer('puntaje').notNull(),
  totalPreguntas: integer('total_preguntas').notNull(),
  tiempoSegundos: integer('tiempo_segundos'),
  // [{preguntaIdx, elegida, correcta}]
  respuestas:     jsonb('respuestas').notNull(),
  createdAt:      timestamp('created_at').defaultNow().notNull(),
});

// ─── FLASHCARDS ───────────────────────────────────────────────────────────────
export const flashcards = pgTable('flashcards', {
  id:        uuid('id').primaryKey().defaultRandom(),
  // null = tarjeta del sistema (accesible a todos)
  userId:    uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  materia:   varchar('materia', { length: 50 }).notNull(),
  pregunta:  text('pregunta').notNull(),
  respuesta: text('respuesta').notNull(),
  esPublica: boolean('es_publica').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ─── FLASHCARD PROGRESS (SM-2) ────────────────────────────────────────────────
export const flashcardProgress = pgTable(
  'flashcard_progress',
  {
    id:              uuid('id').primaryKey().defaultRandom(),
    userId:          uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    flashcardId:     uuid('flashcard_id').notNull().references(() => flashcards.id, { onDelete: 'cascade' }),
    intervaloDias:   integer('intervalo_dias').default(1).notNull(),
    facilidad:       real('facilidad').default(2.5).notNull(),
    repeticiones:    integer('repeticiones').default(0).notNull(),
    proximaRevision: date('proxima_revision').default(sql`CURRENT_DATE`).notNull(),
  },
  (table) => ({
    // Un alumno tiene un solo registro de progreso por flashcard
    uniqUserCard: uniqueIndex('uq_user_card').on(table.userId, table.flashcardId),
  }),
);

// ─── RELACIONES (para joins tipados con Drizzle) ──────────────────────────────
export const usersRelations = relations(users, ({ many }) => ({
  simulacroResults: many(simulacroResults),
  flashcards:       many(flashcards),
  flashcardProgress: many(flashcardProgress),
}));

export const simulacroResultsRelations = relations(simulacroResults, ({ one }) => ({
  user: one(users, { fields: [simulacroResults.userId], references: [users.id] }),
}));

export const flashcardsRelations = relations(flashcards, ({ one, many }) => ({
  user:     one(users, { fields: [flashcards.userId], references: [users.id] }),
  progress: many(flashcardProgress),
}));

export const flashcardProgressRelations = relations(flashcardProgress, ({ one }) => ({
  user:      one(users, { fields: [flashcardProgress.userId], references: [users.id] }),
  flashcard: one(flashcards, { fields: [flashcardProgress.flashcardId], references: [flashcards.id] }),
}));

// ─── TIPOS INFERIDOS (usar en los servicios en lugar de interfaces manuales) ──
export type User              = typeof users.$inferSelect;
export type NewUser           = typeof users.$inferInsert;
export type SimulacroResult   = typeof simulacroResults.$inferSelect;
export type NewSimulacroResult = typeof simulacroResults.$inferInsert;
export type Flashcard         = typeof flashcards.$inferSelect;
export type NewFlashcard      = typeof flashcards.$inferInsert;
export type FlashcardProgress = typeof flashcardProgress.$inferSelect;
