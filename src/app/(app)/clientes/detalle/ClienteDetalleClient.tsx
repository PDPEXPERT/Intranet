'use client';

import { useSearchParams } from 'next/navigation';
import { ClienteDetail } from '@/components/clientes/ClienteDetail';

export function ClienteDetalleClient() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  if (!id) {
    return (
      <p className="font-body text-sm text-danger">Cliente no encontrado.</p>
    );
  }

  return <ClienteDetail id={id} />;
}
