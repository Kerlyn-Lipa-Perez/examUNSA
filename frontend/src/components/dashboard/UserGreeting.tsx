'use client';

import { useAuthStore } from '@/store/authStore';
import { useEffect, useState } from 'react';

export function UserGreeting() {
  const [mounted, setMounted] = useState(false);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    setMounted(true);
  }, []);

  const name = mounted ? (user?.nombre || 'Usuario') : 'Usuario';

  return (
    <h1 className="text-3xl font-bold text-white flex items-center gap-2">
      Hola, {name} <span role="img" aria-label="wave"></span>
    </h1>
  );
}
