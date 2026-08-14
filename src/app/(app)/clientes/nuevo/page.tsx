'use client';

import { useRouter } from 'next/navigation';
import { RoleGuard } from '@/components/RoleGuard';
import { ClienteForm } from '@/components/clientes/ClienteForm';

export default function NuevoClientePage() {
  const router = useRouter();

  return (
    <RoleGuard allow={['jefe_operaciones', 'gerente', 'admin']}>
      <div className="max-w-[1120px] mx-auto">
        <ClienteForm
          onSaved={(cliente) =>
            router.push(`/clientes/detalle/?id=${cliente.id}`)
          }
          onCancel={() => router.push('/clientes/')}
        />
      </div>
    </RoleGuard>
  );
}
