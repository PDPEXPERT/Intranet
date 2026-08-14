import { supabase } from './supabase';
import type {
  Cliente,
  ClienteInput,
  ContactoCliente,
  ContactoClienteInput,
  EmpresaHolding,
  TipoContacto,
} from './types';

const CLIENTE_COLUMNS =
  'id, razon_social, nombre_comercial, tax_id, pais, id_empresa, moneda, estado, es_aliado, created_at, updated_at';

const CONTACTO_COLUMNS =
  'id, id_cliente, nombre, cargo, email, telefono, id_tipo_contacto, es_principal, notas, created_at, updated_at';

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

/**
 * Traduce errores de Postgres/PostgREST del modulo Clientes a mensajes
 * legibles en español. Cubre los casos probados en la migracion 003:
 * constraint de moneda, tax_id duplicado y bloqueo por RLS (rol sin
 * permiso de escritura).
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
    return 'Esta operacion hace referencia a un registro relacionado que no existe o no se puede modificar.';
  }

  // Not null violation en campos requeridos.
  if (code === '23502' || /null value in column/i.test(message)) {
    return 'Falta completar un campo obligatorio.';
  }

  return message || 'Ocurrio un error inesperado al guardar. Intenta nuevamente.';
}
