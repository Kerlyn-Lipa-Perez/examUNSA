// frontend/src/hooks/usePagos.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';

interface CheckoutResponse {
  publicKey: string | undefined;
  amount: number;
  currency: string;
  email: string;
}

interface ConfirmarPagoResponse {
  success: boolean;
  message: string;
  cargoId: string;
}

interface PagoHistorial {
  id: string;
  userId?: string;
  monto: number;
  moneda: string;
  estado: string;
  planId?: string;
  referencia?: string;
  createdAt: string;
}

// POST /pagos/checkout — obtener datos para CulqiCheckout
export function useCheckout() {
  return useMutation<CheckoutResponse, Error, string>({
    mutationFn: async (planId: string) => {
      const { data } = await api.post<CheckoutResponse>('/pagos/checkout', { planId });
      return data;
    },
  });
}

// POST /pagos/confirmar — enviar token al backend para crear cargo real
export function useConfirmarPago() {
  const queryClient = useQueryClient();

  return useMutation<ConfirmarPagoResponse, Error, string>({
    mutationFn: async (tokenId: string) => {
      const { data } = await api.post<ConfirmarPagoResponse>('/pagos/confirmar', { tokenId });
      return data;
    },
    onSuccess: () => {
      // Refrescar datos del usuario para que refleje el plan Pro
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['pagos', 'historial'] });
    },
  });
}

// GET /pagos/historial — historial de pagos del usuario
export function usePagosHistorial() {
  return useQuery<PagoHistorial[]>({
    queryKey: ['pagos', 'historial'],
    queryFn: async () => {
      const { data } = await api.get<PagoHistorial[]>('/pagos/historial');
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
}
