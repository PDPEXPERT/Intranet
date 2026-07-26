import { CapabilityMap } from '@/components/capability-map/CapabilityMap';
import type { CapabilityMapData } from '@/lib/capabilityMap';
import capabilityMapData from '../../../../../content/capability-map/capability-map_v1.0.json';

const data = capabilityMapData as CapabilityMapData;

export default function QuePage() {
  return (
    <div className="max-w-[1120px] mx-auto space-y-6">
      <header className="space-y-3">
        <h1 className="font-heading text-2xl font-bold text-primary">Qué</h1>
        <p className="font-body text-sm text-neutral-dark/85">
          Conoce qué hacemos, con nuestro mapa de capacidades
          <span className="align-super text-[10px]">*</span>:
        </p>
        <p className="font-body text-xs italic text-neutral-dark/55 max-w-[720px]">
          * Un mapa de capacidades describe qué sabe hacer la organización, con independencia
          de cómo se organiza o quién lo ejecuta. Cada capacidad se expande en un segundo nivel
          al hacer clic.
        </p>
      </header>

      <CapabilityMap data={data} />
    </div>
  );
}
