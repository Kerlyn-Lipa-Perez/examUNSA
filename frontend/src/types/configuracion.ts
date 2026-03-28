// frontend/src/types/configuracion.ts
export interface UserPreferences {
  metaDiariaHoras: number;
  flashcardsNuevasDia: number;
  recordatorioActivo: boolean;
  horaRecordatorio: string;
  notificacionesEmail: boolean;
  sonidosTimer: boolean;
  vibracion: boolean;
}

export interface UpdatePasswordDto {
  passwordActual: string;
  nuevaPassword: string;
  confirmarPassword: string;
}

export interface UpdateProfileDto {
  nombre: string;
  email: string;
}

// Opciones de configuración
export const META_DIARIA_OPCIONES = [
  { value: 1, label: '1 hora' },
  { value: 2, label: '2 horas' },
  { value: 3, label: '3 horas' },
  { value: 4, label: '4 horas' },
  { value: 5, label: '5 horas' },
] as const;

export const FLASHCARDS_POR_DIA_OPCIONES = [
  { value: 5, label: '5 tarjetas' },
  { value: 10, label: '10 tarjetas' },
  { value: 20, label: '20 tarjetas' },
  { value: 30, label: '30 tarjetas' },
  { value: 50, label: '50 tarjetas' },
] as const;

export const HORAS_RECORDATORIO = [
  { value: '07:00', label: '7:00 AM - Mañana' },
  { value: '12:00', label: '12:00 PM - Tarde' },
  { value: '18:00', label: '6:00 PM - Tarde temprana' },
  { value: '20:00', label: '8:00 PM - Noche' },
  { value: '21:00', label: '9:00 PM - Noche' },
] as const;