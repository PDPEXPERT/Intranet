# Organigrama

Datos del organigrama de PDP Expert que alimentan la página
`/sobre-nosotros/quienes` de la intranet (componente `OrgChart`). El JSON es la
fuente única de la vista; la página no tiene botón de carga de archivo: el dato
vive versionado en este repositorio y se importa en build time.

## Archivos

| Archivo | Qué es |
|---|---|
| `organigrama-pdp-expert_v2.6.json` | Instancia vigente (modelo v2.x, descriptivo MOD-org-002 v0.4). Consumida por `src/app/(app)/sobre-nosotros/quienes/page.tsx` y `src/lib/search.ts` vía import estático. |
| `organigrama.schema.json` | JSON Schema del modelo v2.x. Referencia para validar ediciones manuales. |

## Origen del dato

Fuente de gobernanza: Gestión Organizacional,
`03-Personas/Organigrama/organigrama-pdp-expert_v2.6.json`, con sus fichas
MOD-org-001 (organigrama) y MOD-org-002 (descriptivo de cargo) y el anexo de
fuentes y trazabilidad. Ese espacio es la fuente de verdad del modelo; este
repo consume una copia versionada para la intranet.

**No incluye datos del "Evaluador de personas"** (valores medulares, CDC/GWC).
Ese dato es sensible y se mantiene fuera del modelo por decisión ya documentada
en Gestión Organizacional: el organigrama solo dice qué posición existe y quién
la ocupa, no cómo se evalúa a esa persona.

## Modelo de datos (v2.x)

El JSON contiene dos modelos hermanos, alineados a W3C Organization Ontology:

- **`roles`** (org:Role): el descriptivo de cada cargo. Misión, funciones
  esenciales, competencias (esenciales y opcionales), requisitos, indicadores,
  entregables, clasificación ISCO-08, nombre estandarizado ESCO y perfiles
  profesionales UNE-EN 17740. Según MOD-org-002 v0.4, el descriptivo no guarda
  campos libres de contexto ni notas de proceso; el panel de detalle arma un
  encabezado de identificación derivado de la posición (área y "reporta a") y no
  muestra ocupante, tipo de vínculo, organización retenida ni confianzas del
  dato, que son propios del organigrama o metadato de gobernanza.
- **`posiciones`** (org:Post): las plazas de la estructura. Cada una referencia
  un rol (`rol_ref`), su línea de reporte (`vinculo_superior.ref` con `tipo`
  `mando` o `servicio`), el tipo de vínculo (`interna` / `staff_augmentation` /
  `managed_service`), el proveedor y el rol retenido (ISO 37500).
- **`asignaciones`** (org:holds): quién ocupa cada posición. Solo identidad.
- **`organos`** (org:OrganizationalUnit): órganos como el Comité de liderazgo,
  con sus miembros y a qué posición asesoran.

El componente `OrgChart` arma el árbol desde `posiciones` (raíz = posición sin
`vinculo_superior`), enriquece cada nodo con su rol y su ocupante, dibuja línea
punteada para relaciones de servicio o asesoría, y cuelga los órganos de la
posición que asesoran. El adaptador vive en `src/lib/organigrama.ts`
(`construirArbol`).

## Exportación a PDF

La vista de la intranet **no** exporta a PDF (es de consulta). El visor
standalone `visor-organigrama.html` que vive en Gestión Organizacional **sí**
permite exportar a PDF (imprimir). Ambos consumen el mismo modelo v2.x.

## Hallazgos abiertos

Vienen del propio JSON (campo `hallazgos_detectados`) y se muestran en la vista
bajo "Notas". Incluyen concentración de personas en varios asientos y algunas
líneas de reporte o códigos ISCO por confirmar. Detalle y resolución en Gestión
Organizacional.

## Cómo actualizar el organigrama

1. El cambio de fondo se hace primero en Gestión Organizacional (fuente de
   gobernanza), generando la nueva versión del JSON.
2. Copia el JSON nuevo a `content/organigrama/` con su nombre versionado y
   repunta el import en `src/app/(app)/sobre-nosotros/quienes/page.tsx`.
   Valídalo contra `organigrama.schema.json` si el cambio es grande.
3. `git commit && git push origin main` dispara el deploy. La página toma el
   JSON en build time, no hay paso de sincronización adicional.

No hay carga manual de archivo en la intranet: el JSON de este directorio es
siempre lo que se muestra.
