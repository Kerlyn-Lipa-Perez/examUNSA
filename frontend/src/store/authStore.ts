import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';

interface AuthState {
  user: { id: string; nombre: string; email: string } | null;
  token: string | null;
  plan: 'free' | 'pro';
  setAuth: (user: any, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      plan: 'free',
      setAuth: (user, token) => {
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
