'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  getProcedureByCode,
  listActivitiesByProcedureId,
  listInvocations,
  InvocationGroups,
} from '@/lib/procedures';
import type { Activity, Procedure } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';
import { CollapsibleSection } from '@/components/ui/CollapsibleSection';
import { ExpandCollapseAll } from '@/components/ui/ExpandCollapseAll';
import { Table, TableColumn } from '@/components/ui/Table';
import { ProcedureActivities } from './ProcedureActivities';

const SECTIONS = [
  { id: 'sec-proposito', label: 'Proposito' },
  { id: 'sec-alcance', label: 'Alcance' },
  { id: 'sec-responsabilidades', label: 'Responsabilidades' },
  { id: 'sec-entradas', label: 'Entradas' },
  { id: 'sec-salidas', label: 'Salidas' },
  { id: 'sec-controles', label: 'Controles' },
  { id: 'sec-riesgos', label: 'Riesgos' },
  { id: 'sec-indicadores', label: 'Indicadores' },
  { id: 'sec-excepciones', label: 'Excepciones' },
  { id: 'sec-actividades', label: 'Actividades' },
  { id: 'sec-invocaciones', label: 'Invocaciones' },
];

interface State {
  procedure: Procedure | null;
  activities: Activity[];
  invocations: InvocationGroups;
  loading: boolean;
  error: string | null;
}

export function ProcedureDetail({ code }: { code: string }) {
  const [state, setState] = useState<State>({
    procedure: null,
    activities: [],
    invocations: { calls: [], calledBy: [] },
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const procedure = await getProcedureByCode(code);
        if (!procedure) {
          if (!cancelled)
            setState((s) => ({
              ...s,
              loading: false,
              error: 'Procedimiento no encontrado.',
            }));
          return;
        }
        const [activities, invocations] = await Promise.all([
          listActivitiesByProcedureId(procedure.id),
          listInvocations(procedure.id),
        ]);
        if (cancelled) return;
        setState({
          procedure,
          activities,
          invocations,
          loading: false,
          error: null,
        });
      } catch (e) {
        if (cancelled) return;
        setState((s) => ({
          ...s,
          loading: false,
          error: (e as Error).message ?? 'Error al cargar el procedimiento.',
        }));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [code]);

  if (state.loading) {
    return (
      <p className="font-body text-sm text-neutral-dark/60">Cargando...</p>
    );
  }
  if (state.error || !state.procedure) {
    return (
      <p className="font-body text-sm text-danger">
        {state.error ?? 'Procedimiento no encontrado.'}
      </p>
    );
  }

  const p = state.procedure;
  const sectionsRootId = 'procedure-sections';

  return (
    <div className="max-w-[1120px] mx-auto space-y-6">
      <header className="space-y-3">
        <div className="font-body text-xs font-medium text-neutral-dark/60">
          {p.code}
        </div>
        <div className="flex items-baseline gap-3 flex-wrap">
          <h1 className="font-heading text-2xl font-bold text-primary">
            {p.title}
          </h1>
          <Badge tone={p.part === 'compartidos' ? 'accent' : 'neutral'}>
            {p.part === 'compartidos' ? 'Compartidos' : 'Servicio'}
          </Badge>
        </div>
        <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
          <nav className="font-body text-xs text-neutral-dark/70">
            Saltar a:{' '}
            {SECTIONS.map((s, i) => (
              <span key={s.id}>
                {i > 0 && <span className="mx-1 text-neutral-dark/40">.</span>}
                <a href={`#${s.id}`} className="text-accent hover:text-primary">
                  {s.label}
                </a>
              </span>
            ))}
          </nav>
          <ExpandCollapseAll targetSelector={`#${sectionsRootId}`} />
        </div>
      </header>

      <div id={sectionsRootId} className="space-y-2">
        <CollapsibleSection id="sec-proposito" title="Proposito">
          <p className="whitespace-pre-line">{p.purpose}</p>
        </CollapsibleSection>

        <CollapsibleSection id="sec-alcance" title="Alcance">
          <p className="whitespace-pre-line">{p.scope}</p>
        </CollapsibleSection>

        <CollapsibleSection id="sec-responsabilidades" title="Responsabilidades">
          <Table
            rows={p.responsibilities}
            rowKey={(r) => r.role}
            columns={[
              {
                key: 'role',
                header: 'Rol',
                width: '220px',
                cell: (r) => (
                  <span className="font-medium text-primary">{r.role}</span>
                ),
              },
              {
                key: 'responsibility',
                header: 'Responsabilidad',
                cell: (r) => <span>{r.responsibility}</span>,
              },
              {
                key: 'authority',
                header: 'Autoridad',
                cell: (r) => <span>{r.authority}</span>,
              },
            ]}
          />
        </CollapsibleSection>

        <CollapsibleSection id="sec-entradas" title="Entradas">
          <Table
            rows={p.inputs}
            rowKey={(r) => r.input}
            columns={[
              {
                key: 'input',
                header: 'Entrada',
                width: '260px',
                cell: (r) => (
                  <span className="font-medium text-primary">{r.input}</span>
                ),
              },
              {
                key: 'origin',
                header: 'Origen',
                width: '180px',
                cell: (r) => <span>{r.origin}</span>,
              },
              {
                key: 'condition',
                header: 'Condicion',
                cell: (r) => <span>{r.condition}</span>,
              },
            ]}
          />
        </CollapsibleSection>

        <CollapsibleSection id="sec-salidas" title="Salidas">
          <Table
            rows={p.outputs}
            rowKey={(r) => r.output}
            columns={[
              {
                key: 'output',
                header: 'Salida',
                width: '260px',
                cell: (r) => (
                  <span className="font-medium text-primary">{r.output}</span>
                ),
              },
              {
                key: 'recipient',
                header: 'Destinatario',
                width: '220px',
                cell: (r) => <span>{r.recipient}</span>,
              },
              {
                key: 'format',
                header: 'Formato',
                cell: (r) => <span>{r.format}</span>,
              },
            ]}
          />
        </CollapsibleSection>

        <CollapsibleSection id="sec-controles" title="Controles">
          <Table
            rows={p.controls}
            rowKey={(r) => r.control}
            columns={[
              {
                key: 'control',
                header: 'Control',
                cell: (r) => (
                  <span className="font-medium text-primary">{r.control}</span>
                ),
              },
              {
                key: 'activity',
                header: 'Actividad',
                width: '120px',
                cell: (r) => <span>{r.activity}</span>,
              },
              {
                key: 'executor',
                header: 'Ejecutor',
                width: '180px',
                cell: (r) => <span>{r.executor}</span>,
              },
              {
                key: 'frequency',
                header: 'Frecuencia',
                width: '160px',
                cell: (r) => <span>{r.frequency}</span>,
              },
              {
                key: 'failure_action',
                header: 'Accion ante fallo',
                cell: (r) => <span>{r.failure_action}</span>,
              },
            ]}
          />
        </CollapsibleSection>

        <CollapsibleSection id="sec-riesgos" title="Riesgos">
          <Table
            rows={p.risks}
            rowKey={(r) => r.risk}
            columns={[
              {
                key: 'risk',
                header: 'Riesgo',
                width: '260px',
                cell: (r) => (
                  <span className="font-medium text-primary">{r.risk}</span>
                ),
              },
              {
                key: 'description',
                header: 'Descripcion',
                cell: (r) => <span>{r.description}</span>,
              },
              {
                key: 'activity',
                header: 'Actividad',
                width: '140px',
                cell: (r) => <span>{r.activity}</span>,
              },
              {
                key: 'mitigation',
                header: 'Mitigacion',
                cell: (r) => <span>{r.mitigation}</span>,
              },
            ]}
          />
        </CollapsibleSection>

        <CollapsibleSection id="sec-indicadores" title="Indicadores">
          <Table
            rows={p.indicators}
            rowKey={(r) => r.indicator}
            columns={[
              {
                key: 'indicator',
                header: 'Indicador',
                width: '220px',
                cell: (r) => (
                  <span className="font-medium text-primary">{r.indicator}</span>
                ),
              },
              {
                key: 'calculation',
                header: 'Calculo',
                cell: (r) => <span>{r.calculation}</span>,
              },
              {
                key: 'frequency',
                header: 'Frecuencia',
                width: '120px',
                cell: (r) => <span>{r.frequency}</span>,
              },
              {
                key: 'responsible',
                header: 'Responsable',
                width: '180px',
                cell: (r) => <span>{r.responsible}</span>,
              },
              {
                key: 'acceptable_value',
                header: 'Valor aceptable',
                width: '160px',
                cell: (r) => <span>{r.acceptable_value}</span>,
              },
            ]}
          />
        </CollapsibleSection>

        <CollapsibleSection id="sec-excepciones" title="Excepciones">
          <div className="space-y-3">
            {p.exceptions.map((ex) => (
              <div
                key={ex.id}
                className="border border-neutral/40 rounded-md p-4 space-y-2"
              >
                <div className="font-heading text-sm font-semibold text-primary">
                  {ex.id}. {ex.title}
                </div>
                <ExceptionField label="Situacion" value={ex.situation} />
                <ExceptionField label="Deteccion" value={ex.detection} />
                <ExceptionField label="Manejo" value={ex.handling} />
              </div>
            ))}
          </div>
        </CollapsibleSection>

        <CollapsibleSection id="sec-actividades" title="Actividades">
          <ProcedureActivities activities={state.activities} />
        </CollapsibleSection>

        <CollapsibleSection id="sec-invocaciones" title="Invocaciones">
          <div className="space-y-4">
            <InvocationGroup
              label="Este procedimiento llama a"
              links={state.invocations.calls}
            />
            <InvocationGroup
              label="Este procedimiento es llamado por"
              links={state.invocations.calledBy}
            />
          </div>
        </CollapsibleSection>
      </div>
    </div>
  );
}

function ExceptionField({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[100px_1fr] gap-3">
      <div className="font-body text-xs font-medium text-neutral-dark/60 uppercase tracking-wide pt-0.5">
        {label}
      </div>
      <div className="font-body text-sm text-neutral-dark">{value}</div>
    </div>
  );
}

function InvocationGroup({
  label,
  links,
}: {
  label: string;
  links: { code: string; title: string; context: string }[];
}) {
  if (links.length === 0) {
    return (
      <div>
        <div className="font-body text-xs font-medium text-neutral-dark/60 uppercase tracking-wide mb-2">
          {label}
        </div>
        <p className="font-body text-sm text-neutral-dark/60">Ninguna.</p>
      </div>
    );
  }
  return (
    <div>
      <div className="font-body text-xs font-medium text-neutral-dark/60 uppercase tracking-wide mb-2">
        {label}
      </div>
      <ul className="space-y-1">
        {links.map((link, i) => (
          <li key={`${link.code}-${i}`}>
            <Link
              href={`/procesos/${link.code}/`}
              className="font-body text-sm text-accent hover:text-primary"
            >
              {link.code} {link.title}
            </Link>
            {link.context && (
              <span className="font-body text-xs text-neutral-dark/60 ml-2">
                ({link.context})
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
