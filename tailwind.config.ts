import type { Config } from 'tailwindcss';

// Helper para colores definidos como canales RGB separados por espacio
// en globals.css. Permite que Tailwind componga modificadores de opacidad
// como `bg-primary/20`, `text-on-primary/70`, etc.
const rgbVar = (name: string) => `rgb(var(${name}) / <alpha-value>)`;

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Marca PDP Expert
        primary: rgbVar('--color-primary'),
        accent: rgbVar('--color-accent'),
        'accent-light': rgbVar('--color-accent-light'),
        neutral: rgbVar('--color-neutral'),
        'neutral-dark': rgbVar('--color-neutral-dark'),
        surface: rgbVar('--color-surface'),
        'on-primary': rgbVar('--color-on-primary'),
        // Estados
        success: rgbVar('--color-success'),
        warning: rgbVar('--color-warning'),
        danger: rgbVar('--color-danger'),
        pending: rgbVar('--color-pending'),
        muted: rgbVar('--color-muted'),
      },
      fontFamily: {
        heading: ['Montserrat', 'system-ui', 'sans-serif'],
        body: ['Poppins', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
