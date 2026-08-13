import { notFound } from 'next/navigation';
import { TOPICS } from '@/content/excellence/registry';
import QueEsCalidad from '@/content/excellence/topics/que-es-calidad';
import PDLC from '@/content/excellence/topics/pdlc';
import GestionConocimiento from '@/content/excellence/topics/gestion-conocimiento';
import ArquitecturaEmpresarialYNegocio from '@/content/excellence/topics/arquitectura-empresarial-y-negocio';
import type { FC } from 'react';

const COMPONENTS: Record<string, FC> = {
  'que-es-calidad': QueEsCalidad,
  pdlc: PDLC,
  'gestion-conocimiento': GestionConocimiento,
  'arquitectura-empresarial-y-negocio': ArquitecturaEmpresarialYNegocio,
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
