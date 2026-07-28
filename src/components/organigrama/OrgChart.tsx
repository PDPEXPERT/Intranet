'use client';

import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArbolOrganigrama,
  NodoArbol,
  Organigrama,
  Posicion,
  Rol,
  construirArbol,
  tituloPosicion,
} from '@/lib/organigrama';
import { Button } from '@/components/ui/Button';
import styles from './OrgChart.module.css';

interface OrgChartProps {
  data: Organigrama;
}

function aplanar(nodos: NodoArbol[], parent: string | undefined, acc: {
  todos: NodoArbol[];
  parentDe: Record<string, string | undefined>;
}) {
  nodos.forEach((n) => {
    acc.todos.push(n);
    acc.parentDe[n.id] = parent;
    aplanar(n.hijos, n.id, acc);
  });
}

export function OrgChart({ data }: OrgChartProps) {
  const arbol: ArbolOrganigrama = useMemo(() => construirArbol(data), [data]);
  const { todos, parentDe } = useMemo(() => {
    const acc = { todos: [] as NodoArbol[], parentDe: {} as Record<string, string | undefined> };
    aplanar(arbol.raices, undefined, acc);
    return acc;
  }, [arbol]);

  const [colapsados, setColapsados] = useState<Set<string>>(() => new Set());
  const [query, setQuery] = useState('');
  const [seleccionado, setSeleccionado] = useState<NodoArbol | null>(null);
  const [notasAbiertas, setNotasAbiertas] = useState(false);
  const [leyendaAbierta, setLeyendaAbierta] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const recalcularConectores = useCallback(() => {
    const wrapper = wrapperRef.current;
    const svg = svgRef.current;
    if (!wrapper || !svg) return;

    const w = wrapper.scrollWidth;
    const h = wrapper.scrollHeight;
    svg.setAttribute('width', String(w));
    svg.setAttribute('height', String(h));
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    svg.innerHTML = '';
    const wRect = wrapper.getBoundingClientRect();

    wrapper.querySelectorAll<HTMLElement>(`.${styles.rama}`).forEach((rama) => {
      const hijosCont = rama.querySelector<HTMLElement>(`:scope > .${styles.hijos}`);
      if (!hijosCont || hijosCont.classList.contains(styles.hijosOculto)) return;
      const nodoPadre = rama.querySelector<HTMLElement>(`:scope > .${styles.nodo}`);
      if (!nodoPadre) return;
      const pRect = nodoPadre.getBoundingClientRect();
      const px = pRect.left + pRect.width / 2 - wRect.left;
      const py = pRect.bottom - wRect.top;

      Array.from(hijosCont.children).forEach((ramaHija) => {
        const nodoHijo = ramaHija.querySelector<HTMLElement>(`:scope > .${styles.nodo}`);
        if (!nodoHijo) return;
        const cRect = nodoHijo.getBoundingClientRect();
        const cx = cRect.left + cRect.width / 2 - wRect.left;
        const cy = cRect.top - wRect.top;
        const midY = py + (cy - py) / 2;

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute(
          'd',
          `M ${px} ${py} L ${px} ${midY} L ${cx} ${midY} L ${cx} ${cy}`,
        );
        const dashed = nodoHijo.dataset.linea === 'servicio';
        path.setAttribute('class', `${styles.lineaConector} ${dashed ? styles.lineaConectorPunteada : ''}`);
        svg.appendChild(path);
      });
    });
  }, []);

  useEffect(() => {
    requestAnimationFrame(recalcularConectores);
  }, [colapsados, recalcularConectores]);

  useEffect(() => {
    let timer: number | null = null;
    function onResize() {
      if (timer) window.clearTimeout(timer);
      timer = window.setTimeout(recalcularConectores, 150);
    }
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      if (timer) window.clearTimeout(timer);
    };
  }, [recalcularConectores]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setSeleccionado(null);
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  function toggleColapso(id: string) {
    setColapsados((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function expandirTodo() {
    setColapsados(new Set());
  }

  function colapsarTodo() {
    setColapsados(new Set(arbol.raices.filter((r) => r.hijos.length > 0).map((r) => r.id)));
  }

  const q = query.trim().toLowerCase();

  const coincide = useCallback(
    (nodo: NodoArbol): boolean => {
      if (!q) return false;
      return `${nodo.titulo} ${nodo.ocupanteTexto}`.toLowerCase().includes(q);
    },
    [q],
  );

  // Al buscar, expande los ancestros de cualquier coincidencia para que quede visible.
  useEffect(() => {
    if (!q) return;
    const aExpandir = new Set<string>();
    todos.forEach((n) => {
      if (!`${n.titulo} ${n.ocupanteTexto}`.toLowerCase().includes(q)) return;
      let actual = parentDe[n.id];
      while (actual) {
        aExpandir.add(actual);
        actual = parentDe[actual];
      }
    });
    if (aExpandir.size === 0) return;
    setColapsados((prev) => {
      let cambio = false;
      const next = new Set(prev);
      aExpandir.forEach((id) => {
        if (next.delete(id)) cambio = true;
      });
      return cambio ? next : prev;
    });
  }, [q, todos, parentDe]);

  function renderRama(nodo: NodoArbol): ReactNode {
    const colapsado = colapsados.has(nodo.id);
    const esOrgano = nodo.tipo === 'organo';

    const nodoClases = [
      styles.nodo,
      nodo.nivel === 'direccion' && !esOrgano ? styles.nivelDireccion : '',
      esOrgano ? styles.nodoOrgano : '',
      nodo.esVacante ? styles.vacante : '',
      coincide(nodo) ? styles.resaltado : '',
      seleccionado?.id === nodo.id ? styles.seleccionado : '',
    ]
      .filter(Boolean)
      .join(' ');

    const mostrarBadges = nodo.esExternalizada || nodo.esVacante || nodo.esInferida || esOrgano;

    return (
      <div key={nodo.id} className={styles.rama}>
        <div
          className={nodoClases}
          data-linea={nodo.lineaServicio ? 'servicio' : 'mando'}
          onClick={(e) => {
            e.stopPropagation();
            setSeleccionado(nodo);
          }}
        >
          <div className={styles.titulo}>{nodo.titulo}</div>
          <div className={styles.codigo}>
            {nodo.codigo}
            {nodo.area ? ` · ${nodo.area}` : ''}
          </div>
          {nodo.ocupanteTexto && <div className={styles.ocupante}>{nodo.ocupanteTexto}</div>}
          {mostrarBadges && (
            <div className={styles.badges}>
              {esOrgano && (
                <span className={`${styles.badge} ${styles.badgeOrgano}`}>Órgano asesor</span>
              )}
              {nodo.esExternalizada && (
                <span className={`${styles.badge} ${styles.badgeExternalizado}`}>
                  Externalizado
                </span>
              )}
              {nodo.esVacante && (
                <span className={`${styles.badge} ${styles.badgeVacante}`}>Vacante</span>
              )}
              {nodo.esInferida && (
                <span className={`${styles.badge} ${styles.badgeInferida}`}>Inferido</span>
              )}
            </div>
          )}
          {nodo.hijos.length > 0 && (
            <div
              className={styles.toggle}
              onClick={(e) => {
                e.stopPropagation();
                toggleColapso(nodo.id);
              }}
            >
              {colapsado ? '+' : '−'}
            </div>
          )}
        </div>
        {nodo.hijos.length > 0 && (
          <div className={`${styles.hijos} ${colapsado ? styles.hijosOculto : ''}`}>
            {nodo.hijos.map((h) => renderRama(h))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 print:hidden">
        <input
          type="search"
          placeholder="Buscar cargo o persona"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-64 px-3 py-1.5 text-sm border border-neutral rounded-md bg-surface text-neutral-dark placeholder:text-neutral focus:outline-none focus:border-accent"
        />
        <Button variant="ghost" onClick={expandirTodo}>
          Expandir todo
        </Button>
        <Button variant="ghost" onClick={colapsarTodo}>
          Colapsar todo
        </Button>
        <Button variant="ghost" onClick={() => setLeyendaAbierta((v) => !v)}>
          Leyenda
        </Button>
        {(data.nota_metodologica ||
          (data.hallazgos_detectados && data.hallazgos_detectados.length > 0)) && (
          <Button variant="ghost" onClick={() => setNotasAbiertas((v) => !v)}>
            Notas
          </Button>
        )}
      </div>

      {leyendaAbierta && (
        <div className="flex flex-wrap items-center gap-4 border border-neutral/40 rounded-md px-4 py-2 text-xs text-neutral-dark/80 print:hidden">
          <span className="font-heading font-bold text-primary uppercase text-[10px] tracking-wide">
            Leyenda
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-sm bg-primary" /> Dirección
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-sm bg-surface border border-primary" />{' '}
            Otros niveles
          </span>
          <span className={`${styles.badge} ${styles.badgeExternalizado}`}>Externalizado</span>
          <span className={`${styles.badge} ${styles.badgeVacante}`}>Vacante</span>
          <span className={`${styles.badge} ${styles.badgeOrgano}`}>Órgano asesor</span>
          <span className="flex items-center gap-1.5">
            <span className={`${styles.badge} ${styles.badgeInferida}`}>Inferido</span>
            línea de reporte no explícita en la fuente
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-6 border-t-2 border-dashed border-neutral" /> relación
            de servicio o asesoría
          </span>
        </div>
      )}

      {notasAbiertas && (
        <div className="border border-neutral/40 border-l-[3px] border-l-primary rounded-md px-5 py-3.5 text-xs leading-relaxed text-neutral-dark/90 print:hidden">
          {data.nota_metodologica && (
            <>
              <h3 className="font-heading font-bold text-primary uppercase text-[10px] tracking-wide mb-1">
                Nota metodológica
              </h3>
              <p className="mb-3">{data.nota_metodologica}</p>
            </>
          )}
          {data.hallazgos_detectados && data.hallazgos_detectados.length > 0 && (
            <>
              <h3 className="font-heading font-bold text-primary uppercase text-[10px] tracking-wide mb-1">
                Hallazgos detectados
              </h3>
              <ul className="list-disc pl-4 space-y-1">
                {data.hallazgos_detectados.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      <div className="overflow-x-auto pb-4">
        <div ref={wrapperRef} className={styles.wrapper}>
          <svg ref={svgRef} className={styles.svgConectores} />
          <div className={styles.arbol}>{arbol.raices.map((r) => renderRama(r))}</div>
        </div>
      </div>

      <p className="text-xs text-neutral-dark/50 print:hidden">
        Visor de organigrama de solo lectura. El JSON en el repositorio es la fuente única; esta
        vista no modifica ni guarda datos.
      </p>

      {seleccionado && (
        <div
          className={`${styles.overlay} ${styles.overlayAbierto} print:hidden`}
          onClick={() => setSeleccionado(null)}
        />
      )}
      <div
        className={`${styles.panelDetalle} ${seleccionado ? styles.panelDetalleAbierto : ''} print:hidden`}
      >
        {seleccionado && (
          <>
            <div className={styles.panelDetalleCab}>
              <button
                type="button"
                onClick={() => setSeleccionado(null)}
                className="absolute top-3.5 right-4 text-on-primary/70 hover:text-on-primary text-xl leading-none"
                aria-label="Cerrar"
              >
                &times;
              </button>
              <h2 className="m-0 mr-6 text-[15px] font-bold font-heading">{seleccionado.titulo}</h2>
              <div className="text-[10.5px] opacity-65 tracking-wide mt-1">
                {seleccionado.codigo}
                {seleccionado.area ? ` · ${seleccionado.area}` : ''}
              </div>
            </div>
            <div className={styles.panelDetalleCuerpo}>
              {seleccionado.tipo === 'organo'
                ? renderDetalleOrgano(seleccionado, arbol)
                : renderDetallePosicion(seleccionado, arbol)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ListaDetalle({ titulo, items }: { titulo: string; items?: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <>
      <h4>{titulo}</h4>
      <ul className={styles.funciones}>
        {items.map((x, i) => (
          <li key={i}>{x}</li>
        ))}
      </ul>
    </>
  );
}

function renderDetallePosicion(nodo: NodoArbol, arbol: ArbolOrganigrama): ReactNode {
  const pos = nodo.posicion as Posicion;
  const rol: Rol | undefined = nodo.rol;
  const { posiciones, roles } = arbol;

  const isco = rol?.clasificacion_isco;
  const perfiles = rol?.perfiles_profesionales ?? [];
  const funciones = rol?.funciones_esenciales ?? [];
  const requisitos = rol?.requisitos;

  return (
    <>
      <h4>Identificación</h4>
      <div className={styles.fila}>
        <span>Área</span>
        <b>{pos.area_departamento || '—'}</b>
      </div>
      {pos.vinculo_superior && (
        <div className={styles.fila}>
          <span>{pos.vinculo_superior.tipo === 'servicio' ? 'Relación de servicio con' : 'Reporta a'}</span>
          <b>{tituloPosicion(posiciones, roles, pos.vinculo_superior.ref)}</b>
        </div>
      )}

      {rol?.mision && (
        <>
          <h4>Misión</h4>
          <p>{rol.mision}</p>
        </>
      )}

      {isco?.codigo && (
        <>
          <h4>Clasificación ISCO-08</h4>
          <p>{isco.grupo_unitario || isco.codigo}</p>
        </>
      )}

      {perfiles.length > 0 && (
        <>
          <h4>Perfiles profesionales</h4>
          <ul className={styles.funciones}>
            {perfiles.map((pf, i) => (
              <li key={i}>
                {pf.perfil} ({pf.esquema}
                {pf.referencia ? ` ${pf.referencia}` : ''}
                {pf.primario ? ', primario' : ''})
              </li>
            ))}
          </ul>
        </>
      )}

      {rol?.nombre_estandarizado && (
        <>
          <h4>Nombre estandarizado (ESCO)</h4>
          <p>
            {rol.nombre_estandarizado}
            {rol.terminos_alternativos && rol.terminos_alternativos.length > 0 && (
              <>
                <br />
                <span className="text-neutral-dark/60 text-[11.5px]">
                  {rol.terminos_alternativos.join(', ')}
                </span>
              </>
            )}
          </p>
        </>
      )}

      {funciones.length > 0 && (
        <>
          <h4>Funciones esenciales</h4>
          <ul className={styles.funciones}>
            {funciones.map((f, i) => (
              <li key={i} className={f.critica ? '' : styles.secundaria}>
                {f.descripcion}
              </li>
            ))}
          </ul>
        </>
      )}

      <ListaDetalle titulo="Competencias esenciales" items={rol?.competencias?.esenciales} />
      <ListaDetalle titulo="Competencias opcionales" items={rol?.competencias?.opcionales} />

      {requisitos && (requisitos.formacion || requisitos.experiencia || requisitos.certificaciones) && (
        <>
          <h4>Requisitos</h4>
          {requisitos.formacion && (
            <div className={styles.fila}>
              <span>Formación</span>
              <b>{requisitos.formacion}</b>
            </div>
          )}
          {requisitos.experiencia && (
            <div className={styles.fila}>
              <span>Experiencia</span>
              <b>{requisitos.experiencia}</b>
            </div>
          )}
          {requisitos.certificaciones && (
            <div className={styles.fila}>
              <span>Certificaciones</span>
              <b>{requisitos.certificaciones}</b>
            </div>
          )}
        </>
      )}

      <ListaDetalle titulo="Indicadores de desempeño" items={rol?.indicadores_desempeno} />
      <ListaDetalle titulo="Entregables" items={rol?.entregables} />
    </>
  );
}

function renderDetalleOrgano(nodo: NodoArbol, arbol: ArbolOrganigrama): ReactNode {
  const org = nodo.organo;
  if (!org) return null;
  const { posiciones, roles } = arbol;
  return (
    <>
      {org.descripcion && (
        <>
          <h4>Descripción</h4>
          <p>{org.descripcion}</p>
        </>
      )}
      {org.asesora_a_ref && (
        <div className={styles.fila}>
          <span>Asesora a</span>
          <b>{tituloPosicion(posiciones, roles, org.asesora_a_ref)}</b>
        </div>
      )}
      {org.miembros_ref && org.miembros_ref.length > 0 && (
        <>
          <h4>Miembros</h4>
          <ul className={styles.funciones}>
            {org.miembros_ref.map((m) => (
              <li key={m}>{tituloPosicion(posiciones, roles, m)}</li>
            ))}
          </ul>
        </>
      )}
      {org.notas && <div className={styles.nota}>{org.notas}</div>}
    </>
  );
}
