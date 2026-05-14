import { ButtonHTMLAttributes, forwardRef } from 'react';

type Variant = 'primary' | 'ghost' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const base =
  'px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed';

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-on-primary hover:bg-accent-light',
  ghost: 'text-accent hover:text-primary hover:bg-accent-light/10',
  danger: 'bg-danger text-on-primary hover:bg-danger/80',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', className = '', type = 'button', ...rest },
  ref,
) {
  const cls = `${base} ${variants[variant]} ${className}`.trim();
  return <button ref={ref} type={type} className={cls} {...rest} />;
});
