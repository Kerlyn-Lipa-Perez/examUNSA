import { examQuestions, NewExamQuestion } from '../database/schema';
import {
  CsvRow,
  ExamQuestionDatabase,
  filterAndMap,
  persistExamQuestions,
} from './dataset-importer';

const buildRow = (overrides: Partial<CsvRow> = {}): CsvRow => ({
  id: 'unsa-2023-001',
  pregunta: '¿Cuánto es 2 + 2?',
  alternativa_a: '3',
  alternativa_b: '4',
  alternativa_c: '5',
  alternativa_d: '6',
  alternativa_e: '7',
  respuesta: 'b',
  universidad: '',
  facultad: 'Ingenieria',
  materia: ' Matemática ',
  tipo_examen: ' Ordinario ',
  anio: ' 2023 ',
  fase: ' I ',
  fuente_url: ' https://unsa.edu.pe/fuente ',
  fuente_archivo: ' examen.pdf ',
  confianza_extraccion: ' 0.85 ',
  revisado_manual: ' TRUE ',
  origen_archivo: ' archivo-origen.pdf ',
  figura_path: ' figuras/1.png ',
  ...overrides,
});

describe('dataset importer', () => {
  describe('filterAndMap', () => {
    it.each([
      ['Biomedicas', 'biomedicas'],
      ['Ingenieria', 'ingenierias'],
      ['Sociales', 'sociales'],
    ])('normaliza %s a %s', (facultad, area) => {
      const result = filterAndMap([buildRow({ facultad })]);

      expect(result.toInsert).toHaveLength(1);
      expect(result.toInsert[0].area).toBe(area);
    });

    it('descarta filas sin respuesta correcta y conserva su contador', () => {
      const result = filterAndMap([buildRow({ respuesta: '   ' })]);

      expect(result).toMatchObject({ toInsert: [], skippedNoAnswer: 1, skippedOther: 0 });
    });

    it.each([
      ['respuesta fuera de A-E', { respuesta: 'F' }],
      ['facultad desconocida', { facultad: 'Derecho' }],
      ['pregunta vacía', { pregunta: ' ' }],
      ['id vacío', { id: ' ' }],
    ])('descarta una fila con %s', (_reason, row) => {
      const result = filterAndMap([buildRow(row)]);

      expect(result).toMatchObject({ toInsert: [], skippedNoAnswer: 0, skippedOther: 1 });
    });

    it('convierte opcionales, números y booleanos al contrato de base de datos', () => {
      const result = filterAndMap([
        buildRow({
          materia: ' ',
          anio: 'sin año',
          confianza_extraccion: 'sin confianza',
          revisado_manual: 'false',
          figura_path: ' ',
        }),
      ]);

      expect(result.toInsert[0]).toMatchObject({
        id: 'unsa-2023-001',
        pregunta: '¿Cuánto es 2 + 2?',
        respuestaCorrecta: 'B',
        universidad: 'UNSA',
        materia: null,
        anio: null,
        confianzaExtraccion: null,
        revisadoManual: false,
        figuraPath: null,
      });
    });
  });

  describe('persistExamQuestions', () => {
    it('hace upsert por id al repetir una pregunta', async () => {
      const onConflictDoUpdate = jest.fn<Promise<void>, [unknown]>().mockResolvedValue(undefined);
      const values = jest.fn().mockReturnValue({ onConflictDoUpdate });
      const insert = jest.fn().mockReturnValue({ values });
      const db = { insert } as unknown as ExamQuestionDatabase;
      const question = filterAndMap([buildRow()]).toInsert[0] as NewExamQuestion;

      await persistExamQuestions(db, [question]);
      await persistExamQuestions(db, [question]);

      expect(insert).toHaveBeenCalledTimes(2);
      expect(insert).toHaveBeenCalledWith(examQuestions);
      expect(values).toHaveBeenNthCalledWith(1, [question]);
      expect(onConflictDoUpdate).toHaveBeenCalledTimes(2);
      expect(onConflictDoUpdate).toHaveBeenLastCalledWith(expect.objectContaining({
        target: examQuestions.id,
      }));
    });

    it('persiste en batches configurables', async () => {
      const onConflictDoUpdate = jest.fn<Promise<void>, [unknown]>().mockResolvedValue(undefined);
      const values = jest.fn().mockReturnValue({ onConflictDoUpdate });
      const insert = jest.fn().mockReturnValue({ values });
      const db = { insert } as unknown as ExamQuestionDatabase;
      const questions = [1, 2, 3].map((index) => filterAndMap([buildRow({ id: `unsa-${index}` })]).toInsert[0]);

      await persistExamQuestions(db, questions, 2);

      expect(values).toHaveBeenNthCalledWith(1, questions.slice(0, 2));
      expect(values).toHaveBeenNthCalledWith(2, questions.slice(2));
    });
  });
});
