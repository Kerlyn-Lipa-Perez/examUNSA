// backend/src/database/schema.ts
import {
  pgTable, uuid, varchar, integer, real,
  boolean, text, jsonb, date, timestamp,
  uniqueIndex, index,
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

// ─── USERS ───────────────────────────────────────────────────────────────────
export const users = pgTable('users', {
  id:                   uuid('id').primaryKey().defaultRandom(),
  email:                varchar('email', { length: 255 }).unique().notNull(),
  passwordHash:         varchar('password_hash', { length: 255 }), // null para usuarios de Google
  nombre:               varchar('nombre', { length: 100 }).notNull(),
  plan:                 varchar('plan', { length: 10 }).default('free').notNull(), // 'free' | 'pro'
  simulacrosHoy:        integer('simulacros_hoy').default(0).notNull(),
  streakDias:           integer('streak_dias').default(0).notNull(),
  ultimoAcceso:         date('ultimo_acceso'),
  createdAt:            timestamp('created_at').defaultNow().notNull(),

  // Auth social
  googleId:             varchar('google_id', { length: 255 }).unique(),

  // Foto de perfil
  avatarUrl:            varchar('avatar_url', { length: 500 }),

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
}, (table) => ({
  // Historial: WHERE user_id = ? ORDER BY created_at DESC
  userIdCreatedIdx: index('idx_simulacro_user_created').on(table.userId, table.createdAt),
  // Historial por examen: WHERE user_id = ? AND exam_id = ?
  userIdExamIdx: index('idx_simulacro_user_exam').on(table.userId, table.examId),
}));

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
}, (table) => ({
  // Filtrar flashcards del usuario: WHERE user_id = ?
  userIdIdx: index('idx_flashcard_user').on(table.userId),
}));

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
    // Cards pendientes: WHERE user_id = ? AND proxima_revision <= ?
    userIdRevisionIdx: index('idx_progress_user_revision').on(table.userId, table.proximaRevision),
  }),
);

// ─── PAGOS ───────────────────────────────────────────────────────────────────
export const pagos = pgTable('pagos', {
  id:         uuid('id').primaryKey().defaultRandom(),
  userId:     uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  monto:      integer('monto').notNull(),
  moneda:     varchar('moneda', { length: 3 }).default('PEN').notNull(),
  estado:     varchar('estado', { length: 20 }).default('completado').notNull(),
  planId:     varchar('plan_id', { length: 20 }).notNull(),
  referencia: varchar('referencia', { length: 100 }),
  createdAt:  timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdCreatedIdx: index('idx_pago_user_created').on(table.userId, table.createdAt),
  referenciaIdx: index('idx_pago_referencia').on(table.referencia),
}));

// ─── RELACIONES (para joins tipados con Drizzle) ──────────────────────────────
export const usersRelations = relations(users, ({ many }) => ({
  simulacroResults: many(simulacroResults),
  flashcards:       many(flashcards),
  flashcardProgress: many(flashcardProgress),
  pagos:            many(pagos),
  ranking:          many(userRanking),
  rankingLogs:      many(rankingLog),
}));

export const simulacroResultsRelations = relations(simulacroResults, ({ one }) => ({
  user: one(users, { fields: [simulacroResults.userId], references: [users.id] }),
}));

export const pagosRelations = relations(pagos, ({ one }) => ({
  user: one(users, { fields: [pagos.userId], references: [users.id] }),
}));

export const flashcardsRelations = relations(flashcards, ({ one, many }) => ({
  user:     one(users, { fields: [flashcards.userId], references: [users.id] }),
  progress: many(flashcardProgress),
}));

export const flashcardProgressRelations = relations(flashcardProgress, ({ one }) => ({
  user:      one(users, { fields: [flashcardProgress.userId], references: [users.id] }),
  flashcard: one(flashcards, { fields: [flashcardProgress.flashcardId], references: [flashcards.id] }),
}));

// ─── RANKING ──────────────────────────────────────────────────────────────────
export const userRanking = pgTable('user_ranking', {
  id:                     uuid('id').primaryKey().defaultRandom(),
  userId:                 uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  totalRp:                integer('total_rp').default(0).notNull(),
  simulacrosCompletados:  integer('simulacros_completados').default(0).notNull(),
  rachaActual:            integer('racha_actual').default(0).notNull(),
  rachaMaxima:            integer('racha_maxima').default(0).notNull(),
  respuestasCorrectas:    integer('respuestas_correctas').default(0).notNull(),
  respuestasTotales:      integer('respuestas_totales').default(0).notNull(),
  flashcardsRevisadas:    integer('flashcards_revisadas').default(0).notNull(),
  ultimoSimulacroAt:      timestamp('ultimo_simulacro_at'),
  ultimaActividadAt:      timestamp('ultima_actividad_at').defaultNow(),
  createdAt:              timestamp('created_at').defaultNow().notNull(),
  updatedAt:              timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdUnique: uniqueIndex('uq_user_ranking').on(table.userId),
  totalRpIdx:   index('idx_ranking_total_rp').on(table.totalRp),
}));

export const rankingLog = pgTable('ranking_log', {
  id:         uuid('id').primaryKey().defaultRandom(),
  userId:     uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  accion:     varchar('accion', { length: 50 }).notNull(),
  rpGanados:  integer('rp_ganados').notNull(),
  metadata:   jsonb('metadata'),
  createdAt:  timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdCreatedIdx: index('idx_ranking_log_user_created').on(table.userId, table.createdAt),
  // Para rankings semanales/mensuales: WHERE created_at >= ?
  createdAtIdx:     index('idx_ranking_log_created').on(table.createdAt),
}));

// ─── RELACIONES RANKING ──────────────────────────────────────────────────────
export const userRankingRelations = relations(userRanking, ({ one }) => ({
  user: one(users, { fields: [userRanking.userId], references: [users.id] }),
}));

export const rankingLogRelations = relations(rankingLog, ({ one }) => ({
  user: one(users, { fields: [rankingLog.userId], references: [users.id] }),
}));

// Agregar a usersRelations existente
// (se actualiza más abajo con las nuevas relaciones)

// ─── AI ANALYSIS CACHE ─────────────────────────────────────────────────────
export const aiAnalysisCache = pgTable(
  'ai_analysis_cache',
  {
    id:                      uuid('id').primaryKey().defaultRandom(),
    userId:                  uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    tipo:                    varchar('tipo', { length: 30 }).notNull(), // 'errores_patron'
    resultado:               jsonb('resultado').notNull(),
    simulacrosCountAlMomento: integer('simulacros_count_al_momento').notNull(),
    expiresAt:               timestamp('expires_at').notNull(),
    createdAt:               timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    userTipoUnique: uniqueIndex('uq_ai_cache_user_tipo').on(table.userId, table.tipo),
  }),
);

export const aiAnalysisCacheRelations = relations(aiAnalysisCache, ({ one }) => ({
  user: one(users, { fields: [aiAnalysisCache.userId], references: [users.id] }),
}));

// ─── TIPOS INFERIDOS (usar en los servicios en lugar de interfaces manuales) ──
export type User              = typeof users.$inferSelect;
export type NewUser           = typeof users.$inferInsert;
export type SimulacroResult   = typeof simulacroResults.$inferSelect;
export type NewSimulacroResult = typeof simulacroResults.$inferInsert;
export type Flashcard         = typeof flashcards.$inferSelect;
export type NewFlashcard      = typeof flashcards.$inferInsert;
export type FlashcardProgress = typeof flashcardProgress.$inferSelect;
export type Pago              = typeof pagos.$inferSelect;
export type NewPago           = typeof pagos.$inferInsert;
export type UserRanking       = typeof userRanking.$inferSelect;
export type NewUserRanking    = typeof userRanking.$inferInsert;
export type RankingLog        = typeof rankingLog.$inferSelect;
export type NewRankingLog     = typeof rankingLog.$inferInsert;
export type AiAnalysisCache   = typeof aiAnalysisCache.$inferSelect;
export type NewAiAnalysisCache = typeof aiAnalysisCache.$inferInsert;
