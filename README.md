# COMBO UNSA

Plataforma de preparación académica de alto rendimiento orientada a postulantes de la UNSA (Universidad Nacional San Agustín). Cuenta con un diseño intensivo y nocturnal, enfocado en el aprendizaje a través de métricas, simulacros y material educativo.

## 🚀 Arquitectura y Tecnologías

El proyecto sigue una arquitectura Full Stack separada en un ecosistema robusto:

### Frontend
- **Framework:** Next.js 14.2 (App Router)
- **Librería UI:** React 18
- **Estilos:** Tailwind CSS con variables personalizadas (Combo UNSA Design System).
- **Manejo de Estado/Data:** Zustand (Estado Global) y Tanstack React Query (Data Fetching).
- **Iconos:** Lucide React / SVG Personalizados.
- **Gestor de paquetes:** pnpm (v9)

### Backend
- **Framework:** NestJS 10
- **Base de Datos:** PostgreSQL 15
- **ORM:** Drizzle ORM (Kit y Studio incluidos para migraciones rápidas).
- **Autenticación:** Passport JWT + Bcrypt para hashing de contraseñas.
- **Integraciones de APIs de 3ros:** OpenAI (Generación de Flashcards/Contenido), Resend (Mailing), Culqi (Pagos/Checkout).
- **Gestor de paquetes:** pnpm (v9)

### Infraestructura Local
- **Docker Compose:** Incluye contenedores orquestados para levantar el entorno de desarrollo (PostgreSQL DB y el Backend usando Hot-Reload).

---

## ⚙️ Requisitos Previos

- [Node.js](https://nodejs.org/) (versión 18 o superior)
- [pnpm](https://pnpm.io/) (v9 recomendado)
- [Docker](https://www.docker.com/) y Docker Compose

---

## 🛠 Instalación y Configuración

### 1. Clonar el Repositorio e Instalar Dependencias

```bash
# Entrar al repositorio
cd exam

# Instalar dependencias en el frontend
cd frontend
pnpm install

# Instalar dependencias en el backend
cd ../backend
pnpm install
```

### 2. Variables de Entorno

Tanto el **backend** como el **frontend** requieren de variables de entorno (crea un `.env` en base a posibles `.env.example`).
Principalmente para el Backend y Docker Compose necesitas configurar las siguientes variables secretas:

```env
JWT_SECRET=...
OPENAI_API_KEY=...
CULQI_SECRET_KEY=...
RESEND_API_KEY=...
FRONTEND_URL=http://localhost:3000
```

*Nota: Para que el `docker-compose.yml` funcione correctamente con los puertos locales, asegúrate de proveer estas variables env al usar docker.*

### 3. Ejecutar el Entorno de Desarrollo (Base de Datos + Backend)

Posiciónate en la raíz del proyecto (`d:\Dev2\exam`) e inicializa los servicios usando Docker o Scripts:

Levantar Base de Datos y Backend con Docker:
```bash
docker-compose up -d --build
```
* La BD estará corriendo bajo el puerto `5432` (db: `combounsa`, user: `admin`, pass: `secret`).
* El API Backend será expuesto localmente en el puerto `3001` (`http://localhost:3001`).

Si prefieres correr el backend sin docker (teniendo solo el postgres levantado):
```bash
# Dentro de la carpeta /backend
pnpm run db:generate # Generar los esquemas actuales
pnpm run db:migrate  # Ejecutar la migración
pnpm run start:dev   # Inicia Nest en reloj (watch/hot-reload)
```

### 4. Ejecutar el Frontend Next.js

Abre una nueva terminal para no bloquear tu servicio de docker, ve a la carpeta `frontend` y ejecuta:

```bash
cd frontend
pnpm run dev
```
* El frontend quedará corriendo en `http://localhost:3000`.

---

## 🎨 Sistema de Diseño (Combo UNSA Design System)

* **Baseline Palette:** Tonalidades Nocturnas con `#0D1117` como canvas general, un borde oscuro en `#30363D`, y el `#161B22` para backgrounds de paneles (superficie).
* **Brand Primary:** Oro Andino `#D4A017`. Usado en acciones principales para representar el brillo local y recompensa académica.
* **Componentes:** Los fondos de elementos secundarios son translúcidos en lo general ("glassmorphism" oscuro), priorizando el ritmo vertical con `Space Grotesk` para el componente visual tipográfico, y `JetBrains Mono` para estadísticas o códigos técnicos numéricos.

---

## 🗄 Funciones Disponibles 

* **Autenticación (App y DB Integrada):** Pantallas estilizadas desde diseño a Next.js (SignIn/SignUp).
* **Dashboard Principal:** Layout general responsivo con Sidebar lateral modular persistiendo sesión y horas de estudio.
* **Drizzle ORM:** La base de datos y esquemas se manipulan cómodamente con Drizzle, brindado una DX extremadamente ágil y con soporte type-safe.

---

## 👩‍💻 Desarrolladores & Reglas Comunes

* Para lanzar "Drizzle Studio" (Panel de GUI para administrar la BD en Chrome): desde carpeta `/backend` utilice el comando `pnpm run db:studio`.
* Para crear nuevas "Migrations" tras cambiar la base de datos en los schemas: ejecuta `pnpm run db:generate`.
* Los estilos Frontend están estrictamente acoplados al Tailwind Config; nunca introduzcas "hard-colors" a menos que sean excepciones vitales. Referenciar el documento de Diseño `SKILL.md` bajo `/.agents/skills/`.

---
