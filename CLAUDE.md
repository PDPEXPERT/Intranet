# Intranet PDP Expert

Portal interno para consultores de PDP Expert. Next.js 14 (static export) + TypeScript + Tailwind CSS + Supabase (PostgreSQL + Auth + REST).

## Decisiones clave

- **Static export**: `next.config.js` tiene `output: 'export'`. No hay SSR, no hay API routes. Todo corre client-side.
- **Supabase es 100% del backend**: Auth, BD, REST API auto-generada. El browser habla directo con Supabase.
- **Hosting**: Hostinger (hosting compartido, solo archivos estáticos).
- **Auth**: Supabase Auth con email. Un solo rol ("consultor autenticado"). Sin RLS en v1. Todo el contenido visible para cualquier usuario autenticado.
- **Procedimientos en Supabase**: 3 tablas (`procedures`, `activities`, `procedure_invocations`). JSON de respaldo en `content/procesos/`.
- **PGF**: Micrositio estático en `src/app/pgf/`. No usa Supabase.
- **Biblioteca**: Página estática con links. No usa Supabase.
- **Búsqueda**: Full-text search en español sobre procedures y activities en Supabase. PGF y Biblioteca fuera de búsqueda en v1.

## Modelo de datos (Supabase)

### procedures
- id (uuid PK), code (text UNIQUE, ej. "PRC-CON-001"), title (text), part (text: "compartidos"|"servicio"), purpose (text), scope (text), sort_order (int)
- JSONB: responsibilities, inputs, exceptions, controls, outputs, risks, indicators
- created_at, updated_at (timestamptz)

### activities
- id (uuid PK), procedure_id (uuid FK → procedures), sort_order (int), type (text: 'event_start'|'activity'|'decision'|'event_end'), number (int, NULL para eventos/decisiones), title (text), trigger (text), executor (text), description (text), result (text), evidence (text), outcomes (jsonb, solo decisiones)
- created_at (timestamptz)

### procedure_invocations
- id (uuid PK), caller_id (uuid FK → procedures), callee_id (uuid FK → procedures), context (text)
- UNIQUE(caller_id, callee_id, context)

## Estructura

- `src/app/` — rutas Next.js (app router)
- `src/app/(auth)/login/` — página de login
- `src/components/` — componentes reutilizables
- `src/lib/supabase.ts` — cliente Supabase
- `content/procesos/` — JSON de respaldo (un archivo por procedimiento)
- `scripts/sync-procesos.js` — sync JSON → Supabase
- `supabase/migrations/` — SQL de migración

## Variables de entorno

Archivo `.env.local` (no se commitea):
- `NEXT_PUBLIC_SUPABASE_URL` — URL del proyecto Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — clave pública
- `SUPABASE_SERVICE_ROLE_KEY` — solo para scripts de sync (nunca en cliente)

## Marca PDP Expert — Diseño visual

Los colores y tipografías de la intranet siguen el manual de marca de PDP Expert v2.0.

### Sistema de colores

Todos los colores están definidos como CSS variables en `src/app/globals.css`. Tailwind los consume desde `tailwind.config.ts`. Para cambiar un color, editar solo `globals.css`.

Tokens disponibles en Tailwind:
- `primary` (#143953) — Azul Marino. Headers, sidebar, textos principales.
- `accent` (#4FA1D9) — Azul Cielo. Links, botones, highlights.
- `accent-light` (#74B1E1) — Azul Intermedio. Fondos alternos, hover.
- `neutral` (#C6C6C6) — Gris Claro. Separadores, bordes.
- `neutral-dark` (#1D1D1B) — Texto cuerpo.
- `surface` (#FFFFFF) — Fondo principal.
- `on-primary` (#FFFFFF) — Texto sobre fondos oscuros.
- Estados: `success`, `warning`, `danger`, `pending`, `muted`.

Uso en componentes: `bg-primary`, `text-accent`, `border-neutral`, `hover:bg-accent-light`, etc. Nunca usar colores HEX hardcodeados en componentes.

### Tipografía

- `font-heading` → Montserrat (títulos, encabezados, sidebar).
- `font-body` → Poppins (cuerpo de texto, UI general).

Uso: `<h1 className="font-heading font-bold">`, `<p className="font-body">`.

### Reglas de diseño

- Sidebar: fondo `bg-primary`, texto `text-on-primary`, hover `bg-accent`.
- Botón primario: `bg-accent text-on-primary hover:bg-accent-light`.
- Links: `text-accent hover:text-primary`.
- Tablas: header `bg-primary text-on-primary`, filas alternas con `bg-accent-light/20`.
- No usar sombras excesivas. Interfaz limpia y profesional.

## UI / Frontend

- **Leer `docs/design-system.md` antes de crear o modificar cualquier componente UI.** Es la fuente de verdad para layout, spacing, tipografía, componentes y anti-patrones.
- Todos los componentes nuevos deben seguir los patrones documentados en el design system.
- Al terminar, verificar que no se usaron tokens fuera de los definidos ni clases fuera del sistema de espaciado.
- No usar guiones largos ni emojis en la interfaz.

## Convenciones

- TypeScript estricto. No usar `any`.
- Tailwind CSS para estilos. No CSS custom salvo casos justificados.
- Componentes funcionales con hooks. No class components.
- Archivos en español para contenido de negocio, en inglés para código (nombres de variables, funciones, componentes).
- Commits en español.

## Fase actual

Fase 3: Backend completo (tablas migradas, datos sincronizados, búsqueda funcional). Pendiente: diseñar y construir la interfaz de la intranet.

### Completado

**Datos y contenido (2026-05-13)**
1. **8 JSONs de procedimientos + `_invocations.json`** en `content/procesos/`. Cada JSON tiene los campos del procedure + un array `activities` con el flujo completo. `_invocations.json` tiene las 13 relaciones entre procedimientos.
2. **Migración SQL** en `supabase/migrations/001_create_procedures_tables.sql`. Crea las 3 tablas, FKs con cascade, CHECK constraints, full-text search en español con `unaccent` (config `spanish_unaccent`), columnas `fts` generadas con pesos A/B/C, índices GIN, trigger `updated_at`, y función `search_procedures(query)`.
3. **Sync script** en `scripts/sync-procesos.js`. Lee `.env.local` automáticamente. Upsert de procedures por `code`, delete+insert de activities por `procedure_id`, delete+insert de invocations resolviendo `caller_code`/`callee_code` → UUIDs. Se ejecuta con `npm run sync`.

**Migración y sync ejecutados (2026-05-13)**
4. **Migración ejecutada en Supabase SQL Editor** — sin errores. Tablas sin RLS (decisión v1).
5. **Sync ejecutado** con `npm run sync` — 8 procedures, 109 activities, 13 invocations. Último sync: 2026-05-21 (agregó PRC-CON-008).

**Supabase en producción:**
- Proyecto: `Intranet` en org PDPEXPERT's Org
- URL: `https://pdnbdqdtobhykaxaiqmv.supabase.co`
- Región: us-west-1 (West US, North California)
- Compute: MICRO
- `.env.local` tiene las 3 variables necesarias (URL, anon key, service role key)

### Contenido JSON

- PRC-CON-001.json — Activar servicio (compartidos, 10 rows: 6 actividades + 1 decisión + 1 event_start + 2 event_end)
- PRC-CON-002.json — Ejecutar diagnóstico y plan de trabajo (servicio, 16 rows: 11 actividades + 3 decisiones + 1 event_start + 1 event_end)
- PRC-CON-003.json — Atender requerimiento (servicio, 15 rows: 7 actividades + 4 decisiones + 1 event_start + 3 event_end)
- PRC-CON-004.json — Gestionar soporte continuo del SGPDP (servicio, 15 rows: 11 actividades + 1 decisión + 2 event_start + 1 event_end, 3 fases)
- PRC-CON-005.json — Ejecutar supervisión DPO (servicio, 14 rows: 10 actividades + 1 decisión + 2 event_start + 1 event_end, 3 fases)
- PRC-CON-006.json — Cerrar servicio (compartidos, 9 rows: 6 actividades + 1 decisión + 1 event_start + 1 event_end)
- PRC-CON-007.json — Gestionar secondment (servicio, 13 rows: 9 actividades + 1 decisión + 2 event_start + 1 event_end, 3 fases)
- PRC-CON-008.json — Levantar registro de actividades de tratamiento (servicio, 17 rows: 12 actividades + 2 decisiones + 1 event_start + 2 event_end). Parte III — Procedimientos técnicos de consultoría.

### Pendiente (en orden, DA-016)

1. ~~Generar JSONs de procedimientos~~ ✓
2. ~~Crear migración SQL~~ ✓
3. ~~Crear sync script~~ ✓
4. ~~Ejecutar migración en Supabase SQL Editor~~ ✓
5. ~~Correr `npm run sync` y verificar datos~~ ✓
6. ~~Diseñar y construir la interfaz de la intranet (layout, navegación, secciones)~~ ✓
7. ~~UI de procedimientos (lista + detalle)~~ ✓
8. PGF como micrositio estático
9. Biblioteca como índice con links

## Mantenimiento del README

El README es la fuente de verdad sobre el estado del proyecto. Actualízalo (o sugiere actualizarlo) cuando:

- Se agrega un procedimiento (contador, lista de JSONs)
- Se agrega una sección nueva al intranet (Excellence Wiki y similares)
- Cambia el mecanismo de deploy o hosting
- Cambia la estructura de tablas o el modelo de datos
- Se documenta un nuevo flujo de contenido

Si el cambio ya está aprobado y ejecutado, ofrecer actualizar el README en el mismo turno, sin esperar que el usuario lo pida.
