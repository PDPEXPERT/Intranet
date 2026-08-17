'use client';

import { useEffect, useState } from 'react';
import {
  createActividad,
  createIniciativa,
  createLineaTrabajo,
  friendlyPlanError,
  getPlanConJerarquia,
  updateActividad,
} from '@/lib/planes';
import { createTarea, friendlyTareaError } from '@/lib/tareas';
import type {
  EstadoActividad,
  PlanActividad,
  PlanActividadInput,
  PlanConJerarquia,
  PlanIniciativaInput,
  PlanLineaTrabajoInput,
  PrioridadIniciativa,
  TareaInput,
} from '@/lib/types';
import { useUserRoles } from '@/lib/useUserRoles';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CollapsibleSection } from '@/components/ui/CollapsibleSection';

const CAN_WRITE_ESTRUCTURA_ROLES = ['jefe_operaciones', 'gerente', 'admin'] as const;
const CAN_WRITE_TAREAS_ROLES = [
  'consultor',
  'consultor_dpo',
  'jefe_operaciones',
  'gerente',
  'admin',
] as const;

const inputClass =
  'w-full px-3 py-2 text-sm border border-neutral rounded-md bg-surface text-neutral-dark placeholder:text-neutral focus:outline-none focus:border-accent';
const labelClass =
  'font-body text-xs font-medium text-neutral-dark/70 uppercase tracking-wide';

function textareaToLineas(text: string): string[] {
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
}

function estadoTone(estado: EstadoActividad): 'success' | 'accent' | 'neutral' {
  if (estado === 'Completado') return 'success';
  if (estado === 'En progreso') return 'accent';
  return 'neutral';
}

export function PlanDetail({ id }: { id: string }) {
  const { hasRole } = useUserRoles();
  const canWriteEstructura = hasRole([...CAN_WRITE_ESTRUCTURA_ROLES]);
  const canWriteTareas = hasRole([...CAN_WRITE_TAREAS_ROLES]);

  const [plan, setPlan] = useState<PlanConJerarquia | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      const data = await getPlanConJerarquia(id);
      if (!data) {
        setError('Plan no encontrado.');
        setLoading(false);
        return;
      }
      setPlan(data);
      setLoading(false);
    } catch (e) {
      setError((e as Error).message ?? 'Error al cargar el plan.');
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return <p className="font-body text-sm text-neutral-dark/60">Cargando...</p>;
  }
  if (error || !plan) {
    return (
      <p className="font-body text-sm text-danger">
        {error ?? 'Plan no encontrado.'}
      </p>
    );
  }

  const totalActividades = plan.lineas.reduce(
    (acc, l) =>
      acc + l.iniciativas.reduce((acc2, i) => acc2 + i.actividades.length, 0),
    0,
  );
  const actividadesCompletadas = plan.lineas.reduce(
    (acc, l) =>
      acc +
      l.iniciativas.reduce(
        (acc2, i) =>
          acc2 + i.actividades.filter((a) => a.estado === 'Completado').length,
        0,
      ),
    0,
  );
  const progreso =
    totalActividades > 0
      ? Math.round((actividadesCompletadas / totalActividades) * 100)
      : 0;

  return (
    <div className="max-w-[1120px] mx-auto space-y-6">
      <header className="space-y-3">
        <div className="flex items-baseline gap-3 flex-wrap">
          <h1 className="font-heading text-2xl font-bold text-primary">
            {plan.nombre}
          </h1>
          <Badge
            tone={
              plan.estado === 'Activo'
                ? 'success'
                : plan.estado === 'Completado'
                  ? 'accent'
                  : plan.estado === 'Pausado'
                    ? 'warning'
                    : 'danger'
            }
          >
            {plan.estado}
          </Badge>
        </div>
        <p className="font-body text-sm text-neutral-dark/70">
          Inicio: {plan.fecha_inicio ?? 'Sin dato'} · Fin estimado:{' '}
          {plan.fecha_fin_estimada ?? 'Sin dato'}
        </p>
        <div className="max-w-sm">
          <div className="flex items-center justify-between font-body text-xs text-neutral-dark/70 mb-1">
            <span>Progreso de actividades</span>
            <span>
              {actividadesCompletadas}/{totalActividades} ({progreso}%)
            </span>
          </div>
          <div className="h-2 rounded-full bg-neutral/30 overflow-hidden">
            <div
              className="h-full bg-accent"
              style={{ width: `${progreso}%` }}
            />
          </div>
        </div>
      </header>

      <div className="space-y-2">
        {plan.lineas.map((linea) => (
          <CollapsibleSection
            key={linea.id}
            id={`sec-linea-${linea.id}`}
            title={linea.nombre}
            level="h2"
          >
            <div className="space-y-4 pl-2">
              {linea.objetivo && (
                <p className="font-body text-sm text-neutral-dark/70">
                  {linea.objetivo}
                </p>
              )}

              {linea.iniciativas.map((iniciativa) => (
                <CollapsibleSection
                  key={iniciativa.id}
                  id={`sec-iniciativa-${iniciativa.id}`}
                  title={
                    <span className="flex items-center gap-2 flex-wrap">
                      <span>{iniciativa.nombre}</span>
                      {iniciativa.prioridad && (
                        <Badge
                          tone={
                            iniciativa.prioridad === 'ALTA'
                              ? 'danger'
                              : iniciativa.prioridad === 'MEDIA'
                                ? 'warning'
                                : 'neutral'
                          }
                        >
                          {iniciativa.prioridad}
                        </Badge>
                      )}
                    </span>
                  }
                  level="h3"
                  defaultOpen={false}
                >
                  <div className="space-y-4 pl-2">
                    {iniciativa.objetivo && (
                      <p className="font-body text-sm text-neutral-dark/70">
                        {iniciativa.objetivo}
                      </p>
                    )}

                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                      {iniciativa.responsable_coordinacion && (
                        <MiniField
                          label="Responsable de coordinación"
                          value={iniciativa.responsable_coordinacion}
                        />
                      )}
                      {iniciativa.duracion_semanas_estimada != null && (
                        <MiniField
                          label="Duración estimada"
                          value={`${iniciativa.duracion_semanas_estimada} semanas`}
                        />
                      )}
                      {iniciativa.entradas.length > 0 && (
                        <BulletField label="Entradas" items={iniciativa.entradas} />
                      )}
                      {iniciativa.resultados_esperados.length > 0 && (
                        <BulletField
                          label="Resultados esperados"
                          items={iniciativa.resultados_esperados}
                        />
                      )}
                    </dl>

                    <ActividadesList
                      actividades={iniciativa.actividades}
                      canWriteEstructura={canWriteEstructura}
                      canWriteTareas={canWriteTareas}
                      onChanged={load}
                    />

                    {canWriteEstructura && (
                      <NuevaActividadForm
                        iniciativaId={iniciativa.id}
                        orden={iniciativa.actividades.length}
                        onSaved={load}
                      />
                    )}
                  </div>
                </CollapsibleSection>
              ))}

              {canWriteEstructura && (
                <NuevaIniciativaForm
                  lineaId={linea.id}
                  orden={linea.iniciativas.length}
                  onSaved={load}
                />
              )}
            </div>
          </CollapsibleSection>
        ))}

        {canWriteEstructura && (
          <NuevaLineaTrabajoForm
            planId={plan.id}
            orden={plan.lineas.length}
            onSaved={load}
          />
        )}
      </div>
    </div>
  );
}

function MiniField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-body text-xs font-medium text-neutral-dark/60 uppercase tracking-wide">
        {label}
      </dt>
      <dd className="font-body text-sm text-neutral-dark mt-0.5">{value}</dd>
    </div>
  );
}

function BulletField({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="sm:col-span-2">
      <dt className="font-body text-xs font-medium text-neutral-dark/60 uppercase tracking-wide">
        {label}
      </dt>
      <dd className="font-body text-sm text-neutral-dark mt-0.5">
        <ul className="list-disc list-inside space-y-0.5">
          {items.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </dd>
    </div>
  );
}

function ActividadesList({
  actividades,
  canWriteEstructura,
  canWriteTareas,
  onChanged,
}: {
  actividades: PlanActividad[];
  canWriteEstructura: boolean;
  canWriteTareas: boolean;
  onChanged: () => void;
}) {
  if (actividades.length === 0) {
    return (
      <p className="font-body text-sm text-neutral-dark/60">
        Esta iniciativa no tiene actividades registradas todavía.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {actividades.map((act) => (
        <ActividadRow
          key={act.id}
          actividad={act}
          canWriteEstructura={canWriteEstructura}
          canWriteTareas={canWriteTareas}
          onChanged={onChanged}
        />
      ))}
    </div>
  );
}

function ActividadRow({
  actividad,
  canWriteEstructura,
  canWriteTareas,
  onChanged,
}: {
  actividad: PlanActividad;
  canWriteEstructura: boolean;
  canWriteTareas: boolean;
  onChanged: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [savingEstado, setSavingEstado] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTareaForm, setShowTareaForm] = useState(false);

  async function handleEstadoChange(nuevoEstado: EstadoActividad) {
    setSavingEstado(true);
    setError(null);
    const input: PlanActividadInput = {
      nombre: actividad.nombre,
      responsable: actividad.responsable,
      fecha_inicio: actividad.fecha_inicio,
      fecha_fin: actividad.fecha_fin,
      estado: nuevoEstado,
      entradas: actividad.entradas,
      salidas: actividad.salidas,
      orden: actividad.orden,
    };
    try {
      await updateActividad(actividad.id, input);
      setSavingEstado(false);
      onChanged();
    } catch (e) {
      setSavingEstado(false);
      setError(friendlyPlanError(e));
    }
  }

  return (
    <div className="border border-neutral/30 rounded-md p-3">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="text-left flex-1 min-w-0"
        >
          <span className="flex items-center gap-2 flex-wrap">
            <span className="font-body text-sm font-medium text-primary">
              {actividad.nombre}
            </span>
            <Badge tone={estadoTone(actividad.estado)}>{actividad.estado}</Badge>
          </span>
          {actividad.responsable && (
            <span className="block font-body text-xs text-neutral-dark/60 mt-0.5">
              Responsable: {actividad.responsable}
            </span>
          )}
        </button>

        {canWriteEstructura && (
          <select
            value={actividad.estado}
            disabled={savingEstado}
            onChange={(e) => handleEstadoChange(e.target.value as EstadoActividad)}
            className="px-2 py-1 text-xs border border-neutral rounded-md bg-surface text-neutral-dark focus:outline-none focus:border-accent"
          >
            <option value="No iniciado">No iniciado</option>
            <option value="En progreso">En progreso</option>
            <option value="Completado">Completado</option>
          </select>
        )}
      </div>

      {error && <p className="font-body text-xs text-danger mt-2">{error}</p>}

      {expanded && (
        <div className="mt-3 space-y-3 pl-1 border-l-2 border-accent-light/40 pl-3">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
            <MiniField
              label="Fecha de inicio"
              value={actividad.fecha_inicio ?? 'Sin dato'}
            />
            <MiniField
              label="Fecha de fin"
              value={actividad.fecha_fin ?? 'Sin dato'}
            />
            {actividad.entradas.length > 0 && (
              <BulletField label="Entradas" items={actividad.entradas} />
            )}
            {actividad.salidas.length > 0 && (
              <BulletField label="Salidas" items={actividad.salidas} />
            )}
          </dl>

          {canWriteTareas && !showTareaForm && (
            <Button variant="ghost" onClick={() => setShowTareaForm(true)}>
              Crear tarea desde esta actividad
            </Button>
          )}
          {canWriteTareas && showTareaForm && (
            <TareaRapidaForm
              idActividad={actividad.id}
              onSaved={() => setShowTareaForm(false)}
              onCancel={() => setShowTareaForm(false)}
            />
          )}
        </div>
      )}
    </div>
  );
}

function TareaRapidaForm({
  idActividad,
  onSaved,
  onCancel,
}: {
  idActividad: string;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [consultor, setConsultor] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!consultor.trim() || !descripcion.trim()) {
      setFieldError('Consultor y descripción son obligatorios.');
      return;
    }
    setFieldError(null);
    setSaving(true);
    setError(null);

    const input: TareaInput = {
      consultor: consultor.trim(),
      descripcion: descripcion.trim(),
      fecha: new Date().toISOString().slice(0, 10),
      estado: 'Pendiente',
      id_actividad: idActividad,
      id_ticket: null,
    };

    try {
      await createTarea(input);
      setSaving(false);
      onSaved();
    } catch (e) {
      setSaving(false);
      setError(friendlyTareaError(e));
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-neutral/40 rounded-md p-3 space-y-3 bg-accent-light/5"
    >
      {error && <p className="font-body text-xs text-danger">{error}</p>}
      {fieldError && <p className="font-body text-xs text-danger">{fieldError}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          value={consultor}
          onChange={(e) => setConsultor(e.target.value)}
          placeholder="Consultor (ej. PA)"
          className={inputClass}
        />
        <input
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Descripción de la tarea"
          className={inputClass}
        />
      </div>
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar tarea'}
        </Button>
        <Button type="button" variant="ghost" disabled={saving} onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}

function NuevaLineaTrabajoForm({
  planId,
  orden,
  onSaved,
}: {
  planId: string;
  orden: number;
  onSaved: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) {
    return (
      <Button variant="ghost" onClick={() => setOpen(true)}>
        Agregar línea de trabajo
      </Button>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim()) return;
    setSaving(true);
    setError(null);
    const input: PlanLineaTrabajoInput = {
      nombre: nombre.trim(),
      objetivo: objetivo.trim() ? objetivo.trim() : null,
      orden,
    };
    try {
      await createLineaTrabajo(planId, input);
      setSaving(false);
      setNombre('');
      setObjetivo('');
      setOpen(false);
      onSaved();
    } catch (e) {
      setSaving(false);
      setError(friendlyPlanError(e));
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-neutral/40 rounded-md p-4 space-y-3"
    >
      <h3 className="font-heading text-base font-semibold text-primary">
        Nueva línea de trabajo
      </h3>
      {error && <p className="font-body text-xs text-danger">{error}</p>}
      <input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Ej. 1. Gobernanza y marco de gestión"
        className={inputClass}
      />
      <textarea
        value={objetivo}
        onChange={(e) => setObjetivo(e.target.value)}
        placeholder="Objetivo (opcional)"
        rows={2}
        className={inputClass}
      />
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar línea de trabajo'}
        </Button>
        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}

function NuevaIniciativaForm({
  lineaId,
  orden,
  onSaved,
}: {
  lineaId: string;
  orden: number;
  onSaved: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [prioridad, setPrioridad] = useState<PrioridadIniciativa | ''>('');
  const [responsable, setResponsable] = useState('');
  const [entradas, setEntradas] = useState('');
  const [resultados, setResultados] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) {
    return (
      <Button variant="ghost" onClick={() => setOpen(true)}>
        Agregar iniciativa
      </Button>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim()) return;
    setSaving(true);
    setError(null);
    const input: PlanIniciativaInput = {
      nombre: nombre.trim(),
      objetivo: objetivo.trim() ? objetivo.trim() : null,
      prioridad: prioridad || null,
      responsable_coordinacion: responsable.trim() ? responsable.trim() : null,
      duracion_semanas_estimada: null,
      horas_coordinacion_estimadas: null,
      horas_equipo_estimadas: null,
      entradas: textareaToLineas(entradas),
      resultados_esperados: textareaToLineas(resultados),
      subelemento_mmi: [],
      orden,
    };
    try {
      await createIniciativa(lineaId, input);
      setSaving(false);
      setOpen(false);
      onSaved();
    } catch (e) {
      setSaving(false);
      setError(friendlyPlanError(e));
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-neutral/40 rounded-md p-4 space-y-3 ml-2"
    >
      <h3 className="font-heading text-base font-semibold text-primary">
        Nueva iniciativa
      </h3>
      {error && <p className="font-body text-xs text-danger">{error}</p>}
      <input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Ej. 1.1 Definir roles, responsabilidades y autoridades"
        className={inputClass}
      />
      <textarea
        value={objetivo}
        onChange={(e) => setObjetivo(e.target.value)}
        placeholder="Objetivo (opcional)"
        rows={2}
        className={inputClass}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <select
          value={prioridad}
          onChange={(e) => setPrioridad(e.target.value as PrioridadIniciativa | '')}
          className={inputClass}
        >
          <option value="">Sin prioridad</option>
          <option value="ALTA">ALTA</option>
          <option value="MEDIA">MEDIA</option>
          <option value="BAJA">BAJA</option>
        </select>
        <input
          value={responsable}
          onChange={(e) => setResponsable(e.target.value)}
          placeholder="Responsable de coordinación"
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>Entradas (una por línea)</label>
        <textarea
          value={entradas}
          onChange={(e) => setEntradas(e.target.value)}
          rows={3}
          className={`${inputClass} mt-1`}
        />
      </div>
      <div>
        <label className={labelClass}>Resultados esperados (una por línea)</label>
        <textarea
          value={resultados}
          onChange={(e) => setResultados(e.target.value)}
          rows={3}
          className={`${inputClass} mt-1`}
        />
      </div>
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar iniciativa'}
        </Button>
        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}

function NuevaActividadForm({
  iniciativaId,
  orden,
  onSaved,
}: {
  iniciativaId: string;
  orden: number;
  onSaved: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState('');
  const [responsable, setResponsable] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [entradas, setEntradas] = useState('');
  const [salidas, setSalidas] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) {
    return (
      <Button variant="ghost" onClick={() => setOpen(true)}>
        Agregar actividad
      </Button>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim()) return;
    setSaving(true);
    setError(null);
    const input: PlanActividadInput = {
      nombre: nombre.trim(),
      responsable: responsable.trim() ? responsable.trim() : null,
      fecha_inicio: fechaInicio.trim() ? fechaInicio.trim() : null,
      fecha_fin: fechaFin.trim() ? fechaFin.trim() : null,
      estado: 'No iniciado',
      entradas: textareaToLineas(entradas),
      salidas: textareaToLineas(salidas),
      orden,
    };
    try {
      await createActividad(iniciativaId, input);
      setSaving(false);
      setOpen(false);
      onSaved();
    } catch (e) {
      setSaving(false);
      setError(friendlyPlanError(e));
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-neutral/40 rounded-md p-3 space-y-3"
    >
      <h4 className="font-heading text-sm font-semibold text-primary">
        Nueva actividad
      </h4>
      {error && <p className="font-body text-xs text-danger">{error}</p>}
      <input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Ej. 1.1.1 Definir los roles y responsabilidades"
        className={inputClass}
      />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input
          value={responsable}
          onChange={(e) => setResponsable(e.target.value)}
          placeholder="Responsable"
          className={inputClass}
        />
        <input
          type="date"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
          className={inputClass}
        />
        <input
          type="date"
          value={fechaFin}
          onChange={(e) => setFechaFin(e.target.value)}
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>Entradas (una por línea)</label>
        <textarea
          value={entradas}
          onChange={(e) => setEntradas(e.target.value)}
          rows={2}
          className={`${inputClass} mt-1`}
        />
      </div>
      <div>
        <label className={labelClass}>Salidas (una por línea)</label>
        <textarea
          value={salidas}
          onChange={(e) => setSalidas(e.target.value)}
          rows={2}
          className={`${inputClass} mt-1`}
        />
      </div>
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar actividad'}
        </Button>
        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
