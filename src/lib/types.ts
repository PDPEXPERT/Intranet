export type ProcedurePart = 'compartidos' | 'servicio';

export interface Responsibility {
  role: string;
  responsibility: string;
  authority: string;
}

export interface Input {
  input: string;
  origin: string;
  condition: string;
}

export interface Output {
  output: string;
  recipient: string;
  format: string;
}

export interface Exception {
  id: number;
  title: string;
  situation: string;
  detection: string;
  handling: string;
}

export interface Control {
  control: string;
  activity: string;
  executor: string;
  frequency: string;
  failure_action: string;
}

export interface Risk {
  risk: string;
  description: string;
  activity: string;
  mitigation: string;
}

export interface Indicator {
  indicator: string;
  calculation: string;
  frequency: string;
  responsible: string;
  acceptable_value: string;
}

export interface Procedure {
  id: string;
  code: string;
  title: string;
  part: ProcedurePart;
  purpose: string;
  scope: string;
  sort_order: number;
  responsibilities: Responsibility[];
  inputs: Input[];
  outputs: Output[];
  exceptions: Exception[];
  controls: Control[];
  risks: Risk[];
  indicators: Indicator[];
}

export type ActivityType =
  | 'event_start'
  | 'activity'
  | 'decision'
  | 'event_end';

export interface ActivityOutcome {
  condition: string;
  next: string;
}

export interface Activity {
  id: string;
  procedure_id: string;
  sort_order: number;
  type: ActivityType;
  number: number | null;
  title: string;
  trigger: string | null;
  executor: string | null;
  description: string | null;
  result: string | null;
  evidence: string | null;
  outcomes: ActivityOutcome[] | null;
}

export interface ProcedureInvocationRow {
  id: string;
  caller_id: string;
  callee_id: string;
  context: string;
}

export interface InvocationLink {
  code: string;
  title: string;
  context: string;
}

export interface ProcedureSummary {
  code: string;
  title: string;
  part: ProcedurePart;
  sort_order: number;
  activity_count: number;
}

// ============================================================
// Modulo Operaciones: Clientes
// Columnas exactas de supabase/migrations/003_create_clientes.sql
// ============================================================

export type Moneda = 'USD' | 'CLP';
export type EstadoCliente = 'Activo' | 'Cancelado';

export interface EmpresaHolding {
  id: string;
  razon_social: string;
  pais: string;
}

export interface Cliente {
  id: string;
  razon_social: string;
  nombre_comercial: string;
  tax_id: string | null;
  pais: string | null;
  id_empresa: string | null;
  moneda: Moneda;
  estado: EstadoCliente;
  es_aliado: boolean;
  created_at: string;
  updated_at: string;
}

export interface ClienteInput {
  razon_social: string;
  nombre_comercial: string;
  tax_id: string | null;
  pais: string | null;
  id_empresa: string | null;
  moneda: Moneda;
  estado: EstadoCliente;
  es_aliado: boolean;
}

export interface TipoContacto {
  id: string;
  nombre: string;
}

export interface ContactoCliente {
  id: string;
  id_cliente: string;
  nombre: string;
  cargo: string | null;
  email: string | null;
  telefono: string | null;
  id_tipo_contacto: string;
  es_principal: boolean;
  notas: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContactoClienteInput {
  nombre: string;
  cargo: string | null;
  email: string | null;
  telefono: string | null;
  id_tipo_contacto: string;
  es_principal: boolean;
  notas: string | null;
}

// ============================================================
// Modulo Operaciones: Clientes — Servicios contratados
// Columnas exactas de supabase/migrations/004_create_servicios_cliente.sql
// ============================================================

export type ModoServicio = 'Recurrente' | 'Proyecto';
export type EstadoServicioCliente = 'Activo' | 'Cancelado';

export interface CatalogoServicio {
  id: string;
  nombre: string;
  modo: ModoServicio;
  activo: boolean;
}

export interface ServicioCliente {
  id: string;
  id_cliente: string;
  id_servicio_tipo: string;
  estado: EstadoServicioCliente;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  notas: string | null;
  created_at: string;
  updated_at: string;
}

export interface ServicioClienteInput {
  id_servicio_tipo: string;
  estado: EstadoServicioCliente;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  notas: string | null;
}

/** Servicio contratado enriquecido con el nombre/modo del catálogo, para mostrar directo en la ficha de cliente. */
export interface ServicioClienteConCatalogo extends ServicioCliente {
  nombre_servicio: string;
  modo: ModoServicio;
}

// ============================================================
// Modulo Operaciones: Plan de implementación y cumplimiento + Tareas
// Columnas exactas de supabase/migrations/005_create_planes_implementacion.sql
//
// Entradas/salidas/resultados_esperados/subelemento_mmi son jsonb en la
// base de datos: hoy siempre arreglos de texto libre (string[]), pero el
// tipo se deja abierto (unknown[] a nivel de fila cruda, string[] en la
// UI) porque el contenido puede estructurarse más adelante sin migración.
// ============================================================

export type EstadoPlan = 'Activo' | 'Pausado' | 'Completado' | 'Cancelado';
export type PrioridadIniciativa = 'ALTA' | 'MEDIA' | 'BAJA';
export type EstadoActividad = 'No iniciado' | 'En progreso' | 'Completado';
export type EstadoTarea = 'Pendiente' | 'En progreso' | 'Completada';

export interface Plan {
  id: string;
  id_cliente: string;
  id_servicio_cliente: string | null;
  nombre: string;
  fecha_inicio: string | null;
  fecha_fin_estimada: string | null;
  estado: EstadoPlan;
  created_at: string;
  updated_at: string;
}

export interface PlanInput {
  id_cliente: string;
  id_servicio_cliente: string | null;
  nombre: string;
  fecha_inicio: string | null;
  fecha_fin_estimada: string | null;
  estado: EstadoPlan;
}

export interface PlanLineaTrabajo {
  id: string;
  id_plan: string;
  nombre: string;
  objetivo: string | null;
  orden: number;
  created_at: string;
  updated_at: string;
}

export interface PlanLineaTrabajoInput {
  nombre: string;
  objetivo: string | null;
  orden: number;
}

export interface PlanIniciativa {
  id: string;
  id_linea_trabajo: string;
  nombre: string;
  objetivo: string | null;
  prioridad: PrioridadIniciativa | null;
  responsable_coordinacion: string | null;
  duracion_semanas_estimada: number | null;
  horas_coordinacion_estimadas: number | null;
  horas_equipo_estimadas: number | null;
  /** Arreglo de texto libre. Ver nota de módulo arriba. */
  entradas: string[];
  /** Arreglo de texto libre. Ver nota de módulo arriba. */
  resultados_esperados: string[];
  /** Códigos de subelemento MMI (ej. ["S2", "S28"]). Referencia externa, sin uso activo en este MVP. */
  subelemento_mmi: string[];
  orden: number;
  created_at: string;
  updated_at: string;
}

export interface PlanIniciativaInput {
  nombre: string;
  objetivo: string | null;
  prioridad: PrioridadIniciativa | null;
  responsable_coordinacion: string | null;
  duracion_semanas_estimada: number | null;
  horas_coordinacion_estimadas: number | null;
  horas_equipo_estimadas: number | null;
  entradas: string[];
  resultados_esperados: string[];
  subelemento_mmi: string[];
  orden: number;
}

export interface PlanIniciativaDependencia {
  id: string;
  id_iniciativa: string;
  id_iniciativa_depende: string;
  descripcion: string | null;
  created_at: string;
}

export interface PlanIniciativaDependenciaInput {
  id_iniciativa_depende: string;
  descripcion: string | null;
}

export interface PlanActividad {
  id: string;
  id_iniciativa: string;
  nombre: string;
  responsable: string | null;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  estado: EstadoActividad;
  /** Arreglo de texto libre. Ver nota de módulo arriba. */
  entradas: string[];
  /** Arreglo de texto libre. Ver nota de módulo arriba. */
  salidas: string[];
  orden: number;
  created_at: string;
  updated_at: string;
}

export interface PlanActividadInput {
  nombre: string;
  responsable: string | null;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  estado: EstadoActividad;
  entradas: string[];
  salidas: string[];
  orden: number;
}

/** Jerarquía completa de un plan, ensamblada en el cliente a partir de las 3 tablas. */
export interface PlanConJerarquia extends Plan {
  lineas: Array<
    PlanLineaTrabajo & {
      iniciativas: Array<
        PlanIniciativa & { actividades: PlanActividad[] }
      >;
    }
  >;
}

export interface Tarea {
  id: string;
  consultor: string;
  descripcion: string;
  fecha: string;
  estado: EstadoTarea;
  /** Actividad de plan de origen. Excluyente con id_ticket (chk_tarea_origen_exclusivo). */
  id_actividad: string | null;
  /** Ticket de origen. El módulo de Tickets no existe todavía: siempre null por ahora. */
  id_ticket: string | null;
  created_at: string;
  updated_at: string;
}

export interface TareaInput {
  consultor: string;
  descripcion: string;
  fecha: string;
  estado: EstadoTarea;
  id_actividad: string | null;
  id_ticket: string | null;
}

/** Tarea enriquecida con el nombre de la actividad/iniciativa/plan de origen, para mostrar en "Mis tareas" sin joins manuales repetidos. */
export interface TareaConOrigen extends Tarea {
  origen_nombre: string | null;
}
