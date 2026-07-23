export type NivelJerarquico =
  | 'direccion'
  | 'gerencia'
  | 'jefatura'
  | 'coordinacion'
  | 'operativo';

export type TipoOcupante = 'interno' | 'externalizado' | 'vacante';

export type ConfianzaReportaA = 'alta' | 'inferida' | null;

export interface Ocupante {
  tipo: TipoOcupante;
  nombre_o_iniciales?: string | null;
  headcount?: number | null;
  proveedor?: string | null;
  ubicacion?: string | null;
}

export interface FuncionEsencial {
  descripcion: string;
  critica: boolean;
}

export interface Cargo {
  codigo_cargo: string;
  titulo_cargo: string;
  area_departamento?: string;
  nivel_jerarquico: NivelJerarquico;
  reporta_a: string | null;
  confianza_reporta_a: ConfianzaReportaA;
  cargos_que_supervisa: string[];
  mision_cargo: string;
  contexto_area?: string;
  funciones_esenciales: FuncionEsencial[];
  ocupante?: Ocupante;
  notas?: string;
  [key: string]: unknown;
}

export interface Organigrama {
  organizacion: string;
  version: string;
  fecha_actualizacion: string;
  fuente?: string;
  nota_metodologica?: string;
  hallazgos_detectados?: string[];
  cargos: Cargo[];
}

export function cargosPorCodigo(data: Organigrama): Record<string, Cargo> {
  const map: Record<string, Cargo> = {};
  data.cargos.forEach((c) => {
    map[c.codigo_cargo] = c;
  });
  return map;
}

export function raices(data: Organigrama, porCodigo: Record<string, Cargo>): Cargo[] {
  return data.cargos.filter((c) => !c.reporta_a || !porCodigo[c.reporta_a]);
}

export function hijosDe(data: Organigrama, codigo: string): Cargo[] {
  return data.cargos.filter((c) => c.reporta_a === codigo);
}

export function textoOcupante(cargo: Cargo): string {
  const oc = cargo.ocupante;
  if (!oc) return '';
  if (oc.tipo === 'vacante') return 'Vacante';
  let texto: string;
  if (oc.tipo === 'externalizado') {
    texto = oc.proveedor || 'Externalizado';
  } else {
    texto = oc.nombre_o_iniciales || 'Sin nombre asignado';
  }
  if (oc.headcount && oc.headcount > 1) {
    texto += ` · ${oc.headcount} personas`;
  }
  return texto;
}
