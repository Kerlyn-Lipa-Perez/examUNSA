import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, and, sql, count } from 'drizzle-orm';
import { DATABASE_CONNECTION } from '../database/database.provider';
import * as schema from '../database/schema';
import { UserPreferences } from '../database/schema';
import { EmailService } from '../email/email.service';
import { MATERIAS_VALIDAS } from '../shared/constants/materias';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @Inject(DATABASE_CONNECTION)
    private db: NodePgDatabase<typeof schema>,
    private readonly emailService: EmailService,
  ) {}

  async findByEmail(email: string) {
    return this.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });
  }

  async findById(id: string) {
    return this.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, id),
    });
  }

  async create(data: { email: string; passwordHash?: string; nombre: string; googleId?: string; avatarUrl?: string }) {
    const [nuevoUsuario] = await this.db
      .insert(schema.users)
      .values(data)
      .returning();
    return nuevoUsuario;
  }

  async findByGoogleId(googleId: string) {
    return this.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.googleId, googleId),
    });
  }

  async updateAvatarUrl(userId: string, avatarUrl: string | null) {
    const [updated] = await this.db
      .update(schema.users)
      .set({ avatarUrl })
      .where(eq(schema.users.id, userId))
      .returning();
    return updated;
  }

  async linkGoogleAccount(userId: string, googleId: string, avatarUrl?: string) {
    const updateData: { googleId: string; avatarUrl?: string } = { googleId };
    // Solo actualizar avatar si el usuario no tiene uno propio
    const user = await this.findById(userId);
    if (user && !user.avatarUrl && avatarUrl) {
      updateData.avatarUrl = avatarUrl;
    }

    const [updated] = await this.db
      .update(schema.users)
      .set(updateData)
      .where(eq(schema.users.id, userId))
      .returning();
    return updated;
  }

  async updatePlan(userId: string, plan: 'free' | 'pro') {
    const [updatedUser] = await this.db
      .update(schema.users)
      .set({ plan })
      .where(eq(schema.users.id, userId))
      .returning();
    return updatedUser;
  }

  async resetSimulacrosHoy() {
    return this.db.update(schema.users).set({ simulacrosHoy: 0 });
  }

  // ======= PASSWORD RESET =======
  async findByResetToken(token: string) {
    return this.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.passwordResetToken, token),
    });
  }

  async setPasswordResetToken(userId: string, token: string, expires: Date) {
    await this.db
      .update(schema.users)
      .set({
        passwordResetToken: token,
        passwordResetExpires: expires,
      })
      .where(eq(schema.users.id, userId));
  }

  async resetPassword(userId: string, passwordHash: string) {
    await this.db
      .update(schema.users)
      .set({
        passwordHash,
        passwordResetToken: null,
        passwordResetExpires: null,
      })
      .where(eq(schema.users.id, userId));
  }

  // ======= PREFERENCIAS =======
  async getUserPreferences(userId: string) {
    const user = await this.findById(userId);
    if (!user) return null;

    return user.preferencias || {
      metaDiariaHoras: 2,
      flashcardsNuevasDia: 20,
      recordatorioActivo: true,
      horaRecordatorio: '20:00',
      notificacionesEmail: true,
      sonidosTimer: true,
      vibracion: true,
    };
  }

  async updateUserPreferences(userId: string, prefs: Partial<UserPreferences>) {
    const current = await this.getUserPreferences(userId);
    const updated = { ...current, ...prefs };

    await this.db
      .update(schema.users)
      .set({ preferencias: updated })
      .where(eq(schema.users.id, userId));

    return updated;
  }

  // ======= PERFIL =======
  async updateProfile(userId: string, data: { nombre?: string; email?: string }) {
    const [updated] = await this.db
      .update(schema.users)
      .set(data)
      .where(eq(schema.users.id, userId))
      .returning();

    return updated;
  }

  // ======= ELIMINAR CUENTA =======
  async deleteAccount(userId: string) {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Eliminar datos relacionados primero (por si hay cascade issues)
    await this.db.delete(schema.simulacroResults).where(eq(schema.simulacroResults.userId, userId));
    await this.db.delete(schema.flashcardProgress).where(eq(schema.flashcardProgress.userId, userId));
    await this.db.delete(schema.flashcards).where(eq(schema.flashcards.userId, userId));

    // Guardar email antes de eliminar
    const userEmail = user.email;

    // Eliminar usuario
    await this.db.delete(schema.users).where(eq(schema.users.id, userId));

    // Enviar email de confirmación (fire-and-forget, no bloquear respuesta)
    this.emailService.sendAccountDeletionEmail(userEmail).catch((err) =>
      this.logger.error(`Error al enviar email de eliminación a ${userEmail}:`, err),
    );

    return { message: 'Cuenta eliminada correctamente' };
  }

  async getUserProfile(userId: string) {
    const user = await this.findById(userId);
    if (!user) return null;

    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getUserStats(userId: string) {
    // Ejecutar todas las queries en paralelo para mejor rendimiento
    const [user, simulacrosRecientes, statsFlashcards, statsSimulacros] = await Promise.all([
      this.findById(userId),
      // Últimos 5 simulacros
      this.db
        .select({
          id: schema.simulacroResults.id,
          materia: schema.simulacroResults.materia,
          puntaje: schema.simulacroResults.puntaje,
          totalPreguntas: schema.simulacroResults.totalPreguntas,
          createdAt: schema.simulacroResults.createdAt,
        })
        .from(schema.simulacroResults)
        .where(eq(schema.simulacroResults.userId, userId))
        .orderBy(sql`${schema.simulacroResults.createdAt} DESC`)
        .limit(5),
      // Contar flashcards del usuario (solo las creadas por él)
      this.db
        .select({ total: count() })
        .from(schema.flashcards)
        .where(eq(schema.flashcards.userId, userId)),
      // Contar progress (cards en progreso)
      this.db
        .select({ total: count() })
        .from(schema.flashcardProgress)
        .where(eq(schema.flashcardProgress.userId, userId)),
    ]);

    if (!user) return null;

    // Calcular stats de simulacros (total y mejor puntuación)
    const [totalSimulacrosResult] = await this.db
      .select({ total: sql<number>`COALESCE(MAX(${schema.simulacroResults.puntaje}), 0)::int`, count: sql<number>`COUNT(*)::int` })
      .from(schema.simulacroResults)
      .where(eq(schema.simulacroResults.userId, userId));

    const mejorPuntaje = Number(totalSimulacrosResult?.total || 0);
    const totalSimulacros = Number(totalSimulacrosResult?.count || 0);
    const promedioPuntaje = totalSimulacros > 0 
      ? Math.round(simulacrosRecientes.reduce((acc, s) => acc + s.puntaje, 0) / simulacrosRecientes.length)
      : 0;

    // Progress by materia (desde los simulacros recientes)
    const progresoPorMateria: Record<string, { promedio: number; simulacros: number }> = {};
    for (const materia of MATERIAS_VALIDAS) {
      const materiaResults = simulacrosRecientes.filter(s => s.materia.toLowerCase() === materia);
      if (materiaResults.length > 0) {
        const promedio = Math.round(materiaResults.reduce((acc, s) => acc + s.puntaje, 0) / materiaResults.length);
        progresoPorMateria[materia] = {
          promedio,
          simulacros: materiaResults.length,
        };
      }
    }

    return {
      // User stats
      simulacrosTotales: totalSimulacros,
      simulacrosHoy: user.simulacrosHoy,
      mejorPuntaje,
      promedioPuntaje,
      diasRacha: user.streakDias,
      
      // Flashcard stats
      flashcardsTotales: Number(statsFlashcards.total || 0),
      flashcardsCreadas: Number(statsFlashcards.total || 0),
      flashcardsEnProgreso: Number(statsSimulacros.total || 0),
      
      // Progress by materia
      progresoPorMateria,
      
      // Recent simulacros
      ultimosSimulacros: simulacrosRecientes.map(s => ({
        id: s.id,
        materia: s.materia,
        puntaje: s.puntaje,
        totalPreguntas: s.totalPreguntas,
        createdAt: s.createdAt,
      })),
    };
  }
}