// Modelo de datos del organigrama v2.x (roles / posiciones / asignaciones / organos).
// El JSON contiene dos modelos hermanos en un archivo (organigrama + descriptivo de
// cargo), alineados a las fichas MOD-org-001 y MOD-org-002 y al vocabulario W3C ORG.
// Esta capa tipa el JSON crudo y lo adapta a un arbol renderizable por el visor.

export type NivelJerarquico =
  | 'direccion'
  | 'gerencia'
  | 'jefatura'
  | 'coordinacion'
  | 'operativo';

export type TipoVinculo = 'interna' | 'staff_augmentation' | 'managed_service';
export type EstadoPosicion = 'ocupada' | 'vacante' | 'provista_externamente';
export type ConfianzaVinculo = 'alta' | 'inferida';
export type TipoVinculoSuperior = 'mando' | 'servicio';

export interface ClasificacionIsco {
  codigo: string;
  grupo_principal?: string;
  subgrupo_principal?: string;
  grupo_menor?: string;
  grupo_unitario?: string;
  confianza?: string;
}

export interface PerfilProfesional {
  esquema: string;
  perfil: string;
  referencia: string | null;
  primario: boolean;
}

export interface FuncionEsencial {
  descripcion: string;
  critica: boolean;
}

export interface Requisitos {
  formacion?: string;
  experiencia?: string;
  certificaciones?: string;
}

export interface Rol {
  codigo_rol: string;
  titulo: string;
  nombre_estandarizado?: string;
  terminos_alternativos?: string[];
  clasificacion_isco?: ClasificacionIsco;
  perfiles_profesionales?: PerfilProfesional[];
  mision?: string;
  funciones_esenciales?: FuncionEsencial[];
  competencias?: { esenciales?: string[]; opcionales?: string[] };
  requisitos?: Requisitos;
  indicadores_desempeno?: string[];
  entregables?: string[];
  descriptivo_externo_ref?: string | null;
  contexto?: string | null;
  notas?: string | null;
}

export interface VinculoSuperior {
  ref: string;
  tipo: TipoVinculoSuperior;
}

export interface Posicion {
  codigo_posicion: string;
  rol_ref: string;
  titulo_posicion: string;
  area_departamento?: string;
  nivel_jerarquico: NivelJerarquico;
  estado: EstadoPosicion;
  tipo_vinculo: TipoVinculo;
  ubicacion?: string | null;
  vinculo_superior: VinculoSuperior | null;
  rol_retenido_ref?: string | null;
  confianza_vinculo?: ConfianzaVinculo;
  proveedor?: string | null;
  notas?: string | null;
}

export interface Ocupante {
  tipo: 'persona_interna' | 'persona_externa' | 'proveedor';
  nombre_o_iniciales?: string | null;
  proveedor?: string | null;
}

export interface Asignacion {
  codigo_asignacion: string;
  posicion_ref: string;
  ocupante: Ocupante;
}

export interface Organo {
  codigo_organo: string;
  titulo: string;
  tipo?: string;
  descripcion?: string;
  miembros_ref?: string[];
  asesora_a_ref?: string | null;
  notas?: string | null;
}

export interface Organigrama {
  organizacion: string;
  version: string;
  fecha_actualizacion: string;
  fuente?: string;
  nota_metodologica?: string;
  hallazgos_detectados?: string[];
  roles: Rol[];
  posiciones: Posicion[];
  asignaciones: Asignacion[];
  organos?: Organo[];
}

// Nodo del arbol que consume el visor. Une posicion + rol + ocupante, o representa
// un organo asesor colgado de la posicion a la que asesora.
export interface NodoArbol {
  tipo: 'posicion' | 'organo';
  id: string;
  titulo: string;
  codigo: string;
  area?: string;
  nivel?: NivelJerarquico;
  ocupanteTexto: string;
  esVacante: boolean;
  esExternalizada: boolean;
  esInferida: boolean;
  lineaServicio: boolean;
  posicion?: Posicion;
  rol?: Rol;
  organo?: Organo;
  hijos: NodoArbol[];
}

export interface ArbolOrganigrama {
  raices: NodoArbol[];
  roles: Record<string, Rol>;
  posiciones: Record<string, Posicion>;
}

export const ETIQUETA_VINCULO: Record<TipoVinculo, string> = {
  interna: 'Interna',
  staff_augmentation: 'Externalizada (staff augmentation)',
  managed_service: 'Externalizada (managed service)',
};

function textoOcupante(pos: Posicion, ocupante: Ocupante | undefined): string {
  if (pos.estado === 'vacante') return 'Vacante';
  if (!ocupante) return pos.proveedor ?? '';
  if (ocupante.tipo === 'proveedor') return ocupante.proveedor ?? 'Externalizado';
  const nombre = ocupante.nombre_o_iniciales ?? 'Sin nombre asignado';
  return ocupante.proveedor ? `${nombre} (${ocupante.proveedor})` : nombre;
}

export function construirArbol(data: Organigrama): ArbolOrganigrama {
  const roles: Record<string, Rol> = {};
  data.roles.forEach((r) => {
    roles[r.codigo_rol] = r;
  });

  const posiciones: Record<string, Posicion> = {};
  data.posiciones.forEach((p) => {
    posiciones[p.codigo_posicion] = p;
  });

  const ocupantePorPos: Record<string, Ocupante> = {};
  data.asignaciones.forEach((a) => {
    ocupantePorPos[a.posicion_ref] = a.ocupante;
  });

  const organosPorPos: Record<string, Organo[]> = {};
  (data.organos ?? []).forEach((o) => {
    if (!o.asesora_a_ref) return;
    (organosPorPos[o.asesora_a_ref] ??= []).push(o);
  });

  function nodoPosicion(pos: Posicion): NodoArbol {
    const rol = roles[pos.rol_ref];
    const externalizada =
      pos.tipo_vinculo === 'staff_augmentation' || pos.tipo_vinculo === 'managed_service';
    const hijosPos = data.posiciones
      .filter((p) => p.vinculo_superior?.ref === pos.codigo_posicion)
      .map(nodoPosicion);
    const hijosOrg = (organosPorPos[pos.codigo_posicion] ?? []).map(nodoOrgano);

    return {
      tipo: 'posicion',
      id: pos.codigo_posicion,
      titulo: pos.titulo_posicion || rol?.titulo || pos.codigo_posicion,
      codigo: rol?.codigo_rol ?? '',
      area: pos.area_departamento,
      nivel: pos.nivel_jerarquico,
      ocupanteTexto: textoOcupante(pos, ocupantePorPos[pos.codigo_posicion]),
      esVacante: pos.estado === 'vacante',
      esExternalizada: externalizada,
      esInferida: pos.confianza_vinculo === 'inferida',
      lineaServicio: pos.vinculo_superior?.tipo === 'servicio',
      posicion: pos,
      rol,
      hijos: [...hijosPos, ...hijosOrg],
    };
  }

  function nodoOrgano(org: Organo): NodoArbol {
    return {
      tipo: 'organo',
      id: org.codigo_organo,
      titulo: org.titulo,
      codigo: org.codigo_organo,
      ocupanteTexto: '',
      esVacante: false,
      esExternalizada: false,
      esInferida: false,
      lineaServicio: true,
      organo: org,
      hijos: [],
    };
  }

  const raices = data.posiciones
    .filter((p) => !p.vinculo_superior || !posiciones[p.vinculo_superior.ref])
    .map(nodoPosicion);

  return { raices, roles, posiciones };
}

export function tituloPosicion(posiciones: Record<string, Posicion>, roles: Record<string, Rol>, ref: string): string {
  const p = posiciones[ref];
  if (!p) return ref;
  return p.titulo_posicion || roles[p.rol_ref]?.titulo || ref;
}
