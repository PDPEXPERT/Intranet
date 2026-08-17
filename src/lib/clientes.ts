import { supabase } from './supabase';
import type {
  CatalogoServicio,
  Cliente,
  ClienteInput,
  ContactoCliente,
  ContactoClienteInput,
  EmpresaHolding,
  ServicioCliente,
  ServicioClienteConCatalogo,
  ServicioClienteInput,
  TipoContacto,
} from './types';

const CLIENTE_COLUMNS =
  'id, razon_social, nombre_comercial, tax_id, pais, id_empresa, moneda, estado, es_aliado, created_at, updated_at';

const CONTACTO_COLUMNS =
  'id, id_cliente, nombre, cargo, email, telefono, id_tipo_contacto, es_principal, notas, created_at, updated_at';

const SERVICIO_CLIENTE_COLUMNS =
  'id, id_cliente, id_servicio_tipo, estado, fecha_inicio, fecha_fin, notas, created_at, updated_at';

export async function listClientes(): Promise<Cliente[]> {
  const { data, error } = await supabase
    .from('clientes')
    .select(CLIENTE_COLUMNS)
    .order('nombre_comercial', { ascending: true });

  if (error) throw error;
  return (data as Cliente[] | null) ?? [];
}

export async function getClienteById(id: string): Promise<Cliente | null> {
  const { data, error } = await supabase
    .from('clientes')
    .select(CLIENTE_COLUMNS)
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return (data as Cliente | null) ?? null;
}

export async function createCliente(input: ClienteInput): Promise<Cliente> {
  const { data, error } = await supabase
    .from('clientes')
    .insert(input)
    .select(CLIENTE_COLUMNS)
    .single();

  if (error) throw error;
  return data as Cliente;
}

export async function updateCliente(
  id: string,
  input: ClienteInput,
): Promise<Cliente> {
  const { data, error } = await supabase
    .from('clientes')
    .update(input)
    .eq('id', id)
    .select(CLIENTE_COLUMNS)
    .single();

  if (error) throw error;
  return data as Cliente;
}

export async function listEmpresasHolding(): Promise<EmpresaHolding[]> {
  const { data, error } = await supabase
    .from('empresas_holding')
    .select('id, razon_social, pais')
    .order('id', { ascending: true });

  if (error) throw error;
  return (data as EmpresaHolding[] | null) ?? [];
}

export async function listTiposContacto(): Promise<TipoContacto[]> {
  const { data, error } = await supabase
    .from('tipos_contacto')
    .select('id, nombre')
    .order('nombre', { ascending: true });

  if (error) throw error;
  return (data as TipoContacto[] | null) ?? [];
}

export async function listContactosByCliente(
  clienteId: string,
): Promise<ContactoCliente[]> {
  const { data, error } = await supabase
    .from('contactos_cliente')
    .select(CONTACTO_COLUMNS)
    .eq('id_cliente', clienteId)
    .order('es_principal', { ascending: false })
    .order('nombre', { ascending: true });

  if (error) throw error;
  return (data as ContactoCliente[] | null) ?? [];
}

export async function createContactoCliente(
  clienteId: string,
  input: ContactoClienteInput,
): Promise<ContactoCliente> {
  const { data, error } = await supabase
    .from('contactos_cliente')
    .insert({ ...input, id_cliente: clienteId })
    .select(CONTACTO_COLUMNS)
    .single();

  if (error) throw error;
  return data as ContactoCliente;
}

export async function updateContactoCliente(
  id: string,
  input: ContactoClienteInput,
): Promise<ContactoCliente> {
  const { data, error } = await supabase
    .from('contactos_cliente')
    .update(input)
    .eq('id', id)
    .select(CONTACTO_COLUMNS)
    .single();

  if (error) throw error;
  return data as ContactoCliente;
}

export async function deleteContactoCliente(id: string): Promise<void> {
  const { error } = await supabase
    .from('contactos_cliente')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ============================================================
// Servicios contratados (migración 004)
// ============================================================

export async function listCatalogoServicios(): Promise<CatalogoServicio[]> {
  const { data, error } = await supabase
    .from('catalogo_servicios')
    .select('id, nombre, modo, activo')
    .order('nombre', { ascending: true });

  if (error) throw error;
  return (data as CatalogoServicio[] | null) ?? [];
}

export async function listServiciosByCliente(
  clienteId: string,
): Promise<ServicioClienteConCatalogo[]> {
  const { data, error } = await supabase
    .from('servicios_cliente')
    .select(
      `${SERVICIO_CLIENTE_COLUMNS}, catalogo_servicios ( nombre, modo )`,
    )
    .eq('id_cliente', clienteId)
    .order('estado', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) throw error;
  return ((data as unknown[] | null) ?? []).map((row) => {
    const r = row as ServicioCliente & {
      catalogo_servicios: { nombre: string; modo: 'Recurrente' | 'Proyecto' } | null;
    };
    return {
      ...r,
      nombre_servicio: r.catalogo_servicios?.nombre ?? r.id_servicio_tipo,
      modo: r.catalogo_servicios?.modo ?? 'Proyecto',
    };
  });
}

export async function createServicioCliente(
  clienteId: string,
  input: ServicioClienteInput,
): Promise<ServicioCliente> {
  const { data, error } = await supabase
    .from('servicios_cliente')
    .insert({ ...input, id_cliente: clienteId })
    .select(SERVICIO_CLIENTE_COLUMNS)
    .single();

  if (error) throw error;
  return data as ServicioCliente;
}

export async function updateServicioCliente(
  id: string,
  input: ServicioClienteInput,
): Promise<ServicioCliente> {
  const { data, error } = await supabase
    .from('servicios_cliente')
    .update(input)
    .eq('id', id)
    .select(SERVICIO_CLIENTE_COLUMNS)
    .single();

  if (error) throw error;
  return data as ServicioCliente;
}

/**
 * Traduce errores de Postgres/PostgREST del modulo Clientes a mensajes
 * legibles en español. Cubre los casos probados en la migracion 003:
 * constraint de moneda, tax_id duplicado y bloqueo por RLS (rol sin
 * permiso de escritura). Migracion 004 (servicios_cliente) agrega el
 * caso de servicio activo duplicado.
 */
export function friendlyClienteError(error: unknown): string {
  const err = error as {
    code?: string;
    message?: string;
    details?: string | null;
  } | null;

  const message = err?.message ?? '';
  const code = err?.code ?? '';

  // RLS: la politica "with check" bloquea el insert/update/delete.
  // PostgREST devuelve 42501 (insufficient_privilege) cuando la policy falla.
  if (code === '42501' || /row-level security|permission denied/i.test(message)) {
    return 'No tienes permiso para hacer este cambio. Este modulo solo permite escritura a jefatura de operaciones, gerencia y administracion.';
  }

  // Unique violation. Distinguimos tax_id de otros posibles indices unicos.
  if (code === '23505' || /duplicate key value/i.test(message)) {
    if (/tax_id/i.test(message) || /uq_clientes_tax_id/i.test(message)) {
      return 'Ya existe un cliente registrado con ese numero de identificacion tributaria (RUC/RUT/NIT).';
    }
    if (/uq_servicios_cliente_activo/i.test(message)) {
      return 'Este cliente ya tiene ese servicio activo. Cancela el existente antes de crear uno nuevo, o edita el registro actual.';
    }
    return 'Ya existe un registro con ese valor unico.';
  }

  // Check constraint: moneda o estado fuera de los valores permitidos.
  if (code === '23514' || /violates check constraint/i.test(message)) {
    if (/clientes_moneda_check|moneda/i.test(message)) {
      return 'La moneda debe ser USD o CLP.';
    }
    if (/clientes_estado_check|estado/i.test(message)) {
      return 'El estado debe ser Activo o Cancelado.';
    }
    if (/catalogo_servicios_modo_check|modo/i.test(message)) {
      return 'El modo del servicio debe ser Recurrente o Proyecto.';
    }
    return 'Uno de los valores ingresados no es valido.';
  }

  // Foreign key: id_empresa o id_tipo_contacto inexistente, o intento de
  // borrar una empresa_holding referenciada por clientes (on delete restrict).
  if (code === '23503' || /violates foreign key constraint/i.test(message)) {
    if (/id_empresa/i.test(message)) {
      return 'La empresa del holding seleccionada no es valida.';
    }
    if (/id_tipo_contacto/i.test(message)) {
      return 'El tipo de contacto seleccionado no es valido.';
    }
    if (/id_servicio_tipo/i.test(message)) {
      return 'El servicio seleccionado no es valido.';
    }
    return 'Esta operacion hace referencia a un registro relacionado que no existe o no se puede modificar.';
  }

  // Not null violation en campos requeridos.
  if (code === '23502' || /null value in column/i.test(message)) {
    return 'Falta completar un campo obligatorio.';
  }

  return message || 'Ocurrio un error inesperado al guardar. Intenta nuevamente.';
}
