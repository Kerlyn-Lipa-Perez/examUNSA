import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { DATABASE_CONNECTION } from '../database/database.provider';
import { EmailService } from '../email/email.service';

describe('UsersService', () => {
  let service: UsersService;
  let dbMock: any;
  let emailService: jest.Mocked<EmailService>;

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    nombre: 'Juan',
    passwordHash: 'hashed',
    plan: 'free',
    simulacrosHoy: 2,
    streakDias: 5,
    ultimoAcceso: null,
    passwordResetToken: null,
    passwordResetExpires: null,
    preferencias: null,
    createdAt: new Date(),
  };

  beforeEach(async () => {
    dbMock = {
      query: {
        users: { findFirst: jest.fn() },
        flashcards: { findMany: jest.fn().mockResolvedValue([]) },
        flashcardProgress: { findMany: jest.fn().mockResolvedValue([]) },
        simulacroResults: {
          findMany: jest.fn().mockResolvedValue([]),
        },
      },
      insert: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValue([mockUser]),
      update: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: DATABASE_CONNECTION, useValue: dbMock },
        {
          provide: EmailService,
          useValue: {
            sendAccountDeletionEmail: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get(UsersService);
    emailService = module.get(EmailService);
  });

  // ======= FINDERS =======
  describe('findByEmail', () => {
    it('debe retornar el usuario si existe', async () => {
      dbMock.query.users.findFirst.mockResolvedValue(mockUser);

      const result = await service.findByEmail('test@example.com');

      expect(result).toEqual(mockUser);
    });

    it('debe retornar undefined si no existe', async () => {
      dbMock.query.users.findFirst.mockResolvedValue(undefined);

      const result = await service.findByEmail('noexiste@example.com');

      expect(result).toBeUndefined();
    });
  });

  describe('findById', () => {
    it('debe retornar el usuario por ID', async () => {
      dbMock.query.users.findFirst.mockResolvedValue(mockUser);

      const result = await service.findById('user-123');

      expect(result).toEqual(mockUser);
    });
  });

  // ======= DELETE ACCOUNT =======
  describe('deleteAccount', () => {
    it('debe eliminar la cuenta y enviar email de confirmación', async () => {
      dbMock.query.users.findFirst.mockResolvedValue(mockUser);

      const result = await service.deleteAccount('user-123');

      // Elimina datos relacionados
      expect(dbMock.delete).toHaveBeenCalledTimes(4); // simulacros, progress, flashcards, user
      expect(result).toEqual({ message: 'Cuenta eliminada correctamente' });

      // Espera a que el fire-and-forget se ejecute
      await new Promise(process.nextTick);
      expect(emailService.sendAccountDeletionEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
    });

    it('debe lanzar NotFoundException si el usuario no existe', async () => {
      dbMock.query.users.findFirst.mockResolvedValue(null);

      await expect(service.deleteAccount('no-existe')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('debe eliminar la cuenta incluso si falla el email', async () => {
      dbMock.query.users.findFirst.mockResolvedValue(mockUser);
      emailService.sendAccountDeletionEmail.mockRejectedValue(
        new Error('Email service down'),
      );

      // No debe lanzar error — el email es fire-and-forget
      const result = await service.deleteAccount('user-123');

      expect(result).toEqual({ message: 'Cuenta eliminada correctamente' });
      expect(dbMock.delete).toHaveBeenCalled();
    });
  });

  // ======= RESET SIMULACROS =======
  describe('resetSimulacrosHoy', () => {
    it('debe resetear el contador de simulacros para todos los usuarios', async () => {
      await service.resetSimulacrosHoy();

      expect(dbMock.update).toHaveBeenCalled();
      expect(dbMock.set).toHaveBeenCalledWith({ simulacrosHoy: 0 });
    });
  });

  // ======= GET USER STATS =======
  describe('getUserStats', () => {
    it('debe retornar estadísticas del usuario', async () => {
      dbMock.query.users.findFirst.mockResolvedValue(mockUser);
      dbMock.query.simulacroResults.findMany.mockResolvedValue([
        { materia: 'matematica', puntaje: 15, totalPreguntas: 20, id: '1', createdAt: new Date() },
        { materia: 'matematica', puntaje: 18, totalPreguntas: 20, id: '2', createdAt: new Date() },
      ]);

      const result = await service.getUserStats('user-123');

      expect(result.simulacrosTotales).toBe(2);
      expect(result.simulacrosHoy).toBe(2);
      expect(result.mejorPuntaje).toBe(18);
      expect(result.promedioPuntaje).toBe(17);
      expect(result.diasRacha).toBe(5);
      expect(result).toHaveProperty('progresoPorMateria');
      expect(result).toHaveProperty('ultimosSimulacros');
    });

    it('debe retornar null si el usuario no existe', async () => {
      dbMock.query.users.findFirst.mockResolvedValue(null);

      const result = await service.getUserStats('no-existe');

      expect(result).toBeNull();
    });
  });

  // ======= UPDATE PROFILE =======
  describe('updateProfile', () => {
    it('debe actualizar nombre y email', async () => {
      const updated = { ...mockUser, nombre: 'Nuevo Nombre' };
      dbMock.returning.mockResolvedValue([updated]);

      const result = await service.updateProfile('user-123', {
        nombre: 'Nuevo Nombre',
      });

      expect(result.nombre).toBe('Nuevo Nombre');
    });
  });
});
