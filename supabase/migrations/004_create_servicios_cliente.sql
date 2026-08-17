-- ============================================================
-- Migración 004: Módulo Operaciones — Clientes: Servicios contratados
-- Intranet PDP Expert
-- 2026-08-17
-- ============================================================
--
-- Alcance de esta migración: extiende el módulo de Clientes (migración
-- 003) con los servicios que cada cliente tiene contratados. Esto sigue
-- siendo gestión administrativa/comercial del cliente (qué servicio
-- presta PDP Expert a quién), no el módulo de Operaciones de consultoría
-- (tickets, planes de implementación, entregables, tareas), que se
-- migra por separado más adelante.
--
-- Crea: catalogo_servicios, servicios_cliente.
--
-- Sigue fuera de alcance (módulo de Operaciones, no de Clientes):
-- tickets, planes/lineas_trabajo/iniciativas/actividades, entregables,
-- tareas, perfiles_operaciones.
--
-- Roles: mismos que en 003. Lectura para cualquier autenticado, escritura
-- para jefe_operaciones, gerente y admin. El catálogo de servicios
-- (catalogo_servicios) es un catálogo estable de la firma: escritura
-- reservada a gerente/admin, igual que empresas_holding y tipos_contacto
-- en 003.
-- ============================================================

-- ============================================================
-- 1. catalogo_servicios
-- ============================================================
create table public.catalogo_servicios (
  id       text primary key,
  nombre   text not null,
  modo     text not null check (modo in ('Recurrente', 'Proyecto')),
  activo   boolean not null default true
);

comment on table public.catalogo_servicios is
  'Catálogo de líneas de servicio que PDP Expert ofrece (DPO Externo, Oficina PDP, Secondment, Diagnóstico, Implementación). Modo indica si es un servicio recurrente o un proyecto con fin definido.';
comment on column public.catalogo_servicios.modo is
  'Recurrente: servicio continuo sin fecha de cierre definida (ej. DPO Externo). Proyecto: servicio con alcance y cierre definidos (ej. Diagnóstico).';

insert into public.catalogo_servicios (id, nombre, modo) values
  ('DPO_EXTERNO', 'DPO Externo', 'Recurrente'),
  ('OFICINA_PDP', 'Oficina PDP', 'Recurrente'),
  ('SECONDMENT', 'Secondment', 'Proyecto'),
  ('DIAGNOSTICO', 'Diagnóstico', 'Proyecto'),
  ('IMPLEMENTACION', 'Implementación', 'Proyecto');

alter table public.catalogo_servicios enable row level security;

create policy "catalogo_servicios_select_authenticated"
  on public.catalogo_servicios for select
  to authenticated
  using (true);

create policy "catalogo_servicios_write_gerente"
  on public.catalogo_servicios for all
  to authenticated
  using (public.tiene_rol(array['gerente', 'admin']))
  with check (public.tiene_rol(array['gerente', 'admin']));

-- ============================================================
-- 2. servicios_cliente
-- ============================================================
create table public.servicios_cliente (
  id                 uuid primary key default gen_random_uuid(),
  id_cliente         uuid not null references public.clientes(id) on delete cascade,
  id_servicio_tipo   text not null references public.catalogo_servicios(id),
  estado             text not null default 'Activo' check (estado in ('Activo', 'Cancelado')),
  fecha_inicio       date,
  fecha_fin          date,
  notas              text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

comment on table public.servicios_cliente is
  'Servicios que un cliente tiene contratados con PDP Expert. Un mismo cliente puede tener varios servicios activos simultáneamente (ej. DPO Externo + Oficina PDP). Es la relación Cliente -> Servicio que se muestra en la ficha de cliente.';
comment on column public.servicios_cliente.fecha_inicio is
  'Fecha de inicio del servicio contratado. Opcional: permite cargar el dato progresivamente sin bloquear el alta del servicio.';
comment on column public.servicios_cliente.fecha_fin is
  'Fecha de cierre del servicio, solo aplica cuando estado pasa a Cancelado o el servicio (modo Proyecto) concluye.';

create unique index uq_servicios_cliente_activo
  on public.servicios_cliente (id_cliente, id_servicio_tipo)
  where estado = 'Activo';
create index idx_servicios_cliente_id_cliente on public.servicios_cliente (id_cliente);
create index idx_servicios_cliente_id_servicio_tipo on public.servicios_cliente (id_servicio_tipo);

comment on index uq_servicios_cliente_activo is
  'Evita registrar el mismo servicio dos veces como Activo para un mismo cliente. Permite historial: un servicio Cancelado y luego vuelto a contratar (nueva fila Activa) sí es válido.';

create trigger trg_servicios_cliente_updated_at
  before update on public.servicios_cliente
  for each row execute function public.set_updated_at();

alter table public.servicios_cliente enable row level security;

create policy "servicios_cliente_select_authenticated"
  on public.servicios_cliente for select
  to authenticated
  using (true);

create policy "servicios_cliente_write_jefa_o_gerente"
  on public.servicios_cliente for all
  to authenticated
  using (public.tiene_rol(array['jefe_operaciones', 'gerente', 'admin']))
  with check (public.tiene_rol(array['jefe_operaciones', 'gerente', 'admin']));
