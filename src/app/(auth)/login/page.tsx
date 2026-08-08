'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

function IconMicrosoft({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 23 23" className={className} aria-hidden="true">
      <rect x="1" y="1" width="10" height="10" fill="#F25022" />
      <rect x="12" y="1" width="10" height="10" fill="#7FBA00" />
      <rect x="1" y="12" width="10" height="10" fill="#00A4EF" />
      <rect x="12" y="12" width="10" height="10" fill="#FFB900" />
    </svg>
  );
}

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleMicrosoftLogin() {
    setError(null);
    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: 'azure',
      options: {
        // Al ser static export, la app no tiene servidor propio: se
        // redirige de vuelta a la raíz del sitio y AuthGuard se encarga
        // de resolver la sesión y, según el rol, dejar entrar o no.
        redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
      },
    });
    if (signInError) {
      setLoading(false);
      setError('No se pudo iniciar el proceso de inicio de sesión. Intenta de nuevo.');
    }
    // Si no hay error, el navegador es redirigido a Microsoft. No hay
    // nada más que hacer aquí: al volver, AuthGuard detecta la sesión.
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-surface font-body">
      <div className="w-full max-w-sm p-6 bg-surface border border-neutral rounded-lg">
        <h2 className="font-heading font-bold text-xl text-primary text-center mb-1">
          Iniciar sesión
        </h2>
        <p className="text-sm text-muted text-center mb-6">
          Acceso exclusivo para el equipo de PDP Expert
        </p>

        <button
          type="button"
          onClick={handleMicrosoftLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-surface text-neutral-dark border border-neutral rounded-md hover:bg-accent-light/20 disabled:opacity-50"
        >
          <IconMicrosoft className="w-5 h-5 shrink-0" />
          <span className="font-medium text-sm">
            {loading ? 'Redirigiendo…' : 'Iniciar sesión con Microsoft'}
          </span>
        </button>

        {error && (
          <p className="text-sm text-danger text-center mt-4">{error}</p>
        )}

        <p className="text-xs text-muted text-center mt-6">
          Usa tu cuenta corporativa @pdpexpert.com
        </p>
      </div>
    </div>
  );
}
