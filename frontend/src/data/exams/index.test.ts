import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getExamsByArea, getExamMeta } from './index';
import { ExamMeta } from '@/types/simulacro';

const mockExamMeta: ExamMeta = {
  id: 'banco-preguntas',
  name: 'Banco de preguntas',
  area: 'ingenierias',
  university: 'UNSA',
  totalPreguntas: 263,
  tiempoMinutos: 493,
  description: 'Banco de preguntas reales de admisión UNSA',
  year: 2024,
};

describe('getExamsByArea', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('devuelve la lista de ExamMeta cuando el fetch responde 200', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve([mockExamMeta]),
    });

    const result = await getExamsByArea('UNSA', 'ingenierias');

    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/exams/UNSA/ingenierias'));
    expect(result).toEqual([mockExamMeta]);
  });

  it('devuelve un array vacío cuando el backend responde 404 (área inválida)', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      status: 404,
      json: () => Promise.resolve(null),
    });

    const result = await getExamsByArea('UNSA', 'area-invalida');

    expect(result).toEqual([]);
  });

  it('devuelve un array vacío cuando el fetch falla (error de red)', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network error'));

    const result = await getExamsByArea('UNSA', 'ingenierias');

    expect(result).toEqual([]);
  });
});

describe('getExamMeta', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('devuelve el ExamMeta que coincide con el examId', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve([mockExamMeta]),
    });

    const result = await getExamMeta('UNSA', 'ingenierias', 'banco-preguntas');

    expect(result).toEqual(mockExamMeta);
  });

  it('devuelve undefined cuando no hay coincidencia', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve([]),
    });

    const result = await getExamMeta('UNSA', 'ingenierias', 'no-existe');

    expect(result).toBeUndefined();
  });
});
