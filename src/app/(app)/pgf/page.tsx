import Link from 'next/link';
import {
  SEVEN_COMPONENTS,
  GOV_PROCESSES,
  MGMT_PROCESSES,
  PROFILES,
  RACI_HEADERS,
  RACI_ROWS,
  EXTERNALIZATION_ROWS,
  PRINCIPLES,
  POLICIES,
  PROCEDURE_GROUPS,
  FLOW_ROWS,
  FAQS,
  type ProcedureCard,
} from '@/content/pgf';

const SECTIONS = [
  { id: 's1', num: '01', label: 'Que es' },
  { id: 's2', num: '02', label: 'Como usarlo' },
  { id: 's3', num: '03', label: 'Sistema de gobernanza' },
  { id: 's4', num: '04', label: 'Componentes' },
  { id: 's5', num: '05', label: 'Seguridad' },
  { id: 's6', num: '06', label: 'IA' },
  { id: 's7', num: '07', label: 'Marco metodologico' },
  { id: 's8', num: '08', label: 'Preguntas frecuentes' },
];

export default function PGFPage() {
  return (
    <div className="max-w-[960px] mx-auto space-y-6 scroll-smooth">
      <header className="space-y-3">
        <h1 className="font-heading text-2xl font-bold text-primary">
          Privacy Governance Framework
        </h1>
        <p className="font-body text-xs font-medium text-neutral-dark/60">
          v1.0
        </p>
        <nav className="font-body text-xs text-neutral-dark/70 pt-2">
          Saltar a:{' '}
          {SECTIONS.map((s, i) => (
            <span key={s.id}>
              {i > 0 && <span className="mx-1 text-neutral-dark/40">.</span>}
              <a href={`#${s.id}`} className="text-accent hover:text-primary">
                {s.num} {s.label}
              </a>
            </span>
          ))}
        </nav>
      </header>

      <Section id="s1" num="01" title="Que es y para que sirve">
        <p>
          El Privacy Governance Framework (PGF) es un marco de trabajo para
          implementar un sistema de gobierno en proteccion de datos personales.
          Proporciona una arquitectura de referencia que organiza los
          componentes necesarios para que una organizacion gestione la
          proteccion de datos de forma sistematica, demostrable y auditable.
        </p>
        <p>
          El framework no es una lista de verificacion de cumplimiento ni un
          catalogo normativo. Es un modelo de referencia que muestra como se
          configuran e interrelacionan los componentes de un sistema de gobierno
          en proteccion de datos personales: procesos, personas, estructuras,
          politicas, procedimientos, tecnologia, informacion y cultura.
        </p>
      </Section>

      <Section id="s2" num="02" title="Como usarlo">
        <p>
          La organizacion toma la arquitectura tipo del framework y la adapta a
          su contexto: estructura organizacional, jurisdiccion aplicable, nivel
          de madurez y sistemas existentes. Los componentes globales se
          implementan como base estable; los componentes que requieren
          adaptacion jurisdiccional o sectorial se configuran segun la normativa
          aplicable.
        </p>
        <p>
          El acompanamiento para la implementacion se articula en tres vias:
          herramientas operativas organizadas en kits de implementacion, un
          programa de formacion que genera capacidades internas en el equipo de
          la organizacion, y acompanamiento consultivo especializado que orienta
          las decisiones de diseno y configuracion del sistema.
        </p>
      </Section>

      <Section id="s3" num="03" title="Que es el sistema de gobernanza">
        <Subsection title="3.1 Definiciones">
          <p>
            Un sistema de gobernanza es un conjunto de componentes
            interrelacionados, ordenados a un fin comun: dirigir y controlar una
            dimension especifica de la gestion organizacional. En el contexto de
            la proteccion de datos personales, ese fin es la gestion adecuada de
            los datos personales que la organizacion trata, en cumplimiento de
            los requisitos legales aplicables y conforme a los principios de
            proteccion de datos reconocidos internacionalmente.
          </p>
          <p>
            Los componentes del sistema de gobernanza son los factores que,
            individual y colectivamente, contribuyen a la adecuada operacion del
            sistema de gobernanza de la organizacion. El concepto de componente
            proviene de COBIT 2019, que identifica siete tipos de componentes en
            todo sistema de gobierno. El PGF adapta esta tipologia al dominio de
            la proteccion de datos personales.
          </p>
        </Subsection>

        <Subsection title="3.2 Los siete componentes">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {SEVEN_COMPONENTS.map((c, i) => (
              <div
                key={c.id}
                className="border border-neutral/40 rounded-md p-4 space-y-2"
              >
                <div className="flex items-baseline gap-3">
                  <span className="font-body text-xs font-medium text-accent">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h4 className="font-heading text-base font-semibold text-primary">
                    {c.name}
                  </h4>
                </div>
                <p className="font-body text-sm text-neutral-dark">
                  {c.description}
                </p>
                <p className="font-body text-sm text-neutral-dark">
                  <span className="font-medium">Que trae el framework: </span>
                  {c.brings}
                </p>
                <p className="font-body text-sm text-neutral-dark">
                  <span className="font-medium">Global vs adaptacion: </span>
                  {c.globalVsAdapt}
                </p>
              </div>
            ))}
          </div>
        </Subsection>

        <Subsection title="3.3 Relacion entre componentes">
          <p>
            Los componentes del sistema de gobernanza no operan de forma
            aislada. Un proceso bien disenado fracasa si las personas que lo
            ejecutan no tienen las competencias necesarias. Personas competentes
            sin politicas claras toman decisiones inconsistentes. Politicas sin
            informacion para monitorear su cumplimiento son declaraciones sin
            efecto. Tecnologia sin procesos que la gobiernen genera riesgo en
            lugar de reducirlo. Cultura organizacional que no respalda la
            proteccion de datos convierte cualquier diseno formal en un
            ejercicio documental.
          </p>
          <p>
            El sistema de gobierno es un sistema donde los componentes se
            refuerzan mutuamente. El framework se disena y se implementa como un
            conjunto integrado, no como una coleccion de piezas independientes.
          </p>
        </Subsection>
      </Section>

      <Section id="s4" num="04" title="Los componentes">
        <Subsection title="4.1 Procesos">
          <p>El PGF organiza sus procesos en dos capas formales.</p>
          <p>
            <span className="font-medium">Capa de gobierno.</span> Cuatro
            procesos que corresponden a las funciones de evaluar, dirigir y
            monitorear el sistema de proteccion de datos. Se ejecutan a nivel
            del organo de gobierno de la organizacion.
          </p>
          <p>
            <span className="font-medium">Capa de gestion.</span> Seis procesos
            que agrupan 27 procedimientos operativos. Cubren la planificacion,
            ejecucion, control y monitoreo de las operaciones del programa de
            proteccion de datos.
          </p>

          <h5 className="font-heading text-sm font-semibold text-primary uppercase tracking-wide pt-2">
            Capa de gobierno
          </h5>
          <ProcessGrid items={GOV_PROCESSES} />

          <h5 className="font-heading text-sm font-semibold text-primary uppercase tracking-wide pt-2">
            Capa de gestion
          </h5>
          <ProcessGrid items={MGMT_PROCESSES} />
        </Subsection>

        <Subsection title="4.2 Personas, habilidades y competencias">
          <p>
            El sistema de gobierno requiere personas con las competencias
            adecuadas en dos capas diferenciadas.
          </p>
          <h5 className="font-heading text-sm font-semibold text-primary pt-2">
            Capa de gobierno: el organo de gobierno del Programa
          </h5>
          <p>
            El organo de gobierno del Programa de Proteccion de Datos es la
            instancia que ejerce las funciones de evaluar, dirigir y monitorear
            el sistema. Sus responsabilidades principales son: aprobar la
            estructura de gobierno y la configuracion de la funcion de
            proteccion de datos, definir la direccion estrategica y los
            objetivos del programa, supervisar la gestion del riesgo conforme al
            apetito definido, y asegurar la dotacion de recursos necesarios para
            la operacion del programa.
          </p>

          <h5 className="font-heading text-sm font-semibold text-primary pt-2">
            Capa de gestion: perfiles profesionales y roles operativos
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {PROFILES.map((p) => (
              <div
                key={p.name}
                className="border border-neutral/40 rounded-md p-4 space-y-1"
              >
                <div className="font-body text-xs font-medium text-accent uppercase tracking-wide">
                  {p.role}
                </div>
                <div className="font-heading text-base font-semibold text-primary">
                  {p.name}
                </div>
                <p className="font-body text-sm text-neutral-dark">
                  {p.description}
                </p>
                {p.mission && (
                  <p className="font-body text-xs text-neutral-dark/70 italic pt-1">
                    Mision: {p.mission}
                  </p>
                )}
              </div>
            ))}
          </div>

          <h5 className="font-heading text-sm font-semibold text-primary pt-2">
            Orientacion para implementacion
          </h5>
          <p>
            Los perfiles profesionales pueden asignarse de manera flexible: una
            misma persona puede ejercer varios perfiles segun la capacidad y
            tamano de la organizacion. La restriccion principal es legal: el DPO
            debe mantener independencia y ausencia de conflicto de interes
            conforme a la normativa aplicable, lo cual limita su acumulacion con
            roles que impliquen determinacion de medios y fines del tratamiento.
          </p>
        </Subsection>

        <Subsection title="4.3 Estructuras organizacionales">
          <h5 className="font-heading text-sm font-semibold text-primary">
            Modelo de referencia
          </h5>
          <p>
            El framework propone un modelo de referencia de estructuras con tres
            niveles:
          </p>
          <p>
            <span className="font-medium">Organo de gobierno.</span> Instancia
            con autoridad para evaluar, dirigir y monitorear el programa.
            Ejecuta los procesos de gobierno GOB-PDP-01 a GOB-PDP-04.
          </p>
          <p>
            <span className="font-medium">Funcion de proteccion de datos.</span>{' '}
            Compuesta por el DPO y el equipo de gestion del programa. Ejecuta
            los 27 procedimientos operativos del programa (PRC-PDP-01 a
            PRC-PDP-27).
          </p>
          <p>
            <span className="font-medium">Interfaces con otras funciones.</span>{' '}
            Legal, Tecnologias de la Informacion, Seguridad de la Informacion,
            Recursos Humanos, y las areas de negocio.
          </p>

          <h5 className="font-heading text-sm font-semibold text-primary pt-2">
            RACI de referencia por proceso
          </h5>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-b border-neutral/30">
              <thead>
                <tr className="bg-primary text-on-primary text-xs font-medium uppercase tracking-wide">
                  {RACI_HEADERS.map((h) => (
                    <th key={h} className="px-3 py-2 text-left">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RACI_ROWS.map((row, idx) => (
                  <tr
                    key={row.process}
                    className={`${
                      idx % 2 === 0 ? 'bg-surface' : 'bg-accent-light/10'
                    } border-b border-neutral/30`}
                  >
                    <td className="px-3 py-2 align-top">
                      <div className="font-medium text-primary">
                        {row.process}
                      </div>
                      <div className="text-xs text-neutral-dark/60">
                        {row.description}
                      </div>
                    </td>
                    {row.values.map((v, i) => (
                      <td key={i} className="px-3 py-2 align-top">
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h5 className="font-heading text-sm font-semibold text-primary pt-2">
            Perfil de externalizacion por proceso de gestion
          </h5>
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-primary text-on-primary text-xs font-medium uppercase tracking-wide">
                <th className="px-3 py-2">Proceso</th>
                <th className="px-3 py-2 w-32">Externalizable</th>
                <th className="px-3 py-2">Justificacion</th>
              </tr>
            </thead>
            <tbody>
              {EXTERNALIZATION_ROWS.map((row, idx) => (
                <tr
                  key={row.process}
                  className={`${
                    idx % 2 === 0 ? 'bg-surface' : 'bg-accent-light/10'
                  } border-b border-neutral/30`}
                >
                  <td className="px-3 py-2 align-top">
                    <div className="font-medium text-primary">
                      {row.process}
                    </div>
                    <div className="text-xs text-neutral-dark/60">
                      {row.description}
                    </div>
                  </td>
                  <td className="px-3 py-2 align-top">{row.level}</td>
                  <td className="px-3 py-2 align-top">{row.justification}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Subsection>

        <Subsection title="4.4 Principios, politicas y procedimientos">
          <h5 className="font-heading text-sm font-semibold text-primary">
            4.4.1 Principios
          </h5>
          <p>
            El framework se fundamenta en los principios de proteccion de datos
            de ISO/IEC 29100, que proporcionan un marco de referencia agnostico
            de jurisdiccion.
          </p>
          <div className="border border-neutral/40 rounded-md p-4 space-y-2">
            {PRINCIPLES.map((pr) => (
              <p key={pr.name}>
                <span className="font-medium">{pr.name}.</span> {pr.description}
              </p>
            ))}
          </div>

          <h5 className="font-heading text-sm font-semibold text-primary pt-2">
            4.4.2 Politicas
          </h5>
          <p>
            El paquete normativo interno del programa se estructura en dos
            niveles: la politica general de proteccion de datos personales y las
            politicas especificas que desarrollan requisitos operativos.
          </p>
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-primary text-on-primary text-xs font-medium uppercase tracking-wide">
                <th className="px-3 py-2">Politica</th>
                <th className="px-3 py-2">Descripcion</th>
                <th className="px-3 py-2">Procesos</th>
              </tr>
            </thead>
            <tbody>
              {POLICIES.map((pol, idx) => (
                <tr
                  key={pol.name}
                  className={`${
                    idx % 2 === 0 ? 'bg-surface' : 'bg-accent-light/10'
                  } border-b border-neutral/30`}
                >
                  <td className="px-3 py-2 align-top font-medium text-primary">
                    {pol.name}
                  </td>
                  <td className="px-3 py-2 align-top">{pol.description}</td>
                  <td className="px-3 py-2 align-top text-xs">
                    {pol.processes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h5 className="font-heading text-sm font-semibold text-primary pt-2">
            4.4.3 Procedimientos
          </h5>
          <p>
            Los 27 procedimientos del programa se presentan agrupados por
            proceso de gestion. Cada grupo se expande para ver el detalle de sus
            procedimientos.
          </p>
          <div className="space-y-2">
            {PROCEDURE_GROUPS.map((group) => (
              <details
                key={group.id}
                className="border border-neutral/40 rounded-md group [&:not([open])>summary>.indicator]:-rotate-90"
              >
                <summary className="flex items-center gap-3 px-4 py-3 cursor-pointer list-none">
                  <span className="font-body text-xs font-medium text-accent w-24 shrink-0">
                    {group.id}
                  </span>
                  <span className="font-heading text-sm font-semibold text-primary flex-1">
                    {group.name}
                  </span>
                  <span className="font-body text-xs text-neutral-dark/60">
                    {group.procedures.length} procedimientos
                  </span>
                  <span
                    aria-hidden="true"
                    className="indicator text-primary text-xs select-none"
                  >
                    v
                  </span>
                </summary>
                <div className="px-4 pb-4 pt-2 border-t border-neutral/30 space-y-2">
                  {group.procedures.map((proc) => (
                    <ProcedureCardView key={proc.code} proc={proc} />
                  ))}
                </div>
              </details>
            ))}
          </div>
        </Subsection>

        <Subsection title="4.5 Servicios, infraestructura y aplicaciones">
          <h5 className="font-heading text-sm font-semibold text-primary">
            Panoramica de tecnologias de mejora de la proteccion de datos
          </h5>
          <p>
            <span className="font-medium">Tecnologias de proteccion.</span>{' '}
            Operan activamente sobre los datos durante el tratamiento para
            reducir el riesgo de exposicion o uso indebido. Incluyen: tecnicas
            de seudonimizacion, tecnicas de anonimizacion, cifrado, filtros y
            bloqueadores, y supresores de seguimiento.
          </p>
          <p>
            <span className="font-medium">Tecnologias de gestion.</span>{' '}
            Soportan la administracion de los procedimientos del programa sin
            operar directamente sobre los datos. Incluyen herramientas de
            informacion y herramientas administrativas.
          </p>

          <h5 className="font-heading text-sm font-semibold text-primary pt-2">
            Inteligencia artificial: dos roles
          </h5>
          <p>
            <span className="font-medium">IA como objeto de gobierno.</span> Los
            sistemas de IA que tratan datos personales son actividades de
            tratamiento sujetas a todos los requisitos del programa.
          </p>
          <p>
            <span className="font-medium">IA como herramienta del programa.</span>{' '}
            Las herramientas de IA pueden soportar la operacion del sistema de
            gobierno: automatizar verificaciones, asistir en la clasificacion,
            acelerar evaluaciones de impacto o apoyar la vigilancia regulatoria.
          </p>

          <h5 className="font-heading text-sm font-semibold text-primary pt-2">
            Escala de priorizacion por categoria funcional
          </h5>
          <ol className="list-decimal list-inside space-y-1">
            <li>
              Herramientas administrativas de gestion de identidad y acceso.
            </li>
            <li>
              Herramientas de registro y documentacion del programa (RAT,
              gestion documental, registro de consentimiento).
            </li>
            <li>
              Herramientas de cifrado y proteccion de datos en almacenamiento y
              transito.
            </li>
            <li>Herramientas de monitoreo y verificacion de cumplimiento.</li>
            <li>
              Herramientas avanzadas de proteccion (anonimizacion,
              seudonimizacion, PETs especializadas).
            </li>
            <li>Herramientas de automatizacion del programa con IA.</li>
          </ol>
        </Subsection>

        <Subsection title="4.6 Informacion">
          <h5 className="font-heading text-sm font-semibold text-primary">
            Informacion como insumo y como producto
          </h5>
          <p>
            Cada proceso del programa consume y produce informacion. El RAT es
            producto del proceso GES-PDP-02 e insumo del proceso GES-PDP-05 para
            verificacion de cumplimiento. El informe de evaluacion de impacto es
            producto de PRC-PDP-08 e insumo de la decision de gobierno sobre
            riesgo en GOB-PDP-03.
          </p>

          <h5 className="font-heading text-sm font-semibold text-primary pt-2">
            Mapa de flujos de informacion entre procesos
          </h5>
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-primary text-on-primary text-xs font-medium uppercase tracking-wide">
                <th className="px-3 py-2">Proceso origen</th>
                <th className="px-3 py-2">Informacion producida</th>
                <th className="px-3 py-2">Procesos destino</th>
              </tr>
            </thead>
            <tbody>
              {FLOW_ROWS.map((row, idx) => (
                <tr
                  key={row.origin}
                  className={`${
                    idx % 2 === 0 ? 'bg-surface' : 'bg-accent-light/10'
                  } border-b border-neutral/30`}
                >
                  <td className="px-3 py-2 align-top">
                    <div className="font-medium text-primary">{row.origin}</div>
                    <div className="text-xs text-neutral-dark/60">
                      {row.originDesc}
                    </div>
                  </td>
                  <td className="px-3 py-2 align-top">{row.produced}</td>
                  <td className="px-3 py-2 align-top text-xs">
                    {row.destinations}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Subsection>

        <Subsection title="4.7 Cultura, etica y comportamiento">
          <p>
            La cultura organizacional determina si el sistema de gobierno
            funciona en la practica o se queda en documentacion formal. Los
            controles mejor disenados fracasan cuando la cultura los ignora, los
            evita o los percibe como obstaculo.
          </p>
          <h5 className="font-heading text-sm font-semibold text-primary pt-2">
            Buenas practicas
          </h5>
          <ul className="list-disc list-inside space-y-1">
            <li>
              Tono desde la direccion. La alta direccion demuestra con acciones
              que la proteccion de datos es prioridad organizacional.
            </li>
            <li>
              Cultura de reporte abierto. Canales conocidos, accesibles y sin
              represalias.
            </li>
            <li>
              Integracion en la induccion y la comunicacion interna.
            </li>
            <li>Comportamiento etico frente al manejo de datos.</li>
            <li>Disposicion a escalar las situaciones que exceden el ambito de decision.</li>
          </ul>
          <h5 className="font-heading text-sm font-semibold text-primary pt-2">
            Errores frecuentes
          </h5>
          <ul className="list-disc list-inside space-y-1">
            <li>
              Tratar la proteccion de datos como ejercicio exclusivamente
              documental.
            </li>
            <li>Delegar toda la responsabilidad en el DPO.</li>
            <li>Cultura de ocultacion de incidentes.</li>
            <li>Desconexion entre politicas y practica.</li>
            <li>Formacion que no conecta con el dia a dia.</li>
          </ul>
        </Subsection>
      </Section>

      <Section
        id="s5"
        num="05"
        title="Integracion con Seguridad de la Informacion"
      >
        <h5 className="font-heading text-sm font-semibold text-primary">
          Criterios generales
        </h5>
        <p>
          El programa de proteccion de datos no sustituye al sistema de gestion
          de seguridad de la informacion (SGSI); se articula con el. La
          seguridad de la informacion es condicion necesaria pero no suficiente
          para la proteccion de datos personales.
        </p>
        <h5 className="font-heading text-sm font-semibold text-primary pt-2">
          Puntos de integracion
        </h5>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <span className="font-medium">Gestion de incidentes.</span>{' '}
            PRC-PDP-11 se coordina con el procedimiento de gestion de incidentes
            del SGSI.
          </li>
          <li>
            <span className="font-medium">Controles de acceso e identidad.</span>{' '}
            PRC-PDP-14 verifica que los controles de identidad y acceso del SGSI
            son adecuados.
          </li>
          <li>
            <span className="font-medium">Requisitos de seguridad en terceros.</span>{' '}
            PRC-PDP-09 incorpora requisitos de seguridad de la informacion en
            los acuerdos con terceros.
          </li>
          <li>
            <span className="font-medium">Implementacion tecnica de controles.</span>{' '}
            PRC-PDP-27 coordina con el SGSI la implementacion de controles de
            seguridad con componente de proteccion de datos.
          </li>
        </ul>
        <h5 className="font-heading text-sm font-semibold text-primary pt-2">
          Errores comunes
        </h5>
        <p>
          Asumir que cumplir ISO 27001 equivale a cumplir los requisitos de
          proteccion de datos personales. Duplicar controles sin coordinacion
          entre el programa de proteccion de datos y el SGSI. No incluir al
          equipo de proteccion de datos en la gestion de incidentes de seguridad
          cuando pueden estar afectados datos personales.
        </p>
      </Section>

      <Section id="s6" num="06" title="Integracion con Gobernanza de IA">
        <h5 className="font-heading text-sm font-semibold text-primary">
          Criterios generales
        </h5>
        <p>
          Los sistemas de inteligencia artificial que tratan datos personales
          son objeto del programa de proteccion de datos. No pueden operar fuera
          de el. El marco de gobierno debe ser holistico e integrar proteccion
          de datos, inteligencia artificial y ciberseguridad bajo componentes
          armonizados.
        </p>
        <h5 className="font-heading text-sm font-semibold text-primary pt-2">
          Puntos de integracion
        </h5>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <span className="font-medium">Evaluacion de impacto cuando interviene IA.</span>{' '}
            PRC-PDP-08 se activa cuando un tratamiento incorpora componentes de
            IA, particularmente cuando implica elaboracion de perfiles o
            decisiones automatizadas con efectos sobre los titulares.
          </li>
          <li>
            <span className="font-medium">Proteccion de datos desde el diseno en sistemas de IA.</span>{' '}
            PRC-PDP-06 incorpora requisitos especificos cuando el sistema en
            diseno incluye componentes de IA: minimizacion de datos en el
            entrenamiento, restriccion de finalidad, mecanismos de supervision
            humana, capacidad de explicacion.
          </li>
          <li>
            <span className="font-medium">Monitoreo del entorno regulatorio para normativa de IA.</span>{' '}
            PRC-PDP-26 incluye en su vigilancia la normativa emergente de IA.
          </li>
          <li>
            <span className="font-medium">Transparencia e informacion con decisiones automatizadas.</span>{' '}
            PRC-PDP-03 y PRC-PDP-01 contemplan los requisitos especificos cuando
            las decisiones que afectan a los titulares se producen o se asisten
            con IA.
          </li>
        </ul>
        <h5 className="font-heading text-sm font-semibold text-primary pt-2">
          Errores comunes
        </h5>
        <p>
          Tratar gobernanza de IA y proteccion de datos como programas separados
          que operan de forma independiente. Implementar herramientas de IA sin
          evaluacion previa de los requisitos de proteccion de datos.
        </p>
      </Section>

      <Section id="s7" num="07" title="Marco metodologico">
        <p>
          El Privacy Governance Framework se estructura sobre el modelo de
          componentes de sistema de gobierno de COBIT 2019, adaptado al dominio
          de la proteccion de datos personales. La adaptacion se inspira en los
          tres principios que COBIT establece para un framework de gobernanza:
          basado en un modelo conceptual, abierto y flexible, y alineado con
          estandares relevantes.
        </p>
        <p>
          El contenido del framework se nutre de un ecosistema de normas ISO
          aplicable a la proteccion de datos personales, organizado en cinco
          capas: vocabulario y principios fundacionales (ISO/IEC 29100), sistema
          de gestion (ISO/IEC 27701:2025), evaluacion y riesgo (ISO/IEC 27557,
          ISO/IEC 29134, ISO/IEC 29190), instrumentos operativos y tecnicos, e
          infraestructura general.
        </p>
        <p>
          El framework esta disenado para organizaciones que operan en multiples
          jurisdicciones y que necesitan integrar proteccion de datos con otros
          frentes de cumplimiento. Los componentes globales se separan de los
          que requieren adaptacion jurisdiccional. Esta separacion permite que
          la organizacion mantenga una estructura de gobierno estable mientras
          ajusta el contenido normativo conforme se expande a nuevas
          jurisdicciones.
        </p>
      </Section>

      <Section id="s8" num="08" title="Preguntas frecuentes">
        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <details
              key={i}
              className="border border-neutral/40 rounded-md group [&:not([open])>summary>.indicator]:-rotate-90"
            >
              <summary className="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer list-none">
                <span className="font-body text-sm font-medium text-primary">
                  {faq.question}
                </span>
                <span
                  aria-hidden="true"
                  className="indicator text-primary text-xs select-none shrink-0"
                >
                  v
                </span>
              </summary>
              <div className="px-4 pb-4 pt-2 border-t border-neutral/30 font-body text-sm text-neutral-dark">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </Section>
    </div>
  );
}

function Section({
  id,
  num,
  title,
  children,
}: {
  id: string;
  num: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="border-t border-neutral/30 pt-6 space-y-3 scroll-mt-24"
    >
      <div className="font-body text-xs font-bold text-accent uppercase tracking-widest">
        {num}
      </div>
      <h2 className="font-heading text-xl font-semibold text-primary">
        {title}
      </h2>
      <div className="space-y-3 font-body text-sm text-neutral-dark">
        {children}
      </div>
    </section>
  );
}

function Subsection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3 pt-4">
      <h3 className="font-heading text-lg font-semibold text-primary">
        {title}
      </h3>
      {children}
    </div>
  );
}

function ProcessGrid({
  items,
}: {
  items: { id: string; name: string; objective?: string; policies?: string; procedures?: { code: string; name: string }[] }[];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {items.map((p) => (
        <div
          key={p.id}
          className="border border-neutral/40 rounded-md p-3 space-y-1"
        >
          <div className="font-body text-xs font-medium text-accent">
            {p.id}
          </div>
          <div className="font-heading text-sm font-semibold text-primary">
            {p.name}
          </div>
          {p.objective && (
            <p className="font-body text-xs text-neutral-dark/80">
              <span className="font-medium">Objetivo: </span>
              {p.objective}
            </p>
          )}
          {p.policies && (
            <p className="font-body text-xs text-neutral-dark/60">
              Politicas: {p.policies}
            </p>
          )}
          {p.procedures && p.procedures.length > 0 && (
            <ul className="space-y-0.5 pt-1">
              {p.procedures.map((proc) => (
                <li
                  key={proc.code}
                  className="font-body text-xs text-neutral-dark/80"
                >
                  <span className="font-medium">{proc.code}:</span> {proc.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

function ProcedureCardView({ proc }: { proc: ProcedureCard }) {
  return (
    <details className="border border-neutral/40 rounded-md group [&:not([open])>summary>.indicator]:-rotate-90">
      <summary className="flex items-center gap-3 px-3 py-2 cursor-pointer list-none">
        <span className="font-body text-xs font-medium text-accent w-24 shrink-0">
          {proc.code}
        </span>
        <span className="font-body text-sm font-medium text-primary flex-1">
          {proc.name}
        </span>
        <span
          aria-hidden="true"
          className="indicator text-primary text-xs select-none"
        >
          v
        </span>
      </summary>
      <div className="px-3 py-3 border-t border-neutral/30 bg-accent-light/5 space-y-2">
        <ProcField label="Objetivo" value={proc.objective} />
        {proc.scope && <ProcField label="Alcance" value={proc.scope} />}
        <ProcField label="Responsabilidades" value={proc.responsibilities} />
        <ProcField label="Salidas" value={proc.outputs} />
        <ProcField label="Politicas relacionadas" value={proc.policies} />
        <ProcField label="Tecnologia" value={proc.technology} />
      </div>
    </details>
  );
}

function ProcField({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-3">
      <div className="font-body text-xs font-medium text-neutral-dark/60 uppercase tracking-wide pt-0.5">
        {label}
      </div>
      <div className="font-body text-sm text-neutral-dark">{value}</div>
    </div>
  );
}
