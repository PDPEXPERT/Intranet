'use client';

import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Cargo,
  Organigrama,
  cargosPorCodigo,
  hijosDe,
  raices,
  textoOcupante,
} from '@/lib/organigrama';
import { Button } from '@/components/ui/Button';
import styles from './OrgChart.module.css';

interface OrgChartProps {
  data: Organigrama;
}

export function OrgChart({ data }: OrgChartProps) {
  const porCodigo = useMemo(() => cargosPorCodigo(data), [data]);
  const raicesData = useMemo(() => raices(data, porCodigo), [data, porCodigo]);

  const [colapsados, setColapsados] = useState<Set<string>>(() => new Set());
  const [query, setQuery] = useState('');
  const [seleccionado, setSeleccionado] = useState<Cargo | null>(null);
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
        path.setAttribute('class', styles.lineaConector);
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

  function toggleColapso(codigo: string) {
    setColapsados((prev) => {
      const next = new Set(prev);
      if (next.has(codigo)) next.delete(codigo);
      else next.add(codigo);
      return next;
    });
  }

  function expandirTodo() {
    setColapsados(new Set());
  }

  function colapsarTodo() {
    const raicesConHijos = raicesData.filter((r) => hijosDe(data, r.codigo_cargo).length > 0);
    setColapsados(new Set(raicesConHijos.map((r) => r.codigo_cargo)));
  }

  const q = query.trim().toLowerCase();

  // Al buscar, expande automaticamente los ancestros de cualquier coincidencia
  // para que el resultado quede visible.
  useEffect(() => {
    if (!q) return;
    const ancestrosAExpandir = new Set<string>();
    data.cargos.forEach((c) => {
      const buscable = `${c.titulo_cargo} ${c.ocupante?.nombre_o_iniciales || ''}`.toLowerCase();
      if (!buscable.includes(q)) return;
      let actual = c.reporta_a;
      while (actual) {
        ancestrosAExpandir.add(actual);
        actual = porCodigo[actual]?.reporta_a ?? null;
      }
    });
    if (ancestrosAExpandir.size === 0) return;
    setColapsados((prev) => {
      let cambio = false;
      const next = new Set(prev);
      ancestrosAExpandir.forEach((codigo) => {
        if (next.delete(codigo)) cambio = true;
      });
      return cambio ? next : prev;
    });
  }, [q, data.cargos, porCodigo]);

  function coincide(cargo: Cargo): boolean {
    if (!q) return false;
    const buscable = `${cargo.titulo_cargo} ${cargo.ocupante?.nombre_o_iniciales || ''}`.toLowerCase();
    return buscable.includes(q);
  }

  function renderRama(cargo: Cargo): ReactNode {
    const hijos = hijosDe(data, cargo.codigo_cargo);
    const ocupanteTxt = cargo.ocupante ? textoOcupante(cargo) : '';
    const ocupanteVacante = cargo.ocupante?.tipo === 'vacante';
    const colapsado = colapsados.has(cargo.codigo_cargo);

    const nodoClases = [
      styles.nodo,
      cargo.nivel_jerarquico === 'direccion' ? styles.nivelDireccion : '',
      ocupanteVacante ? styles.vacante : '',
      coincide(cargo) ? styles.resaltado : '',
      seleccionado?.codigo_cargo === cargo.codigo_cargo ? styles.seleccionado : '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div key={cargo.codigo_cargo} className={styles.rama}>
        <div
          className={nodoClases}
          onClick={(e) => {
            e.stopPropagation();
            setSeleccionado(cargo);
          }}
        >
          <div className={styles.titulo}>{cargo.titulo_cargo}</div>
          <div className={styles.codigo}>
            {cargo.codigo_cargo}
            {cargo.area_departamento ? ` · ${cargo.area_departamento}` : ''}
          </div>
          {ocupanteTxt && <div className={styles.ocupante}>{ocupanteTxt}</div>}
          {(cargo.ocupante?.tipo === 'externalizado' ||
            cargo.ocupante?.tipo === 'vacante' ||
            cargo.confianza_reporta_a === 'inferida') && (
            <div className={styles.badges}>
              {cargo.ocupante?.tipo === 'externalizado' && (
                <span className={`${styles.badge} ${styles.badgeExternalizado}`}>
                  Externalizado
                </span>
              )}
              {cargo.ocupante?.tipo === 'vacante' && (
                <span className={`${styles.badge} ${styles.badgeVacante}`}>Vacante</span>
              )}
              {cargo.confianza_reporta_a === 'inferida' && (
                <span className={`${styles.badge} ${styles.badgeInferida}`}>Inferido</span>
              )}
            </div>
          )}
          {hijos.length > 0 && (
            <div
              className={styles.toggle}
              onClick={(e) => {
                e.stopPropagation();
                toggleColapso(cargo.codigo_cargo);
              }}
            >
              {colapsado ? '+' : '−'}
            </div>
          )}
        </div>
        {hijos.length > 0 && (
          <div className={`${styles.hijos} ${colapsado ? styles.hijosOculto : ''}`}>
            {hijos.map((h) => renderRama(h))}
          </div>
        )}
      </div>
    );
  }

  const jefeDeSeleccionado = seleccionado?.reporta_a ? porCodigo[seleccionado.reporta_a] : null;
  const hijosDeSeleccionado = seleccionado ? hijosDe(data, seleccionado.codigo_cargo) : [];

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
        {(data.nota_metodologica || (data.hallazgos_detectados && data.hallazgos_detectados.length > 0)) && (
          <Button variant="ghost" onClick={() => setNotasAbiertas((v) => !v)}>
            Notas
          </Button>
        )}
        <Button variant="ghost" onClick={() => window.print()}>
          Exportar a PDF
        </Button>
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
          <span className="flex items-center gap-1.5">
            <span className={`${styles.badge} ${styles.badgeInferida}`}>Inferido</span>
            línea de reporte no explícita en la fuente
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
          <div className={styles.arbol}>{raicesData.map((r) => renderRama(r))}</div>
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
              <h2 className="m-0 mr-6 text-[15px] font-bold font-heading">
                {seleccionado.titulo_cargo}
              </h2>
              <div className="text-[10.5px] opacity-65 tracking-wide mt-1">
                {seleccionado.codigo_cargo}
                {seleccionado.area_departamento ? ` · ${seleccionado.area_departamento}` : ''}
              </div>
            </div>
            <div className={styles.panelDetalleCuerpo}>
              <h4>Misión</h4>
              <p>{seleccionado.mision_cargo || '—'}</p>

              {seleccionado.contexto_area && (
                <>
                  <h4>Contexto</h4>
                  <p>{seleccionado.contexto_area}</p>
                </>
              )}

              <h4>Ocupante</h4>
              <p>{seleccionado.ocupante ? textoOcupante(seleccionado) : '—'}</p>

              <div className={styles.fila}>
                <span>Nivel jerárquico</span>
                <b>{seleccionado.nivel_jerarquico || '—'}</b>
              </div>

              {seleccionado.reporta_a && (
                <div className={styles.fila}>
                  <span>Reporta a</span>
                  <b>
                    {jefeDeSeleccionado ? jefeDeSeleccionado.titulo_cargo : seleccionado.reporta_a}
                    {seleccionado.confianza_reporta_a === 'inferida' && (
                      <span className={`${styles.badge} ${styles.badgeInferida} ml-1`}>
                        inferido
                      </span>
                    )}
                  </b>
                </div>
              )}

              {hijosDeSeleccionado.length > 0 && (
                <div className={styles.fila}>
                  <span>Supervisa</span>
                  <b>{hijosDeSeleccionado.map((h) => h.titulo_cargo).join(', ')}</b>
                </div>
              )}

              {seleccionado.funciones_esenciales.length > 0 && (
                <>
                  <h4>Funciones esenciales</h4>
                  <ul className={styles.funciones}>
                    {seleccionado.funciones_esenciales.map((f, i) => (
                      <li key={i} className={f.critica ? '' : styles.secundaria}>
                        {f.descripcion}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {seleccionado.notas && <div className={styles.nota}>{seleccionado.notas}</div>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
