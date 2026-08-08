'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useUserRoles } from '@/lib/useUserRoles';
import { supabase } from '@/lib/supabase';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { loading, session, hasNoRole } = useUserRoles();

  useEffect(() => {
    if (loading) return;
    if (!session) router.replace('/login/');
  }, [loading, session, router]);

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface font-body text-sm text-muted">
        Cargando...
      </div>
    );
  }

  if (!session) return null;

  if (hasNoRole) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface font-body px-4">
        <div className="w-full max-w-sm text-center space-y-3">
          <h2 className="font-heading font-bold text-xl text-primary">
            Sin rol asignado
          </h2>
          <p className="text-sm text-neutral-dark">
            Tu cuenta ({session.user.email}) inició sesión correctamente, pero
            todavía no tiene un rol asignado en el Intranet.
          </p>
          <p className="text-sm text-muted">
            Comunícate con el administrador para que te asigne acceso.
          </p>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-4 text-sm text-accent hover:text-primary underline"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
