/**
 * Registry del módulo "Gestión del Conocimiento" (Knowledge Management &
 * Engineering).
 *
 * Este módulo es un entorno de CONSULTA/NAVEGACIÓN: un mapa de los
 * componentes del sistema de gestión del conocimiento de la organización
 * (dónde vive qué, qué procesos lo mantienen, qué herramientas lo soportan).
 * No es el repositorio de los activos de conocimiento en sí — solo apunta
 * hacia ellos.
 *
 * Cómo cargar contenido:
 *   Agregar objetos a `COMPONENTS` con la categoría correspondiente. La
 *   página índice y las subpáginas de categoría se arman solas a partir de
 *   este arreglo — no hace falta tocar los .tsx de las páginas para sumar
 *   componentes nuevos.
 */

export type ComponentCategory =
  | 'repositorios-fuentes'
  | 'procesos-flujos'
  | 'herramientas-sistemas'
  | 'mapa-conocimiento';

export type ComponentStatus = 'activo' | 'en-construccion' | 'deprecado';

export interface CategoryMeta {
  slug: ComponentCategory;
  label: string;
  description: string;
}

export interface KMComponent {
  /** Identificador corto y estable, usado como key. Ej: 'sharepoint-normas'. */
  code: string;
  category: ComponentCategory;
  name: string;
  description: string;
  /** Enlace directo al recurso (SharePoint, repo, herramienta, etc.), si aplica. */
  link?: string;
  /** Responsable del componente (persona o rol), si aplica. */
  owner?: string;
  status?: ComponentStatus;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    slug: 'repositorios-fuentes',
    label: 'Repositorios y fuentes',
    description:
      'Dónde vive el conocimiento: SharePoint, Drive, wikis, bases normativas, repositorios de código, etc.',
  },
  {
    slug: 'procesos-flujos',
    label: 'Procesos y flujos de KM',
    description:
      'Cómo se captura, valida, actualiza y retira el conocimiento a lo largo de su ciclo de vida.',
  },
  {
    slug: 'herramientas-sistemas',
    label: 'Herramientas y sistemas técnicos',
    description:
      'El stack que soporta la gestión del conocimiento: bases de datos, integraciones, MCPs, skills.',
  },
  {
    slug: 'mapa-conocimiento',
    label: 'Mapa de conocimiento',
    description:
      'Vista general de los dominios de conocimiento de la organización y cómo se relacionan entre sí.',
  },
];

/**
 * Componentes registrados. Vacío por diseño: se va llenando poco a poco.
 * Ejemplo de cómo agregar uno (descomentar y adaptar):
 *
 * {
 *   code: 'sharepoint-normas',
 *   category: 'repositorios-fuentes',
 *   name: 'Repositorio de normas PDP',
 *   description: 'Base normativa consultable vía MCP Repositorio_normas_PDP.',
 *   owner: 'Fernando Balarezo',
 *   status: 'activo',
 * },
 */
export const COMPONENTS: KMComponent[] = [];

export function getCategoryMeta(slug: string): CategoryMeta | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getComponentsByCategory(slug: ComponentCategory): KMComponent[] {
  return COMPONENTS.filter((c) => c.category === slug);
}

export function getCategoriesWithCounts(): (CategoryMeta & { count: number })[] {
  return CATEGORIES.map((cat) => ({
    ...cat,
    count: COMPONENTS.filter((c) => c.category === cat.slug).length,
  }));
}
