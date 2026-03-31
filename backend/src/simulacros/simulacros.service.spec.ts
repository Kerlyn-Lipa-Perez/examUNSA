import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import { SimulacrosService } from './simulacros.service';
import { DATABASE_CONNECTION } from '../database/database.provider';
import { AiService } from '../ai/ai.service';

describe('SimulacrosService', () => {
  let service: SimulacrosService;
  let dbMock: any;
  let aiService: jest.Mocked<AiService>;

  const mockUserFree = {
    id: 'user-123',
    email: 'free@example.com',
    plan: 'free',
    simulacrosHoy: 0,
  };

  const mockUserFreeLimit = {
    id: 'user-456',
    email: 'limit@example.com',
    plan: 'free',
    simulacrosHoy: 3,
  };

  const mockUserPro = {
    id: 'user-789',
    email: 'pro@example.com',
    plan: 'pro',
    simulacrosHoy: 10,
  };

  beforeEach(async () => {
    // Mock de Drizzle DB
    dbMock = {
      query: {
        users: {
          findFirst: jest.fn(),
        },
        simulacroResults: {
          findFirst: jest.fn(),
        },
      },
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([]),
      insert: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValue([]),
      update: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
    };

    aiService = {
      generarPreguntas: jest.fn().mockResolvedValue([
        { pregunta: '¿Pregunta 1?', opciones: ['A', 'B', 'C', 'D'], respuesta: 'A' },
        { pregunta: '¿Pregunta 2?', opciones: ['A', 'B', 'C', 'D'], respuesta: 'B' },
      ]),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SimulacrosService,
        { provide: DATABASE_CONNECTION, useValue: dbMock },
        { provide: AiService, useValue: aiService },
      ],
    }).compile();

    service = module.get(SimulacrosService);
  });

  // ======= GENERAR =======
  describe('generar', () => {
    it('debe generar un simulacro para usuario free (bajo el límite)', async () => {
      dbMock.query.users.findFirst.mockResolvedValue(mockUserFree);

      const result = await service.generar('user-123', {
        materia: 'ciencia-tecnologia',
      });

      expect(result.materia).toBe('ciencia-tecnologia');
      expect(result.preguntas).toHaveLength(2);
      expect(result.tiempoMinutos).toBe(30);
      // Verifica que se incrementa el contador
      expect(dbMock.update).toHaveBeenCalled();
      expect(dbMock.set).toHaveBeenCalled();
    });

    it('debe RECHAZAR usuario free que alcanzó el límite de 3 simulacros/día', async () => {
      dbMock.query.users.findFirst.mockResolvedValue(mockUserFreeLimit);

      await expect(
        service.generar('user-456', { materia: 'matematica' }),
      ).rejects.toThrow(ForbiddenException);

      // NO debe llamar a la AI ni incrementar contador
      expect(aiService.generarPreguntas).not.toHaveBeenCalled();
    });

    it('debe permitir usuario Pro generar sin límite', async () => {
      dbMock.query.users.findFirst.mockResolvedValue(mockUserPro);

      const result = await service.generar('user-789', {
        materia: 'comunicacion',
      });

      expect(result.materia).toBe('comunicacion');
      expect(aiService.generarPreguntas).toHaveBeenCalled();
    });

    it('debe lanzar ForbiddenException si el usuario no existe', async () => {
      dbMock.query.users.findFirst.mockResolvedValue(null);

      await expect(
        service.generar('no-existe', { materia: 'aptitud' }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  // ======= GUARDAR RESULTADO =======
  describe('guardarResultado', () => {
    it('debe guardar un resultado de simulacro', async () => {
      const mockResultado = {
        id: 'result-123',
        puntaje: 15,
      };
      dbMock.returning.mockResolvedValue([mockResultado]);

      const result = await service.guardarResultado('user-123', {
        examId: 'exam-1',
        materia: 'ciencia-tecnologia',
        puntaje: 15,
        tiempoSegundos: 1200,
        respuestas: [{ preguntaId: '1', respuesta: 'A', correcta: true }],
      });

      expect(result).toEqual({ guardado: true, puntaje: 15 });
      expect(dbMock.insert).toHaveBeenCalled();
    });
  });

  // ======= HISTORIAL =======
  describe('historial', () => {
    it('debe retornar historial limitado para usuario free', async () => {
      dbMock.query.users.findFirst.mockResolvedValue(mockUserFree);
      dbMock.limit.mockResolvedValue([
        { id: 'r1', materia: 'matematica', puntaje: 10 },
      ]);

      const result = await service.historial('user-123');

      // Free solo ve 1 resultado
      expect(dbMock.limit).toHaveBeenCalledWith(1);
    });

    it('debe retornar hasta 20 para usuario Pro', async () => {
      dbMock.query.users.findFirst.mockResolvedValue(mockUserPro);
      dbMock.limit.mockResolvedValue([]);

      await service.historial('user-789');

      expect(dbMock.limit).toHaveBeenCalledWith(20);
    });
  });
});
