import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { loadExam } from './loader';
import { ExamData } from '@/types/simulacro';

const mockExamData: ExamData = {
  meta: {
    id: 'banco-preguntas',
    name: 'Banco de preguntas',
    area: 'ingenierias',
    university: 'UNSA',
    totalPreguntas: 1,
    tiempoMinutos: 2,
    description: 'Banco de preguntas reales de admisión UNSA',
    year: 2024,
  },
  preguntas: [
    {
      id: 1,
      materia: '',
      texto: '¿Cuánto es 2+2?',
      opciones: { A: '3', B: '4', C: '5', D: '6', E: '7' },
      respuestaCorrecta: 'B',
    },
  ],
};

describe('loadExam', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('devuelve ExamData cuando el fetch responde 200 con datos', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockExamData),
    });

    const result = await loadExam('UNSA', 'ingenierias', 'banco-preguntas');

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/exams/UNSA/ingenierias/banco-preguntas'),
    );
    expect(result).toEqual(mockExamData);
  });

  it('devuelve null cuando el backend responde 404', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      status: 404,
      json: () => Promise.resolve(null),
    });

    const result = await loadExam('UNSA', 'ingenierias', 'no-existe');

    expect(result).toBeNull();
  });

  it('devuelve null cuando el fetch falla (error de red)', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network error'));

    const result = await loadExam('UNSA', 'ingenierias', 'banco-preguntas');

    expect(result).toBeNull();
  });
});
