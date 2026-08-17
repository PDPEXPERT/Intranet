'use client';

import { useSearchParams } from 'next/navigation';
import { PlanDetail } from '@/components/planes/PlanDetail';

export function PlanDetalleClient() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  if (!id) {
    return (
      <p className="font-body text-sm text-danger">Plan no encontrado.</p>
    );
  }

  return <PlanDetail id={id} />;
}
