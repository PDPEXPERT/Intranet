import { Suspense } from 'react';
import { ClienteDetalleClient } from './ClienteDetalleClient';

// output: 'export' no permite rutas dinamicas cuyo parametro no se conoce
// en build time (los ids de cliente son UUIDs que solo existen en
// Supabase): generateStaticParams() con un array vacio directamente falla
// el build ("Page ... is missing generateStaticParams()"), verificado con
// un build real de este proyecto. En vez de forzar un shell dinamico
// [id], esta ruta es estatica (un solo archivo /clientes/detalle/) y el
// id del cliente viaja por query string (?id=...), resuelto en el
// cliente con useSearchParams(). Cambia la URL de /clientes/<uuid>/ a
// /clientes/detalle/?id=<uuid>, pero es 100% compatible con
// output: 'export' en cualquier hosting estatico, sin reglas de rewrite
// especiales del lado del servidor.
export default function ClienteDetallePage() {
  return (
    <Suspense
      fallback={
        <p className="font-body text-sm text-neutral-dark/60">Cargando...</p>
      }
    >
      <ClienteDetalleClient />
    </Suspense>
  );
}
