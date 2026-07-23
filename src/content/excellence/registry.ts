export interface TopicMeta {
  slug: string;
  label: string;
  category: string;
}

export const TOPICS: TopicMeta[] = [
  { slug: 'que-es-calidad', label: '¿Qué es calidad?', category: 'Calidad' },
  {
    slug: 'pdlc',
    label: 'Ciclo de desarrollo de producto',
    category: 'Desarrollo de Producto',
  },
  {
    slug: 'gestion-conocimiento',
    label: 'Qué es la gestión del conocimiento',
    category: 'Gestión del conocimiento',
  },
];

export function getTopicMeta(slug: string): TopicMeta | undefined {
  return TOPICS.find((t) => t.slug === slug);
}

export function getTopicsByCategory(): { category: string; topics: TopicMeta[] }[] {
  const map = new Map<string, TopicMeta[]>();
  for (const t of TOPICS) {
    if (!map.has(t.category)) map.set(t.category, []);
    map.get(t.category)!.push(t);
  }
  return Array.from(map.entries()).map(([category, topics]) => ({ category, topics }));
}
