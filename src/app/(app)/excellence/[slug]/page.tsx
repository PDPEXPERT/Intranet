import { notFound } from 'next/navigation';
import { TOPICS } from '@/content/excellence/registry';
import QueEsCalidad from '@/content/excellence/topics/que-es-calidad';
import PDLC from '@/content/excellence/topics/pdlc';
import GestionConocimiento from '@/content/excellence/topics/gestion-conocimiento';
import ArquitecturaEmpresarialYNegocio from '@/content/excellence/topics/arquitectura-empresarial-y-negocio';
import ProcesosPDP from '@/content/excellence/topics/procesos-pdp';
import InformacionEInformacionDocumentada from '@/content/excellence/topics/informacion-e-informacion-documentada';
import ErroresComunes from '@/content/excellence/topics/errores-comunes';
import type { FC } from 'react';

const COMPONENTS: Record<string, FC> = {
  'que-es-calidad': QueEsCalidad,
  pdlc: PDLC,
  'gestion-conocimiento': GestionConocimiento,
  'arquitectura-empresarial-y-negocio': ArquitecturaEmpresarialYNegocio,
  'procesos-pdp': ProcesosPDP,
  'informacion-e-informacion-documentada': InformacionEInformacionDocumentada,
  'errores-comunes': ErroresComunes,
};

export function generateStaticParams() {
  return TOPICS.map((t) => ({ slug: t.slug }));
}

interface PageProps {
  params: { slug: string };
}

export default function TopicPage({ params }: PageProps) {
  const Component = COMPONENTS[params.slug];
  if (!Component) notFound();
  return (
    <div className="max-w-[880px] mx-auto">
      <Component />
    </div>
  );
}
