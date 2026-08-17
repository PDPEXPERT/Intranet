import { Suspense } from 'react';
import { PlanDetalleClient } from './PlanDetalleClient';

// Mismo patron que clientes/detalle: output: 'export' no permite rutas
// dinamicas [id] cuyo parametro solo existe en Supabase (UUIDs). El id
// del plan viaja por query string (?id=...), resuelto en el cliente.
export default function PlanDetallePage() {
  return (
    <Suspense
      fallback={
        <p className="font-body text-sm text-neutral-dark/60">Cargando...</p>
      }
    >
      <PlanDetalleClient />
    </Suspense>
  );
}
