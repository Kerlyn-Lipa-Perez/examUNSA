// frontend/src/hooks/usePagos.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';

interface CheckoutResponse {
  checkoutUrl: string;
  publicKey: string | undefined;
  amount: number;
  currency: string;
  email: string;
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

// POST /pagos/checkout — iniciar flujo de pago
export function useCheckout() {
  const queryClient = useQueryClient();

  return useMutation<CheckoutResponse, Error, string>({
    mutationFn: async (planId: string) => {
      const { data } = await api.post<CheckoutResponse>('/pagos/checkout', { planId });
      return data;
    },
    onSuccess: () => {
      // Invalidar auth para refrescar plan del usuario
      queryClient.invalidateQueries({ queryKey: ['user'] });
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
