# Organigrama

Datos del organigrama de PDP Expert que alimentan la página `/organigrama` de
la intranet. El JSON es la fuente única de la vista; la página no tiene botón
de carga de archivo — el dato vive versionado en este repositorio.

## Archivos

| Archivo | Qué es |
|---|---|
| `organigrama-pdp-expert_v1.0.json` | Instancia con los 20 cargos de PDP Expert. Consumida por `src/app/(app)/organigrama/page.tsx` vía import estático. |
| `organigrama.schema.json` | JSON Schema del organigrama completo (envuelve un arreglo `cargos`). Referencia para validar cualquier edición manual del JSON. |

## Origen del dato

Fuente primaria: `Organigrama de rendición de cuentas PDP EXPERT 2026 3t.xlsx`
(hoja "Organigrama 26-1"), cruzado con notas del Integrador y con
`descriptivo-cargo-integrador_v1.0.json`. Migrado el 2026-07-22 desde
Gestión Organizacional (`01-Arquitectura-empresarial/02-Organizacion-y-
Personas/Organigrama/Modelo-de-datos_v1.0/organigrama/`), donde queda el
paquete completo (README de migración, criterio de migración, plantillas de
descriptivo de cargo). Ese espacio sigue siendo la fuente de gobernanza del
dato; este repo consume una copia versionada para la intranet.

**No incluye datos del "Evaluador de personas"** (valores medulares,
CDC/GWC). Ese dato es sensible y se mantiene fuera de este modelo por
decisión ya documentada en Gestión Organizacional: el organigrama solo dice
quién ocupa cada puesto, no cómo se evalúa a esa persona.

## Modelo de datos

Cada cargo separa el puesto de quién lo ocupa (inspirado en W3C Organization
Ontology: Post / Membership / reportsTo):

- **Puesto** — `codigo_cargo`, `titulo_cargo`, `mision_cargo`,
  `funciones_esenciales`, `reporta_a`, etc. Estructura EOS, independiente de
  la persona.
- **Ocupante** (`ocupante.tipo`: `interno` / `externalizado` / `vacante`) —
  quién ocupa el puesto hoy. Sin evaluación de desempeño, solo identidad.
- **`confianza_reporta_a`** (`alta` / `inferida` / `null`) — si la línea de
  reporte es explícita en la fuente o se dedujo por posición. Se muestra en
  la vista como badge "Inferido" para no imponer certeza donde no la hay.

## Hallazgos abiertos (vienen del JSON, campo `hallazgos_detectados`)

- FB figura como ocupante de al menos tres asientos simultáneos (Gerente de
  Tecnología y SI, Jefe de Growth, Ventas Ecuador) — concentración a
  verificar con PA.
- Ventas Chile y Gerente de Proyecto figuran con headcount 0 (vacantes).
- Las líneas de reporte de Consultor Legal, Consultor Técnico y Analista
  siguen inferidas por posición, no explícitas en la fuente.

## Pendiente

Sesión con MG prevista en el criterio original de migración
(`Criterio - Migración organigrama a modelo de datos.md`, en Gestión
Organizacional) antes de considerar este dato como entregable institucional
cerrado. Esta copia en la intranet es la base migrada, no el cierre.

## Cómo actualizar el organigrama

1. Edita `organigrama-pdp-expert_v1.0.json` (a mano, o regenerando desde el
   Excel institucional). Valídalo contra `organigrama.schema.json` si el
   cambio es grande.
2. Si el cambio de fondo (estructura de cargos, criterio de migración) debe
   quedar también en Gestión Organizacional, replícalo ahí — ese espacio es
   la fuente de gobernanza, este repo es el consumidor para la intranet.
3. `git commit && git push origin main` — dispara el deploy. La página
   `/organigrama` toma el JSON en build time, no hay paso de sincronización
   adicional.

No hay carga manual de archivo en la intranet: el JSON de este directorio es
siempre lo que se muestra.
