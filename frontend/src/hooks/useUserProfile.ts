// frontend/src/hooks/useUserProfile.ts
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { UserProfile, UserStats } from '@/types/perfil';

// GET /users/me/profile - información del usuario
export function useUserProfile() {
  return useQuery<UserProfile>({
    queryKey: ['user', 'profile'],
    queryFn: async () => {
      const { data } = await api.get<UserProfile>('/users/me/profile');
      return data;
    },
    staleTime: 1000 * 60 * 10, // 10 minutos
  });
}

// GET /users/me/stats - estadísticas del usuario
export function useUserStats() {
  return useQuery<UserStats>({
    queryKey: ['user', 'stats'],
    queryFn: async () => {
      const { data } = await api.get<UserStats>('/users/me/stats');
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

// Combinar ambos en un solo hook
export function useUserProfileData() {
  const { data: profile, isLoading: profileLoading, error: profileError } = useUserProfile();
  const { data: stats, isLoading: statsLoading, error: statsError } = useUserStats();

  return {
    profile,
    stats,
    isLoading: profileLoading || statsLoading,
    error: profileError || statsError,
  };
}