import { OrgChart } from '@/components/organigrama/OrgChart';
import type { Organigrama } from '@/lib/organigrama';
import organigramaData from '../../../../../content/organigrama/organigrama-pdp-expert_v2.5.json';

const data = organigramaData as Organigrama;

export default function QuienesPage() {
  return (
    <div className="max-w-[1120px] mx-auto space-y-6">
      <header className="space-y-3">
        <h1 className="font-heading text-2xl font-bold text-primary">Quiénes</h1>
        <p className="font-body text-sm leading-relaxed text-neutral-dark/85 max-w-[820px]">
          La organización la mueven y construyen las personas, somos su "causa eficiente".
          Aquí encuentras información sobre nuestro organigrama de rendición de cuentas, los
          cargos de la organización y otros puntos que consideramos para hacer a las personas
          brillar.
        </p>
        <h2 className="font-heading text-base font-semibold text-primary pt-2">
          Organigrama de rendición de cuentas
        </h2>
      </header>

      <OrgChart data={data} />
    </div>
  );
}
