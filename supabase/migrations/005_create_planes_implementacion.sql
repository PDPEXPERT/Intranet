-- ============================================================
-- Migración 005: Módulo Operaciones — Plan de implementación y cumplimiento
-- Intranet PDP Expert
-- 2026-08-17
-- ============================================================
--
-- Alcance de esta migración: primera versión del plan de implementación
-- y cumplimiento (jerarquía Plan -> Línea de trabajo -> Iniciativa ->
-- Actividad), sus dependencias entre iniciativas, y las tareas de
-- ejecución diaria.
--
-- Crea: planes, planes_lineas_trabajo, planes_iniciativas,
-- planes_iniciativa_dependencias, planes_actividades, tareas.
--
-- Contenido variable por diseño: el número de líneas de trabajo,
-- iniciativas y actividades, así como el contenido de "entradas" y
-- "salidas" de cada iniciativa/actividad, cambia con el tiempo (fuente:
-- "Planificación Programa PDP v1.16.xlsx", ya en su versión 16). Por eso
-- entradas/salidas/resultados_esperados se guardan en columnas jsonb
-- (arreglo de texto libre hoy, sin impedir estructurarlas más adelante)
-- en vez de columnas fijas o una tabla de atributos aparte. No se
-- migran filas de datos reales de ningún cliente en este archivo: cada
-- firma de plan (línea/iniciativa/actividad) se crea desde la UI cuando
-- arranca un programa con un cliente.
--
-- Subelemento MMI: cada iniciativa/actividad puede referenciar uno o
-- varios subelementos del Modelo de Madurez I (MMI) por su código
-- (ej. "S2", "S28"). El MMI vive como fuente propia fuera de esta base
-- de datos (servida por su propio conector/MCP: 9 elementos, 32
-- subelementos, 115 requisitos) — aquí solo se guarda el código como
-- referencia de texto (subelemento_mmi jsonb), sin duplicar su
-- estructura. Este campo queda disponible pero no se usa activamente
-- todavía (decisión del 2026-08-17: el mapeo con el MMI no se activa en
-- este MVP, pero el modelo de datos no debe bloquearlo).
--
-- Tareas: una tarea puede originarse de una actividad de un plan, de un
-- ticket, o de ninguno de los dos (tarea suelta creada directamente por
-- el consultor). El módulo de Tickets todavía no existe, así que
-- id_ticket queda como columna preparada sin tabla ticket que
-- referenciar (sin foreign key por ahora) — se agrega la referencia real
-- cuando exista el módulo de Tickets, sin necesidad de tocar filas
-- existentes. La regla "como máximo un origen a la vez" se aplica con
-- un check constraint (num_nonnulls), no con un patrón polimórfico
-- genérico tipo tipo+id: así la base de datos, y no el código de la
-- aplicación, es quien garantiza que una tarea no quede con dos padres
-- a la vez o con una referencia rota.
--
-- Fuera de alcance por ahora (se migran en una siguiente entrega):
-- tickets, entregables, perfiles_operaciones, y el uso activo del
-- mapeo con el MMI.
--
-- Roles: mismos que en 003/004. Lectura para cualquier autenticado.
-- Escritura de la estructura del plan (líneas/iniciativas/actividades/
-- dependencias) para jefe_operaciones, gerente y admin. Escritura de
-- tareas también para consultor y consultor_dpo, porque cualquier
-- consultor debe poder crear y actualizar sus propias tareas del día a
-- día sin depender de jefatura.
-- ============================================================

-- ============================================================
-- 1. planes
-- ============================================================
create table public.planes (
  id                  uuid primary key default gen_random_uuid(),
  id_cliente          uuid not null references public.clientes(id) on delete restrict,
  id_servicio_cliente uuid references public.servicios_cliente(id) on delete set null,
  nombre              text not null,
  fecha_inicio        date,
  fecha_fin_estimada  date,
  estado              text not null default 'Activo'
                        check (estado in ('Activo', 'Pausado', 'Completado', 'Cancelado')),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

comment on table public.planes is
  'Plan de implementación y cumplimiento de un cliente. Un cliente puede tener más de un plan (ej. uno por servicio de Implementación contratado). id_servicio_cliente es opcional: permite crear el plan antes de tener el servicio formalizado, o desvincularlo si el servicio se cancela sin perder el historial del plan.';

create index idx_planes_id_cliente on public.planes (id_cliente);
create index idx_planes_id_servicio_cliente on public.planes (id_servicio_cliente);
create index idx_planes_estado on public.planes (estado);

create trigger trg_planes_updated_at
  before update on public.planes
  for each row execute function public.set_updated_at();

alter table public.planes enable row level security;

create policy "planes_select_authenticated"
  on public.planes for select
  to authenticated
  using (true);

create policy "planes_write_jefa_o_gerente"
  on public.planes for all
  to authenticated
  using (public.tiene_rol(array['jefe_operaciones', 'gerente', 'admin']))
  with check (public.tiene_rol(array['jefe_operaciones', 'gerente', 'admin']));

-- ============================================================
-- 2. planes_lineas_trabajo
-- ============================================================
create table public.planes_lineas_trabajo (
  id         uuid primary key default gen_random_uuid(),
  id_plan    uuid not null references public.planes(id) on delete cascade,
  nombre     text not null,
  objetivo   text,
  orden      integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.planes_lineas_trabajo is
  'Línea de trabajo dentro de un plan (ej. "1. Gobernanza y marco de gestión"). El número y nombre de líneas varía por versión del programa de implementación (hoy 5 en la plantilla vigente) — no se asume una cantidad fija.';

create index idx_planes_lineas_trabajo_id_plan on public.planes_lineas_trabajo (id_plan);

create trigger trg_planes_lineas_trabajo_updated_at
  before update on public.planes_lineas_trabajo
  for each row execute function public.set_updated_at();

alter table public.planes_lineas_trabajo enable row level security;

create policy "planes_lineas_trabajo_select_authenticated"
  on public.planes_lineas_trabajo for select
  to authenticated
  using (true);

create policy "planes_lineas_trabajo_write_jefa_o_gerente"
  on public.planes_lineas_trabajo for all
  to authenticated
  using (public.tiene_rol(array['jefe_operaciones', 'gerente', 'admin']))
  with check (public.tiene_rol(array['jefe_operaciones', 'gerente', 'admin']));

-- ============================================================
-- 3. planes_iniciativas
-- ============================================================
create table public.planes_iniciativas (
  id                            uuid primary key default gen_random_uuid(),
  id_linea_trabajo               uuid not null references public.planes_lineas_trabajo(id) on delete cascade,
  nombre                        text not null,
  objetivo                      text,
  prioridad                    text check (prioridad in ('ALTA', 'MEDIA', 'BAJA')),
  responsable_coordinacion     text,
  duracion_semanas_estimada    integer,
  horas_coordinacion_estimadas numeric,
  horas_equipo_estimadas       numeric,
  entradas                     jsonb not null default '[]'::jsonb,
  resultados_esperados         jsonb not null default '[]'::jsonb,
  subelemento_mmi              jsonb not null default '[]'::jsonb,
  orden                        integer not null default 0,
  created_at                   timestamptz not null default now(),
  updated_at                   timestamptz not null default now()
);

comment on table public.planes_iniciativas is
  'Iniciativa dentro de una línea de trabajo (ej. "1.1 Definir roles, responsabilidades y autoridades"). El contenido de entradas/resultados_esperados y el número de iniciativas por línea cambia entre versiones del programa — no se modela como estructura fija.';
comment on column public.planes_iniciativas.entradas is
  'Arreglo de texto libre (jsonb), ej. ["Organigrama vigente", "Decisión de la alta dirección..."]. Sin estructura fija: se puede pasar a objetos con más campos (tipo, url) sin migración.';
comment on column public.planes_iniciativas.resultados_esperados is
  'Arreglo de texto libre (jsonb) con los resultados esperados de la iniciativa. Mismo criterio que entradas.';
comment on column public.planes_iniciativas.subelemento_mmi is
  'Arreglo de códigos de subelemento del Modelo de Madurez I (MMI), ej. ["S2", "S28"]. Referencia de texto a una fuente externa (servida por su propio conector) — no se modela la jerarquía del MMI en esta base de datos. Campo disponible pero sin uso activo en este MVP.';

create index idx_planes_iniciativas_id_linea on public.planes_iniciativas (id_linea_trabajo);

create trigger trg_planes_iniciativas_updated_at
  before update on public.planes_iniciativas
  for each row execute function public.set_updated_at();

alter table public.planes_iniciativas enable row level security;

create policy "planes_iniciativas_select_authenticated"
  on public.planes_iniciativas for select
  to authenticated
  using (true);

create policy "planes_iniciativas_write_jefa_o_gerente"
  on public.planes_iniciativas for all
  to authenticated
  using (public.tiene_rol(array['jefe_operaciones', 'gerente', 'admin']))
  with check (public.tiene_rol(array['jefe_operaciones', 'gerente', 'admin']));

-- ============================================================
-- 4. planes_iniciativa_dependencias
-- ============================================================
create table public.planes_iniciativa_dependencias (
  id                     uuid primary key default gen_random_uuid(),
  id_iniciativa          uuid not null references public.planes_iniciativas(id) on delete cascade,
  id_iniciativa_depende  uuid not null references public.planes_iniciativas(id) on delete cascade,
  descripcion            text,
  created_at             timestamptz not null default now(),

  constraint chk_iniciativa_dependencia_no_autorreferencia
    check (id_iniciativa <> id_iniciativa_depende)
);

comment on table public.planes_iniciativa_dependencias is
  'Relación real iniciativa -> iniciativa de la que depende, reemplazando el texto libre "Dependencias" del Excel de origen. Permite en el futuro validar automáticamente si una iniciativa depende de otra que no ha concluido. descripcion guarda la explicación de la dependencia (hoy texto libre en el Excel).';

create unique index uq_iniciativa_dependencia
  on public.planes_iniciativa_dependencias (id_iniciativa, id_iniciativa_depende);
create index idx_iniciativa_dependencias_id_iniciativa
  on public.planes_iniciativa_dependencias (id_iniciativa);
create index idx_iniciativa_dependencias_id_depende
  on public.planes_iniciativa_dependencias (id_iniciativa_depende);

alter table public.planes_iniciativa_dependencias enable row level security;

create policy "planes_iniciativa_dependencias_select_authenticated"
  on public.planes_iniciativa_dependencias for select
  to authenticated
  using (true);

create policy "planes_iniciativa_dependencias_write_jefa_o_gerente"
  on public.planes_iniciativa_dependencias for all
  to authenticated
  using (public.tiene_rol(array['jefe_operaciones', 'gerente', 'admin']))
  with check (public.tiene_rol(array['jefe_operaciones', 'gerente', 'admin']));

-- ============================================================
-- 5. planes_actividades
-- ============================================================
create table public.planes_actividades (
  id            uuid primary key default gen_random_uuid(),
  id_iniciativa uuid not null references public.planes_iniciativas(id) on delete cascade,
  nombre        text not null,
  responsable   text,
  fecha_inicio  date,
  fecha_fin     date,
  estado        text not null default 'No iniciado'
                  check (estado in ('No iniciado', 'En progreso', 'Completado')),
  entradas      jsonb not null default '[]'::jsonb,
  salidas       jsonb not null default '[]'::jsonb,
  orden         integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table public.planes_actividades is
  'Actividad dentro de una iniciativa (ej. "1.1.1 Definir los roles y responsabilidades..."). El seguimiento semanal tipo Gantt del Excel de origen (Semana 1-24) no se modela como columnas: se calcula en la UI a partir de fecha_inicio/fecha_fin de cada actividad contra la fecha de inicio del plan.';
comment on column public.planes_actividades.entradas is
  'Arreglo de texto libre (jsonb) con las entradas de la actividad. Mismo criterio que planes_iniciativas.entradas: sin estructura fija, cambia de contenido entre versiones del programa.';
comment on column public.planes_actividades.salidas is
  'Arreglo de texto libre (jsonb) con las salidas/resultados de la actividad.';

create index idx_planes_actividades_id_iniciativa on public.planes_actividades (id_iniciativa);
create index idx_planes_actividades_estado on public.planes_actividades (estado);

create trigger trg_planes_actividades_updated_at
  before update on public.planes_actividades
  for each row execute function public.set_updated_at();

alter table public.planes_actividades enable row level security;

create policy "planes_actividades_select_authenticated"
  on public.planes_actividades for select
  to authenticated
  using (true);

create policy "planes_actividades_write_jefa_o_gerente"
  on public.planes_actividades for all
  to authenticated
  using (public.tiene_rol(array['jefe_operaciones', 'gerente', 'admin']))
  with check (public.tiene_rol(array['jefe_operaciones', 'gerente', 'admin']));

-- ============================================================
-- 6. tareas
-- ============================================================
create table public.tareas (
  id            uuid primary key default gen_random_uuid(),
  consultor     text not null,
  descripcion   text not null,
  fecha         date not null default current_date,
  estado        text not null default 'Pendiente'
                  check (estado in ('Pendiente', 'En progreso', 'Completada')),
  id_actividad  uuid references public.planes_actividades(id) on delete set null,
  id_ticket     uuid,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  constraint chk_tarea_origen_exclusivo
    check (num_nonnulls(id_actividad, id_ticket) <= 1)
);

comment on table public.tareas is
  'Unidad de ejecución diaria de un consultor. Una tarea puede originarse de una actividad de un plan de implementación (id_actividad), de un ticket (id_ticket), o de ninguno de los dos (tarea suelta creada directamente por el consultor) — nunca de los dos a la vez (chk_tarea_origen_exclusivo). Si se borra la actividad de origen, la tarea no se borra: queda suelta (on delete set null), preservando el historial de trabajo del consultor.';
comment on column public.tareas.id_ticket is
  'Referencia al ticket de origen. El módulo de Tickets todavía no existe: esta columna no tiene foreign key por ahora (no hay tabla "tickets" que referenciar) y toda tarea actual la deja en null. Se agrega la referencia real (con su foreign key) cuando se construya el módulo de Tickets, sin necesidad de migrar filas existentes.';
comment on column public.tareas.consultor is
  'Identificador del consultor responsable (hoy texto libre tipo iniciales, siguiendo el patrón ya usado en planes_iniciativas.responsable_coordinacion y planes_actividades.responsable). Puede evolucionar a una referencia real a auth.users/user_roles más adelante si se necesita reportería estructurada por usuario.';

create index idx_tareas_id_actividad on public.tareas (id_actividad);
create index idx_tareas_id_ticket on public.tareas (id_ticket);
create index idx_tareas_consultor on public.tareas (consultor);
create index idx_tareas_estado on public.tareas (estado);
create index idx_tareas_fecha on public.tareas (fecha);

create trigger trg_tareas_updated_at
  before update on public.tareas
  for each row execute function public.set_updated_at();

alter table public.tareas enable row level security;

create policy "tareas_select_authenticated"
  on public.tareas for select
  to authenticated
  using (true);

comment on policy "tareas_select_authenticated" on public.tareas is
  'Lectura abierta a cualquier autenticado, igual que el resto del módulo Operaciones (ej. la Jefa de Operaciones necesita ver las tareas de todos los consultores). Si más adelante se requiere que un consultor solo vea sus propias tareas, se restringe aquí sin tocar el resto del modelo.';

create policy "tareas_write_consultor_o_jefatura"
  on public.tareas for all
  to authenticated
  using (public.tiene_rol(array['consultor', 'consultor_dpo', 'jefe_operaciones', 'gerente', 'admin']))
  with check (public.tiene_rol(array['consultor', 'consultor_dpo', 'jefe_operaciones', 'gerente', 'admin']));

comment on policy "tareas_write_consultor_o_jefatura" on public.tareas is
  'A diferencia de planes/iniciativas/actividades (solo jefatura/gerencia escriben la estructura), cualquier consultor puede crear y actualizar tareas: son su propio trabajo diario, no la estructura del plan.';
