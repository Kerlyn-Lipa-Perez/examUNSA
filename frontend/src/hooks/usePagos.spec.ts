import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useCheckout, useConfirmarPago, usePagosHistorial } from './usePagos';

// Mock de axios
vi.mock('@/lib/axios', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

import api from '@/lib/axios';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
  };
}

describe('useCheckout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe llamar POST /pagos/checkout con planId', async () => {
    const mockResponse = {
      data: {
        publicKey: 'pk_test_123',
        amount: 2990,
        currency: 'PEN',
        email: 'test@example.com',
      },
    };
    (api.post as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useCheckout(), {
      wrapper: createWrapper(),
    });

    result.current.mutate('pro');

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(api.post).toHaveBeenCalledWith('/pagos/checkout', { planId: 'pro' });
    expect(result.current.data).toEqual(mockResponse.data);
  });
});

describe('useConfirmarPago', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe llamar POST /pagos/confirmar con tokenId', async () => {
    const mockResponse = {
      data: {
        success: true,
        message: 'Pago procesado correctamente',
        cargoId: 'chr_123',
      },
    };
    (api.post as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useConfirmarPago(), {
      wrapper: createWrapper(),
    });

    result.current.mutate('tok_test_abc');

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(api.post).toHaveBeenCalledWith('/pagos/confirmar', { tokenId: 'tok_test_abc' });
    expect(result.current.data?.success).toBe(true);
  });
});

describe('usePagosHistorial', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe llamar GET /pagos/historial', async () => {
    const mockPagos = [
      { id: 'p1', monto: 2990, moneda: 'PEN', estado: 'completado', createdAt: '2026-01-01' },
    ];
    (api.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: mockPagos });

    const { result } = renderHook(() => usePagosHistorial(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(api.get).toHaveBeenCalledWith('/pagos/historial');
    expect(result.current.data).toEqual(mockPagos);
  });
});
