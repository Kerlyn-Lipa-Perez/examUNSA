import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore, getInitials } from './authStore';
import Cookies from 'js-cookie';

// Mock de js-cookie
vi.mock('js-cookie', () => ({
  default: {
    set: vi.fn(),
    remove: vi.fn(),
  },
}));

describe('useAuthStore', () => {
  beforeEach(() => {
    // Reset store a estado inicial
    useAuthStore.setState({ user: null, token: null, plan: 'free' });
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('estado inicial', () => {
    it('debe tener estado inicial null/sin auth', () => {
      const state = useAuthStore.getState();

      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.plan).toBe('free');
    });
  });

  describe('setAuth', () => {
    it('debe guardar usuario, token y plan', () => {
      const mockUser = {
        id: 'user-123',
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan@example.com',
        plan: 'pro' as const,
      };

      useAuthStore.getState().setAuth(mockUser, 'jwt-token-abc');

      const state = useAuthStore.getState();

      expect(state.user).toEqual(mockUser);
      expect(state.token).toBe('jwt-token-abc');
      expect(state.plan).toBe('pro');
    });

    it('debe guardar cookie para middleware Next.js', () => {
      const mockUser = {
        id: 'user-123',
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan@example.com',
        plan: 'free' as const,
      };

      useAuthStore.getState().setAuth(mockUser, 'jwt-token-xyz');

      expect(Cookies.set).toHaveBeenCalledWith('token', 'jwt-token-xyz', {
        expires: 30,
      });
    });

    it('debe actualizar plan según el usuario', () => {
      const proUser = {
        id: 'user-123',
        nombre: 'Ana',
        apellido: 'López',
        email: 'ana@example.com',
        plan: 'pro' as const,
      };

      useAuthStore.getState().setAuth(proUser, 'token');

      expect(useAuthStore.getState().plan).toBe('pro');
    });
  });

  describe('logout', () => {
    it('debe limpiar usuario, token y plan', () => {
      // Primero hacer login
      const mockUser = {
        id: 'user-123',
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan@example.com',
        plan: 'pro' as const,
      };
      useAuthStore.getState().setAuth(mockUser, 'token');

      // Luego logout
      useAuthStore.getState().logout();

      const state = useAuthStore.getState();

      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.plan).toBe('free');
    });

    it('debe eliminar cookie al hacer logout', () => {
      useAuthStore.getState().logout();

      expect(Cookies.remove).toHaveBeenCalledWith('token');
    });
  });
});

describe('getInitials', () => {
  it('debe retornar iniciales de nombre y apellido', () => {
    expect(getInitials('Juan', 'Pérez')).toBe('JP');
  });

  it('debe manejar nombre sin apellido', () => {
    expect(getInitials('Juan', '')).toBe('J');
  });

  it('debe manejar strings vacíos', () => {
    expect(getInitials('', '')).toBe('?');
  });

  it('debe convertir a mayúsculas', () => {
    expect(getInitials('maría', 'garcía')).toBe('MG');
  });

  it('debe manejar caracteres especiales', () => {
    expect(getInitials('José', 'Ñuñez')).toBe('JÑ');
  });
});
