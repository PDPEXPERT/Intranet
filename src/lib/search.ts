import { searchProcedures } from './procedures';
import { TOPICS } from '@/content/excellence/registry';
import { ABOUT_SECTIONS } from '@/content/sobre-nosotros/sections';
import type { CapabilityMapData } from './capabilityMap';
import type { Organigrama } from './organigrama';
import capabilityMapData from '../../content/capability-map/capability-map_v1.0.json';
import organigramaData from '../../content/organigrama/organigrama-pdp-expert_v1.0.json';

const capMap = capabilityMapData as CapabilityMapData;
const organigrama = organigramaData as Organigrama;

export type SearchArea =
  | 'Procedimientos'
  | 'Sobre nosotros'
  | 'Mapa de capacidades'
  | 'Organigrama'
  | 'Excellence Wiki';

export interface SearchHitAll {
  area: SearchArea;
  title: string;
  subtitle?: string;
  href: string;
}

export interface SearchGroup {
  area: SearchArea;
  hits: SearchHitAll[];
}

const AREA_ORDER: SearchArea[] = [
  'Procedimientos',
  'Sobre nosotros',
  'Mapa de capacidades',
  'Organigrama',
  'Excellence Wiki',
];

const PER_AREA = 6;

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

function matchStatic(q: string): SearchHitAll[] {
  const hits: SearchHitAll[] = [];

  // Sobre nosotros (subsecciones)
  for (const s of ABOUT_SECTIONS) {
    if (normalize(`${s.label} ${s.short}`).includes(q)) {
      hits.push({
        area: 'Sobre nosotros',
        title: s.label,
        subtitle: s.short,
        href: `/sobre-nosotros/${s.slug}/`,
      });
    }
  }

  // Mapa de capacidades (L1 + L2)
  let capCount = 0;
  for (const tier of capMap.tiers) {
    for (const cap of tier.capabilities) {
      if (capCount >= PER_AREA) break;
      if (normalize(`${cap.code} ${cap.name} ${cap.objeto} ${cap.description}`).includes(q)) {
        hits.push({
          area: 'Mapa de capacidades',
          title: `${cap.code} · ${cap.name}`,
          subtitle: `Objeto: ${cap.objeto}`,
          href: '/sobre-nosotros/que/',
        });
        capCount++;
        continue;
      }
      for (const sub of cap.subcapabilities) {
        if (capCount >= PER_AREA) break;
        if (normalize(`${sub.code} ${sub.name} ${sub.description}`).includes(q)) {
          hits.push({
            area: 'Mapa de capacidades',
            title: `${sub.code} · ${sub.name}`,
            subtitle: cap.name,
            href: '/sobre-nosotros/que/',
          });
          capCount++;
        }
      }
    }
  }

  // Organigrama (cargos y ocupantes)
  let orgCount = 0;
  for (const cargo of organigrama.cargos) {
    if (orgCount >= PER_AREA) break;
    const ocupante = cargo.ocupante?.nombre_o_iniciales ?? '';
    if (normalize(`${cargo.titulo_cargo} ${ocupante} ${cargo.codigo_cargo}`).includes(q)) {
      hits.push({
        area: 'Organigrama',
        title: cargo.titulo_cargo,
        subtitle: ocupante || cargo.codigo_cargo,
        href: '/sobre-nosotros/quienes/',
      });
      orgCount++;
    }
  }

  // Excellence Wiki (temas)
  for (const t of TOPICS) {
    if (normalize(`${t.label} ${t.category}`).includes(q)) {
      hits.push({
        area: 'Excellence Wiki',
        title: t.label,
        subtitle: t.category,
        href: `/excellence/${t.slug}/`,
      });
    }
  }

  return hits;
}

export async function searchAll(query: string): Promise<SearchGroup[]> {
  const q = normalize(query.trim());
  if (q.length < 2) return [];

  const hits: SearchHitAll[] = [];

  // Procedimientos (full-text en Supabase)
  try {
    const proc = await searchProcedures(query);
    for (const p of proc.slice(0, PER_AREA)) {
      hits.push({
        area: 'Procedimientos',
        title: p.title,
        subtitle: p.snippet ? `${p.code} · ${p.snippet}` : p.code,
        href: `/procesos/${p.code}/`,
      });
    }
  } catch {
    // si Supabase falla, seguimos con el contenido estatico
  }

  hits.push(...matchStatic(q));

  // Agrupar respetando el orden de areas
  const groups: SearchGroup[] = [];
  for (const area of AREA_ORDER) {
    const areaHits = hits.filter((h) => h.area === area).slice(0, PER_AREA);
    if (areaHits.length > 0) groups.push({ area, hits: areaHits });
  }
  return groups;
}
