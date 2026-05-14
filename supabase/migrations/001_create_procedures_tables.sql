-- ============================================================
-- Migración 001: Tablas de procedimientos de consultoría
-- Intranet PDP Expert
-- 2026-05-13
-- ============================================================

-- Extensión para UUIDs (normalmente ya existe en Supabase)
create extension if not exists "uuid-ossp";

-- Configuración de búsqueda full-text en español
create extension if not exists "unaccent";

-- ============================================================
-- 1. procedures
-- ============================================================
create table procedures (
  id          uuid primary key default uuid_generate_v4(),
  code        text not null unique,            -- ej. "PRC-CON-001"
  title       text not null,
  part        text not null check (part in ('compartidos', 'servicio')),
  purpose     text not null default '',
  scope       text not null default '',
  sort_order  int not null default 0,

  -- Secciones tabulares en JSONB
  responsibilities  jsonb not null default '[]'::jsonb,
  inputs            jsonb not null default '[]'::jsonb,
  exceptions        jsonb not null default '[]'::jsonb,
  controls          jsonb not null default '[]'::jsonb,
  outputs           jsonb not null default '[]'::jsonb,
  risks             jsonb not null default '[]'::jsonb,
  indicators        jsonb not null default '[]'::jsonb,

  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Índice de ordenamiento
create index idx_procedures_sort on procedures (sort_order);

-- ============================================================
-- 2. activities
-- ============================================================
create table activities (
  id              uuid primary key default uuid_generate_v4(),
  procedure_id    uuid not null references procedures(id) on delete cascade,
  sort_order      int not null default 0,
  type            text not null check (type in ('event_start', 'activity', 'decision', 'event_end')),
  number          int,                          -- NULL para eventos y decisiones
  title           text not null,
  "trigger"       text,                         -- palabra reservada → comillas
  executor        text,
  description     text,
  result          text,
  evidence        text,
  outcomes        jsonb,                        -- solo para decisiones

  created_at      timestamptz not null default now()
);

-- Índice compuesto para consultar actividades de un procedimiento en orden
create index idx_activities_proc_sort on activities (procedure_id, sort_order);

-- ============================================================
-- 3. procedure_invocations
-- ============================================================
create table procedure_invocations (
  id          uuid primary key default uuid_generate_v4(),
  caller_id   uuid not null references procedures(id) on delete cascade,
  callee_id   uuid not null references procedures(id) on delete cascade,
  context     text not null default '',

  unique (caller_id, callee_id, context)
);

-- ============================================================
-- 4. Full-text search en español
-- ============================================================

-- Configuración de búsqueda que quita acentos
create text search configuration spanish_unaccent (copy = spanish);
alter text search configuration spanish_unaccent
  alter mapping for hword, hword_part, word
  with unaccent, spanish_stem;

-- Columna tsvector generada en procedures (título + propósito + alcance)
alter table procedures
  add column fts tsvector
  generated always as (
    setweight(to_tsvector('spanish_unaccent', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('spanish_unaccent', coalesce(code, '')), 'A') ||
    setweight(to_tsvector('spanish_unaccent', coalesce(purpose, '')), 'B') ||
    setweight(to_tsvector('spanish_unaccent', coalesce(scope, '')), 'C')
  ) stored;

create index idx_procedures_fts on procedures using gin(fts);

-- Columna tsvector generada en activities (título + descripción + resultado)
alter table activities
  add column fts tsvector
  generated always as (
    setweight(to_tsvector('spanish_unaccent', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('spanish_unaccent', coalesce(description, '')), 'B') ||
    setweight(to_tsvector('spanish_unaccent', coalesce(result, '')), 'C') ||
    setweight(to_tsvector('spanish_unaccent', coalesce(executor, '')), 'C')
  ) stored;

create index idx_activities_fts on activities using gin(fts);

-- ============================================================
-- 5. Trigger para updated_at automático en procedures
-- ============================================================
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_procedures_updated_at
  before update on procedures
  for each row execute function update_updated_at();

-- ============================================================
-- 6. Función de búsqueda unificada
-- ============================================================
create or replace function search_procedures(query text)
returns table (
  source        text,
  procedure_id  uuid,
  procedure_code text,
  procedure_title text,
  activity_id   uuid,
  activity_title text,
  rank          real
) as $$
declare
  tsq tsquery;
begin
  tsq := websearch_to_tsquery('spanish_unaccent', query);

  return query
    -- Resultados de procedures
    select
      'procedure'::text as source,
      p.id as procedure_id,
      p.code as procedure_code,
      p.title as procedure_title,
      null::uuid as activity_id,
      null::text as activity_title,
      ts_rank(p.fts, tsq) as rank
    from procedures p
    where p.fts @@ tsq

    union all

    -- Resultados de activities
    select
      'activity'::text as source,
      p.id as procedure_id,
      p.code as procedure_code,
      p.title as procedure_title,
      a.id as activity_id,
      a.title as activity_title,
      ts_rank(a.fts, tsq) as rank
    from activities a
    join procedures p on p.id = a.procedure_id
    where a.fts @@ tsq

    order by rank desc;
end;
$$ language plpgsql stable;
