// Script de arranque del frontend en desarrollo.
// Arranca `next dev` y, en cuanto el servidor está listo, precompila
// todas las rutas en paralelo para que la navegación entre páginas
// sea instantánea (evita la compilación on-demand de Next.js).
import { spawn } from 'node:child_process';

// Rutas conocidas del App Router. Las protegidas requieren una cookie
// `token` (el middleware solo valida su presencia, no su contenido).
const ROUTES = [
  '/',
  '/login',
  '/registro',
  '/olvidaste-tu-contrasena',
  '/restablecer-contrasena',
  '/dashboard',
  '/simulacros',
  '/flashcards/hoy',
  '/ranking',
  '/estadisticas',
  '/perfil',
  '/configuracion',
  '/checkout',
  '/privacidad',
  '/terminos',
];

const BASE = 'http://localhost:3000';
// Cookie dummy para rutas protegidas por el middleware.
const HEADERS = { Cookie: 'token=docker-warmup' };

const dev = spawn('pnpm', ['dev'], {
  stdio: 'inherit',
  shell: true,
});

async function waitReady() {
  for (let i = 0; i < 180; i++) {
    try {
      const r = await fetch(`${BASE}/`, { headers: HEADERS });
      if (r.status < 500) return true;
    } catch {
      // servidor aún no listo
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  return false;
}

async function warmup() {
  const ready = await waitReady();
  if (!ready) {
    console.warn('[warmup] el servidor no estuvo listo en 180s; continúa sin precalentar.');
    return;
  }
  console.log('[warmup] servidor listo, precalentando rutas...');
  await Promise.all(
    ROUTES.map(async (route) => {
      try {
        const r = await fetch(`${BASE}${route}`, {
          headers: HEADERS,
          redirect: 'manual',
        });
        console.log(`[warmup] ${route} -> ${r.status}`);
      } catch (e) {
        console.log(`[warmup] ${route} -> error: ${e.message}`);
      }
    }),
  );
  console.log('[warmup] precalentado completo.');
}

// No bloqueamos el arranque de dev; calentamos en segundo plano.
warmup();

dev.on('exit', (code) => process.exit(code ?? 0));
