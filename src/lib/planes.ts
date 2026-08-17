import { supabase } from './supabase';
import type {
  Plan,
  PlanActividad,
  PlanActividadInput,
  PlanConJerarquia,
  PlanIniciativa,
  PlanIniciativaDependencia,
  PlanIniciativaDependenciaInput,
  PlanIniciativaInput,
  PlanInput,
  PlanLineaTrabajo,
  PlanLineaTrabajoInput,
} from './types';

const PLAN_COLUMNS =
  'id, id_cliente, id_servicio_cliente, nombre, fecha_inicio, fecha_fin_estimada, estado, created_at, updated_at';

const LINEA_COLUMNS = 'id, id_plan, nombre, objetivo, orden, created_at, updated_at';

const INICIATIVA_COLUMNS =
  'id, id_linea_trabajo, nombre, objetivo, prioridad, responsable_coordinacion, duracion_semanas_estimada, horas_coordinacion_estimadas, horas_equipo_estimadas, entradas, resultados_esperados, subelemento_mmi, orden, created_at, updated_at';

const DEPENDENCIA_COLUMNS =
  'id, id_iniciativa, id_iniciativa_depende, descripcion, created_at';

const ACTIVIDAD_COLUMNS =
  'id, id_iniciativa, nombre, responsable, fecha_inicio, fecha_fin, estado, entradas, salidas, orden, created_at, updated_at';

export async function listPlanesByCliente(clienteId: string): Promise<Plan[]> {
  const { data, error } = await supabase
    .from('planes')
    .select(PLAN_COLUMNS)
    .eq('id_cliente', clienteId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data as Plan[] | null) ?? [];
}

export async function getPlanById(id: string): Promise<Plan | null> {
  const { data, error } = await supabase
    .from('planes')
    .select(PLAN_COLUMNS)
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return (data as Plan | null) ?? null;
}

export async function createPlan(input: PlanInput): Promise<Plan> {
  const { data, error } = await supabase
    .from('planes')
    .insert(input)
    .select(PLAN_COLUMNS)
    .single();

  if (error) throw error;
  return data as Plan;
}

export async function updatePlan(id: string, input: PlanInput): Promise<Plan> {
  const { data, error } = await supabase
    .from('planes')
    .update(input)
    .eq('id', id)
    .select(PLAN_COLUMNS)
    .single();

  if (error) throw error;
  return data as Plan;
}

/**
 * Carga la jerarquía completa de un plan (líneas -> iniciativas ->
 * actividades) en 3 consultas (una por tabla, filtradas por id_plan /
 * ids de líneas / ids de iniciativas) y la ensambla en el cliente. Se
 * evita un solo select anidado de Supabase de 3 niveles porque el
 * ordenamiento (orden, luego nombre) es más simple de aplicar por tabla
 * que dentro de un embed anidado.
 */
export async function getPlanConJerarquia(
  planId: string,
): Promise<PlanConJerarquia | null> {
  const plan = await getPlanById(planId);
  if (!plan) return null;

  const { data: lineasData, error: lineasError } = await supabase
    .from('planes_lineas_trabajo')
    .select(LINEA_COLUMNS)
    .eq('id_plan', planId)
    .order('orden', { ascending: true });
  if (lineasError) throw lineasError;
  const lineas = (lineasData as PlanLineaTrabajo[] | null) ?? [];

  if (lineas.length === 0) {
    return { ...plan, lineas: [] };
  }

  const lineaIds = lineas.map((l) => l.id);
  const { data: iniciativasData, error: iniciativasError } = await supabase
    .from('planes_iniciativas')
    .select(INICIATIVA_COLUMNS)
    .in('id_linea_trabajo', lineaIds)
    .order('orden', { ascending: true });
  if (iniciativasError) throw iniciativasError;
  const iniciativas = (iniciativasData as PlanIniciativa[] | null) ?? [];

  const iniciativaIds = iniciativas.map((i) => i.id);
  let actividades: PlanActividad[] = [];
  if (iniciativaIds.length > 0) {
    const { data: actividadesData, error: actividadesError } = await supabase
      .from('planes_actividades')
      .select(ACTIVIDAD_COLUMNS)
      .in('id_iniciativa', iniciativaIds)
      .order('orden', { ascending: true });
    if (actividadesError) throw actividadesError;
    actividades = (actividadesData as PlanActividad[] | null) ?? [];
  }

  return {
    ...plan,
    lineas: lineas.map((linea) => ({
      ...linea,
      iniciativas: iniciativas
        .filter((ini) => ini.id_linea_trabajo === linea.id)
        .map((ini) => ({
          ...ini,
          actividades: actividades.filter((act) => act.id_iniciativa === ini.id),
        })),
    })),
  };
}

// ============================================================
// Líneas de trabajo
// ============================================================

export async function createLineaTrabajo(
  planId: string,
  input: PlanLineaTrabajoInput,
): Promise<PlanLineaTrabajo> {
  const { data, error } = await supabase
    .from('planes_lineas_trabajo')
    .insert({ ...input, id_plan: planId })
    .select(LINEA_COLUMNS)
    .single();

  if (error) throw error;
  return data as PlanLineaTrabajo;
}

export async function updateLineaTrabajo(
  id: string,
  input: PlanLineaTrabajoInput,
): Promise<PlanLineaTrabajo> {
  const { data, error } = await supabase
    .from('planes_lineas_trabajo')
    .update(input)
    .eq('id', id)
    .select(LINEA_COLUMNS)
    .single();

  if (error) throw error;
  return data as PlanLineaTrabajo;
}

export async function deleteLineaTrabajo(id: string): Promise<void> {
  const { error } = await supabase.from('planes_lineas_trabajo').delete().eq('id', id);
  if (error) throw error;
}

// ============================================================
// Iniciativas
// ============================================================

export async function createIniciativa(
  lineaId: string,
  input: PlanIniciativaInput,
): Promise<PlanIniciativa> {
  const { data, error } = await supabase
    .from('planes_iniciativas')
    .insert({ ...input, id_linea_trabajo: lineaId })
    .select(INICIATIVA_COLUMNS)
    .single();

  if (error) throw error;
  return data as PlanIniciativa;
}

export async function updateIniciativa(
  id: string,
  input: PlanIniciativaInput,
): Promise<PlanIniciativa> {
  const { data, error } = await supabase
    .from('planes_iniciativas')
    .update(input)
    .eq('id', id)
    .select(INICIATIVA_COLUMNS)
    .single();

  if (error) throw error;
  return data as PlanIniciativa;
}

export async function deleteIniciativa(id: string): Promise<void> {
  const { error } = await supabase.from('planes_iniciativas').delete().eq('id', id);
  if (error) throw error;
}

export async function listDependenciasByIniciativa(
  iniciativaId: string,
): Promise<PlanIniciativaDependencia[]> {
  const { data, error } = await supabase
    .from('planes_iniciativa_dependencias')
    .select(DEPENDENCIA_COLUMNS)
    .eq('id_iniciativa', iniciativaId);

  if (error) throw error;
  return (data as PlanIniciativaDependencia[] | null) ?? [];
}

export async function createDependenciaIniciativa(
  iniciativaId: string,
  input: PlanIniciativaDependenciaInput,
): Promise<PlanIniciativaDependencia> {
  const { data, error } = await supabase
    .from('planes_iniciativa_dependencias')
    .insert({ ...input, id_iniciativa: iniciativaId })
    .select(DEPENDENCIA_COLUMNS)
    .single();

  if (error) throw error;
  return data as PlanIniciativaDependencia;
}

export async function deleteDependenciaIniciativa(id: string): Promise<void> {
  const { error } = await supabase
    .from('planes_iniciativa_dependencias')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// ============================================================
// Actividades
// ============================================================

export async function createActividad(
  iniciativaId: string,
  input: PlanActividadInput,
): Promise<PlanActividad> {
  const { data, error } = await supabase
    .from('planes_actividades')
    .insert({ ...input, id_iniciativa: iniciativaId })
    .select(ACTIVIDAD_COLUMNS)
    .single();

  if (error) throw error;
  return data as PlanActividad;
}

export async function updateActividad(
  id: string,
  input: PlanActividadInput,
): Promise<PlanActividad> {
  const { data, error } = await supabase
    .from('planes_actividades')
    .update(input)
    .eq('id', id)
    .select(ACTIVIDAD_COLUMNS)
    .single();

  if (error) throw error;
  return data as PlanActividad;
}

export async function deleteActividad(id: string): Promise<void> {
  const { error } = await supabase.from('planes_actividades').delete().eq('id', id);
  if (error) throw error;
}

/**
 * Traduce errores de Postgres/PostgREST del plan de implementación a
 * mensajes legibles en español. Mismo criterio que friendlyClienteError
 * en clientes.ts.
 */
export function friendlyPlanError(error: unknown): string {
  const err = error as {
    code?: string;
    message?: string;
    details?: string | null;
  } | null;

  const message = err?.message ?? '';
  const code = err?.code ?? '';

  if (code === '42501' || /row-level security|permission denied/i.test(message)) {
    return 'No tienes permiso para hacer este cambio en el plan de implementación.';
  }

  if (code === '23505' || /duplicate key value/i.test(message)) {
    if (/uq_iniciativa_dependencia/i.test(message)) {
      return 'Esa dependencia entre iniciativas ya está registrada.';
    }
    return 'Ya existe un registro con ese valor único.';
  }

  if (code === '23514' || /violates check constraint/i.test(message)) {
    if (/planes_estado_check|estado/i.test(message)) {
      return 'El estado del plan no es válido.';
    }
    if (/prioridad/i.test(message)) {
      return 'La prioridad debe ser ALTA, MEDIA o BAJA.';
    }
    if (/planes_actividades_estado_check/i.test(message)) {
      return 'El estado de la actividad debe ser No iniciado, En progreso o Completado.';
    }
    if (/chk_iniciativa_dependencia_no_autorreferencia/i.test(message)) {
      return 'Una iniciativa no puede depender de sí misma.';
    }
    return 'Uno de los valores ingresados no es válido.';
  }

  if (code === '23503' || /violates foreign key constraint/i.test(message)) {
    return 'Esta operación hace referencia a un registro relacionado que no existe o no se puede modificar.';
  }

  if (code === '23502' || /null value in column/i.test(message)) {
    return 'Falta completar un campo obligatorio.';
  }

  return message || 'Ocurrió un error inesperado al guardar. Intenta nuevamente.';
}
