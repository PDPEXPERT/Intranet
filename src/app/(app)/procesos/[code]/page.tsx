import { readdirSync } from 'fs';
import { join } from 'path';
import { ProcedureDetail } from '@/components/procedures/ProcedureDetail';

export function generateStaticParams() {
  const dir = join(process.cwd(), 'content', 'procesos');
  const files = readdirSync(dir);
  return files
    .filter((f) => f.startsWith('PRC-') && f.endsWith('.json'))
    .map((f) => ({ code: f.replace('.json', '') }));
}

interface PageProps {
  params: { code: string };
}

export default function ProcedureDetailPage({ params }: PageProps) {
  return <ProcedureDetail code={params.code} />;
}
