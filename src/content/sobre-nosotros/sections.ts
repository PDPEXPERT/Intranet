export interface AboutSection {
  slug: string;
  label: string;
  short: string;
}

export const ABOUT_SECTIONS: AboutSection[] = [
  {
    slug: 'por-que',
    label: 'Por qué',
    short: 'Life by design y los valores que nos mueven.',
  },
  {
    slug: 'organizacion-inteligente',
    label: '¿Organización inteligente?',
    short: 'Nuestra postura ante la inteligencia y la empresa.',
  },
  {
    slug: 'que',
    label: 'Qué',
    short: 'Lo que hacemos, en nuestro mapa de capacidades.',
  },
  {
    slug: 'quienes',
    label: 'Quiénes',
    short: 'Organigrama de rendición de cuentas y cargos.',
  },
  {
    slug: 'como',
    label: 'Cómo',
    short: 'Nuestro mapa de procesos.',
  },
];

export function aboutLabel(slug: string): string | undefined {
  return ABOUT_SECTIONS.find((s) => s.slug === slug)?.label;
}
