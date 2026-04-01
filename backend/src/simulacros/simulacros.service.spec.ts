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
    it('debe retornar historial paginado con items, total y metadata', async () => {
      const mockItems = [
        { id: 'r1', materia: 'matematica', puntaje: 10, examId: 'e1', totalPreguntas: 20, createdAt: new Date() },
        { id: 'r2', materia: 'fisica', puntaje: 15, examId: 'e2', totalPreguntas: 20, createdAt: new Date() },
      ];

      // Mock: select().from().where().orderBy().limit().offset() → items
      // y select().from().where() → [{ total: 12 }]
      let callCount = 0;
      dbMock.limit = jest.fn().mockImplementation(function () {
        callCount++;
        if (callCount === 1) return this; // primera llamada: limit() retorna chain
        return mockItems; // segunda llamada (offset): retorna items
      });
      dbMock.offset = jest.fn().mockResolvedValue(mockItems);

      // Para el count, el segundo Promise.all item es un select sin limit/offset
      const originalWhere = dbMock.where;
      dbMock.where = jest.fn().mockImplementation(function () {
        return { ...this, then: undefined, catch: undefined };
      });

      // Simular que Promise.all recibe [items, [{ total }]]
      // Necesitamos mockear las dos ramas del Promise.all
      const mockCountResult = [{ total: 12 }];

      // Re-mock del select para que se comporte diferente según el contexto
      let selectCall = 0;
      dbMock.select = jest.fn().mockImplementation(() => {
        selectCall++;
        if (selectCall === 1) {
          // Primera llamada: query de items
          return {
            from: jest.fn().mockReturnValue({
              where: jest.fn().mockReturnValue({
                orderBy: jest.fn().mockReturnValue({
                  limit: jest.fn().mockReturnValue({
                    offset: jest.fn().mockResolvedValue(mockItems),
                  }),
                }),
              }),
            }),
          };
        }
        // Segunda llamada: query de count
        return {
          from: jest.fn().mockReturnValue({
            where: jest.fn().mockResolvedValue(mockCountResult),
          }),
        };
      });

      const result = await service.historial('user-123', 1, 10);

      expect(result.items).toEqual(mockItems);
      expect(result.total).toBe(12);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.totalPages).toBe(2);
    });

    it('debe paginar correctamente con page=2, limit=5', async () => {
      const mockItems = [{ id: 'r6', materia: 'historia', puntaje: 8, examId: null, totalPreguntas: 20, createdAt: new Date() }];

      let selectCall = 0;
      dbMock.select = jest.fn().mockImplementation(() => {
        selectCall++;
        if (selectCall === 1) {
          return {
            from: jest.fn().mockReturnValue({
              where: jest.fn().mockReturnValue({
                orderBy: jest.fn().mockReturnValue({
                  limit: jest.fn().mockReturnValue({
                    offset: jest.fn().mockResolvedValue(mockItems),
                  }),
                }),
              }),
            }),
          };
        }
        return {
          from: jest.fn().mockReturnValue({
            where: jest.fn().mockResolvedValue([{ total: 11 }]),
          }),
        };
      });

      const result = await service.historial('user-123', 2, 5);

      expect(result.page).toBe(2);
      expect(result.limit).toBe(5);
      expect(result.totalPages).toBe(3);
    });
  });
});
