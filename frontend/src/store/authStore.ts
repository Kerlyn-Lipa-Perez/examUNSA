import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';

export interface UserData {
  id: string;
  nombre: string;
  email: string;
  plan: 'free' | 'pro';
  avatarUrl?: string | null;
  simulacrosHoy?: number;
  streakDias?: number;
  ultimoAcceso?: string;
  createdAt?: string;
}

interface AuthState {
  user: UserData | null;
  token: string | null;
  plan: 'free' | 'pro';
  setAuth: (user: UserData, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      plan: 'free',
      setAuth: (user: UserData, token: string) => {
        Cookies.set('token', token, { expires: 30 }); // para el middleware Next.js
        set({ user, token, plan: user.plan });
      },
      logout: () => {
        Cookies.remove('token');
        set({ user: null, token: null, plan: 'free' });
      },
    }),
    { name: 'combo-unsa-auth', storage: createJSONStorage(() => localStorage) },
  ),
);

// Helper para obtener iniciales desde el nombre completo
export function getInitials(nombre: string): string {
  if (!nombre) return '?';
  const parts = nombre.trim().split(/\s+/);
  const first = parts[0]?.charAt(0).toUpperCase() || '';
  const last = parts.length > 1 ? parts[parts.length - 1]?.charAt(0).toUpperCase() || '' : '';
  return `${first}${last}` || '?';
}
