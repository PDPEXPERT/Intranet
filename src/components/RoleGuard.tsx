'use client';

import { useUserRoles, type AppRole } from '@/lib/useUserRoles';

/**
 * Protege una sección específica del Intranet por rol, además del
 * AuthGuard general (que ya exige sesión + al menos un rol).
 *
 * Uso:
 *   <RoleGuard allow={['gerente', 'admin']}>
 *     <ModuloGerencial />
 *   </RoleGuard>
 */
export function RoleGuard({
  allow,
  children,
}: {
  allow: AppRole[];
  children: React.ReactNode;
}) {
  const { loading, hasRole } = useUserRoles();

  if (loading) {
    return (
      <div className="text-sm text-muted font-body">Cargando...</div>
    );
  }

  if (!hasRole(allow)) {
    return (
      <div className="max-w-md space-y-2">
        <h2 className="font-heading font-bold text-lg text-primary">
          No tienes acceso a esta sección
        </h2>
        <p className="text-sm text-muted">
          Este módulo está restringido a roles específicos. Si crees que
          deberías tener acceso, contacta al administrador.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
