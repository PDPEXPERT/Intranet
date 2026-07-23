import { OrgChart } from '@/components/organigrama/OrgChart';
import type { Organigrama } from '@/lib/organigrama';
import organigramaData from '../../../../content/organigrama/organigrama-pdp-expert_v1.0.json';

const data = organigramaData as Organigrama;

export default function OrganigramaPage() {
  return (
    <div className="max-w-[1120px] mx-auto space-y-6">
      <header className="space-y-2">
        <h1 className="font-heading text-2xl font-bold text-primary">
          Organigrama {data.organizacion}
        </h1>
        <p className="font-body text-sm text-neutral-dark/80">
          Estructura de cargos y ocupantes actuales.
          {data.fuente ? ` Fuente: ${data.fuente}.` : ''}
          {data.fecha_actualizacion ? ` Actualizado: ${data.fecha_actualizacion}.` : ''}
        </p>
      </header>

      <OrgChart data={data} />
    </div>
  );
}
