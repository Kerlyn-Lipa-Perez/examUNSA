# Exam

**Preparación académica basada en práctica, repetición espaciada y métricas para postulantes a la Universidad Nacional de San Agustín.**

Exam reúne simulacros, flashcards, seguimiento del rendimiento y un ranking de estudiantes en una aplicación web. El repositorio contiene un frontend Next.js y una API NestJS conectada a PostgreSQL; ambos se pueden ejecutar de forma local o con Docker Compose.

> [!IMPORTANT]
> El proyecto está en desarrollo. La estructura funcional está implementada, pero el banco local de exámenes todavía contiene contenido parcial y algunas operaciones de configuración siguen pendientes. Consulta [Estado conocido](#estado-conocido) antes de desplegarlo.

## Inicio rápido con Docker

### Requisitos

- Docker Desktop con Docker Compose v2.
- Credenciales para las integraciones que quieras probar: Google, OpenAI, Resend, Culqi y Cloudinary.

### Puesta en marcha

1. Crea el archivo de variables que Docker Compose leerá desde la raíz:

   ```powershell
   Copy-Item backend/.env.example .env
   ```

2. Reemplaza los valores de ejemplo de `.env` por credenciales válidas.
3. Construye y levanta los tres servicios:

   ```bash
   docker compose up --build
   ```

4. En otra terminal, aplica las migraciones:

   ```bash
   docker compose exec backend pnpm db:migrate
   ```

5. Abre:

   - Aplicación: <http://localhost:3000>
   - API: <http://localhost:3001/api>
   - PostgreSQL desde el host: `localhost:5433`

Docker Compose no ejecuta las migraciones automáticamente porque, en desarrollo, sobrescribe el comando de producción del backend con `pnpm start:dev`.

## Funcionalidades

| Área | Implementación actual |
| --- | --- |
| Autenticación | Registro e inicio de sesión con email y contraseña, JWT, Google Identity Services, consulta de sesión, cambio y recuperación de contraseña. Resend envía los enlaces de recuperación. |
| Dashboard | Consume estadísticas del usuario, flashcards pendientes y el último simulacro desde la API. |
| Simulacros | Navegación por universidad y áreas UNSA, temporizador, respuestas, resultados e historial. La API también puede generar 20 preguntas con OpenAI y limita el plan Free a 3 generaciones diarias. |
| Flashcards | Cola diaria, repetición espaciada SM-2, calificación de respuestas y estadísticas por materia. El plan Pro puede generar tarjetas con OpenAI. |
| Métricas de estudio | Evolución, fortalezas y debilidades, actividad, rendimiento por día, errores y comparación global. El análisis de patrones con IA está reservado a Pro y usa caché. |
| Ranking | Ranking global y semanal, posición personal, niveles, rachas y puntos obtenidos por simulacros y flashcards. |
| Perfil y preferencias | Perfil, estadísticas, preferencias de estudio/notificaciones, eliminación de cuenta y avatar JPG/PNG/WebP en Cloudinary. |
| Plan Pro y pagos | Checkout de Culqi, creación de cargo, webhook firmado, activación del plan Pro e historial de pagos. Actualmente es un cargo único; no existe ciclo de suscripción recurrente. |
| Tareas programadas | Un cron de NestJS restablece `simulacrosHoy` todos los días a medianoche. |

Las páginas públicas incluyen la landing, inicio de sesión, registro, recuperación de contraseña, privacidad y términos. Las rutas autenticadas incluyen `/dashboard`, `/simulacros`, `/flashcards/hoy`, `/ranking`, `/estadisticas`, `/perfil`, `/configuracion` y `/checkout`.

## Stack tecnológico

| Capa | Tecnologías |
| --- | --- |
| Frontend | Next.js 14.2 (App Router), React 18, TypeScript, Tailwind CSS 3, Zustand 4, TanStack React Query 5, Axios, Recharts y Lucide React. |
| Autenticación web | Google OAuth (`@react-oauth/google`), JWT persistido por Zustand y cookie para el middleware de Next.js. |
| Backend | NestJS 10, TypeScript, Passport JWT, bcrypt, `class-validator`, throttling y tareas programadas. |
| Datos | PostgreSQL 15, Drizzle ORM 0.30 y Drizzle Kit para migraciones y Studio. |
| Integraciones | OpenAI (`gpt-4o-mini`), Resend, Culqi y Cloudinary. |
| Calidad | Vitest + Testing Library en frontend; Jest + Supertest en backend. |
| Herramientas | pnpm declarado por cada paquete, Docker y Docker Compose. |

El frontend declara `pnpm@10.33.0` y el backend `pnpm@9.1.0`. Activa Corepack para que cada directorio use la versión indicada en su `package.json`.

## Arquitectura

El repositorio es un monorepo con dos aplicaciones independientes y dos lockfiles. No hay un workspace pnpm en la raíz; las dependencias y los comandos se gestionan dentro de `frontend/` y `backend/`.

```text
exam/
├── frontend/                   # Aplicación Next.js
│   └── src/
│       ├── app/                # Rutas App Router públicas y autenticadas
│       ├── components/         # UI por dominio: auth, dashboard, flashcards, etc.
│       ├── hooks/              # React Query y operaciones de cada dominio
│       ├── store/              # Estado Zustand de auth, examen y flashcards
│       ├── types/              # Contratos TypeScript del frontend
│       ├── lib/                # Cliente Axios y utilidades compartidas
│       └── data/exams/         # Catálogo y preguntas locales de simulacros
├── backend/                    # API NestJS
│   ├── src/
│   │   ├── auth/               # JWT, Google y recuperación de contraseña
│   │   ├── users/              # Perfil, preferencias y estadísticas personales
│   │   ├── simulacros/         # Generación, resultados e historial
│   │   ├── flashcards/         # SM-2, cola diaria y generación con IA
│   │   ├── estadisticas/       # Analítica académica y análisis IA
│   │   ├── ranking/            # Puntos, niveles y clasificaciones
│   │   ├── pagos/              # Culqi e historial de pagos
│   │   ├── upload/             # Avatares en Cloudinary
│   │   ├── email/              # Correos con Resend
│   │   ├── scheduler/          # Tareas cron
│   │   ├── ai/                 # Cliente y prompts de OpenAI
│   │   └── database/           # Conexión y schema Drizzle
│   └── drizzle/migrations/     # Migraciones generadas
├── docker-compose.yml
└── AGENTS.md                   # Estándares de desarrollo
```

### Topología de Docker Compose

| Servicio | Imagen / aplicación | Puerto del host | Dependencia |
| --- | --- | --- | --- |
| `db` | PostgreSQL 15 Alpine | `5433` → `5432` | — |
| `backend` | NestJS en modo watch | `3001` | Espera el healthcheck de `db`. |
| `frontend` | Next.js en modo desarrollo | `3000` | Inicia después de `backend`. |

El volumen `postgres_data` conserva la base de datos y `frontend_next_cache` mantiene la caché de Next.js en el filesystem Linux de Docker. Para mejorar el rendimiento en Windows, el frontend monta sólo `src/` y sus archivos de configuración, mientras las dependencias permanecen dentro de la imagen.

### Flujo de datos

1. El navegador consume `NEXT_PUBLIC_API_URL` mediante Axios o `fetch`.
2. La API expone todos los endpoints bajo `/api` y valida DTOs globalmente.
3. Las rutas privadas usan `Authorization: Bearer <token>` y `JwtAuthGuard`.
4. Los servicios acceden a PostgreSQL mediante Drizzle ORM.
5. OpenAI, Resend, Culqi y Cloudinary se invocan desde el backend; las claves secretas nunca deben llegar al navegador.

## Configuración local

### Requisitos

- Node.js 20 recomendado (es la versión usada por los Dockerfiles).
- Corepack habilitado: `corepack enable`.
- Docker Desktop, o una instancia compatible de PostgreSQL 15.
- pnpm; Corepack selecciona la versión declarada por cada paquete.

### 1. Instalar dependencias

```bash
cd frontend
pnpm install

cd ../backend
pnpm install
```

### 2. Configurar variables de entorno

Backend:

```powershell
Copy-Item backend/.env.example backend/.env
```

Frontend:

```powershell
Copy-Item frontend/.env.example frontend/.env.local
```

Si usas Linux o macOS, los equivalentes son `cp backend/.env.example backend/.env` y `cp frontend/.env.example frontend/.env.local`.

#### Variables del backend

| Variable | Requerida para | Ejemplo / valor local |
| --- | --- | --- |
| `DATABASE_HOST` | PostgreSQL | `localhost` |
| `DATABASE_PORT` | PostgreSQL y Drizzle | `5433` si la BD corre en Docker; `5432` en una instalación local estándar. |
| `DATABASE_NAME` | PostgreSQL y Drizzle | `combounsa` |
| `DATABASE_USER` | PostgreSQL y Drizzle | `admin` |
| `DATABASE_PASSWORD` | PostgreSQL y Drizzle | Valor local no secreto o contraseña segura. |
| `JWT_SECRET` | Firma y validación de JWT | Cadena larga, aleatoria y privada. |
| `JWT_EXPIRES_IN` | Duración del JWT | `30d` |
| `GOOGLE_CLIENT_ID` | Verificación de Google en el servidor | ID OAuth Web de Google. |
| `OPENAI_API_KEY` | Preguntas, flashcards y análisis IA | Clave privada de OpenAI. |
| `CULQI_PUBLIC_KEY` | Configuración del widget Culqi | Clave pública de prueba o producción. |
| `CULQI_SECRET_KEY` | Cargos y firma del webhook Culqi | Clave secreta privada. |
| `RESEND_API_KEY` | Recuperación de contraseña y confirmación de borrado | Clave privada de Resend. |
| `RESEND_FROM_EMAIL` | Remitente de Resend | `Combo UNSA <onboarding@resend.dev>` en pruebas. |
| `CLOUDINARY_CLOUD_NAME` | Avatares | Nombre del cloud. |
| `CLOUDINARY_API_KEY` | Avatares | API key. |
| `CLOUDINARY_API_SECRET` | Avatares | API secret privado. |
| `FRONTEND_URL` | CORS y enlaces enviados por email | `http://localhost:3000` |
| `PORT` | Puerto de NestJS | `3001` |
| `NODE_ENV` | Entorno de ejecución | `development` |

La aplicación puede iniciar sin algunas claves de integración, pero la funcionalidad asociada fallará al invocarse. `JWT_SECRET` y las variables `DATABASE_*` son indispensables para autenticación y persistencia.

#### Variables del frontend

| Variable | Uso | Valor local |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | URL base pública de la API, incluido `/api`. | `http://localhost:3001/api` |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Inicializa Google Identity Services en el navegador. | El mismo ID OAuth Web configurado en `GOOGLE_CLIENT_ID`. |

No pongas `JWT_SECRET`, `OPENAI_API_KEY`, `CULQI_SECRET_KEY`, `RESEND_API_KEY` ni `CLOUDINARY_API_SECRET` en variables `NEXT_PUBLIC_*`.

### 3. Ejecutar PostgreSQL y aplicar migraciones

La opción más simple es usar sólo el servicio de base de datos de Compose:

```bash
docker compose up -d db

cd backend
pnpm db:migrate
```

En este modo, `backend/.env` debe usar `DATABASE_PORT=5433` porque ése es el puerto publicado en el host.

### 4. Ejecutar backend y frontend

Terminal 1:

```bash
cd backend
pnpm start:dev
```

Terminal 2:

```bash
cd frontend
pnpm dev
```

### Drizzle Kit

Ejecuta estos comandos desde `backend/`:

```bash
# Generar una migración después de modificar src/database/schema.ts
pnpm db:generate

# Aplicar migraciones pendientes
pnpm db:migrate

# Abrir Drizzle Studio
pnpm db:studio
```

No edites manualmente archivos dentro de `backend/drizzle/migrations/`.

## API por dominio

Todos los endpoints tienen el prefijo `/api`. Salvo registro, login, recuperación y webhook de Culqi, las operaciones de usuario requieren JWT.

| Prefijo | Responsabilidad |
| --- | --- |
| `/auth` | Registro, login, Google, sesión y contraseñas. |
| `/users` | Perfil, estadísticas, preferencias y eliminación de cuenta. |
| `/simulacros` | Generación IA, resultados e historial paginado. |
| `/flashcards` | Cola diaria, revisión SM-2, generación IA y estadísticas. |
| `/estadisticas` | Evolución, fortalezas, actividad, errores y comparativo. |
| `/ranking` | Ranking global/semanal y posición personal. |
| `/pagos` | Checkout, confirmación, historial y webhook de Culqi. |
| `/upload` | Carga y eliminación de avatar. |

El backend aplica `ValidationPipe` con `whitelist` y `transform` y habilita CORS para el frontend. `ThrottlerModule` está configurado con 10 solicitudes por minuto, pero el guard de throttling todavía no está registrado globalmente.

## Sistema de diseño

Combo UNSA usa una interfaz oscura con acentos dorados, definida en `frontend/tailwind.config.ts`.

| Token | Color | Uso |
| --- | --- | --- |
| `neutral-900` | `#0D1117` | Fondo general. |
| `neutral-800` | `#161B22` | Tarjetas y superficies. |
| `neutral-700` | `#1E2532` | Superficies elevadas. |
| `neutral-border` | `#30363D` | Bordes. |
| `primary` | `#D4A017` | Marca y acciones principales. |
| `secondary` | `#1A3A5C` | Acciones secundarias. |
| `tertiary` / `info` | `#3B82F6` | Enlaces e información. |
| `success` | `#10B981` | Éxito y Biología. |
| `error` | `#EF4444` | Error e Historia. |

- Texto general y títulos: **Space Grotesk** (`font-sans`).
- Datos numéricos, porcentajes, timers y preguntas: **JetBrains Mono** (`font-mono`).
- Franjas de materias: Biología usa verde; Física y Matemáticas, azul; Historia, rojo; Cívica, dorado.
- Los colores de interfaz deben provenir de Tailwind; no agregues hexadecimales nuevos directamente en JSX.

## Desarrollo y pruebas

Los estándares completos están en [`AGENTS.md`](./AGENTS.md). Reglas esenciales:

- TypeScript en frontend y backend; evita `any`.
- Usa exclusivamente pnpm, nunca npm ni yarn.
- Commits convencionales: `feat:`, `fix:`, `refactor:`, `chore:` y `docs:`.
- Archivos frontend en `kebab-case.tsx` para componentes y `camelCase.ts` para hooks, stores y utilidades.
- Componentes funcionales y exports nombrados, salvo los archivos especiales del App Router.
- UI y mensajes para usuarios en español; identificadores de código en inglés.
- No hardcodees secretos ni confirmes archivos `.env`.
- Usa Drizzle ORM en lugar de SQL directo y valida la entrada con DTOs.

Pruebas disponibles:

```bash
cd frontend
pnpm test

cd ../backend
pnpm test
```

## Estado conocido

- El catálogo anuncia un examen UNSA por cada área (Biomédicas, Ingenierías y Sociales), pero los archivos locales todavía contienen 1, 1 y 0 preguntas respectivamente. Además, `data/exams/index.ts` anuncia 80 preguntas mientras cada archivo de examen declara 20. No consideres completo este banco de preguntas.
- UCSM aparece como “Próximamente” y no tiene exámenes.
- El backend limita a los usuarios Free a 3 simulacros generados por IA al día; el dashboard actualmente muestra un máximo visual de 5.
- `flashcards/stats` calcula totales y materias, pero devuelve `streak: 0` de forma fija.
- El checkout de Culqi crea un cargo y activa Pro, pero no implementa cobro recurrente, renovación ni cancelación de suscripción.
- El frontend de configuración llama a `/users/me/password` y `/users/me/export-data`, endpoints que el backend no expone. El cambio de contraseña disponible en la API es `POST /auth/change-password`.
- `ThrottlerModule` tiene una política de 10 solicitudes por minuto, pero falta registrar `ThrottlerGuard`; por ahora esa política no se aplica globalmente.
- `API_URL_INTERNAL` está definido en Docker Compose, pero el código actual del frontend no lo consume.

## Solución de problemas

### El backend no conecta con PostgreSQL

- Backend ejecutado en el host + BD en Docker: usa `DATABASE_HOST=localhost` y `DATABASE_PORT=5433`.
- Backend dentro de Compose: usa `DATABASE_HOST=db` y `DATABASE_PORT=5432`; Compose ya establece ambos valores.
- Verifica el servicio con `docker compose ps` y aplica `pnpm db:migrate` en el contexto correcto.

### Un puerto ya está ocupado

Los puertos del proyecto son `3000` (frontend), `3001` (backend) y `5433` (PostgreSQL publicado). PostgreSQL usa `5432` únicamente dentro de la red de Compose o en una instalación local estándar. Cambia el mapeo del host o detén el proceso en conflicto; si cambias la API, actualiza también `NEXT_PUBLIC_API_URL`.

### Docker en Windows recarga lentamente

- Mantén el repositorio dentro del filesystem de WSL 2 si el volumen montado desde NTFS resulta lento.
- Usa Docker Desktop con el backend WSL 2 habilitado.
- El Compose actual reduce el costo de I/O montando sólo `frontend/src` y los archivos de configuración. Si modificas otro archivo del frontend, reconstruye la imagen o agrégalo explícitamente al montaje.

### Google no aparece o rechaza el token

Configura el mismo cliente OAuth Web en `GOOGLE_CLIENT_ID` y `NEXT_PUBLIC_GOOGLE_CLIENT_ID`, y agrega `http://localhost:3000` a los orígenes JavaScript autorizados en Google Cloud.

### Falla una integración externa

- OpenAI: revisa `OPENAI_API_KEY` y disponibilidad del modelo configurado.
- Resend: revisa `RESEND_API_KEY`, el dominio/remitente y `FRONTEND_URL`.
- Culqi: usa un par coherente de claves públicas y secretas del mismo entorno.
- Cloudinary: las tres variables `CLOUDINARY_*` deben pertenecer al mismo cloud.

### Cambié una variable del frontend y no se refleja

Reinicia Next.js. Las variables `NEXT_PUBLIC_*` se incorporan al bundle del navegador al iniciar o construir la aplicación.
