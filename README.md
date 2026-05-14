# Intranet PDP Expert

Portal interno para consultores de PDP Expert. Permite entender rápidamente qué se está armando u operando en cada servicio, cómo se ejecutan los procesos y bajo qué marcos propietarios trabaja el equipo.

## Stack

| Capa | Tecnología | Notas |
|---|---|---|
| Frontend | Next.js 14 (static export) + TypeScript + Tailwind CSS | Genera HTML/CSS/JS puros, sin SSR |
| Backend | Supabase (PostgreSQL + Auth + REST API) | 100% del backend; sin API routes de Next.js |
| Hosting | Hostinger (intranet.pdpexpert.com) | Hosting compartido, archivos estáticos |
| CI/CD | GitHub Actions → FTP deploy | Build automático en push a main |

## Contenido de v1

1. **Repositorio de procesos** (prioridad #1) — Los 7 procedimientos de consultoría (PRC-CON-001 a PRC-CON-007) con sus actividades, responsabilidades, controles, riesgos e indicadores. Almacenados en Supabase, con búsqueda full-text en español.
2. **PGF** — Privacy Governance Framework como micrositio estático navegable. No usa Supabase.
3. **Biblioteca** — Página estática con categorías y links a recursos existentes.
4. **MMI** — Link a PDF. Sin implementación dedicada en v1.

## Estructura del repositorio

```
intranet/
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Root layout: html/body, sin auth ni chrome
│   │   ├── globals.css
│   │   ├── (auth)/           # Páginas públicas (sin sidebar)
│   │   │   ├── layout.tsx    # Redirige a / si ya hay sesión
│   │   │   └── login/
│   │   └── (app)/            # Páginas protegidas (con sidebar + topbar)
│   │       ├── layout.tsx    # AuthGuard + AppLayout
│   │       ├── page.tsx      # Home
│   │       ├── procesos/     # Procedimientos (consume Supabase)
│   │       │   ├── page.tsx  # Índice
│   │       │   └── [code]/   # Detalle por código
│   │       ├── pgf/          # Privacy Governance Framework (estático)
│   │       └── biblioteca/   # Índice de recursos (estático)
│   ├── components/
│   │   ├── layout/           # AppLayout, Sidebar, TopBar, Breadcrumbs
│   │   ├── ui/               # Button, Table, Badge, SearchInput, CollapsibleSection
│   │   ├── procedures/       # Componentes específicos de procedimientos
│   │   ├── pgf/              # Componentes específicos del PGF
│   │   ├── AuthGuard.tsx
│   │   └── AuthRedirectIfSession.tsx
│   └── lib/
│       ├── supabase.ts       # Cliente Supabase
│       ├── types.ts          # Tipos TS de procedures, activities, etc.
│       └── procedures.ts     # Helpers de fetch + búsqueda
├── content/
│   └── procesos/             # Un JSON por procedimiento (respaldo portable)
│       ├── PRC-CON-001.json
│       ├── PRC-CON-002.json
│       ├── PRC-CON-003.json
│       ├── PRC-CON-004.json
│       ├── PRC-CON-005.json
│       ├── PRC-CON-006.json
│       ├── PRC-CON-007.json
│       └── _invocations.json # Relaciones de invocación entre procedimientos
├── scripts/
│   └── sync-procesos.js      # Lee content/procesos/*.json → upsert en Supabase
├── supabase/
│   └── migrations/           # SQL de creación de tablas e índices
├── public/                   # Assets estáticos (logos, PDFs)
├── docs/                     # Documentación técnica del proyecto
├── .github/
│   └── workflows/
│       └── deploy.yml        # Build + FTP deploy a Hostinger
├── .env.local.example        # Variables de entorno requeridas
├── package.json
├── tsconfig.json
├── next.config.js            # output: 'export' + trailingSlash
├── tailwind.config.ts
├── postcss.config.js
└── .gitignore
```

## Modelo de datos (Supabase / PostgreSQL)

Tres tablas. Las secciones tabulares de cada procedimiento (responsabilidades, controles, riesgos, etc.) se almacenan como JSONB dentro de `procedures` porque siempre se despliegan en contexto de su procedimiento.

### procedures

| Campo | Tipo | Notas |
|---|---|---|
| id | uuid PK | |
| code | text UNIQUE | "PRC-CON-001" |
| title | text | "Activar servicio" |
| part | text | "compartidos" o "servicio" |
| purpose | text | Sección Objeto |
| scope | text | Sección Alcance |
| sort_order | int | Orden de despliegue |
| responsibilities | jsonb | [{role, responsibility, authority}] |
| inputs | jsonb | [{name, origin, condition}] |
| exceptions | jsonb | [{number, title, situation, detection, handling}] |
| controls | jsonb | [{control, activity_ref, executor, frequency, failure_action}] |
| outputs | jsonb | [{name, recipient, format}] |
| risks | jsonb | [{risk, description, activity_ref, mitigation}] |
| indicators | jsonb | [{name, calculation, frequency, responsible, target}] |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### activities

| Campo | Tipo | Notas |
|---|---|---|
| id | uuid PK | |
| procedure_id | uuid FK | → procedures |
| sort_order | int | Orden de despliegue dentro del procedimiento |
| type | text | 'event_start', 'activity', 'decision', 'event_end' |
| number | int | NULL para eventos y decisiones |
| title | text | |
| trigger | text | Disparador |
| executor | text | Nombre del rol |
| description | text | Cuerpo de la actividad |
| result | text | |
| evidence | text | |
| outcomes | jsonb | Solo para decisiones: [{condition, description}] |
| created_at | timestamptz | |

### procedure_invocations

| Campo | Tipo | Notas |
|---|---|---|
| id | uuid PK | |
| caller_id | uuid FK | → procedures |
| callee_id | uuid FK | → procedures |
| context | text | "al inicio", "de forma recurrente", "al cierre" |

UNIQUE(caller_id, callee_id, context)

## Búsqueda

Full-text search en español usando `to_tsvector('spanish', ...)` sobre:
- `procedures.title` y `procedures.purpose`
- `activities.title`, `activities.executor` y `activities.description`

El PGF y la Biblioteca no participan en la búsqueda en v1.

## Autenticación

Login con Supabase Auth. Un solo rol: "consultor autenticado". Todo el contenido es visible para cualquier usuario autenticado. Sin Row Level Security en v1.

### Estructura de rutas (route groups)

`src/app/` usa dos route groups de Next.js:

- `(auth)/` agrupa páginas públicas (solo `login`). Su `layout.tsx` redirige a `/` si ya hay sesión. No tiene sidebar.
- `(app)/` agrupa páginas protegidas (home, procesos, pgf, biblioteca). Su `layout.tsx` envuelve con `AuthGuard` y monta el `AppLayout` (sidebar + topbar). Si no hay sesión, redirige a `/login`.

Los paréntesis del nombre del grupo no aparecen en la URL: `/`, `/procesos`, `/login`, etc. siguen siendo los paths reales. La separación existe solo para que cada grupo de páginas tenga su propio layout y guard sin chequeos de pathname repartidos por el código.

## Desarrollo local

```bash
# 1. Clonar e instalar
git clone <repo-url>
cd intranet
npm install

# 2. Configurar variables de entorno
cp .env.local.example .env.local
# Editar .env.local con las credenciales de Supabase

# 3. Levantar servidor de desarrollo
npm run dev
# → http://localhost:3000

# 4. Sincronizar procedimientos a Supabase (requiere SUPABASE_SERVICE_ROLE_KEY)
npm run sync
```

## Variables de entorno

| Variable | Dónde se usa | Descripción |
|---|---|---|
| NEXT_PUBLIC_SUPABASE_URL | Cliente (browser) | URL del proyecto Supabase |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Cliente (browser) | Clave pública (anon) de Supabase |
| SUPABASE_SERVICE_ROLE_KEY | Solo scripts (server) | Clave de servicio para sync. No exponer en cliente. |

## Flujo de sync

```
Editar JSON en content/procesos/ → npm run sync → Supabase actualizado → Intranet consume de Supabase
```

En v1 el sync se ejecuta manualmente. En el futuro puede automatizarse con GitHub Actions en push a main.

## Deployment

Push a `main` → GitHub Action ejecuta `next build` → archivos estáticos (`out/`) se suben a Hostinger vía FTP.

## Fases de implementación

1. **Modelo de datos + sync** — Crear tablas en Supabase, convertir MAN-CON-001 a JSON, implementar script de sync.
2. **Auth** — Login con Supabase Auth, protección de rutas client-side.
3. **Procedimientos** — Páginas de procedimientos, mapa de invocaciones, búsqueda Cmd+K.
4. **PGF + Biblioteca + Home** — Contenido estático.

## Decisiones de arquitectura

16 decisiones documentadas en `PDP FILES/Intranet/1. Decisiones/decisiones-arquitectura-intranet.md` (fuera de este repo, en el directorio de gestión del proyecto).
