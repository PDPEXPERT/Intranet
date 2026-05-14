# Design System — Intranet PDP Expert

Fuente de verdad para decisiones de diseño de interfaz. Claude Code DEBE leer este archivo antes de crear o modificar cualquier componente UI.

Los tokens de color y tipografía están en `src/app/globals.css` y `tailwind.config.ts`. Este documento no los repite. Define cómo se usan.

---

## Principios

1. **La información es la interfaz.** El contenido (texto de procedimientos, tablas de actividades, listas de responsabilidades) es lo que el consultor viene a ver. No esconderlo detrás de interacciones innecesarias: colapsables cerrados por defecto, tabs que ocultan contenido, modals. Si cabe en la página, mostrarlo.
2. **Densidad sobre decoración.** Herramienta de trabajo diario, no landing page. Preferir: tablas sobre cards, texto sobre iconos, bordes sutiles sobre sombras, espacio blanco funcional sobre espacio blanco decorativo.
3. **Un solo patrón por problema.** Si las actividades de un procedimiento se muestran como tabla, todas las actividades de todos los procedimientos se muestran como tabla. Consistencia primero.

---

## Layout

```
┌──────────┬─────────────────────────────────────┐
│ SIDEBAR  │  TOP BAR (breadcrumb + búsqueda)    │
│ 240px    ├─────────────────────────────────────┤
│          │                                     │
│ Logo     │  CONTENIDO                          │
│ ───────  │  max-width: 960px                   │
│ Nav      │  padding: 32px                      │
│ items    │                                     │
│          │                                     │
│          │                                     │
│ ───────  │                                     │
│ Usuario  │                                     │
│ Logout   │                                     │
└──────────┴─────────────────────────────────────┘
```

| Zona | Ancho | Posición | Notas |
|------|-------|----------|-------|
| Sidebar | 240px fijo | Fija a la izquierda, altura completa | `bg-primary text-on-primary`. Colapsable a 64px en viewports < 768px |
| Top bar | 100% del área de contenido | Sticky top | Breadcrumbs a la izquierda, búsqueda a la derecha. `border-b border-neutral` |
| Contenido | max-width 960px | Centrado en el área disponible | Tablas y flujos pueden usar max-width 1120px si necesitan más espacio |

### Sidebar: estructura interna

```
Logo PDP Expert (logo-blanco-fondo-transparente.png)
────────────────
Inicio
Procedimientos        ← nivel 1
  PRC-CON-001         ← nivel 2 (visible solo si Procedimientos está activo)
  PRC-CON-002
  ...
PGF
Biblioteca
────────────────
usuario@email.com
[Cerrar sesión]
```

### Sidebar: estilos de navegación

| Estado | Estilo |
|--------|--------|
| Ítem nivel 1 inactivo | `text-on-primary/70 hover:bg-accent hover:text-on-primary` |
| Ítem nivel 1 activo | `bg-accent text-on-primary` |
| Ítem nivel 2 inactivo | `text-on-primary/60 pl-8 hover:text-on-primary` |
| Ítem nivel 2 activo | `border-l-3 border-accent text-on-primary pl-8` sin fondo |

---

## Navegación

Tres niveles:

| Nivel | Mecanismo | Ejemplo |
|-------|-----------|---------|
| 1 | Sidebar: secciones principales | Inicio, Procedimientos, PGF, Biblioteca |
| 2 | Sidebar: sub-items contextuales | PRC-CON-001, PRC-CON-002, ... (dentro de Procedimientos) |
| 3 | Breadcrumbs en top bar | Procedimientos > PRC-CON-003 > Actividades |

Breadcrumbs: separador `/`, último elemento no es link, `text-xs text-neutral-dark/60`.

---

## Espaciado

Base: 8px. Solo múltiplos de 4px permitidos. Preferir múltiplos de 8px.

| Uso | Valor | Tailwind |
|-----|-------|----------|
| Separación mínima entre elementos inline | 4px | `gap-1` |
| Padding de badges, chips | 8px | `p-2` |
| Gap entre elementos de lista | 12px | `gap-3` |
| Padding de contenedores | 16px | `p-4` |
| Separación entre secciones de una página | 24px | `space-y-6` |
| Padding del área de contenido principal | 32px | `p-8` |
| Separación entre bloques mayores | 48px | `space-y-12` |

No inventar valores fuera de esta tabla.

---

## Tipografía web

Montserrat → `font-heading`. Poppins → `font-body`. Definidos en `tailwind.config.ts`.

| Elemento | Font | Tailwind | Peso | Uso |
|----------|------|----------|------|-----|
| Page title (h1) | Montserrat | `text-2xl` (24px) | `font-bold` (700) | Título de página. Uno por página. |
| Section title (h2) | Montserrat | `text-xl` (20px) | `font-semibold` (600) | Secciones: Responsabilidades, Controles, etc. |
| Subsection (h3) | Montserrat | `text-lg` (18px) | `font-semibold` (600) | Sub-secciones si aplica |
| Body | Poppins | `text-sm` (14px) | `font-normal` (400) | Todo el texto de contenido |
| Body emphasis | Poppins | `text-sm` (14px) | `font-medium` (500) | Labels, nombres de roles, campos |
| Caption/meta | Poppins | `text-xs` (12px) | `font-normal` (400) | Timestamps, códigos, metadata |
| Sidebar nav | Poppins | `text-sm` (14px) | `font-medium` (500) | Ítems de navegación |

Body es `text-sm` (14px), no `text-base` (16px). Es herramienta interna con densidad alta.

### Ejemplo de heading

```tsx
<h1 className="font-heading text-2xl font-bold text-primary">
  Procedimientos de Consultoría
</h1>
```

---

## Tablas

Patrón para toda tabla de datos en la intranet:

| Parte | Estilo |
|-------|--------|
| Header | `bg-primary text-on-primary text-xs font-medium uppercase tracking-wide` |
| Filas | `text-sm`. Alternas: par `bg-surface`, impar `bg-accent-light/10` |
| Bordes | `border-b border-neutral/30` entre filas. Sin bordes verticales. |
| Celdas | `px-4 py-3 text-left` |
| Hover fila | `hover:bg-accent-light/20` |

### Ejemplo

```tsx
<table className="w-full text-sm text-left">
  <thead>
    <tr className="bg-primary text-on-primary text-xs font-medium uppercase tracking-wide">
      <th className="px-4 py-3">Actividad</th>
      <th className="px-4 py-3">Ejecutor</th>
      <th className="px-4 py-3">Resultado</th>
    </tr>
  </thead>
  <tbody>
    <tr className="border-b border-neutral/30 hover:bg-accent-light/20">
      <td className="px-4 py-3">Verificar completitud</td>
      <td className="px-4 py-3">Gerente de Proyecto</td>
      <td className="px-4 py-3">Estado verificado</td>
    </tr>
  </tbody>
</table>
```

---

## Botones

Tres variantes. No crear otras sin documentarlas aquí.

| Variante | Clases | Uso |
|----------|--------|-----|
| Primary | `bg-accent text-on-primary hover:bg-accent-light px-4 py-2 rounded-md text-sm font-medium` | Acción principal de la página |
| Ghost | `text-accent hover:text-primary hover:bg-accent-light/10 px-4 py-2 rounded-md text-sm font-medium` | Acciones secundarias |
| Danger | `bg-danger text-on-primary hover:bg-danger/80 px-4 py-2 rounded-md text-sm font-medium` | Acciones destructivas |

### Ejemplo

```tsx
<button className="bg-accent text-on-primary hover:bg-accent-light px-4 py-2 rounded-md text-sm font-medium">
  Guardar
</button>
```

---

## Contenedores y delimitación

| Necesidad | Solución | Clases |
|-----------|----------|--------|
| Agrupar campos relacionados | Borde sutil | `border border-neutral/40 rounded-md p-4` |
| Separar secciones mayores | Línea horizontal | `border-t border-neutral/30 pt-6` |
| Destacar información importante | Fondo con acento | `bg-accent-light/10 border-l-3 border-accent p-4` |
| Contenido colapsable (solo si la página es muy larga) | Detalle expandible | `<details>` nativo con `open` por defecto |

No usar cards con sombra. No usar `shadow-*` de Tailwind.

---

## Badges de estado

Para matrices, indicadores y cualquier campo con estado.

| Estado | Clases |
|--------|--------|
| Cumple | `bg-success/15 text-success text-xs font-medium px-2 py-0.5 rounded` |
| En proceso | `bg-warning/15 text-warning text-xs font-medium px-2 py-0.5 rounded` |
| No cumple | `bg-danger/15 text-danger text-xs font-medium px-2 py-0.5 rounded` |
| Pendiente | `bg-pending/15 text-pending text-xs font-medium px-2 py-0.5 rounded` |
| No aplica | `bg-muted/15 text-neutral-dark/50 text-xs font-medium px-2 py-0.5 rounded` |

---

## Búsqueda

Campo en el top bar, alineado a la derecha.

```tsx
<input
  type="search"
  placeholder="Buscar procedimientos..."
  className="w-64 px-3 py-1.5 text-sm border border-neutral rounded-md bg-surface text-neutral-dark placeholder:text-neutral focus:outline-none focus:border-accent"
/>
```

Resultados: lista simple debajo del input (dropdown). Cada resultado muestra: código del procedimiento, título, y un fragmento del match. Sin highlight de texto, sin categorías, sin tabs de filtro.

---

## Anti-patrones: NUNCA hacer esto

- **No usar sombras.** Nada de `shadow-sm`, `shadow-md`, `shadow-lg`. Delimitación con bordes.
- **No usar `rounded-lg` ni `rounded-xl`.** Máximo `rounded-md` (6px). Preferir `rounded` (4px) o `rounded-md`.
- **No centrar texto de contenido.** Todo `text-left`. Excepción única: página de login.
- **No agregar iconos decorativos.** No poner iconos de Lucide/Heroicons al lado de cada título, cada nav item, cada celda. Iconos solo cuando aportan información que el texto no da (indicador de estado, acción interactiva).
- **No usar gradientes.** La paleta es colores sólidos.
- **No crear layouts de "dashboard" con KPI cards.** La página de inicio no es un dashboard de métricas.
- **No usar animaciones ni transiciones.** Nada de `transition-all`, `hover:scale-*`, `animate-*`. Interfaz estática.
- **No inventar colores fuera de los tokens.** Nada de `text-gray-600`, `bg-slate-100`, `border-blue-200`. Solo los definidos en `tailwind.config.ts`.
- **No usar `style={{}}` inline.** Todo con clases de Tailwind.
- **No crear variantes de componentes sin documentarlas en este archivo.**
- **No usar padding o margin arbitrarios.** Solo los valores de la tabla de espaciado.
- **No usar guiones largos (em dash `—`) ni guiones medios (en dash `–`) en el contenido de la interfaz.** Si se necesita separar conceptos, usar dos puntos, comas, paréntesis o simplemente reestructurar la oración.
- **No usar emojis en la interfaz.** Ni como bullets, ni como indicadores, ni como decoración.

---

## Estructura de archivos UI

```
src/
  components/
    layout/
      Sidebar.tsx           ← navegación principal
      TopBar.tsx            ← breadcrumbs + búsqueda
      AppLayout.tsx         ← wrapper: sidebar + topbar + contenido
    ui/
      Button.tsx            ← 3 variantes: primary | ghost | danger
      Table.tsx             ← tabla canónica con header, filas alternas
      Badge.tsx             ← badges de estado
      SearchInput.tsx       ← input de búsqueda
    procedures/
      ProcedureList.tsx     ← lista de procedimientos
      ProcedureDetail.tsx   ← vista de detalle
      ActivityTable.tsx     ← tabla de actividades de un procedimiento
```

Componentes nuevos van en la carpeta correspondiente. Si no encaja en ninguna, consultar antes de crear una nueva carpeta.

---

## Referencia rápida de clases frecuentes

```
Fondo página:           bg-surface
Texto principal:        text-neutral-dark
Texto sobre azul:       text-on-primary
Link:                   text-accent hover:text-primary
Borde sutil:            border-neutral/40
Heading de página:      font-heading text-2xl font-bold text-primary
Heading de sección:     font-heading text-xl font-semibold text-primary
Body text:              font-body text-sm text-neutral-dark
Caption:                font-body text-xs text-neutral-dark/60
Sidebar fondo:          bg-primary
Sidebar texto:          text-on-primary
Tabla header:           bg-primary text-on-primary text-xs font-medium uppercase tracking-wide
Tabla celda:            px-4 py-3 text-left text-sm
Botón primario:         bg-accent text-on-primary hover:bg-accent-light px-4 py-2 rounded-md text-sm font-medium
```
