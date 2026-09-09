import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { DATABASE_CONNECTION } from '../database/database.provider';
import { ExamQuestion } from '../database/schema';

describe('ExamsService', () => {
  let service: ExamsService;
  let dbMock: any;

  const buildRow = (overrides: Partial<ExamQuestion> = {}): ExamQuestion => ({
    id: 'row-1',
    area: 'ingenierias',
    materia: 'Matemática',
    pregunta: '¿Cuánto es 2+2?',
    alternativaA: '3',
    alternativaB: '4',
    alternativaC: '5',
    alternativaD: '6',
    alternativaE: '7',
    respuestaCorrecta: 'B',
    universidad: 'UNSA',
    tipoExamen: 'ordinario',
    anio: 2022,
    fase: null,
    fuenteUrl: null,
    fuenteArchivo: null,
    origenArchivo: null,
    confianzaExtraccion: null,
    revisadoManual: false,
    figuraPath: null,
    createdAt: new Date(),
    ...overrides,
  });

  beforeEach(async () => {
    dbMock = {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [ExamsService, { provide: DATABASE_CONNECTION, useValue: dbMock }],
    }).compile();

    service = module.get(ExamsService);
  });

  // ======= getExamsByArea =======
  describe('getExamsByArea', () => {
    it('debe lanzar NotFoundException si el área no es válida', async () => {
      await expect(service.getExamsByArea('foo')).rejects.toThrow(NotFoundException);
      expect(dbMock.select).not.toHaveBeenCalled();
    });

    it('debe retornar [] si el área es válida pero no tiene preguntas', async () => {
      dbMock.where.mockResolvedValue([{ total: 0, maxAnio: null }]);

      const result = await service.getExamsByArea('biomedicas');

      expect(result).toEqual([]);
    });

    it('debe retornar un único ExamMeta calculado si el área tiene preguntas', async () => {
      dbMock.where.mockResolvedValue([{ total: 263, maxAnio: 2023 }]);

      const result = await service.getExamsByArea('ingenierias');

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: 'banco-preguntas',
        name: 'Banco de preguntas',
        area: 'ingenierias',
        university: 'UNSA',
        totalPreguntas: 263,
        tiempoMinutos: Math.round(263 * 1.875),
        description: 'Banco de preguntas reales de admisión UNSA',
        year: 2023,
      });
    });

    it('debe usar el año actual si maxAnio es null', async () => {
      dbMock.where.mockResolvedValue([{ total: 5, maxAnio: null }]);

      const result = await service.getExamsByArea('sociales');

      expect(result[0].year).toBe(new Date().getFullYear());
    });
  });

  // ======= getExamById =======
  describe('getExamById', () => {
    it('debe lanzar NotFoundException si el área es inválida', async () => {
      await expect(service.getExamById('foo', 'banco-preguntas')).rejects.toThrow(NotFoundException);
      expect(dbMock.select).not.toHaveBeenCalled();
    });

    it('debe lanzar NotFoundException si el examId no es "banco-preguntas"', async () => {
      await expect(service.getExamById('ingenierias', 'otro-id')).rejects.toThrow(NotFoundException);
      expect(dbMock.select).not.toHaveBeenCalled();
    });

    it('debe lanzar NotFoundException si el área es válida pero no tiene preguntas', async () => {
      dbMock.where.mockResolvedValue([]);

      await expect(service.getExamById('biomedicas', 'banco-preguntas')).rejects.toThrow(NotFoundException);
    });

    it('debe mapear filas a Question con defaults correctos y id secuencial', async () => {
      const rows = [
        buildRow({ id: 'b', materia: null, alternativaE: null, figuraPath: null }),
        buildRow({ id: 'a', materia: 'Física', figuraPath: 'unsa/2019/fig12.png' }),
      ];
      dbMock.where.mockResolvedValue(rows);

      const result = await service.getExamById('ingenierias', 'banco-preguntas');

      expect(result.meta.totalPreguntas).toBe(2);
      // ordenado por id de DB (string), 'a' antes que 'b'
      expect(result.preguntas).toHaveLength(2);
      expect(result.preguntas[0].id).toBe(1);
      expect(result.preguntas[1].id).toBe(2);

      const mapped = result.preguntas[0]; // corresponde a la fila con id 'a'
      expect(mapped.materia).toBe('Física');
      expect(mapped.imagen).toBe('unsa/2019/fig12.png');

      const mappedB = result.preguntas[1]; // fila con id 'b'
      expect(mappedB.materia).toBe(''); // null -> ''
      expect(mappedB.opciones.E).toBe(''); // null -> ''
      expect(mappedB.imagen).toBeUndefined(); // figuraPath null -> omitido
    });

    it('debe pasar figuraPath sin validar que el asset exista', async () => {
      dbMock.where.mockResolvedValue([
        buildRow({ figuraPath: 'unsa/2019/fig-inexistente.png' }),
      ]);

      const result = await service.getExamById('sociales', 'banco-preguntas');

      expect(result.preguntas[0].imagen).toBe('unsa/2019/fig-inexistente.png');
    });

    it('debe usar el año actual en meta si todos los anio son null', async () => {
      dbMock.where.mockResolvedValue([buildRow({ anio: null })]);

      const result = await service.getExamById('ingenierias', 'banco-preguntas');

      expect(result.meta.year).toBe(new Date().getFullYear());
    });
  });
});
