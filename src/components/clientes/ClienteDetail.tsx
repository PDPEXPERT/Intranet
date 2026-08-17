'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  createContactoCliente,
  createServicioCliente,
  deleteContactoCliente,
  friendlyClienteError,
  getClienteById,
  listCatalogoServicios,
  listContactosByCliente,
  listServiciosByCliente,
  listTiposContacto,
  updateContactoCliente,
  updateServicioCliente,
} from '@/lib/clientes';
import type {
  CatalogoServicio,
  Cliente,
  ContactoCliente,
  ContactoClienteInput,
  EstadoServicioCliente,
  ServicioClienteConCatalogo,
  ServicioClienteInput,
  TipoContacto,
} from '@/lib/types';
import { useUserRoles } from '@/lib/useUserRoles';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CollapsibleSection } from '@/components/ui/CollapsibleSection';
import { Table, TableColumn } from '@/components/ui/Table';
import { ClienteForm } from './ClienteForm';

const CAN_WRITE_ROLES = ['jefe_operaciones', 'gerente', 'admin'] as const;

interface State {
  cliente: Cliente | null;
  contactos: ContactoCliente[];
  tiposContacto: TipoContacto[];
  servicios: ServicioClienteConCatalogo[];
  catalogoServicios: CatalogoServicio[];
  loading: boolean;
  error: string | null;
}

export function ClienteDetail({ id }: { id: string }) {
  const router = useRouter();
  const { hasRole } = useUserRoles();
  const canWrite = hasRole([...CAN_WRITE_ROLES]);

  const [state, setState] = useState<State>({
    cliente: null,
    contactos: [],
    tiposContacto: [],
    servicios: [],
    catalogoServicios: [],
    loading: true,
    error: null,
  });
  const [editing, setEditing] = useState(false);

  async function load() {
    try {
      const cliente = await getClienteById(id);
      if (!cliente) {
        setState((s) => ({ ...s, loading: false, error: 'Cliente no encontrado.' }));
        return;
      }
      const [contactos, tiposContacto, servicios, catalogoServicios] =
        await Promise.all([
          listContactosByCliente(cliente.id),
          listTiposContacto(),
          listServiciosByCliente(cliente.id),
          listCatalogoServicios(),
        ]);
      setState({
        cliente,
        contactos,
        tiposContacto,
        servicios,
        catalogoServicios,
        loading: false,
        error: null,
      });
    } catch (e) {
      setState((s) => ({
        ...s,
        loading: false,
        error: (e as Error).message ?? 'Error al cargar el cliente.',
      }));
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (state.loading) {
    return <p className="font-body text-sm text-neutral-dark/60">Cargando...</p>;
  }
  if (state.error || !state.cliente) {
    return (
      <p className="font-body text-sm text-danger">
        {state.error ?? 'Cliente no encontrado.'}
      </p>
    );
  }

  const c = state.cliente;

  if (editing) {
    return (
      <div className="max-w-[1120px] mx-auto">
        <ClienteForm
          cliente={c}
          onSaved={(saved) => {
            setState((s) => ({ ...s, cliente: saved }));
            setEditing(false);
          }}
          onCancel={() => setEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-[1120px] mx-auto space-y-6">
      <header className="space-y-3">
        <div className="flex items-baseline gap-3 flex-wrap">
          <h1 className="font-heading text-2xl font-bold text-primary">
            {c.nombre_comercial}
          </h1>
          <Badge tone={c.estado === 'Activo' ? 'success' : 'danger'}>
            {c.estado}
          </Badge>
          {c.es_aliado && <Badge tone="accent">Aliado</Badge>}
        </div>
        <p className="font-body text-sm text-neutral-dark/70">
          {c.razon_social}
        </p>
        {canWrite && (
          <div>
            <Button variant="ghost" onClick={() => setEditing(true)}>
              Editar
            </Button>
          </div>
        )}
      </header>

      <div className="space-y-2">
        <CollapsibleSection id="sec-datos-generales" title="Datos generales">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            <Field label="Razon social" value={c.razon_social} />
            <Field label="Nombre comercial" value={c.nombre_comercial} />
            <Field label="Tax ID" value={c.tax_id ?? 'Sin dato'} />
            <Field label="Pais" value={c.pais ?? 'Sin dato'} />
            <Field label="Moneda" value={c.moneda} />
            <Field label="Estado" value={c.estado} />
            <Field label="Es aliado" value={c.es_aliado ? 'Si' : 'No'} />
          </dl>
        </CollapsibleSection>

        <CollapsibleSection id="sec-servicios" title="Servicios contratados">
          <ServiciosSection
            clienteId={c.id}
            servicios={state.servicios}
            catalogoServicios={state.catalogoServicios}
            canWrite={canWrite}
            onChanged={load}
          />
        </CollapsibleSection>

        <CollapsibleSection id="sec-contactos" title="Contactos">
          <ContactosSection
            clienteId={c.id}
            contactos={state.contactos}
            tiposContacto={state.tiposContacto}
            canWrite={canWrite}
            onChanged={load}
          />
        </CollapsibleSection>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-body text-xs font-medium text-neutral-dark/60 uppercase tracking-wide">
        {label}
      </dt>
      <dd className="font-body text-sm text-neutral-dark mt-0.5">{value}</dd>
    </div>
  );
}

function ContactosSection({
  clienteId,
  contactos,
  tiposContacto,
  canWrite,
  onChanged,
}: {
  clienteId: string;
  contactos: ContactoCliente[];
  tiposContacto: TipoContacto[];
  canWrite: boolean;
  onChanged: () => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [editingContacto, setEditingContacto] = useState<ContactoCliente | null>(
    null,
  );

  function tipoNombre(idTipo: string): string {
    return tiposContacto.find((t) => t.id === idTipo)?.nombre ?? idTipo;
  }

  const columns: TableColumn<ContactoCliente>[] = [
    {
      key: 'nombre',
      header: 'Nombre',
      cell: (row) => (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-primary">{row.nombre}</span>
          {row.es_principal && <Badge tone="accent">Principal</Badge>}
        </div>
      ),
    },
    {
      key: 'cargo',
      header: 'Cargo',
      width: '160px',
      cell: (row) => <span>{row.cargo ?? 'Sin dato'}</span>,
    },
    {
      key: 'id_tipo_contacto',
      header: 'Tipo',
      width: '160px',
      cell: (row) => <span>{tipoNombre(row.id_tipo_contacto)}</span>,
    },
    {
      key: 'email',
      header: 'Email',
      width: '220px',
      cell: (row) => <span>{row.email ?? 'Sin dato'}</span>,
    },
    {
      key: 'telefono',
      header: 'Telefono',
      width: '140px',
      cell: (row) => <span>{row.telefono ?? 'Sin dato'}</span>,
    },
  ];

  if (canWrite) {
    columns.push({
      key: 'acciones',
      header: 'Acciones',
      width: '160px',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setEditingContacto(row)}
            className="font-body text-xs text-accent hover:text-primary"
          >
            Editar
          </button>
          <button
            type="button"
            onClick={async () => {
              try {
                await deleteContactoCliente(row.id);
                onChanged();
              } catch (e) {
                alert(friendlyClienteError(e));
              }
            }}
            className="font-body text-xs text-danger hover:text-danger/70"
          >
            Eliminar
          </button>
        </div>
      ),
    });
  }

  return (
    <div className="space-y-4">
      <Table
        columns={columns}
        rows={contactos}
        rowKey={(row) => row.id}
        emptyMessage="Este cliente no tiene contactos registrados."
      />

      {canWrite && !showForm && !editingContacto && (
        <Button variant="ghost" onClick={() => setShowForm(true)}>
          Agregar contacto
        </Button>
      )}

      {canWrite && (showForm || editingContacto) && (
        <ContactoForm
          clienteId={clienteId}
          tiposContacto={tiposContacto}
          contacto={editingContacto ?? undefined}
          onSaved={() => {
            setShowForm(false);
            setEditingContacto(null);
            onChanged();
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingContacto(null);
          }}
        />
      )}
    </div>
  );
}

function ContactoForm({
  clienteId,
  tiposContacto,
  contacto,
  onSaved,
  onCancel,
}: {
  clienteId: string;
  tiposContacto: TipoContacto[];
  contacto?: ContactoCliente;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [nombre, setNombre] = useState(contacto?.nombre ?? '');
  const [cargo, setCargo] = useState(contacto?.cargo ?? '');
  const [email, setEmail] = useState(contacto?.email ?? '');
  const [telefono, setTelefono] = useState(contacto?.telefono ?? '');
  const [idTipoContacto, setIdTipoContacto] = useState(
    contacto?.id_tipo_contacto ?? tiposContacto[0]?.id ?? '',
  );
  const [esPrincipal, setEsPrincipal] = useState(contacto?.es_principal ?? false);
  const [notas, setNotas] = useState(contacto?.notas ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);

  const inputClass =
    'w-full px-3 py-2 text-sm border border-neutral rounded-md bg-surface text-neutral-dark placeholder:text-neutral focus:outline-none focus:border-accent';
  const labelClass =
    'font-body text-xs font-medium text-neutral-dark/70 uppercase tracking-wide';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim()) {
      setFieldError('El nombre del contacto es obligatorio.');
      return;
    }
    if (!idTipoContacto) {
      setFieldError('Selecciona un tipo de contacto.');
      return;
    }
    setFieldError(null);
    setSaving(true);
    setError(null);

    const input: ContactoClienteInput = {
      nombre: nombre.trim(),
      cargo: cargo.trim() ? cargo.trim() : null,
      email: email.trim() ? email.trim() : null,
      telefono: telefono.trim() ? telefono.trim() : null,
      id_tipo_contacto: idTipoContacto,
      es_principal: esPrincipal,
      notas: notas.trim() ? notas.trim() : null,
    };

    try {
      if (contacto) {
        await updateContactoCliente(contacto.id, input);
      } else {
        await createContactoCliente(clienteId, input);
      }
      setSaving(false);
      onSaved();
    } catch (e) {
      setSaving(false);
      setError(friendlyClienteError(e));
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-neutral/40 rounded-md p-4 space-y-4"
    >
      <h3 className="font-heading text-lg font-semibold text-primary">
        {contacto ? 'Editar contacto' : 'Nuevo contacto'}
      </h3>

      {error && <p className="font-body text-xs text-danger">{error}</p>}
      {fieldError && <p className="font-body text-xs text-danger">{fieldError}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass} htmlFor="contacto_nombre">
            Nombre
          </label>
          <input
            id="contacto_nombre"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className={`${inputClass} mt-1`}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="contacto_cargo">
            Cargo
          </label>
          <input
            id="contacto_cargo"
            type="text"
            value={cargo}
            onChange={(e) => setCargo(e.target.value)}
            placeholder="Opcional"
            className={`${inputClass} mt-1`}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="contacto_email">
            Email
          </label>
          <input
            id="contacto_email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Opcional"
            className={`${inputClass} mt-1`}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="contacto_telefono">
            Telefono
          </label>
          <input
            id="contacto_telefono"
            type="text"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="Opcional"
            className={`${inputClass} mt-1`}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="contacto_tipo">
            Tipo de contacto
          </label>
          <select
            id="contacto_tipo"
            value={idTipoContacto}
            onChange={(e) => setIdTipoContacto(e.target.value)}
            className={`${inputClass} mt-1`}
          >
            {tiposContacto.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 pt-6">
          <input
            id="contacto_principal"
            type="checkbox"
            checked={esPrincipal}
            onChange={(e) => setEsPrincipal(e.target.checked)}
            className="h-4 w-4 rounded border-neutral text-accent focus:outline-none focus:border-accent"
          />
          <label
            htmlFor="contacto_principal"
            className="font-body text-sm text-neutral-dark"
          >
            Contacto principal
          </label>
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="contacto_notas">
            Notas
          </label>
          <input
            id="contacto_notas"
            type="text"
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            placeholder="Opcional"
            className={`${inputClass} mt-1`}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar contacto'}
        </Button>
        <Button
          type="button"
          variant="ghost"
          disabled={saving}
          onClick={onCancel}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}

function ServiciosSection({
  clienteId,
  servicios,
  catalogoServicios,
  canWrite,
  onChanged,
}: {
  clienteId: string;
  servicios: ServicioClienteConCatalogo[];
  catalogoServicios: CatalogoServicio[];
  canWrite: boolean;
  onChanged: () => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [editingServicio, setEditingServicio] =
    useState<ServicioClienteConCatalogo | null>(null);

  const columns: TableColumn<ServicioClienteConCatalogo>[] = [
    {
      key: 'nombre_servicio',
      header: 'Servicio',
      cell: (row) => (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-primary">{row.nombre_servicio}</span>
          <Badge tone="neutral">{row.modo}</Badge>
        </div>
      ),
    },
    {
      key: 'estado',
      header: 'Estado',
      width: '120px',
      cell: (row) => (
        <Badge tone={row.estado === 'Activo' ? 'success' : 'danger'}>
          {row.estado}
        </Badge>
      ),
    },
    {
      key: 'fecha_inicio',
      header: 'Inicio',
      width: '120px',
      cell: (row) => <span>{row.fecha_inicio ?? 'Sin dato'}</span>,
    },
    {
      key: 'fecha_fin',
      header: 'Fin',
      width: '120px',
      cell: (row) => <span>{row.fecha_fin ?? 'Sin dato'}</span>,
    },
  ];

  if (canWrite) {
    columns.push({
      key: 'acciones',
      header: 'Acciones',
      width: '100px',
      cell: (row) => (
        <button
          type="button"
          onClick={() => setEditingServicio(row)}
          className="font-body text-xs text-accent hover:text-primary"
        >
          Editar
        </button>
      ),
    });
  }

  return (
    <div className="space-y-4">
      <Table
        columns={columns}
        rows={servicios}
        rowKey={(row) => row.id}
        emptyMessage="Este cliente no tiene servicios contratados registrados."
      />

      {canWrite && !showForm && !editingServicio && (
        <Button variant="ghost" onClick={() => setShowForm(true)}>
          Agregar servicio
        </Button>
      )}

      {canWrite && (showForm || editingServicio) && (
        <ServicioForm
          clienteId={clienteId}
          catalogoServicios={catalogoServicios}
          servicio={editingServicio ?? undefined}
          onSaved={() => {
            setShowForm(false);
            setEditingServicio(null);
            onChanged();
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingServicio(null);
          }}
        />
      )}
    </div>
  );
}

function ServicioForm({
  clienteId,
  catalogoServicios,
  servicio,
  onSaved,
  onCancel,
}: {
  clienteId: string;
  catalogoServicios: CatalogoServicio[];
  servicio?: ServicioClienteConCatalogo;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [idServicioTipo, setIdServicioTipo] = useState(
    servicio?.id_servicio_tipo ?? catalogoServicios[0]?.id ?? '',
  );
  const [estado, setEstado] = useState<EstadoServicioCliente>(
    servicio?.estado ?? 'Activo',
  );
  const [fechaInicio, setFechaInicio] = useState(servicio?.fecha_inicio ?? '');
  const [fechaFin, setFechaFin] = useState(servicio?.fecha_fin ?? '');
  const [notas, setNotas] = useState(servicio?.notas ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);

  const inputClass =
    'w-full px-3 py-2 text-sm border border-neutral rounded-md bg-surface text-neutral-dark placeholder:text-neutral focus:outline-none focus:border-accent';
  const labelClass =
    'font-body text-xs font-medium text-neutral-dark/70 uppercase tracking-wide';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!idServicioTipo) {
      setFieldError('Selecciona un servicio del catalogo.');
      return;
    }
    setFieldError(null);
    setSaving(true);
    setError(null);

    const input: ServicioClienteInput = {
      id_servicio_tipo: idServicioTipo,
      estado,
      fecha_inicio: fechaInicio.trim() ? fechaInicio.trim() : null,
      fecha_fin: fechaFin.trim() ? fechaFin.trim() : null,
      notas: notas.trim() ? notas.trim() : null,
    };

    try {
      if (servicio) {
        await updateServicioCliente(servicio.id, input);
      } else {
        await createServicioCliente(clienteId, input);
      }
      setSaving(false);
      onSaved();
    } catch (e) {
      setSaving(false);
      setError(friendlyClienteError(e));
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-neutral/40 rounded-md p-4 space-y-4"
    >
      <h3 className="font-heading text-lg font-semibold text-primary">
        {servicio ? 'Editar servicio' : 'Nuevo servicio'}
      </h3>

      {error && <p className="font-body text-xs text-danger">{error}</p>}
      {fieldError && <p className="font-body text-xs text-danger">{fieldError}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass} htmlFor="servicio_tipo">
            Servicio
          </label>
          <select
            id="servicio_tipo"
            value={idServicioTipo}
            onChange={(e) => setIdServicioTipo(e.target.value)}
            disabled={!!servicio}
            className={`${inputClass} mt-1 ${servicio ? 'opacity-60' : ''}`}
          >
            {catalogoServicios.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre} ({s.modo})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="servicio_estado">
            Estado
          </label>
          <select
            id="servicio_estado"
            value={estado}
            onChange={(e) => setEstado(e.target.value as EstadoServicioCliente)}
            className={`${inputClass} mt-1`}
          >
            <option value="Activo">Activo</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="servicio_fecha_inicio">
            Fecha de inicio
          </label>
          <input
            id="servicio_fecha_inicio"
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className={`${inputClass} mt-1`}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="servicio_fecha_fin">
            Fecha de fin
          </label>
          <input
            id="servicio_fecha_fin"
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            placeholder="Opcional"
            className={`${inputClass} mt-1`}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="servicio_notas">
            Notas
          </label>
          <input
            id="servicio_notas"
            type="text"
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            placeholder="Opcional"
            className={`${inputClass} mt-1`}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar servicio'}
        </Button>
        <Button
          type="button"
          variant="ghost"
          disabled={saving}
          onClick={onCancel}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
