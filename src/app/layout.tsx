import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Intranet PDP Expert',
  description: 'Portal interno para consultores de PDP Expert',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-surface text-neutral-dark font-body">
        {children}
      </body>
    </html>
  );
}
