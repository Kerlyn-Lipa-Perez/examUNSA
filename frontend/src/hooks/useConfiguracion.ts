// frontend/src/hooks/useConfiguracion.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { UserPreferences, UpdatePasswordDto, UpdateProfileDto } from '@/types/configuracion';

// GET /users/me/preferences - preferencias del usuario
export function useUserPreferences() {
  return useQuery<UserPreferences>({
    queryKey: ['preferences'],
    queryFn: async () => {
      const { data } = await api.get<UserPreferences>('/users/me/preferences');
      return data;
    },
    staleTime: 1000 * 60 * 10,
  });
}

// PUT /users/me/preferences - actualizar preferencias
export function useUpdatePreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (prefs: Partial<UserPreferences>) => {
      const { data } = await api.put<UserPreferences>('/users/me/preferences', prefs);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preferences'] });
    },
  });
}

// PUT /users/me/password - cambiar contraseña
export function useUpdatePassword() {
  return useMutation({
    mutationFn: async (dto: UpdatePasswordDto) => {
      await api.put('/users/me/password', dto);
    },
  });
}

// PUT /users/me/profile - actualizar perfil
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: UpdateProfileDto) => {
      const { data } = await api.put('/users/me/profile', dto);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}

// POST /users/me/export-data - exportar datos (GDPR)
export function useExportData() {
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/users/me/export-data');
      return data;
    },
  });
}

// DELETE /users/me/account - eliminar cuenta
export function useDeleteAccount() {
  return useMutation({
    mutationFn: async () => {
      await api.delete('/users/me/account');
    },
  });
}