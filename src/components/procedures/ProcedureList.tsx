'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { listProcedures } from '@/lib/procedures';
import type { ProcedureSummary } from '@/lib/types';
import { Table, TableColumn } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';

export function ProcedureList() {
  const router = useRouter();
  const [procedures, setProcedures] = useState<ProcedureSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listProcedures()
      .then((data) => {
        setProcedures(data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e?.message ?? 'Error al cargar procedimientos');
        setLoading(false);
      });
  }, []);

  const columns: TableColumn<ProcedureSummary>[] = [
    {
      key: 'code',
      header: 'Codigo',
      width: '140px',
      cell: (row) => (
        <span className="font-body text-sm font-medium text-primary">
          {row.code}
        </span>
      ),
    },
    {
      key: 'title',
      header: 'Titulo',
      cell: (row) => <span className="font-body text-sm">{row.title}</span>,
    },
    {
      key: 'part',
      header: 'Parte',
      width: '140px',
      cell: (row) => (
        <Badge tone={row.part === 'compartidos' ? 'accent' : 'neutral'}>
          {row.part === 'compartidos' ? 'Compartidos' : 'Servicio'}
        </Badge>
      ),
    },
    {
      key: 'activity_count',
      header: 'Actividades',
      width: '120px',
      cell: (row) => (
        <span className="font-body text-sm text-neutral-dark/70">
          {row.activity_count}
        </span>
      ),
    },
  ];

  return (
    <div className="max-w-[960px] mx-auto space-y-6">
      <header className="space-y-2">
        <h1 className="font-heading text-2xl font-bold text-primary">
          Procedimientos de consultoria
        </h1>
        <p className="font-body text-sm text-neutral-dark/80">
          Los procedimientos que dirigen la operacion: compartidos a todos los
          servicios y especificos del tipo de servicio. Cada procedimiento
          incluye proposito, responsabilidades, controles, riesgos, indicadores
          y el flujo de actividades.
        </p>
      </header>

      {loading && (
        <p className="font-body text-sm text-neutral-dark/60">Cargando...</p>
      )}
      {error && <p className="font-body text-sm text-danger">{error}</p>}
      {!loading && !error && (
        <Table
          columns={columns}
          rows={procedures}
          rowKey={(row) => row.code}
          onRowClick={(row) => router.push(`/procesos/${row.code}/`)}
          emptyMessage="No hay procedimientos cargados."
        />
      )}
    </div>
  );
}
