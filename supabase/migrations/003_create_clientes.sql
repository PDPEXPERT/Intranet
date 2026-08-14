-- ============================================================
-- Migración 003: Módulo Operaciones — Clientes (v1 del ERP)
-- Intranet PDP Expert
-- 2026-08-14
-- ============================================================
--
-- Alcance de esta migración: primera versión del módulo de Clientes.
-- Crea: empresas_holding, clientes, tipos_contacto, contactos_cliente.
--
-- Fuera de alcance por ahora (se migran en una siguiente entrega):
-- lineas_servicio, contratos_cliente, periodos_contrato, planes/
-- lineas_trabajo/iniciativas/actividades, tickets, entregables, tareas,
-- perfiles_operaciones.
--
-- Decisión de roles (2026-08-14): esta migración usa directamente
-- public.user_roles (ya en producción, migración 002) para las políticas
-- RLS. No se crea una tabla de roles paralela para Operaciones.
-- Roles con permiso de escritura sobre Clientes: jefe_operaciones,
-- gerente, admin.
--
-- Seguridad: cada tabla se crea con RLS habilitado y sus políticas en
-- este mismo archivo — la Intranet no tiene backend intermedio
-- (output: 'export', el navegador habla directo con Supabase).
-- ============================================================

-- ============================================================
-- 0. Función auxiliar: ¿el usuario autenticado tiene alguno de estos roles?
-- ============================================================
create or replace function public.tiene_rol(roles_permitidos text[])
returns boolean as $$
  select exists (
    select 1
    from public.user_roles ur
    where ur.email = auth.jwt() ->> 'email'
      and ur.role::text = any(roles_permitidos)
  );
$$ language sql stable security definer set search_path = public;

comment on function public.tiene_rol(text[]) is
  'Verifica si el usuario autenticado (por email del JWT) tiene alguno de los roles indicados en public.user_roles. Usada en políticas RLS del módulo Operaciones.';

-- ============================================================
-- 0.1 Trigger genérico de updated_at
-- ============================================================
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ============================================================
-- 1. empresas_holding
-- ============================================================
create table public.empresas_holding (
  id           text primary key,
  razon_social text not null,
  pais         text not null
);

comment on table public.empresas_holding is
  'Catálogo de entidades legales del holding que factura/opera a los clientes.';

insert into public.empresas_holding (id, razon_social, pais) values
  ('EC-1', 'PDPEXPERTEC S.A.S.', 'EC'),
  ('EC-2', 'Systemcheck S.A.S.', 'EC'),
  ('CL-1', 'SACI Solutions SpA', 'CL');

alter table public.empresas_holding enable row level security;

create policy "empresas_holding_select_authenticated"
  on public.empresas_holding for select
  to authenticated
  using (true);

create policy "empresas_holding_write_gerente"
  on public.empresas_holding for all
  to authenticated
  using (public.tiene_rol(array['gerente', 'admin']))
  with check (public.tiene_rol(array['gerente', 'admin']));

-- ============================================================
-- 2. clientes
-- ============================================================
create table public.clientes (
  id               uuid primary key default gen_random_uuid(),
  razon_social     text not null,
  nombre_comercial text not null,
  tax_id           text,
  pais             text,
  id_empresa       text references public.empresas_holding(id) on delete restrict,
  moneda           text not null check (moneda in ('USD', 'CLP')),
  estado           text not null default 'Activo' check (estado in ('Activo', 'Cancelado')),
  es_aliado        boolean not null default false,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

comment on table public.clientes is
  'Identidad y relación comercial de cada cliente. Hub del módulo Operaciones.';
comment on column public.clientes.tax_id is
  'RUC/RUT/NIT según jurisdicción. Opcional para permitir carga en fase de prospección.';
comment on column public.clientes.moneda is
  'Moneda de facturación. Atributo estable del cliente, no del contrato puntual.';

create unique index uq_clientes_tax_id on public.clientes (tax_id) where tax_id is not null;
create index idx_clientes_estado on public.clientes (estado);
create index idx_clientes_id_empresa on public.clientes (id_empresa);

create trigger trg_clientes_updated_at
  before update on public.clientes
  for each row execute function public.set_updated_at();

alter table public.clientes enable row level security;

create policy "clientes_select_authenticated"
  on public.clientes for select
  to authenticated
  using (true);

create policy "clientes_write_jefa_o_gerente"
  on public.clientes for all
  to authenticated
  using (public.tiene_rol(array['jefe_operaciones', 'gerente', 'admin']))
  with check (public.tiene_rol(array['jefe_operaciones', 'gerente', 'admin']));

-- ============================================================
-- 3. tipos_contacto
-- ============================================================
create table public.tipos_contacto (
  id     text primary key,
  nombre text not null
);

comment on table public.tipos_contacto is
  'Catálogo de finalidades de un contacto de cliente (servicio, comercial, etc.).';

insert into public.tipos_contacto (id, nombre) values
  ('servicio', 'Servicio'),
  ('administrativo_financiero', 'Administrativo financiero'),
  ('comercial', 'Comercial'),
  ('otro', 'Otro');

alter table public.tipos_contacto enable row level security;

create policy "tipos_contacto_select_authenticated"
  on public.tipos_contacto for select
  to authenticated
  using (true);

create policy "tipos_contacto_write_gerente"
  on public.tipos_contacto for all
  to authenticated
  using (public.tiene_rol(array['gerente', 'admin']))
  with check (public.tiene_rol(array['gerente', 'admin']));

-- ============================================================
-- 4. contactos_cliente
-- ============================================================
create table public.contactos_cliente (
  id                uuid primary key default gen_random_uuid(),
  id_cliente        uuid not null references public.clientes(id) on delete cascade,
  nombre            text not null,
  cargo             text,
  email             text,
  telefono          text,
  id_tipo_contacto  text not null references public.tipos_contacto(id),
  es_principal      boolean not null default false,
  notas             text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

comment on table public.contactos_cliente is
  'Puntos de contacto de un cliente. Un mismo contacto que cumple más de un fin se registra como una fila por combinación contacto+tipo. Sin constraint de unicidad de es_principal por tipo — se maneja en la UI.';

create index idx_contactos_cliente_id_cliente on public.contactos_cliente (id_cliente);
create index idx_contactos_cliente_id_tipo on public.contactos_cliente (id_tipo_contacto);

create trigger trg_contactos_cliente_updated_at
  before update on public.contactos_cliente
  for each row execute function public.set_updated_at();

alter table public.contactos_cliente enable row level security;

create policy "contactos_cliente_select_authenticated"
  on public.contactos_cliente for select
  to authenticated
  using (true);

create policy "contactos_cliente_write_jefa_o_gerente"
  on public.contactos_cliente for all
  to authenticated
  using (public.tiene_rol(array['jefe_operaciones', 'gerente', 'admin']))
  with check (public.tiene_rol(array['jefe_operaciones', 'gerente', 'admin']));
