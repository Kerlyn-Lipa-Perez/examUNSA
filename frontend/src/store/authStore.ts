import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';

export interface UserData {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  plan: 'free' | 'pro';
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

// Helper para obtener iniciales
export function getInitials(nombre: string, apellido: string): string {
  const inicialNombre = nombre?.charAt(0).toUpperCase() || '';
  const inicialApellido = apellido?.charAt(0).toUpperCase() || '';
  return `${inicialNombre}${inicialApellido}` || inicialNombre || '?';
}
