import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { LastSimulacro } from './LastSimulacro';

// Mock de axios
vi.mock('@/lib/axios', () => ({
  default: {
    get: vi.fn(),
  },
}));

// Mock de next/link
vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: any) =>
    React.createElement('a', { href, ...props }, children),
}));

import api from '@/lib/axios';

describe('LastSimulacro', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe mostrar el último simulacro cuando hay datos', async () => {
    (api.get as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: {
        items: [
          {
            id: 'result-1',
            examId: 'exam-1',
            materia: 'matematica',
            puntaje: 15,
            totalPreguntas: 20,
            createdAt: new Date().toISOString(),
          },
        ],
        total: 5,
        page: 1,
        limit: 1,
        totalPages: 5,
      },
    });

    render(React.createElement(LastSimulacro));

    await waitFor(() => {
      expect(screen.getByText('matematica')).toBeInTheDocument();
    });

    // Verifica que llama con el nuevo shape de paginación
    expect(api.get).toHaveBeenCalledWith('/simulacros/historial?limit=1');

    // Verifica que muestra el puntaje
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('/20')).toBeInTheDocument();

    // Verifica botón de revisar
    expect(screen.getByText('Revisar errores')).toBeInTheDocument();
  });

  it('debe mostrar estado vacío cuando no hay simulacros', async () => {
    (api.get as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: {
        items: [],
        total: 0,
        page: 1,
        limit: 1,
        totalPages: 0,
      },
    });

    render(React.createElement(LastSimulacro));

    await waitFor(() => {
      expect(screen.getByText(/Aún no has realizado ningún simulacro/)).toBeInTheDocument();
    });
  });

  it('debe mostrar error cuando la petición falla', async () => {
    (api.get as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network error'));

    render(React.createElement(LastSimulacro));

    await waitFor(() => {
      expect(screen.getByText(/No se pudo cargar el historial/)).toBeInTheDocument();
    });
  });
});
