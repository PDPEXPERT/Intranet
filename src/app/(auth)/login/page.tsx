'use client';

import { FormEvent, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (signInError) {
      setError('Credenciales inválidas. Intenta de nuevo.');
      return;
    }
    // AuthGuard detecta la sesión y redirige a /
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-surface font-body">
      <div className="w-full max-w-sm p-6 bg-surface border border-neutral rounded-lg">
        <h2 className="font-heading font-bold text-xl text-primary text-center mb-1">
          Iniciar sesión
        </h2>
        <p className="text-sm text-muted text-center mb-6">
          Acceso exclusivo para consultores PDP Expert
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-primary mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-surface text-neutral-dark border border-neutral rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-primary mb-1"
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-surface text-neutral-dark border border-neutral rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
            />
          </div>
          {error && <p className="text-sm text-danger">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-accent text-on-primary rounded-md hover:bg-accent-light disabled:opacity-50"
          >
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
