'use client';

import type { Activity, ActivityType } from '@/lib/types';

const TYPE_LABELS: Record<ActivityType, string> = {
  event_start: 'Inicio',
  activity: 'Actividad',
  decision: 'Decision',
  event_end: 'Fin',
};

function summaryIndex(a: Activity): string {
  if (a.type === 'activity' && a.number !== null) {
    return String(a.number).padStart(2, '0');
  }
  if (a.type === 'event_start') return '__';
  if (a.type === 'event_end') return '__';
  return '__';
}

interface FieldProps {
  label: string;
  value: string | null;
}

function Field({ label, value }: FieldProps) {
  if (!value) return null;
  return (
    <div className="grid grid-cols-[120px_1fr] gap-3">
      <dt className="font-body text-xs font-medium text-neutral-dark/60 uppercase tracking-wide pt-0.5">
        {label}
      </dt>
      <dd className="font-body text-sm text-neutral-dark">{value}</dd>
    </div>
  );
}

function ActivityBody({ activity: a }: { activity: Activity }) {
  if (a.type === 'event_start' || a.type === 'event_end') {
    return null;
  }
  if (a.type === 'decision') {
    return (
      <dl className="space-y-2">
        <dt className="font-body text-xs font-medium text-neutral-dark/60 uppercase tracking-wide">
          Resultados posibles
        </dt>
        <dd>
          <ul className="space-y-2">
            {(a.outcomes ?? []).map((o, i) => (
              <li
                key={i}
                className="grid grid-cols-[1fr_1fr] gap-3 border-l-2 border-accent pl-3"
              >
                <span className="font-body text-sm font-medium text-primary">
                  {o.condition}
                </span>
                <span className="font-body text-sm text-neutral-dark">
                  {o.next}
                </span>
              </li>
            ))}
          </ul>
        </dd>
      </dl>
    );
  }
  return (
    <dl className="space-y-2">
      <Field label="Disparador" value={a.trigger} />
      <Field label="Descripcion" value={a.description} />
      <Field label="Resultado" value={a.result} />
      <Field label="Evidencia" value={a.evidence} />
    </dl>
  );
}

export function ProcedureActivities({ activities }: { activities: Activity[] }) {
  if (activities.length === 0) {
    return (
      <p className="font-body text-sm text-neutral-dark/60">
        No hay actividades cargadas.
      </p>
    );
  }
  return (
    <div className="space-y-2">
      {activities.map((a) => {
        const isEvent = a.type === 'event_start' || a.type === 'event_end';
        const indexLabel = summaryIndex(a);
        const typeLabel =
          a.type === 'activity' && a.number !== null
            ? `Actividad ${a.number}`
            : TYPE_LABELS[a.type];

        return (
          <details
            key={a.id}
            open
            className="border border-neutral/40 rounded-md group [&:not([open])>summary>.indicator]:-rotate-90"
          >
            <summary className="flex items-baseline gap-3 px-3 py-2 cursor-pointer list-none">
              <span className="font-body text-xs font-medium text-neutral-dark/60 w-6 shrink-0">
                {indexLabel}
              </span>
              <span
                className={`font-body text-xs font-medium w-24 shrink-0 ${
                  isEvent || a.type === 'decision'
                    ? 'text-accent'
                    : 'text-primary'
                }`}
              >
                {typeLabel}
              </span>
              <span className="font-body text-sm font-medium text-primary flex-1">
                {a.title}
              </span>
              {a.executor && (
                <span className="font-body text-xs text-neutral-dark/70 shrink-0">
                  {a.executor}
                </span>
              )}
              {!isEvent && (
                <span
                  aria-hidden="true"
                  className="indicator text-primary text-xs select-none shrink-0"
                >
                  v
                </span>
              )}
            </summary>
            {!isEvent && (
              <div className="px-3 py-3 border-t border-neutral/30 bg-accent-light/5">
                <ActivityBody activity={a} />
              </div>
            )}
          </details>
        );
      })}
    </div>
  );
}
