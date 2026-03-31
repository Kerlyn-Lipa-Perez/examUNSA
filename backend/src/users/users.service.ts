import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, and } from 'drizzle-orm';
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

  async create(data: { email: string; passwordHash: string; nombre: string }) {
    const [nuevoUsuario] = await this.db
      .insert(schema.users)
      .values(data)
      .returning();
    return nuevoUsuario;
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
    // Get basic user info
    const user = await this.findById(userId);
    if (!user) return null;

    // Get simulacro results
    const simulacros = await this.db.query.simulacroResults.findMany({
      where: eq(schema.simulacroResults.userId, userId),
      orderBy: (simulacroResults, { desc }) => [desc(simulacroResults.createdAt)],
      limit: 10,
    });

    // Get flashcard stats
    const flashcardsCount = await this.db.query.flashcards.findMany({
      where: eq(schema.flashcards.userId, userId),
    });

    const progressCount = await this.db.query.flashcardProgress.findMany({
      where: eq(schema.flashcardProgress.userId, userId),
    });

    // Calculate stats
    const totalSimulacros = simulacros.length;
    const simulacrosHoy = user.simulacrosHoy;
    const mejorPuntaje = simulacros.length > 0 
      ? Math.max(...simulacros.map(s => s.puntaje)) 
      : 0;
    const promedioPuntaje = simulacros.length > 0
      ? Math.round(simulacros.reduce((acc, s) => acc + s.puntaje, 0) / simulacros.length)
      : 0;

    // Progress by materia
    const progresoPorMateria: Record<string, { promedio: number; simulacros: number }> = {};

    for (const materia of MATERIAS_VALIDAS) {
      const materiaResults = simulacros.filter(s => s.materia.toLowerCase() === materia);
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
      simulacrosHoy,
      mejorPuntaje,
      promedioPuntaje,
      diasRacha: user.streakDias,
      
      // Flashcard stats
      flashcardsTotales: flashcardsCount.length,
      flashcardsCreadas: flashcardsCount.length,
      flashcardsEnProgreso: progressCount.length,
      
      // Progress by materia
      progresoPorMateria,
      
      // Recent simulacros
      ultimosSimulacros: simulacros.slice(0, 5).map(s => ({
        id: s.id,
        materia: s.materia,
        puntaje: s.puntaje,
        totalPreguntas: s.totalPreguntas,
        createdAt: s.createdAt,
      })),
    };
  }
}