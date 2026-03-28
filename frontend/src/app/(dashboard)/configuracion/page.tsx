'use client';

import { useState } from 'react';
import {
  AccountSettings,
  StudyPreferences,
  NotificationsSettings,
  SoundTimerSettings,
  PrivacySettings,
  SubscriptionSettings,
} from '@/components/configuracion';
import { User, BookOpen, Bell, Volume2, CreditCard, Shield, Settings } from 'lucide-react';

type Seccion = 'cuenta' | 'estudio' | 'notificaciones' | 'sonido' | 'pago' | 'privacidad';

interface SeccionInfo {
  id: Seccion;
  titulo: string;
  descripcion: string;
  icono: React.ReactNode;
}

const secciones: SeccionInfo[] = [
  {
    id: 'cuenta',
    titulo: 'Cuenta',
    descripcion: 'Datos de tu cuenta y seguridad',
    icono: <User className="w-5 h-5" />,
  },
  {
    id: 'estudio',
    titulo: 'Estudio',
    descripcion: 'Preferencias de aprendizaje',
    icono: <BookOpen className="w-5 h-5" />,
  },
  {
    id: 'notificaciones',
    titulo: 'Notificaciones',
    descripcion: 'Recordatorios y comunicaciones',
    icono: <Bell className="w-5 h-5" />,
  },
  {
    id: 'sonido',
    titulo: 'Sonido',
    descripcion: 'Sonidos del timer y simulator',
    icono: <Volume2 className="w-5 h-5" />,
  },
  {
    id: 'pago',
    titulo: 'Pago',
    descripcion: 'Tu plan y facturación',
    icono: <CreditCard className="w-5 h-5" />,
  },
  {
    id: 'privacidad',
    titulo: 'Privacidad',
    descripcion: 'Tus datos y privacidad',
    icono: <Shield className="w-5 h-5" />,
  },
];

export default function ConfiguracionPage() {
  const [seccionActiva, setSeccionActiva] = useState<Seccion>('cuenta');

  const renderSeccion = () => {
    switch (seccionActiva) {
      case 'cuenta':
        return <AccountSettings />;
      case 'estudio':
        return <StudyPreferences />;
      case 'notificaciones':
        return <NotificationsSettings />;
      case 'sonido':
        return <SoundTimerSettings />;
      case 'pago':
        return <SubscriptionSettings />;
      case 'privacidad':
        return <PrivacySettings />;
      default:
        return <AccountSettings />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Settings className="w-8 h-8 text-primary" />
          Configuración
        </h1>
        <p className="text-gray-400 mt-1">
          Gestiona tu cuenta, preferencias y más
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar de navegación */}
        <div className="lg:w-64 flex-shrink-0">
          <nav className="space-y-1">
            {secciones.map((seccion) => (
              <button
                key={seccion.id}
                onClick={() => setSeccionActiva(seccion.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  seccionActiva === seccion.id
                    ? 'bg-neutral-800 text-primary border-l-4 border-primary'
                    : 'text-gray-400 hover:text-white hover:bg-neutral-800 border-l-4 border-transparent'
                }`}
              >
                {seccion.icono}
                <div>
                  <p className="font-medium text-sm">{seccion.titulo}</p>
                  <p className="text-xs text-gray-500 hidden lg:block">{seccion.descripcion}</p>
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* Contenido de la sección */}
        <div className="flex-1 space-y-6">
          {renderSeccion()}
        </div>
      </div>

      {/* Versión */}
      <div className="text-center text-gray-600 text-xs mt-12 py-4 border-t border-neutral-border">
        <p>Combo UNSA v1.0.0</p>
      </div>
    </div>
  );
}