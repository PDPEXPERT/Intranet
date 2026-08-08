import { RoleGuard } from '@/components/RoleGuard';

export default function LiderazgoPage() {
  return (
    <RoleGuard allow={['gerente', 'admin']}>
      <div className="space-y-4">
        <h1 className="font-heading font-bold text-2xl text-primary">
          Módulo de liderazgo
        </h1>
        <p className="text-sm text-neutral-dark max-w-2xl">
          Esta es una página de prueba, visible solo para los roles{' '}
          <strong>gerente</strong> y <strong>admin</strong>. Sirve para
          confirmar que el login con Microsoft y el sistema de roles
          funcionan de punta a punta antes de construir el contenido real
          (indicadores gerenciales, control de operaciones de consultoría,
          etc.).
        </p>
      </div>
    </RoleGuard>
  );
}
