'use client';

import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export type AppRole =
  | 'consultor'
  | 'consultor_dpo'
  | 'jefe_operaciones'
  | 'jefe_administrativo_financiero'
  | 'jefe_tecnologia_seguridad'
  | 'gerente'
  | 'admin';

interface UseUserRolesResult {
  /** true mientras se resuelve la sesión y, si existe, sus roles */
  loading: boolean;
  session: Session | null;
  /** Roles del usuario autenticado. Vacío si no tiene ninguno asignado. */
  roles: AppRole[];
  /** Atajo: session existe pero roles.length === 0 */
  hasNoRole: boolean;
  hasRole: (role: AppRole | AppRole[]) => boolean;
}

/**
 * Hook central de autenticación + autorización.
 *
 * Resuelve la sesión de Supabase (login vía Microsoft) y, si hay sesión,
 * consulta la tabla `user_roles` por el email del usuario para saber
 * qué roles tiene. Un usuario autenticado sin filas en `user_roles`
 * queda con roles: [] (hasNoRole: true) — ver RoleGuard.
 */
export function useUserRoles(): UseUserRolesResult {
  const [session, setSession] = useState<Session | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [rolesChecked, setRolesChecked] = useState(false);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setSessionChecked(true);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setSessionChecked(true);
      // Si cambia la sesión (login/logout), hay que volver a resolver roles.
      setRolesChecked(false);
      setRoles([]);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!sessionChecked) return;
    const email = session?.user.email;
    if (!email) {
      setRoles([]);
      setRolesChecked(true);
      return;
    }

    let mounted = true;
    supabase
      .from('user_roles')
      .select('role')
      .eq('email', email)
      .then(({ data, error }) => {
        if (!mounted) return;
        if (error) {
          // Si la consulta falla (ej. tabla aún no migrada), tratamos
          // como "sin rol" en vez de romper la app.
          setRoles([]);
        } else {
          setRoles((data ?? []).map((r) => r.role as AppRole));
        }
        setRolesChecked(true);
      });

    return () => {
      mounted = false;
    };
  }, [sessionChecked, session]);

  const loading = !sessionChecked || (!!session && !rolesChecked);
  const hasNoRole = sessionChecked && !!session && rolesChecked && roles.length === 0;

  function hasRole(role: AppRole | AppRole[]): boolean {
    const wanted = Array.isArray(role) ? role : [role];
    return wanted.some((r) => roles.includes(r));
  }

  return { loading, session, roles, hasNoRole, hasRole };
}
