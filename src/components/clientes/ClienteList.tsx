'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { listClientes } from '@/lib/clientes';
import type { Cliente } from '@/lib/types';
import { Table, TableColumn } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

export function ClienteList() {
  const router = useRouter();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    listClientes()
      .then((data) => {
        setClientes(data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e?.message ?? 'Error al cargar clientes');
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return clientes;
    return clientes.filter(
      (c) =>
        normalize(c.nombre_comercial).includes(q) ||
        normalize(c.razon_social).includes(q),
    );
  }, [clientes, query]);

  const columns: TableColumn<Cliente>[] = [
    {
      key: 'nombre_comercial',
      header: 'Nombre comercial',
      cell: (row) => (
        <span className="font-body text-sm font-medium text-primary">
          {row.nombre_comercial}
        </span>
      ),
    },
    {
      key: 'razon_social',
      header: 'Razon social',
      cell: (row) => (
        <span className="font-body text-sm">{row.razon_social}</span>
      ),
    },
    {
      key: 'pais',
      header: 'Pais',
      width: '100px',
      cell: (row) => (
        <span className="font-body text-sm">{row.pais ?? 'Sin dato'}</span>
      ),
    },
    {
      key: 'moneda',
      header: 'Moneda',
      width: '100px',
      cell: (row) => <span className="font-body text-sm">{row.moneda}</span>,
    },
    {
      key: 'estado',
      header: 'Estado',
      width: '120px',
      cell: (row) => (
        <Badge tone={row.estado === 'Activo' ? 'success' : 'danger'}>
          {row.estado}
        </Badge>
      ),
    },
    {
      key: 'es_aliado',
      header: 'Aliado',
      width: '100px',
      cell: (row) =>
        row.es_aliado ? (
          <Badge tone="accent">Aliado</Badge>
        ) : (
          <span className="font-body text-sm text-neutral-dark/50">No</span>
        ),
    },
  ];

  return (
    <div className="max-w-[1120px] mx-auto space-y-6">
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-2">
          <h1 className="font-heading text-2xl font-bold text-primary">
            Clientes
          </h1>
          <p className="font-body text-sm text-neutral-dark/80">
            Identidad y relacion comercial de cada cliente de PDP Expert.
          </p>
        </div>
        <Button onClick={() => router.push('/clientes/nuevo/')}>
          Nuevo cliente
        </Button>
      </header>

      <div>
        <input
          type="search"
          placeholder="Buscar por nombre comercial o razon social..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
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
          onRowClick={(row) => router.push(`/clientes/detalle/?id=${row.id}`)}
          emptyMessage="No hay clientes que coincidan con la busqueda."
        />
      )}
    </div>
  );
}
