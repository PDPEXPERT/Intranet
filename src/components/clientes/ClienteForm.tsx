'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  createCliente,
  friendlyClienteError,
  listEmpresasHolding,
  updateCliente,
} from '@/lib/clientes';
import type { Cliente, ClienteInput, EmpresaHolding, Moneda } from '@/lib/types';
import { Button } from '@/components/ui/Button';

interface ClienteFormProps {
  /** Si se pasa, el formulario edita este cliente. Si no, crea uno nuevo. */
  cliente?: Cliente;
  onSaved: (cliente: Cliente) => void;
  onCancel: () => void;
}

interface FormState {
  razon_social: string;
  nombre_comercial: string;
  tax_id: string;
  pais: string;
  id_empresa: string;
  moneda: Moneda;
  estado: 'Activo' | 'Cancelado';
  es_aliado: boolean;
}

function initialState(cliente?: Cliente): FormState {
  return {
    razon_social: cliente?.razon_social ?? '',
    nombre_comercial: cliente?.nombre_comercial ?? '',
    tax_id: cliente?.tax_id ?? '',
    pais: cliente?.pais ?? '',
    id_empresa: cliente?.id_empresa ?? '',
    moneda: cliente?.moneda ?? 'USD',
    estado: cliente?.estado ?? 'Activo',
    es_aliado: cliente?.es_aliado ?? false,
  };
}

export function ClienteForm({ cliente, onSaved, onCancel }: ClienteFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialState(cliente));
  const [empresas, setEmpresas] = useState<EmpresaHolding[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    listEmpresasHolding()
      .then(setEmpresas)
      .catch(() => setEmpresas([]));
  }, []);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): Record<string, string> {
    const errors: Record<string, string> = {};
    if (!form.razon_social.trim()) {
      errors.razon_social = 'La razon social es obligatoria.';
    }
    if (!form.nombre_comercial.trim()) {
      errors.nombre_comercial = 'El nombre comercial es obligatorio.';
    }
    if (form.moneda !== 'USD' && form.moneda !== 'CLP') {
      errors.moneda = 'La moneda debe ser USD o CLP.';
    }
    if (form.estado !== 'Activo' && form.estado !== 'Cancelado') {
      errors.estado = 'El estado debe ser Activo o Cancelado.';
    }
    return errors;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSaving(true);
    setError(null);

    const input: ClienteInput = {
      razon_social: form.razon_social.trim(),
      nombre_comercial: form.nombre_comercial.trim(),
      tax_id: form.tax_id.trim() ? form.tax_id.trim() : null,
      pais: form.pais.trim() ? form.pais.trim() : null,
      id_empresa: form.id_empresa || null,
      moneda: form.moneda,
      estado: form.estado,
      es_aliado: form.es_aliado,
    };

    try {
      const saved = cliente
        ? await updateCliente(cliente.id, input)
        : await createCliente(input);
      setSaving(false);
      onSaved(saved);
    } catch (e) {
      setSaving(false);
      setError(friendlyClienteError(e));
    }
  }

  const inputClass =
    'w-full px-3 py-2 text-sm border border-neutral rounded-md bg-surface text-neutral-dark placeholder:text-neutral focus:outline-none focus:border-accent';
  const labelClass =
    'font-body text-xs font-medium text-neutral-dark/70 uppercase tracking-wide';
  const errorClass = 'font-body text-xs text-danger mt-1';

  return (
    <form onSubmit={handleSubmit} className="max-w-[720px] space-y-6">
      <header className="space-y-2">
        <h1 className="font-heading text-2xl font-bold text-primary">
          {cliente ? 'Editar cliente' : 'Nuevo cliente'}
        </h1>
      </header>

      {error && (
        <div className="border border-danger/40 bg-danger/10 rounded-md p-4">
          <p className="font-body text-sm text-danger">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="razon_social">
            Razon social
          </label>
          <input
            id="razon_social"
            type="text"
            value={form.razon_social}
            onChange={(e) => setField('razon_social', e.target.value)}
            className={`${inputClass} mt-1`}
          />
          {fieldErrors.razon_social && (
            <p className={errorClass}>{fieldErrors.razon_social}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="nombre_comercial">
            Nombre comercial
          </label>
          <input
            id="nombre_comercial"
            type="text"
            value={form.nombre_comercial}
            onChange={(e) => setField('nombre_comercial', e.target.value)}
            className={`${inputClass} mt-1`}
          />
          {fieldErrors.nombre_comercial && (
            <p className={errorClass}>{fieldErrors.nombre_comercial}</p>
          )}
        </div>

        <div>
          <label className={labelClass} htmlFor="tax_id">
            Tax ID (RUC / RUT / NIT)
          </label>
          <input
            id="tax_id"
            type="text"
            value={form.tax_id}
            onChange={(e) => setField('tax_id', e.target.value)}
            placeholder="Opcional"
            className={`${inputClass} mt-1`}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="pais">
            Pais
          </label>
          <input
            id="pais"
            type="text"
            value={form.pais}
            onChange={(e) => setField('pais', e.target.value)}
            placeholder="Opcional"
            className={`${inputClass} mt-1`}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="id_empresa">
            Empresa del holding
          </label>
          <select
            id="id_empresa"
            value={form.id_empresa}
            onChange={(e) => setField('id_empresa', e.target.value)}
            className={`${inputClass} mt-1`}
          >
            <option value="">Sin asignar</option>
            {empresas.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.razon_social} ({emp.pais})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="moneda">
            Moneda
          </label>
          <select
            id="moneda"
            value={form.moneda}
            onChange={(e) => setField('moneda', e.target.value as Moneda)}
            className={`${inputClass} mt-1`}
          >
            <option value="USD">USD</option>
            <option value="CLP">CLP</option>
          </select>
          {fieldErrors.moneda && (
            <p className={errorClass}>{fieldErrors.moneda}</p>
          )}
        </div>

        <div>
          <label className={labelClass} htmlFor="estado">
            Estado
          </label>
          <select
            id="estado"
            value={form.estado}
            onChange={(e) =>
              setField('estado', e.target.value as 'Activo' | 'Cancelado')
            }
            className={`${inputClass} mt-1`}
          >
            <option value="Activo">Activo</option>
            <option value="Cancelado">Cancelado</option>
          </select>
          {fieldErrors.estado && (
            <p className={errorClass}>{fieldErrors.estado}</p>
          )}
        </div>

        <div className="flex items-center gap-2 sm:col-span-2 pt-1">
          <input
            id="es_aliado"
            type="checkbox"
            checked={form.es_aliado}
            onChange={(e) => setField('es_aliado', e.target.checked)}
            className="h-4 w-4 rounded border-neutral text-accent focus:outline-none focus:border-accent"
          />
          <label
            htmlFor="es_aliado"
            className="font-body text-sm text-neutral-dark"
          >
            Es aliado
          </label>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar'}
        </Button>
        <Button
          type="button"
          variant="ghost"
          disabled={saving}
          onClick={() => {
            router.push(
              cliente ? `/clientes/detalle/?id=${cliente.id}` : '/clientes/',
            );
            onCancel();
          }}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
