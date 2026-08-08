-- Migración: sistema de roles para módulos gerenciales y de consultoría
-- Fecha: 2026-08-08
--
-- Contexto: hasta ahora el Intranet tenía un solo nivel de acceso
-- ("consultor autenticado"). Esta migración agrega una tabla de roles
-- (multi-rol por usuario) para poder mostrar módulos exclusivos a
-- liderazgo y roles específicos de operación.
--
-- IMPORTANTE: esta migración asume que el login pasa a ser exclusivamente
-- vía Microsoft (Azure/Entra ID) a través de Supabase Auth. El email del
-- usuario autenticado es la clave para relacionarlo con su(s) rol(es).

-- 1. Tipo enumerado con los roles válidos
create type public.app_role as enum (
  'consultor',
  'consultor_dpo',
  'jefe_operaciones',
  'jefe_administrativo_financiero',
  'jefe_tecnologia_seguridad',
  'gerente',
  'admin'
);

-- 2. Tabla de asignaciones (un usuario puede tener varios roles)
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (email, role)
);

comment on table public.user_roles is
  'Asignación de roles por email. Un usuario puede tener varios roles simultáneos. Se administra manualmente desde el SQL Editor de Supabase por el admin.';

-- 3. Row Level Security
alter table public.user_roles enable row level security;

-- Cualquier usuario autenticado puede leer la tabla completa de roles.
-- Esto es necesario para que el frontend pueda resolver "¿qué roles tiene
-- el usuario logueado?" y también, si hiciera falta, mostrar un directorio
-- de quién tiene qué rol. No se expone nada sensible (solo email + rol).
create policy "Usuarios autenticados pueden leer roles"
  on public.user_roles
  for select
  to authenticated
  using (true);

-- Nadie puede insertar/actualizar/eliminar roles desde el cliente.
-- La gestión de roles se hace manualmente por el admin vía SQL Editor
-- (con la service role key, que bypassea RLS) o, en el futuro, mediante
-- un panel de administración dedicado.
-- (No se crean políticas de insert/update/delete => quedan denegadas por defecto.)

-- 4. Datos iniciales (asignaciones acordadas 2026-08-08)
insert into public.user_roles (email, role) values
  ('pablo.arteaga@pdpexpert.com', 'gerente'),
  ('pablo.arteaga@pdpexpert.com', 'admin'),
  ('pablo.arteaga@pdpexpert.com', 'consultor_dpo'),
  ('fernando.balarezo@pdpexpert.com', 'jefe_tecnologia_seguridad'),
  ('contabilidad@pdpexpert.com', 'jefe_administrativo_financiero'),
  ('milena.gross@pdpexpert.com', 'jefe_operaciones'),
  ('gabriela.villafuerte@pdpexpert.com', 'consultor_dpo'),
  ('katrina.bustillos@pdpexpert.com', 'consultor');

-- Nota: quienes no aparecen en esta lista NO tienen ningún rol asignado.
-- Al loguearse verán la pantalla de "sin rol asignado, contacta al admin"
-- (ver componente RoleGuard en el frontend). El admin asigna roles nuevos
-- insertando filas en esta tabla desde el SQL Editor de Supabase, ej.:
--
--   insert into public.user_roles (email, role) values
--     ('nuevo.consultor@pdpexpert.com', 'consultor');
