'use client';

import { useEffect, useMemo, useState } from 'react';
import { createTarea, deleteTarea, friendlyTareaError, listTareas, updateTarea } from '@/lib/tareas';
import type { EstadoTarea, TareaConOrigen, TareaInput } from '@/lib/types';
import { useUserRoles } from '@/lib/useUserRoles';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Table, TableColumn } from '@/components/ui/Table';

const CAN_WRITE_ROLES = [
  'consultor',
  'consultor_dpo',
  'jefe_operaciones',
  'gerente',
  'admin',
] as const;

function estadoTone(estado: EstadoTarea): 'success' | 'accent' | 'neutral' {
  if (estado === 'Completada') return 'success';
  if (estado === 'En progreso') return 'accent';
  return 'neutral';
}

export function TareasList() {
  const { hasRole } = useUserRoles();
  const canWrite = hasRole([...CAN_WRITE_ROLES]);

  const [tareas, setTareas] = useState<TareaConOrigen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroConsultor, setFiltroConsultor] = useState('');
  const [showForm, setShowForm] = useState(false);

  async function load() {
    try {
      const data = await listTareas();
      setTareas(data);
      setLoading(false);
    } catch (e) {
      setError((e as Error).message ?? 'Error al cargar tareas.');
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = filtroConsultor.trim().toLowerCase();
    if (!q) return tareas;
    return tareas.filter((t) => t.consultor.toLowerCase().includes(q));
  }, [tareas, filtroConsultor]);

  const columns: TableColumn<TareaConOrigen>[] = [
    {
      key: 'descripcion',
      header: 'Tarea',
      cell: (row) => (
        <div>
          <span className="font-body text-sm font-medium text-primary block">
            {row.descripcion}
          </span>
          <span className="font-body text-xs text-neutral-dark/60">
            {row.origen_nombre
              ? `Plan · ${row.origen_nombre}`
              : row.id_ticket
                ? 'Ticket'
                : 'Tarea suelta'}
          </span>
        </div>
      ),
    },
    {
      key: 'consultor',
      header: 'Consultor',
      width: '110px',
      cell: (row) => <span className="font-body text-sm">{row.consultor}</span>,
    },
    {
      key: 'fecha',
      header: 'Fecha',
      width: '120px',
      cell: (row) => <span className="font-body text-sm">{row.fecha}</span>,
    },
    {
      key: 'estado',
      header: 'Estado',
      width: '160px',
      cell: (row) =>
        canWrite ? (
          <select
            value={row.estado}
            onChange={async (e) => {
              const nuevoEstado = e.target.value as EstadoTarea;
              try {
                await updateTarea(row.id, {
                  consultor: row.consultor,
                  descripcion: row.descripcion,
                  fecha: row.fecha,
                  estado: nuevoEstado,
                  id_actividad: row.id_actividad,
                  id_ticket: row.id_ticket,
                });
                load();
              } catch (err) {
                alert(friendlyTareaError(err));
              }
            }}
            className="px-2 py-1 text-xs border border-neutral rounded-md bg-surface text-neutral-dark focus:outline-none focus:border-accent"
          >
            <option value="Pendiente">Pendiente</option>
            <option value="En progreso">En progreso</option>
            <option value="Completada">Completada</option>
          </select>
        ) : (
          <Badge tone={estadoTone(row.estado)}>{row.estado}</Badge>
        ),
    },
  ];

  if (canWrite) {
    columns.push({
      key: 'acciones',
      header: 'Acciones',
      width: '100px',
      cell: (row) =>
        row.id_actividad ? null : (
          <button
            type="button"
            onClick={async () => {
              try {
                await deleteTarea(row.id);
                load();
              } catch (e) {
                alert(friendlyTareaError(e));
              }
            }}
            className="font-body text-xs text-danger hover:text-danger/70"
          >
            Eliminar
          </button>
        ),
    });
  }

  return (
    <div className="max-w-[1120px] mx-auto space-y-6">
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-2">
          <h1 className="font-heading text-2xl font-bold text-primary">
            Mis tareas
          </h1>
          <p className="font-body text-sm text-neutral-dark/80">
            Tareas de ejecución diaria: vienen de una actividad de un plan de
            implementación, o son tareas sueltas creadas directamente.
          </p>
        </div>
        {canWrite && (
          <Button onClick={() => setShowForm((v) => !v)}>
            {showForm ? 'Cerrar' : 'Nueva tarea suelta'}
          </Button>
        )}
      </header>

      {canWrite && showForm && (
        <NuevaTareaSueltaForm
          onSaved={() => {
            setShowForm(false);
            load();
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div>
        <input
          type="search"
          placeholder="Filtrar por consultor..."
          value={filtroConsultor}
          onChange={(e) => setFiltroConsultor(e.target.value)}
          className="w-full max-w-sm px-3 py-1.5 text-sm border border-neutral rounded-md bg-surface text-neutral-dark placeholder:text-neutral focus:outline-none focus:border-accent"
        />
      </div>

      {loading && (
        <p className="font-body text-sm text-neutral-dark/60">Cargando...</p>
      )}
      {error && <p className="font-body text-sm text-danger">{error}</p>}
      {!loading && !error && (
        <Table
          columns={columns}
          rows={filtered}
          rowKey={(row) => row.id}
          emptyMessage="No hay tareas registradas."
        />
      )}
    </div>
  );
}

function NuevaTareaSueltaForm({
  onSaved,
  onCancel,
}: {
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [consultor, setConsultor] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);

  const inputClass =
    'w-full px-3 py-2 text-sm border border-neutral rounded-md bg-surface text-neutral-dark placeholder:text-neutral focus:outline-none focus:border-accent';
  const labelClass =
    'font-body text-xs font-medium text-neutral-dark/70 uppercase tracking-wide';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!consultor.trim() || !descripcion.trim()) {
      setFieldError('Consultor y descripción son obligatorios.');
      return;
    }
    setFieldError(null);
    setSaving(true);
    setError(null);

    // Tarea suelta: sin id_actividad ni id_ticket. El modulo de Tickets
    // no existe todavia (ver migracion 005), asi que esta es la unica
    // forma de crear una tarea "sin dueño" por ahora.
    const input: TareaInput = {
      consultor: consultor.trim(),
      descripcion: descripcion.trim(),
      fecha,
      estado: 'Pendiente',
      id_actividad: null,
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
      className="border border-neutral/40 rounded-md p-4 space-y-4"
    >
      <h3 className="font-heading text-lg font-semibold text-primary">
        Nueva tarea suelta
      </h3>
      <p className="font-body text-xs text-neutral-dark/60">
        No está vinculada a ningún plan de implementación ni ticket. Útil para
        trabajo puntual mientras el módulo de Tickets no existe.
      </p>

      {error && <p className="font-body text-xs text-danger">{error}</p>}
      {fieldError && <p className="font-body text-xs text-danger">{fieldError}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass} htmlFor="tarea_consultor">
            Consultor
          </label>
          <input
            id="tarea_consultor"
            type="text"
            value={consultor}
            onChange={(e) => setConsultor(e.target.value)}
            placeholder="Ej. PA"
            className={`${inputClass} mt-1`}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="tarea_fecha">
            Fecha
          </label>
          <input
            id="tarea_fecha"
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className={`${inputClass} mt-1`}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="tarea_descripcion">
            Descripción
          </label>
          <input
            id="tarea_descripcion"
            type="text"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className={`${inputClass} mt-1`}
          />
        </div>
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
