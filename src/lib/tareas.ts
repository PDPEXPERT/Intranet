import { supabase } from './supabase';
import type { Tarea, TareaConOrigen, TareaInput } from './types';

const TAREA_COLUMNS =
  'id, consultor, descripcion, fecha, estado, id_actividad, id_ticket, created_at, updated_at';

/**
 * Lista tareas, opcionalmente filtradas por consultor (para "Mis
 * tareas") y/o por actividad de plan (para mostrar tareas de una
 * actividad dentro de la vista de plan). Enriquece con el nombre de la
 * actividad de origen cuando id_actividad no es null; las tareas
 * sueltas o de ticket (id_ticket, hoy siempre null: ver comentario en
 * la migración 005) quedan con origen_nombre = null.
 */
export async function listTareas(filters?: {
  consultor?: string;
  idActividad?: string;
}): Promise<TareaConOrigen[]> {
  let query = supabase.from('tareas').select(TAREA_COLUMNS);

  if (filters?.consultor) {
    query = query.eq('consultor', filters.consultor);
  }
  if (filters?.idActividad) {
    query = query.eq('id_actividad', filters.idActividad);
  }

  const { data, error } = await query
    .order('fecha', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) throw error;
  const tareas = (data as Tarea[] | null) ?? [];

  const idsActividad = Array.from(
    new Set(tareas.map((t) => t.id_actividad).filter((id): id is string => !!id)),
  );

  let nombresPorActividad = new Map<string, string>();
  if (idsActividad.length > 0) {
    const { data: actividadesData, error: actividadesError } = await supabase
      .from('planes_actividades')
      .select('id, nombre')
      .in('id', idsActividad);
    if (actividadesError) throw actividadesError;
    nombresPorActividad = new Map(
      ((actividadesData as { id: string; nombre: string }[] | null) ?? []).map((a) => [
        a.id,
        a.nombre,
      ]),
    );
  }

  return tareas.map((t) => ({
    ...t,
    origen_nombre: t.id_actividad
      ? (nombresPorActividad.get(t.id_actividad) ?? null)
      : null,
  }));
}

export async function createTarea(input: TareaInput): Promise<Tarea> {
  const { data, error } = await supabase
    .from('tareas')
    .insert(input)
    .select(TAREA_COLUMNS)
    .single();

  if (error) throw error;
  return data as Tarea;
}

export async function updateTarea(id: string, input: TareaInput): Promise<Tarea> {
  const { data, error } = await supabase
    .from('tareas')
    .update(input)
    .eq('id', id)
    .select(TAREA_COLUMNS)
    .single();

  if (error) throw error;
  return data as Tarea;
}

export async function deleteTarea(id: string): Promise<void> {
  const { error } = await supabase.from('tareas').delete().eq('id', id);
  if (error) throw error;
}

/**
 * Traduce errores de Postgres/PostgREST de Tareas a mensajes legibles
 * en español. El caso más importante es chk_tarea_origen_exclusivo: la
 * regla de "una tarea viene de una actividad, de un ticket, o de
 * ninguno, pero nunca de los dos a la vez" (ver migración 005).
 */
export function friendlyTareaError(error: unknown): string {
  const err = error as {
    code?: string;
    message?: string;
    details?: string | null;
  } | null;

  const message = err?.message ?? '';
  const code = err?.code ?? '';

  if (code === '42501' || /row-level security|permission denied/i.test(message)) {
    return 'No tienes permiso para hacer este cambio en tareas.';
  }

  if (code === '23514' || /violates check constraint/i.test(message)) {
    if (/chk_tarea_origen_exclusivo/i.test(message)) {
      return 'Una tarea no puede venir de una actividad y de un ticket al mismo tiempo. Elige un solo origen, o ninguno para una tarea suelta.';
    }
    if (/tareas_estado_check|estado/i.test(message)) {
      return 'El estado de la tarea debe ser Pendiente, En progreso o Completada.';
    }
    return 'Uno de los valores ingresados no es válido.';
  }

  if (code === '23503' || /violates foreign key constraint/i.test(message)) {
    if (/id_actividad/i.test(message)) {
      return 'La actividad seleccionada no es válida.';
    }
    return 'Esta operación hace referencia a un registro relacionado que no existe.';
  }

  if (code === '23502' || /null value in column/i.test(message)) {
    return 'Falta completar un campo obligatorio (descripción, consultor o fecha).';
  }

  return message || 'Ocurrió un error inesperado al guardar. Intenta nuevamente.';
}
