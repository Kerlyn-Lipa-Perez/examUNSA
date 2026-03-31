import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { FlashcardsService } from './flashcards.service';
import { DATABASE_CONNECTION } from '../database/database.provider';
import { AiService } from '../ai/ai.service';
import { Sm2Service } from './sm2.service';

describe('FlashcardsService', () => {
  let service: FlashcardsService;
  let dbMock: any;
  let aiService: jest.Mocked<AiService>;
  let sm2Service: Sm2Service;

  const mockUserFree = {
    id: 'user-123',
    plan: 'free',
  };

  const mockUserPro = {
    id: 'user-456',
    plan: 'pro',
  };

  beforeEach(async () => {
    dbMock = {
      query: {
        users: { findFirst: jest.fn() },
        flashcards: {
          findMany: jest.fn().mockResolvedValue([]),
          findFirst: jest.fn(),
        },
        flashcardProgress: { findFirst: jest.fn() },
      },
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      innerJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([]),
      insert: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValue([]),
      onConflictDoUpdate: jest.fn().mockResolvedValue(undefined),
    };

    aiService = {
      generarFlashcards: jest.fn().mockResolvedValue([
        { pregunta: '¿Qué es la mitosis?', respuesta: 'División celular' },
        { pregunta: '¿Qué es la meiosis?', respuesta: 'División reductiva' },
      ]),
    } as any;

    sm2Service = new Sm2Service();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FlashcardsService,
        { provide: DATABASE_CONNECTION, useValue: dbMock },
        { provide: AiService, useValue: aiService },
        Sm2Service,
      ],
    }).compile();

    service = module.get(FlashcardsService);
  });

  // ======= GENERAR CON IA =======
  describe('generarConIA', () => {
    it('debe generar flashcards para usuario Pro', async () => {
      dbMock.query.users.findFirst.mockResolvedValue(mockUserPro);
      const mockCards = [
        { id: 'c1', pregunta: 'P1', respuesta: 'R1', materia: 'ciencia-tecnologia' },
      ];
      dbMock.returning.mockResolvedValue(mockCards);

      const result = await service.generarConIA('user-456', {
        tema: 'Biología celular',
        materia: 'ciencia-tecnologia',
      });

      expect(aiService.generarFlashcards).toHaveBeenCalledWith('Biología celular', 10);
      expect(result.cards).toEqual(mockCards);
    });

    it('debe RECHAZAR usuario free que intenta generar con IA', async () => {
      dbMock.query.users.findFirst.mockResolvedValue(mockUserFree);

      await expect(
        service.generarConIA('user-123', {
          tema: 'Álgebra',
          materia: 'matematica',
        }),
      ).rejects.toThrow(ForbiddenException);

      expect(aiService.generarFlashcards).not.toHaveBeenCalled();
    });

    it('debe lanzar ForbiddenException si el usuario no existe', async () => {
      dbMock.query.users.findFirst.mockResolvedValue(null);

      await expect(
        service.generarConIA('no-existe', {
          tema: 'Test',
          materia: 'aptitud',
        }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  // ======= REVISAR (SM-2) =======
  describe('revisar', () => {
    it('debe crear progreso nuevo si no existe (primera revisión)', async () => {
      dbMock.query.flashcards.findFirst.mockResolvedValue({
        id: 'card-1',
        pregunta: '¿Pregunta?',
        respuesta: 'Respuesta',
      });
      dbMock.query.flashcardProgress.findFirst.mockResolvedValue(null);

      const result = await service.revisar('user-123', 'card-1', {
        calificacion: 4,
      });

      expect(result).toHaveProperty('proximaRevision');
      expect(result).toHaveProperty('intervaloDias');
      expect(dbMock.insert).toHaveBeenCalled();
      expect(dbMock.values).toHaveBeenCalled();
    });

    it('debe actualizar progreso existente con SM-2', async () => {
      dbMock.query.flashcards.findFirst.mockResolvedValue({
        id: 'card-1',
        pregunta: '¿Pregunta?',
        respuesta: 'Respuesta',
      });
      dbMock.query.flashcardProgress.findFirst.mockResolvedValue({
        intervaloDias: 6,
        facilidad: 2.5,
        repeticiones: 2,
      });

      const result = await service.revisar('user-123', 'card-1', {
        calificacion: 5,
      });

      expect(result.intervaloDias).toBeGreaterThan(0);
      expect(dbMock.onConflictDoUpdate).toHaveBeenCalled();
    });

    it('debe lanzar NotFoundException si la flashcard no existe', async () => {
      dbMock.query.flashcards.findFirst.mockResolvedValue(null);

      await expect(
        service.revisar('user-123', 'no-existe', { calificacion: 3 }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ======= SM-2 SERVICE (prueba directa) =======
  describe('Sm2Service (algoritmo)', () => {
    it('debe reiniciar secuencia con calificación < 3', () => {
      const estado = sm2Service.calcularSiguiente(
        { intervaloDias: 15, facilidad: 2.5, repeticiones: 5 },
        1, // Muy difícil
      );

      expect(estado.repeticiones).toBe(0);
      expect(estado.intervaloDias).toBe(1);
    });

    it('debe avanzar intervalo con calificación >= 3', () => {
      const estado = sm2Service.calcularSiguiente(
        { intervaloDias: 1, facilidad: 2.5, repeticiones: 0 },
        4, // Fácil
      );

      expect(estado.repeticiones).toBe(1);
      expect(estado.intervaloDias).toBe(1);
    });

    it('debe usar intervalo de 6 días en la segunda repetición correcta', () => {
      const estado = sm2Service.calcularSiguiente(
        { intervaloDias: 1, facilidad: 2.5, repeticiones: 1 },
        4,
      );

      expect(estado.repeticiones).toBe(2);
      expect(estado.intervaloDias).toBe(6);
    });

    it('debe mantener facilidad mínima de 1.3', () => {
      const estado = sm2Service.calcularSiguiente(
        { intervaloDias: 1, facilidad: 1.3, repeticiones: 0 },
        0, // No sabía nada
      );

      expect(estado.facilidad).toBeGreaterThanOrEqual(1.3);
    });

    it('debe calcular próxima fecha correctamente', () => {
      const fecha = sm2Service.proximaFecha(5);
      const hoy = new Date();
      hoy.setDate(hoy.getDate() + 5);

      // Comparar solo la fecha (sin horas)
      expect(fecha.toDateString()).toBe(hoy.toDateString());
    });
  });
});
