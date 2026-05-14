import { AuthRedirectIfSession } from '@/components/AuthRedirectIfSession';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthRedirectIfSession>{children}</AuthRedirectIfSession>;
}
