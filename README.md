# Intranet PDP Expert

Portal interno para consultores de PDP Expert. Permite entender rápidamente qué se está armando u operando en cada servicio, cómo se ejecutan los procesos y bajo qué marcos propietarios trabaja el equipo.

## Stack

| Capa | Tecnología | Notas |
|---|---|---|
| Frontend | Next.js 14 (static export) + TypeScript + Tailwind CSS | Genera HTML/CSS/JS puros, sin SSR |
| Backend | Supabase (PostgreSQL + Auth + REST API) | 100% del backend; sin API routes de Next.js |
| Hosting | GitHub Pages (intranet.pdpexpert.com) | Dominio personalizado sobre GitHub Pages |
| CI/CD | GitHub Actions → GitHub Pages | Build automático en push a main |

## Contenido

1. **Procedimientos** — 9 procedimientos de consultoría (PRC-CON-001 a PRC-CON-009) con sus actividades, responsabilidades, controles, riesgos e indicadores. Almacenados en Supabase, con búsqueda full-text en español.
2. **Excellence Wiki** — Wiki de conocimiento para la excelencia operativa. Contenido estático en archivos TSX, sin Supabase. Temas actuales, por categoría: Calidad (¿Qué es calidad?), Desarrollo de Producto (Ciclo de desarrollo de producto), Gestión del conocimiento (Qué es la gestión del conocimiento, basado en ISO 30401) y Arquitectura Empresarial (Arquitectura empresarial y arquitectura de negocio, basado en TOGAF, con su conexión al cumplimiento de protección de datos personales).
3. **Sobre nosotros** — Sección institucional con una landing (mensaje principal + tarjetas de acceso) y cinco subsecciones: Por qué (Life by design y valores), ¿Organización inteligente?, Qué (mapa de capacidades), Quiénes (organigrama de rendición de cuentas) y Cómo (mapa de procesos, placeholder "Próximamente"). Reemplaza a la antigua sección "Organigrama" del menú; el organigrama pasa a vivir dentro de "Quiénes".
   - **Mapa de capacidades** (subsección Qué): visor interactivo con Nivel 1 y Nivel 2 expandible, alimentado por `content/capability-map/capability-map_v1.0.json` (fuente única del dato, consumida por import estático). La interfaz no se edita a mano: se actualiza editando el JSON.
   - **Organigrama** (subsección Quiénes): el mismo visor de solo lectura, datos en `content/organigrama/organigrama-pdp-expert_v1.0.json`. Ver `content/organigrama/README.md` para el origen del dato y el modelo (puesto vs. ocupante).

> PGF y Biblioteca fueron secciones de la intranet y se eliminaron (2026-07-22).
> "Organigrama" dejó de ser sección de primer nivel y ahora vive dentro de "Sobre nosotros" → "Quiénes" (2026-07-26).

## Flujos de contenido

### Agregar un procedimiento

1. Crear `content/procesos/PRC-CON-XXX.json` siguiendo la estructura de los existentes
2. Si invoca otros procedimientos, agregar entradas en `content/procesos/_invocations.json`
3. `npm run sync` — sube los datos a Supabase
4. `git commit && git push origin main` — dispara el deploy

### Agregar un tema al Excellence Wiki

1. Crear `src/content/excellence/topics/nombre-del-tema.tsx` con el contenido usando los componentes `Wiki*` de `src/components/excellence/wiki.tsx`
2. Agregar una entrada en `src/content/excellence/registry.ts` (slug, label, category)
3. Importar y registrar el componente en `src/app/(app)/excellence/[slug]/page.tsx`
4. `git commit && git push origin main` — dispara el deploy

### Actualizar el organigrama

1. Editar `content/organigrama/organigrama-pdp-expert_v1.0.json` (validar contra `organigrama.schema.json` si el cambio es grande)
2. `git commit && git push origin main` — dispara el deploy. La página `/sobre-nosotros/quienes` toma el JSON en build time, sin paso de sincronización adicional
3. Detalle completo del origen del dato y del modelo (puesto vs. ocupante) en `content/organigrama/README.md`

### Actualizar el mapa de capacidades

1. Editar `content/capability-map/capability-map_v1.0.json` (franjas, capacidades L1/L2, objeto de negocio y cobertura de líneas de negocio)
2. `git commit && git push origin main` — dispara el deploy. La página `/sobre-nosotros/que` monta el componente `CapabilityMap` con ese JSON en build time, sin sincronización adicional
3. El mismo mapa existe como modelo ArchiMate fuera de este repo (`04-Arquitectura-empresarial/Capability-Map/`, gestión organizacional); el JSON de la intranet es la fuente para la interfaz. Si el modelo cambia, se actualiza este JSON

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
│   │       ├── sobre-nosotros/ # Sobre nosotros (landing + 5 subsecciones)
│   │       │   ├── page.tsx  # Landing (mensaje + tarjetas)
│   │       │   ├── por-que/
│   │       │   ├── organizacion-inteligente/
│   │       │   ├── que/      # Monta el mapa de capacidades
│   │       │   ├── quienes/  # Monta el organigrama
│   │       │   └── como/     # Mapa de procesos (placeholder)
│   │       └── excellence/   # Excellence Wiki (estático)
│   │           ├── page.tsx  # Índice de temas
│   │           └── [slug]/   # Detalle por tema
│   ├── components/
│   │   ├── layout/           # AppLayout, Sidebar, TopBar, Breadcrumbs
│   │   ├── ui/               # Button, Table, Badge, SearchInput, CollapsibleSection
│   │   ├── procedures/       # Componentes de procedimientos
│   │   ├── organigrama/      # OrgChart (árbol + panel de detalle)
│   │   ├── capability-map/   # CapabilityMap (visor de capacidades L1 + L2)
│   │   ├── excellence/       # Primitivas del wiki (WikiSection, WikiTable, etc.)
│   │   ├── AuthGuard.tsx
│   │   └── AuthRedirectIfSession.tsx
│   ├── content/
│   │   ├── excellence/       # Contenido del wiki
│   │   │   ├── registry.ts   # Registro de temas (slug, label, category)
│   │   │   └── topics/       # Un archivo .tsx por tema
│   │   └── sobre-nosotros/
│   │       └── sections.ts   # Registro de subsecciones (slug, label, short)
│   └── lib/
│       ├── supabase.ts       # Cliente Supabase
│       ├── types.ts          # Tipos TS de procedures, activities, etc.
│       ├── procedures.ts     # Helpers de fetch + búsqueda
│       ├── organigrama.ts    # Tipos y helpers del organigrama (raices, hijosDe)
│       └── capabilityMap.ts  # Tipos del mapa de capacidades
├── content/
│   ├── procesos/             # Un JSON por procedimiento (respaldo portable)
│   │   ├── PRC-CON-001.json
│   │   ├── PRC-CON-002.json
│   │   ├── PRC-CON-003.json
│   │   ├── PRC-CON-004.json
│   │   ├── PRC-CON-005.json
│   │   ├── PRC-CON-006.json
│   │   ├── PRC-CON-007.json
│   │   ├── PRC-CON-008.json
│   │   ├── PRC-CON-009.json
│   │   └── _invocations.json # Relaciones de invocación entre procedimientos
│   ├── organigrama/          # JSON del organigrama (fuente única, consumida por import estático)
│   │   ├── organigrama-pdp-expert_v1.0.json
│   │   ├── organigrama.schema.json
│   │   └── README.md         # Origen del dato, modelo y flujo de actualización
│   └── capability-map/       # JSON del mapa de capacidades (fuente única para la interfaz)
│       └── capability-map_v1.0.json
├── scripts/
│   └── sync-procesos.js      # Lee content/procesos/*.json → upsert en Supabase
├── supabase/
│   └── migrations/           # SQL de creación de tablas e índices
├── public/                   # Assets estáticos (logos, PDFs)
├── docs/                     # Documentación técnica del proyecto
├── .github/
│   └── workflows/
│       └── deploy.yml        # Build + deploy a GitHub Pages
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

El buscador del `TopBar` busca en toda la intranet, combinando dos fuentes (`src/lib/search.ts`, resultados agrupados por área):

- **Procedimientos**: full-text en español en Supabase (`to_tsvector('spanish', ...)`) sobre `procedures.title`, `procedures.purpose`, `activities.title`, `activities.executor` y `activities.description`.
- **Contenido estático** (índice ligero por título, nombre y descripción, resuelto en el cliente sobre el bundle): Sobre nosotros (subsecciones), Mapa de capacidades (capacidades L1/L2 y su objeto), Organigrama (títulos de cargo y ocupantes) y Excellence Wiki (temas).

El cuerpo completo de los temas del Excellence Wiki (TSX) no se indexa; se busca por título y categoría.

## Autenticación

Login con Supabase Auth. Un solo rol: "consultor autenticado". Todo el contenido es visible para cualquier usuario autenticado. Sin Row Level Security en v1.

### Estructura de rutas (route groups)

`src/app/` usa dos route groups de Next.js:

- `(auth)/` agrupa páginas públicas (solo `login`). Su `layout.tsx` redirige a `/` si ya hay sesión. No tiene sidebar.
- `(app)/` agrupa páginas protegidas (home, procesos, sobre-nosotros, excellence). Su `layout.tsx` envuelve con `AuthGuard` y monta el `AppLayout` (sidebar + topbar). Si no hay sesión, redirige a `/login`.

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

## Deployment

Push a `main` → GitHub Actions ejecuta `next build` → archivos estáticos (`out/`) se publican en GitHub Pages → disponibles en `intranet.pdpexpert.com`.

## Decisiones de arquitectura

16 decisiones documentadas en `PDP FILES/Intranet/1. Decisiones/decisiones-arquitectura-intranet.md` (fuera de este repo, en el directorio de gestión del proyecto).

## Historial de cambios

| Fecha | Qué cambió |
|---|---|
| 2026-07-26 | Nueva sección **Sobre nosotros** (`/sobre-nosotros`) con landing (mensaje + tarjetas) y cinco subsecciones (Por qué, ¿Organización inteligente?, Qué, Quiénes, Cómo). Se retira "Organigrama" del menú de primer nivel y del route tree (`(app)/organigrama` eliminado); el organigrama ahora se monta dentro de "Quiénes", sin la línea "Fuente: ..." en el encabezado. Nuevo visor **CapabilityMap** en "Qué", alimentado por `content/capability-map/capability-map_v1.0.json` (fuente única para la interfaz; sin edición manual). Archivos nuevos: `content/capability-map/`, `src/components/capability-map/CapabilityMap.tsx`, `src/lib/capabilityMap.ts`, `src/content/sobre-nosotros/sections.ts`, `src/app/(app)/sobre-nosotros/**`. Editados: `Sidebar.tsx`, `Breadcrumbs.tsx`. |
| 2026-07-26 | Sidebar: subnav de Sobre nosotros, Procedimientos y Excellence Wiki ahora **colapsable** (chevron por sección, se abre al entrar y se puede cerrar); reordenado a Inicio, Sobre nosotros, Procedimientos, Excellence Wiki; corregido el enlace de Inicio (apuntaba a `//`) y la marca del sidebar ahora enlaza a `/`. **Home** reescrita (tono profesional y cercano, tarjetas a las tres secciones; se retira el contenido desactualizado de solo procedimientos). **Buscador** ampliado a toda la intranet (`src/lib/search.ts`): full-text de procedimientos en Supabase más índice ligero de Sobre nosotros, Mapa de capacidades, Organigrama y Excellence Wiki, con resultados agrupados por área. |
| 2026-08-13 | Nuevo tema del **Excellence Wiki**: "Arquitectura empresarial y arquitectura de negocio" (categoría nueva **Arquitectura Empresarial**), basado en TOGAF y su conexión con el cumplimiento de la normativa de protección de datos personales (drivers, ontología de capacidades, procesos de soporte). Archivo nuevo: `src/content/excellence/topics/arquitectura-empresarial-y-negocio.tsx`. Editados: `src/content/excellence/registry.ts`, `src/app/(app)/excellence/[slug]/page.tsx`. |
