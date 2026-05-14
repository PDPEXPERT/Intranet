export interface Component {
  id: string;
  name: string;
  description: string;
  brings: string;
  globalVsAdapt: string;
}

export const SEVEN_COMPONENTS: Component[] = [
  {
    id: 'procesos',
    name: 'Procesos',
    description:
      'Conjuntos estructurados de practicas que producen resultados especificos. Organizados en dos capas: gobierno (evaluar, dirigir, monitorear) y gestion (planificar, ejecutar, controlar).',
    brings:
      '4 procesos de gobierno, 6 procesos de gestion, 27 procedimientos. Objetivos, alcances y mapeos completos.',
    globalVsAdapt:
      'Global: estructura de procesos y procedimientos. Adaptacion: plazos legales, requisitos especificos por jurisdiccion dentro de cada procedimiento.',
  },
  {
    id: 'personas',
    name: 'Personas, habilidades y competencias',
    description:
      'Las capacidades humanas necesarias para operar el sistema. Incluye perfiles profesionales, roles operativos y el organo de gobierno.',
    brings:
      '5 perfiles profesionales conforme a UNE-EN 17740, 2 roles operativos, descripcion funcional del organo de gobierno.',
    globalVsAdapt:
      'Global: perfiles y competencias base. Adaptacion: requisitos legales de independencia del DPO segun jurisdiccion.',
  },
  {
    id: 'estructuras',
    name: 'Estructuras organizacionales',
    description:
      'Los organos de decision, funciones y relaciones que determinan quien tiene autoridad y quien rinde cuentas.',
    brings:
      'Modelo de referencia (organo de gobierno, funcion de proteccion de datos, interfaces), RACI por proceso, perfil de externalizacion.',
    globalVsAdapt:
      'Global: modelo de referencia y RACI base. Adaptacion: restricciones sectoriales de gobernanza, requisitos de designacion de DPO.',
  },
  {
    id: 'politicas',
    name: 'Principios, politicas y procedimientos',
    description:
      'Las directrices que traducen la intencion de gobierno en reglas operativas. Los principios expresan valores, las politicas los convierten en reglas, los procedimientos los ejecutan.',
    brings:
      'Principios de referencia ISO 29100, inventario de politicas con patron de diseno, 27 procedimientos completos.',
    globalVsAdapt:
      'Global: principios y estructura de politicas. Adaptacion: contenido normativo especifico de cada politica por jurisdiccion.',
  },
  {
    id: 'tecnologia',
    name: 'Servicios, infraestructura y aplicaciones',
    description:
      'Las capacidades tecnologicas que soportan la operacion del sistema. Incluye herramientas de proteccion de datos y herramientas de gestion del programa.',
    brings:
      'Panoramica de tecnologias de mejora de la proteccion de datos en dos categorias, orientacion de seleccion, consideraciones de IA.',
    globalVsAdapt:
      'Global: categorias funcionales y criterios de seleccion. Adaptacion: requisitos tecnicos especificos por jurisdiccion (cifrado, localizacion de datos).',
  },
  {
    id: 'informacion',
    name: 'Informacion',
    description:
      'Los datos e informacion que el sistema necesita para funcionar: registros, evidencias, reportes, metricas.',
    brings:
      'Distincion insumo/producto, orientacion de gobernanza documental, mapa de flujos entre los 10 procesos.',
    globalVsAdapt:
      'Global: flujos de informacion y principios de gestion documental. Adaptacion: formatos registrales obligatorios por jurisdiccion.',
  },
  {
    id: 'cultura',
    name: 'Cultura, etica y comportamiento',
    description:
      'Los patrones de conducta individual y colectiva que determinan si el sistema de gobierno funciona en la practica.',
    brings:
      'Buenas practicas y errores frecuentes en cultura de proteccion de datos.',
    globalVsAdapt: 'Global en su totalidad.',
  },
];

export interface ProcessCard {
  id: string;
  name: string;
  objective?: string;
  policies?: string;
  procedures?: { code: string; name: string }[];
}

export const GOV_PROCESSES: ProcessCard[] = [
  {
    id: 'GOB-PDP-01',
    name: 'Responsabilidad proactiva e institucionalizacion del Programa',
    objective:
      'El Programa de Proteccion de Datos tiene una estructura de gobierno definida, con autoridades asignadas y cadenas de rendicion de cuentas operativas.',
    policies: 'Politica general de proteccion de datos personales.',
  },
  {
    id: 'GOB-PDP-02',
    name: 'Direccion estrategica y evaluacion de resultados del Programa',
    objective:
      'El programa opera con objetivos estrategicos definidos por el organo de gobierno y con evaluacion periodica de resultados frente a esos objetivos.',
    policies: 'Politica general de proteccion de datos personales.',
  },
  {
    id: 'GOB-PDP-03',
    name: 'Gobernanza del riesgo asociado al tratamiento de datos personales',
    objective:
      'La organizacion tiene un apetito de riesgo definido para el tratamiento de datos personales y los derechos de los titulares.',
    policies:
      'Politica general de proteccion de datos personales, politica especifica de gestion del riesgo en tratamiento de datos.',
  },
  {
    id: 'GOB-PDP-04',
    name: 'Dotacion de recursos del Programa',
    objective:
      'El programa cuenta con los recursos necesarios para cumplir su mandato.',
    policies: 'Politica general de proteccion de datos personales.',
  },
];

export const MGMT_PROCESSES: ProcessCard[] = [
  {
    id: 'GES-PDP-01',
    name: 'Gestion de la relacion con titulares de datos personales',
    procedures: [
      { code: 'PRC-PDP-01', name: 'Atencion a titulares' },
      { code: 'PRC-PDP-02', name: 'Gestion de denuncias' },
      {
        code: 'PRC-PDP-03',
        name: 'Gestion del consentimiento, transparencia e informacion',
      },
    ],
  },
  {
    id: 'GES-PDP-02',
    name: 'Gestion operativa del tratamiento de datos personales',
    procedures: [
      { code: 'PRC-PDP-04', name: 'Verificacion de requisitos legales' },
      { code: 'PRC-PDP-05', name: 'Administracion del RAT' },
      { code: 'PRC-PDP-06', name: 'Proteccion de datos desde el diseno' },
      { code: 'PRC-PDP-07', name: 'Gestion integral del riesgo' },
      { code: 'PRC-PDP-08', name: 'Evaluacion de impacto' },
      { code: 'PRC-PDP-23', name: 'Clasificacion de datos personales' },
      { code: 'PRC-PDP-24', name: 'Retencion y disposicion' },
      {
        code: 'PRC-PDP-27',
        name: 'Implementacion tecnica y verificacion de controles',
      },
    ],
  },
  {
    id: 'GES-PDP-03',
    name: 'Gestion de terceros, transferencias y contratos',
    procedures: [
      { code: 'PRC-PDP-09', name: 'Gestion de la relacion con terceros' },
      { code: 'PRC-PDP-10', name: 'Gestion del encargo de tratamiento' },
      {
        code: 'PRC-PDP-22',
        name: 'Gestion de clausulas e instrumentos contractuales',
      },
    ],
  },
  {
    id: 'GES-PDP-04',
    name: 'Gestion de incidentes y relacion con autoridades de control',
    procedures: [
      { code: 'PRC-PDP-11', name: 'Gestion de incidentes de seguridad' },
      {
        code: 'PRC-PDP-12',
        name: 'Gestion de requerimientos e inspecciones',
      },
    ],
  },
  {
    id: 'GES-PDP-05',
    name: 'Monitoreo, evaluacion y mejora del programa',
    procedures: [
      {
        code: 'PRC-PDP-13',
        name: 'Monitoreo de cumplimiento en actividades',
      },
      { code: 'PRC-PDP-14', name: 'Monitoreo de cumplimiento en activos' },
      { code: 'PRC-PDP-15', name: 'Auditoria interna' },
      { code: 'PRC-PDP-16', name: 'Gestion de no conformidades' },
      { code: 'PRC-PDP-25', name: 'Gestion de objetivos y medicion' },
      { code: 'PRC-PDP-26', name: 'Monitoreo del entorno regulatorio' },
    ],
  },
  {
    id: 'GES-PDP-06',
    name: 'Gestion de las capacidades del programa',
    procedures: [
      { code: 'PRC-PDP-17', name: 'Reporte a la alta direccion' },
      {
        code: 'PRC-PDP-18',
        name: 'Supervision proactiva y asesoramiento del DPO',
      },
      { code: 'PRC-PDP-19', name: 'Gestion documental' },
      { code: 'PRC-PDP-20', name: 'Gestion del programa de formacion' },
      { code: 'PRC-PDP-21', name: 'Gestion de consultas internas' },
    ],
  },
];

export interface Profile {
  role: 'Perfil profesional' | 'Rol operativo';
  name: string;
  description: string;
  mission?: string;
}

export const PROFILES: Profile[] = [
  {
    role: 'Perfil profesional',
    name: 'Delegado de Proteccion de Datos (DPO)',
    description:
      'Asesora a la organizacion en la aplicacion de la normativa de proteccion de datos. Punto de contacto con la autoridad de control y supervisor del cumplimiento del programa.',
    mission:
      'Asesorar respecto a los riesgos de las actividades de tratamiento para garantizar el cumplimiento normativo.',
  },
  {
    role: 'Perfil profesional',
    name: 'Gerente de Proteccion de Datos',
    description:
      'Coordina a todos los actores involucrados en el tratamiento de datos personales.',
    mission:
      'Asegurar el cumplimiento de las leyes aplicables y el logro y mantenimiento del nivel adecuado de proteccion.',
  },
  {
    role: 'Perfil profesional',
    name: 'Especialista en Proteccion de Datos',
    description:
      'Realiza las actividades operativas necesarias a lo largo del ciclo de vida de un tratamiento de datos personales.',
    mission:
      'Ejecutar procedimientos, elaborar evaluaciones de impacto, gestionar solicitudes de titulares y redactar politicas y procedimientos.',
  },
  {
    role: 'Perfil profesional',
    name: 'Ingeniero de Proteccion de Datos',
    description:
      'Responsable de los aspectos de proteccion de datos en el diseno, desarrollo y mejora de sistemas que tratan datos personales.',
    mission:
      'Disenar, desarrollar y apoyar la implementacion de sistemas conformes a los principios de proteccion de datos mediante medidas tecnicas y organizativas.',
  },
  {
    role: 'Perfil profesional',
    name: 'Auditor de Proteccion de Datos',
    description:
      'Revisa e informa sobre el cumplimiento del tratamiento de datos personales con las leyes y regulaciones aplicables. Mantiene posicion independiente.',
    mission:
      'Evaluar de forma independiente la conformidad del programa con los requisitos aplicables.',
  },
  {
    role: 'Rol operativo',
    name: 'Dueno de proceso',
    description:
      'Responsable de que un proceso de negocio que trata datos personales opere conforme a las politicas y procedimientos del programa. Enlace entre la funcion de proteccion de datos y el area operativa.',
  },
  {
    role: 'Rol operativo',
    name: 'Privacy champion',
    description:
      'Referente de proteccion de datos dentro de un area funcional. Promueve la cultura de proteccion de datos, canaliza consultas al equipo especializado y apoya la implementacion de controles en su area.',
  },
];

export interface RaciRow {
  process: string;
  description: string;
  values: string[];
}

export const RACI_HEADERS = [
  'Proceso',
  'Organo gob.',
  'DPO',
  'Gte. PDP',
  'Esp. PDP',
  'Ing. PDP',
  'Aud. PDP',
  'Dueno proc.',
  'Areas soporte',
];

export const RACI_ROWS: RaciRow[] = [
  {
    process: 'GOB-PDP-01',
    description: 'Responsabilidad proactiva',
    values: ['A, R', 'C', 'C', '', '', '', 'I', 'I'],
  },
  {
    process: 'GOB-PDP-02',
    description: 'Direccion estrategica',
    values: ['A, R', 'C', 'C', '', '', '', 'I', 'I'],
  },
  {
    process: 'GOB-PDP-03',
    description: 'Gobernanza del riesgo',
    values: ['A, R', 'C', 'C', '', '', '', 'I', ''],
  },
  {
    process: 'GOB-PDP-04',
    description: 'Dotacion de recursos',
    values: ['A, R', 'C', 'C', '', '', '', '', 'I'],
  },
  {
    process: 'GES-PDP-01',
    description: 'Relacion con titulares',
    values: ['I', 'A', 'R', 'R', '', '', 'C', 'C'],
  },
  {
    process: 'GES-PDP-02',
    description: 'Gestion operativa del tratamiento',
    values: ['I', 'A', 'R', 'R', 'R', '', 'C', 'C'],
  },
  {
    process: 'GES-PDP-03',
    description: 'Terceros y contratos',
    values: ['I', 'A', 'R', 'R', '', '', 'C', 'C (Legal)'],
  },
  {
    process: 'GES-PDP-04',
    description: 'Incidentes y autoridades',
    values: ['I', 'A', 'R', 'R', 'C', '', 'C', 'C (SI, Legal)'],
  },
  {
    process: 'GES-PDP-05',
    description: 'Monitoreo y mejora',
    values: ['I', 'A', 'R', 'R', 'C', 'R', 'C', 'C'],
  },
  {
    process: 'GES-PDP-06',
    description: 'Capacidades del programa',
    values: ['I', 'A', 'R', 'R', '', '', 'I', 'C (RRHH)'],
  },
];

export interface ExternalizationRow {
  process: string;
  description: string;
  level: 'Parcial' | 'Total';
  justification: string;
}

export const EXTERNALIZATION_ROWS: ExternalizationRow[] = [
  {
    process: 'GES-PDP-01',
    description: 'Relacion con titulares',
    level: 'Parcial',
    justification:
      'La atencion operativa de solicitudes y la gestion del consentimiento pueden externalizarse. Las decisiones sobre denuncias complejas y criterios de transparencia los retiene la organizacion.',
  },
  {
    process: 'GES-PDP-02',
    description: 'Gestion operativa del tratamiento',
    level: 'Parcial',
    justification:
      'La verificacion de requisitos, la documentacion del RAT, las evaluaciones de impacto y los analisis de riesgo son externalizables. La aprobacion de bases de licitud y las decisiones de diseno de tratamientos las retiene la organizacion.',
  },
  {
    process: 'GES-PDP-03',
    description: 'Terceros y contratos',
    level: 'Parcial',
    justification:
      'La revision de clausulas y la gestion operativa de instrumentos contractuales son externalizables. La decision de contratar a un tercero y la aprobacion de transferencias las retiene la organizacion.',
  },
  {
    process: 'GES-PDP-04',
    description: 'Incidentes y autoridades',
    level: 'Parcial',
    justification:
      'El soporte en la gestion de incidentes y la preparacion de respuestas a autoridades son externalizables. La decision de notificar y la relacion directa con la autoridad las retiene la organizacion.',
  },
  {
    process: 'GES-PDP-05',
    description: 'Monitoreo y mejora',
    level: 'Total',
    justification:
      'El monitoreo, las auditorias internas, la medicion de desempeno y la vigilancia regulatoria pueden externalizarse completamente. La organizacion retiene la aprobacion de hallazgos y las decisiones de accion correctiva.',
  },
  {
    process: 'GES-PDP-06',
    description: 'Capacidades del programa',
    level: 'Parcial',
    justification:
      'La gestion documental, la ejecucion de programas de formacion y la atencion de consultas internas son externalizables. El reporte a la alta direccion y la funcion de asesoramiento del DPO requieren presencia directa.',
  },
];

export const PRINCIPLES: { name: string; description: string }[] = [
  {
    name: 'Consentimiento y libertad de eleccion',
    description:
      'El tratamiento de datos personales se basa, cuando corresponde, en el consentimiento libre, informado, especifico e inequivoco del titular.',
  },
  {
    name: 'Legitimidad del proposito y especificacion',
    description:
      'Todo tratamiento tiene finalidades determinadas, explicitas y legitimas, documentadas antes de iniciarse.',
  },
  {
    name: 'Limitacion de la recogida',
    description:
      'La recogida de datos personales se limita a lo necesario para las finalidades declaradas.',
  },
  {
    name: 'Minimizacion de datos',
    description:
      'Los datos tratados son adecuados, pertinentes y limitados a lo estrictamente necesario para la finalidad.',
  },
  {
    name: 'Limitacion del uso, la retencion y la divulgacion',
    description:
      'Los datos personales se usan, conservan y comunican exclusivamente para las finalidades declaradas y durante el tiempo necesario.',
  },
  {
    name: 'Exactitud y calidad',
    description:
      'Los datos personales son exactos, completos y estan actualizados conforme a las finalidades del tratamiento.',
  },
  {
    name: 'Apertura, transparencia y aviso',
    description:
      'La organizacion informa a los titulares sobre sus practicas de tratamiento de forma clara, accesible y oportuna.',
  },
  {
    name: 'Participacion individual y acceso',
    description:
      'Los titulares pueden ejercer sus derechos de acceso, rectificacion, supresion y otros reconocidos por la normativa aplicable.',
  },
  {
    name: 'Responsabilidad (accountability)',
    description:
      'La organizacion puede demostrar el cumplimiento de los principios y requisitos aplicables mediante evidencias verificables.',
  },
  {
    name: 'Seguridad de la informacion',
    description:
      'Los datos personales se protegen con medidas tecnicas y organizativas adecuadas al riesgo.',
  },
  {
    name: 'Cumplimiento en materia de proteccion de datos',
    description:
      'La organizacion verifica de forma continua que sus practicas son conformes con la normativa y los principios aplicables.',
  },
];

export const POLICIES: {
  name: string;
  description: string;
  processes: string;
}[] = [
  {
    name: 'Requisitos legales para el tratamiento',
    description:
      'Obligaciones juridicas que toda actividad de tratamiento debe cumplir.',
    processes:
      'GES-PDP-01 (relacion con titulares), GES-PDP-02 (gestion operativa), GES-PDP-04 (incidentes y autoridades)',
  },
  {
    name: 'Gestion del riesgo en tratamiento de datos',
    description: 'Logica de gestion de riesgo aplicada a los tratamientos.',
    processes:
      'GES-PDP-02 (gestion operativa), GES-PDP-05 (monitoreo y mejora)',
  },
  {
    name: 'Transferencia y cesion de datos',
    description:
      'Regula transferencias y comunicaciones de datos, locales e internacionales.',
    processes:
      'GES-PDP-03 (terceros y contratos), GES-PDP-02 (gestion operativa)',
  },
  {
    name: 'Lineamientos para tratamientos especificos',
    description:
      'Videovigilancia, biometria, marketing, control laboral, menores, tecnologias especificas.',
    processes: 'GES-PDP-02 (gestion operativa)',
  },
  {
    name: 'Uso etico de inteligencia artificial',
    description:
      'Principios y reglas para el uso de IA en tratamientos de datos personales.',
    processes:
      'GES-PDP-02 (gestion operativa), GES-PDP-03 (terceros y contratos)',
  },
  {
    name: 'Datos de colaboradores',
    description: 'Tratamiento de datos del personal interno.',
    processes:
      'GES-PDP-01 (relacion con titulares), GES-PDP-03 (terceros y contratos), GES-PDP-02 (gestion operativa)',
  },
  {
    name: 'Disposicion final de datos',
    description:
      'Conservacion y disposicion de datos al cumplimiento de la finalidad.',
    processes: 'GES-PDP-02 (gestion operativa)',
  },
  {
    name: 'Proteccion de datos desde el diseno: requisitos para proyectos',
    description:
      'Requisitos a integrar en el ciclo de gestion de proyectos.',
    processes: 'GES-PDP-02 (gestion operativa)',
  },
  {
    name: 'Proteccion de datos desde el diseno: requisitos para desarrollo de software',
    description: 'Requisitos en el ciclo de desarrollo de software.',
    processes: 'GES-PDP-02 (gestion operativa)',
  },
  {
    name: 'Proteccion de datos desde el diseno: requisitos para activos',
    description:
      'Requisitos para activos que almacenan o procesan datos personales.',
    processes:
      'GES-PDP-02 (gestion operativa), GES-PDP-05 (monitoreo y mejora)',
  },
  {
    name: 'Clasificacion de datos',
    description:
      'Esquema de clasificacion que orienta la calibracion de medidas de proteccion.',
    processes: 'GES-PDP-02 (gestion operativa)',
  },
];

export interface ProcedureCard {
  code: string;
  name: string;
  objective: string;
  scope?: string;
  responsibilities: string;
  outputs: string;
  policies: string;
  technology: string;
}

export interface ProcedureGroup {
  id: string;
  name: string;
  procedures: ProcedureCard[];
}

export const PROCEDURE_GROUPS: ProcedureGroup[] = [
  {
    id: 'GES-PDP-01',
    name: 'Gestion de la relacion con titulares de datos personales',
    procedures: [
      {
        code: 'PRC-PDP-01',
        name: 'Atencion a titulares: ejercicio de derechos, consultas y reclamos',
        objective:
          'Gestionar las solicitudes de ejercicio de derechos, consultas y reclamos de los titulares de datos personales de forma oportuna, conforme a los plazos legales y con evidencia verificable del proceso y su resultado.',
        scope:
          'Se activa ante la recepcion de una solicitud de ejercicio de derecho, una consulta de un titular sobre el tratamiento de sus datos, o un reclamo sobre el manejo de datos personales. Cierra con la respuesta emitida al titular en plazo, la solicitud ejecutada o denegada con fundamento documentado, y el registro del caso actualizado. Excluye las denuncias (PRC-PDP-02) y los requerimientos de autoridades de control (PRC-PDP-12).',
        responsibilities:
          'Especialista en Proteccion de Datos: recibe, clasifica y tramita la solicitud. Gerente de Proteccion de Datos: supervisa el cumplimiento de plazos y aprueba respuestas complejas. DPO: asesora en casos que requieren interpretacion normativa. Dueno de proceso: colabora en la localizacion de datos y la ejecucion de acciones sobre los mismos.',
        outputs:
          'Respuesta formal al titular, registro de la solicitud y su resolucion, evidencia de ejecucion de la accion.',
        policies:
          'Requisitos legales (item h: regimen de derechos del titular), datos de colaboradores (derechos del personal como titular).',
        technology:
          'Sistema de gestion de solicitudes o herramienta de ticketing que permita trazabilidad, control de plazos y generacion de evidencia.',
      },
      {
        code: 'PRC-PDP-02',
        name: 'Gestion de denuncias en proteccion de datos personales',
        objective:
          'Gestionar las denuncias recibidas en materia de proteccion de datos personales, investigar los hechos reportados, determinar las acciones correctivas y documentar el resultado.',
        scope:
          'Se activa ante la recepcion de una denuncia sobre tratamiento indebido de datos personales. Cierra con la investigacion completada, la decision adoptada, las acciones correctivas implementadas cuando corresponda, y el caso registrado. Excluye solicitudes de ejercicio de derechos (PRC-PDP-01) y la gestion de incidentes de seguridad (PRC-PDP-11).',
        responsibilities:
          'Especialista: recibe y documenta la denuncia. Gerente: dirige la investigacion. DPO: asesora sobre la calificacion de los hechos.',
        outputs:
          'Informe de investigacion, decision documentada, acciones correctivas, comunicacion al denunciante.',
        policies:
          'Requisitos legales, politica general de proteccion de datos personales.',
        technology:
          'Canal de denuncia con garantias de confidencialidad, herramienta de gestion de casos.',
      },
      {
        code: 'PRC-PDP-03',
        name: 'Gestion del consentimiento, transparencia e informacion',
        objective:
          'Administrar los mecanismos de obtencion, registro, renovacion y revocacion del consentimiento, y asegurar el cumplimiento del deber de informacion y transparencia en todos los puntos de recogida de datos personales.',
        scope:
          'Se activa ante el diseno de un nuevo punto de recogida de datos, un cambio en las finalidades o bases de licitud, una solicitud de revocacion de consentimiento, o una revision periodica de los instrumentos de informacion. Cierra con el consentimiento gestionado y registrado, los avisos de informacion actualizados y desplegados, y la evidencia de cumplimiento documentada.',
        responsibilities:
          'Especialista: disena y actualiza avisos, gestiona registros de consentimiento. Gerente: aprueba los instrumentos de informacion. DPO: supervisa la suficiencia del cumplimiento informativo. Dueno de proceso: implementa los avisos en sus puntos de recogida.',
        outputs:
          'Avisos de informacion desplegados, registros de consentimiento actualizados, evidencia de revocaciones gestionadas.',
        policies:
          'Requisitos legales (item g: deber de informacion, item d: regimen de consentimiento).',
        technology:
          'Plataforma de gestion de consentimiento (CMP), herramientas de diseno de avisos, registro de evidencia de consentimiento.',
      },
    ],
  },
  {
    id: 'GES-PDP-02',
    name: 'Gestion operativa del tratamiento de datos personales',
    procedures: [
      {
        code: 'PRC-PDP-04',
        name: 'Verificacion de requisitos legales para actividades de tratamiento',
        objective:
          'Verificar que cada actividad de tratamiento de datos personales cumple con los requisitos legales aplicables antes de iniciarse o cuando se modifica su alcance, y documentar el analisis de cumplimiento.',
        scope:
          'Se activa ante el diseno de una nueva actividad de tratamiento o un cambio material en una existente. Cierra con el analisis de cumplimiento completado, la base de licitud determinada y acreditada, y la actividad habilitada o suspendida segun el resultado.',
        responsibilities:
          'Especialista: ejecuta el analisis. Gerente: aprueba. DPO: asesora en casos complejos. Dueno de proceso: provee la informacion sobre la actividad.',
        outputs:
          'Ficha de analisis de requisitos legales, determinacion de base de licitud documentada, dictamen de habilitacion o suspension.',
        policies:
          'Requisitos legales (items a a f), lineamientos para tratamientos especificos.',
        technology:
          'Herramienta de gestion del registro de actividades de tratamiento.',
      },
      {
        code: 'PRC-PDP-05',
        name: 'Administracion del Registro de Actividades de Tratamiento',
        objective:
          'Mantener un registro completo, exacto y actualizado de todas las actividades de tratamiento de datos personales de la organizacion, incluyendo los flujos de datos entre sistemas, procesos, areas y terceros.',
        scope:
          'Se activa ante el registro de una nueva actividad, un cambio en una existente, o una revision periodica. Cierra con el registro actualizado, los flujos de datos documentados y la informacion disponible para los procesos que la requieren.',
        responsibilities:
          'Especialista: documenta y actualiza el registro. Gerente: aprueba y supervisa la completitud. Dueno de proceso: provee la informacion de su area.',
        outputs:
          'RAT actualizado, diagramas de flujos de datos, inventario de transferencias.',
        policies:
          'Requisitos legales (item m: deberes registrales), transferencia y cesion de datos.',
        technology:
          'Herramienta de gestion del RAT, herramientas de diagramacion de flujos.',
      },
      {
        code: 'PRC-PDP-06',
        name: 'Proteccion de datos desde el diseno y por defecto',
        objective:
          'Integrar los requisitos de proteccion de datos personales en las especificaciones de diseno de proyectos, sistemas y procesos que traten datos personales, asegurando que la proteccion se incorpora desde la fase de diseno conceptual.',
        scope:
          'Se activa ante el inicio de un proyecto o sistema nuevo que tratara datos personales, o un cambio significativo en uno existente. Cierra con los requisitos identificados e integrados en las especificaciones. El alcance se limita a la fase de diseno conceptual; la implementacion tecnica corresponde a PRC-PDP-27.',
        responsibilities:
          'Ingeniero: identifica e integra requisitos tecnicos. Especialista: valida el cumplimiento normativo del diseno. Gerente: aprueba los requisitos. Equipo de proyecto: incorpora los requisitos en las especificaciones.',
        outputs:
          'Documento de requisitos de proteccion de datos para el proyecto, validacion de cumplimiento del diseno.',
        policies:
          'Proteccion de datos desde el diseno (requisitos para proyectos, requisitos para desarrollo de software).',
        technology:
          'Herramientas de gestion de proyectos, repositorios de requisitos.',
      },
      {
        code: 'PRC-PDP-07',
        name: 'Gestion integral del riesgo del tratamiento de datos personales',
        objective:
          'Identificar, analizar, evaluar y tratar los riesgos para los derechos y libertades de los titulares derivados de las actividades de tratamiento de datos personales, y los riesgos de cumplimiento normativo asociados.',
        scope:
          'Se activa ante una nueva actividad de tratamiento, un cambio material en una existente, o una revision periodica del perfil de riesgo. Cierra con los riesgos identificados, evaluados y con planes de tratamiento definidos y documentados.',
        responsibilities:
          'Especialista: ejecuta el analisis. Gerente: aprueba los planes de tratamiento. DPO: supervisa la coherencia con el apetito de riesgo. Dueno de proceso: valida los escenarios de riesgo.',
        outputs:
          'Registro de riesgos, planes de tratamiento de riesgo, informe de riesgo para la direccion.',
        policies: 'Gestion del riesgo en tratamiento de datos.',
        technology:
          'Herramientas de gestion de riesgos, matrices de evaluacion.',
      },
      {
        code: 'PRC-PDP-08',
        name: 'Evaluacion de impacto en la proteccion de datos',
        objective:
          'Evaluar el impacto de las actividades de tratamiento que presentan alto riesgo para los derechos y libertades de los titulares, determinar las medidas de mitigacion necesarias y documentar el analisis y sus conclusiones.',
        scope:
          'Se activa cuando el analisis de riesgo (PRC-PDP-07) determina que una actividad requiere evaluacion de impacto, o cuando la normativa aplicable la exige. Cierra con el informe de evaluacion completado, las medidas definidas y la decision sobre la viabilidad del tratamiento documentada.',
        responsibilities:
          'Especialista: ejecuta la evaluacion. DPO: emite dictamen. Gerente: aprueba el resultado y las medidas. Ingeniero: colabora en la evaluacion de medidas tecnicas.',
        outputs:
          'Informe de evaluacion de impacto, plan de medidas de mitigacion, dictamen del DPO.',
        policies:
          'Gestion del riesgo en tratamiento de datos, requisitos legales.',
        technology:
          'Herramientas de evaluacion de impacto, metodologia basada en ISO/IEC 29134.',
      },
      {
        code: 'PRC-PDP-23',
        name: 'Clasificacion de datos personales',
        objective:
          'Mantener un esquema de clasificacion de datos personales vigente y aplicado que permita dimensionar controles proporcionales a la sensibilidad del dato, el tipo de titular y el regimen normativo aplicable.',
        scope:
          'Se activa ante la incorporacion de un nuevo tipo de dato personal al inventario, un cambio normativo que modifica las categorias, o el inicio de una actividad con datos de tipologia no previamente clasificada. Cierra con el esquema actualizado, aprobado y comunicado.',
        responsibilities:
          'Especialista: propone y documenta el esquema. Gerente: aprueba. Dueno de proceso: aplica la clasificacion en su area. Ingeniero: traduce la clasificacion en controles tecnicos diferenciados.',
        outputs:
          'Esquema de clasificacion de datos personales, comunicacion a las areas, registro de actualizaciones.',
        policies: 'Clasificacion de datos.',
        technology:
          'Herramientas de catalogacion de datos, integracion con el RAT.',
      },
      {
        code: 'PRC-PDP-24',
        name: 'Retencion y disposicion de datos personales',
        objective:
          'Asegurar que los datos personales son conservados unicamente durante el periodo necesario para el cumplimiento de la finalidad que motivo su tratamiento o de la obligacion legal aplicable, y que son eliminados o anonimizados de forma segura y verificable al vencimiento del periodo de retencion.',
        scope:
          'Se activa ante el diseno o revision de una actividad que requiere establecer o actualizar periodos de retencion, o ante el vencimiento del periodo de retencion. Cierra con la politica de retencion aprobada o con los datos eliminados o anonimizados con evidencia documentada.',
        responsibilities:
          'Especialista: define los periodos y supervisa la disposicion. Gerente: aprueba la politica de retencion. Ingeniero: implementa los mecanismos tecnicos. Dueno de proceso: ejecuta la disposicion en su ambito.',
        outputs:
          'Politica de retencion con periodos definidos, evidencia de disposicion verificada, registro de eliminacion o anonimizacion.',
        policies:
          'Disposicion final de datos, requisitos legales (item j: regimen de conservacion).',
        technology:
          'Herramientas de gestion del ciclo de vida de datos, tecnicas de eliminacion segura conforme a ISO/IEC 27555, herramientas de anonimizacion.',
      },
      {
        code: 'PRC-PDP-27',
        name: 'Implementacion tecnica y verificacion de controles en sistemas',
        objective:
          'Los sistemas que tratan datos personales incorporan los controles tecnicos de proteccion de datos seleccionados conforme a los requisitos definidos en la fase de diseno, y son verificados contra esos controles antes de entrar en operacion.',
        scope:
          'Se activa ante el inicio de la fase de implementacion tecnica de un sistema nuevo o modificado, una vez definidos los requisitos en la fase de diseno (PRC-PDP-06). Cierra con los controles implementados y verificados, y el sistema con autorizacion documentada para entrar en operacion.',
        responsibilities:
          'Ingeniero: implementa los controles y ejecuta la verificacion. Especialista: valida que los controles corresponden a los requisitos. Gerente: autoriza la entrada en operacion. Equipo de TI: colabora en la implementacion y las pruebas.',
        outputs:
          'Informe de verificacion de controles, autorizacion de entrada en operacion, registro de controles implementados.',
        policies:
          'Proteccion de datos desde el diseno (requisitos para desarrollo de software, requisitos para activos).',
        technology:
          'Herramientas de pruebas de seguridad, escaneres de cumplimiento, entornos de verificacion.',
      },
    ],
  },
  {
    id: 'GES-PDP-03',
    name: 'Gestion de terceros, transferencias y contratos',
    procedures: [
      {
        code: 'PRC-PDP-09',
        name: 'Gestion de la proteccion de datos en la relacion con terceros',
        objective:
          'Gestionar el ciclo de vida completo de la relacion con terceros que acceden, procesan o reciben datos personales de la organizacion, asegurando que cumplen los requisitos de proteccion de datos aplicables, incluyendo los requisitos de seguridad en los acuerdos con terceros.',
        responsibilities:
          'Especialista: evalua al tercero y define requisitos. Gerente: aprueba la relacion. DPO: asesora en evaluaciones complejas.',
        outputs:
          'Evaluacion del tercero, requisitos de proteccion de datos para el acuerdo, registro de terceros del programa.',
        policies:
          'Transferencia y cesion de datos, requisitos legales (item l: formalizacion de roles).',
        technology:
          'Herramientas de gestion de terceros, cuestionarios de evaluacion.',
      },
      {
        code: 'PRC-PDP-10',
        name: 'Gestion del encargo de tratamiento (organizacion como encargado)',
        objective:
          'Gestionar las obligaciones de la organizacion cuando actua como encargado del tratamiento por cuenta de un responsable.',
        responsibilities:
          'Gerente: supervisa el cumplimiento del encargo. Especialista: gestiona operativamente las instrucciones. DPO: asesora sobre conflictos entre instrucciones y normativa.',
        outputs:
          'Registro de instrucciones del responsable, evidencia de cumplimiento del encargo, comunicacion al responsable sobre subencargados.',
        policies:
          'Requisitos legales (item l: roles), transferencia y cesion de datos.',
        technology:
          'Herramientas de gestion contractual, registro de instrucciones.',
      },
      {
        code: 'PRC-PDP-22',
        name: 'Gestion de clausulas e instrumentos contractuales',
        objective:
          'Gestionar los instrumentos contractuales que formalizan las obligaciones de proteccion de datos con terceros y con el personal propio, incluyendo los instrumentos que habilitan las transferencias internacionales y la supervision periodica de las condiciones que los sustentan.',
        responsibilities:
          'Especialista: prepara los instrumentos contractuales. Gerente: aprueba los instrumentos. Legal: valida la conformidad juridica. RRHH: gestiona los instrumentos con el personal.',
        outputs:
          'Contratos de encargo de tratamiento, clausulas de proteccion de datos, instrumentos de habilitacion de transferencias internacionales, compromisos de confidencialidad del personal.',
        policies:
          'Transferencia y cesion de datos, datos de colaboradores, requisitos legales.',
        technology:
          'Repositorio de contratos del programa, gestion de expedientes de personal.',
      },
    ],
  },
  {
    id: 'GES-PDP-04',
    name: 'Gestion de incidentes y relacion con autoridades de control',
    procedures: [
      {
        code: 'PRC-PDP-11',
        name: 'Gestion de incidentes de seguridad con datos personales',
        objective:
          'Detectar, contener, evaluar, notificar y remediar los incidentes de seguridad que afectan datos personales, en coordinacion con el sistema de gestion de seguridad de la informacion cuando exista.',
        responsibilities:
          'Gerente: lidera la respuesta. Especialista: documenta y evalua el incidente. DPO: asesora sobre la obligacion de notificacion. Ingeniero: ejecuta la contencion tecnica. Equipo de SI: coordina la respuesta tecnica.',
        outputs:
          'Registro del incidente, evaluacion de impacto del incidente, notificacion a la autoridad de control (cuando corresponda), comunicacion a titulares (cuando corresponda), informe de lecciones aprendidas.',
        policies: 'Requisitos legales (item k: notificacion de brechas).',
        technology:
          'Herramientas de deteccion y respuesta a incidentes, plataforma de notificacion a autoridades, sistema de gestion de incidentes coordinado con SGSI.',
      },
      {
        code: 'PRC-PDP-12',
        name: 'Gestion de requerimientos e inspecciones de autoridades de control',
        objective:
          'Gestionar los requerimientos, consultas e inspecciones de las autoridades de control de forma oportuna, completa y conforme a los plazos legales.',
        responsibilities:
          'DPO: lidera la relacion con la autoridad y coordina la respuesta. Gerente: prepara la documentacion de soporte. Especialista: recopila la informacion requerida. Legal: asesora sobre los aspectos juridicos.',
        outputs:
          'Respuesta al requerimiento, documentacion de soporte, registro de la actuacion.',
        policies:
          'Politica general de proteccion de datos personales, requisitos legales.',
        technology:
          'Repositorio de correspondencia con autoridades, sistema de gestion documental.',
      },
    ],
  },
  {
    id: 'GES-PDP-05',
    name: 'Monitoreo, evaluacion y mejora del programa',
    procedures: [
      {
        code: 'PRC-PDP-13',
        name: 'Monitoreo de cumplimiento de requisitos en actividades de tratamiento',
        objective:
          'Verificar de forma continua que las actividades de tratamiento de datos personales cumplen con los requisitos legales, las politicas internas y los controles definidos.',
        responsibilities:
          'Especialista: ejecuta las verificaciones. Gerente: aprueba el plan de monitoreo y revisa los resultados. Dueno de proceso: facilita el acceso a la informacion y colabora.',
        outputs:
          'Informe de monitoreo, hallazgos documentados, no conformidades identificadas.',
        policies: 'Todas las politicas especificas.',
        technology:
          'Herramientas de monitoreo de cumplimiento, checklists de verificacion.',
      },
      {
        code: 'PRC-PDP-14',
        name: 'Monitoreo de cumplimiento de requisitos en activos de soporte',
        objective:
          'Verificar que los activos de soporte (sistemas, aplicaciones, bases de datos, redes, dispositivos) que tratan datos personales cumplen con los requisitos de proteccion de datos y seguridad aplicables, incluyendo los controles de identidad y acceso.',
        responsibilities:
          'Ingeniero: ejecuta las verificaciones tecnicas. Especialista: evalua los hallazgos. Gerente: aprueba el plan. Equipo de TI y SI: facilitan el acceso y colaboran.',
        outputs:
          'Informe de monitoreo de activos, hallazgos tecnicos, no conformidades identificadas.',
        policies:
          'Proteccion de datos desde el diseno (requisitos para activos), requisitos legales.',
        technology:
          'Herramientas de escaneo de cumplimiento, gestion de identidades y acceso, herramientas de monitoreo de configuracion.',
      },
      {
        code: 'PRC-PDP-15',
        name: 'Auditoria interna del programa de proteccion de datos personales',
        objective:
          'Evaluar de forma independiente la conformidad del programa de proteccion de datos con los requisitos aplicables y la efectividad de los controles implementados.',
        responsibilities:
          'Auditor: planifica, ejecuta y reporta la auditoria. DPO: aprueba el programa de auditoria y revisa los hallazgos. Gerente: facilita el acceso a la informacion y gestiona el plan de accion.',
        outputs:
          'Programa de auditoria, informe de auditoria, hallazgos y recomendaciones.',
        policies: 'Politica general de proteccion de datos personales.',
        technology:
          'Herramientas de gestion de auditoria, metodologia conforme a ISO 19011.',
      },
      {
        code: 'PRC-PDP-16',
        name: 'Gestion de no conformidades y mejora continua',
        objective:
          'Gestionar las no conformidades detectadas en el programa, determinar las causas, implementar acciones correctivas y capturar las lecciones aprendidas para la mejora continua.',
        responsibilities:
          'Gerente: gestiona el proceso de no conformidades. Especialista: documenta las no conformidades y ejecuta acciones correctivas. Auditor: verifica la efectividad de las acciones correctivas.',
        outputs:
          'Registro de no conformidades, analisis de causas, plan de accion correctiva, evidencia de cierre, registro de lecciones aprendidas.',
        policies: 'Politica general de proteccion de datos personales.',
        technology:
          'Herramientas de gestion de no conformidades, sistema de mejora continua.',
      },
      {
        code: 'PRC-PDP-25',
        name: 'Gestion de objetivos y medicion del desempeno del Programa',
        objective:
          'Establecer, comunicar y monitorear los objetivos del programa, garantizando que el desempeno es medible con indicadores definidos, que los resultados son reportados a los organos de gobierno, y que los desvios frente a objetivos generan acciones de mejora.',
        responsibilities:
          'Gerente: propone objetivos e indicadores, reporta resultados. DPO: valida la coherencia con los requisitos normativos. Organo de gobierno: aprueba los objetivos y revisa los resultados. Especialista: recopila y consolida datos de desempeno.',
        outputs:
          'Cuadro de objetivos e indicadores aprobados, informe periodico de desempeno, plan de acciones de mejora.',
        policies: 'Politica general de proteccion de datos personales.',
        technology:
          'Herramientas de gestion de indicadores, cuadros de mando.',
      },
      {
        code: 'PRC-PDP-26',
        name: 'Monitoreo del entorno regulatorio',
        objective:
          'Mantener una vigilancia sistematica y continua del entorno regulatorio aplicable al programa, identificar oportunamente los cambios normativos con impacto en el programa, y traducirlos en acciones de actualizacion planificadas y ejecutadas.',
        responsibilities:
          'Especialista: ejecuta la vigilancia y elabora el analisis de impacto. DPO: valida el analisis de impacto y las recomendaciones. Gerente: aprueba el plan de actualizacion. Areas afectadas: participan en la planificacion de cambios.',
        outputs:
          'Alerta de cambio regulatorio, analisis de impacto, plan de actualizacion, comunicacion interna.',
        policies: 'Politica general de proteccion de datos personales.',
        technology:
          'Herramientas de vigilancia regulatoria, suscripciones a fuentes oficiales, repositorio de normas.',
      },
    ],
  },
  {
    id: 'GES-PDP-06',
    name: 'Gestion de las capacidades del programa',
    procedures: [
      {
        code: 'PRC-PDP-17',
        name: 'Reporte a la alta direccion',
        objective:
          'Producir y presentar informes periodicos a la alta direccion sobre el estado del programa, sus resultados, riesgos y necesidades, proporcionando la informacion necesaria para que el organo de gobierno ejerza sus funciones.',
        responsibilities:
          'Gerente: prepara y presenta el informe. DPO: contribuye con el analisis de cumplimiento y riesgos. Organo de gobierno: recibe y actua sobre el informe.',
        outputs:
          'Informe a la alta direccion, registro de decisiones adoptadas.',
        policies: 'Politica general de proteccion de datos personales.',
        technology:
          'Herramientas de consolidacion de datos, plantillas de reporte ejecutivo.',
      },
      {
        code: 'PRC-PDP-18',
        name: 'Supervision proactiva y asesoramiento del DPO',
        objective:
          'Ejercer la funcion de supervision proactiva y asesoramiento que corresponde al DPO, identificando riesgos y oportunidades de mejora antes de que se materialicen en incumplimientos.',
        responsibilities:
          'DPO: ejecuta la supervision y emite asesoramiento. Gerente: recibe y gestiona las recomendaciones. Organo de gobierno: es informado de los hallazgos relevantes.',
        outputs:
          'Registros de asesoramiento, recomendaciones formales, alertas de riesgo.',
        policies: 'Todas las politicas (funcion transversal).',
        technology:
          'Herramientas de gestion del conocimiento, registro de asesoramientos.',
      },
      {
        code: 'PRC-PDP-19',
        name: 'Gestion documental del programa de proteccion de datos personales',
        objective:
          'Gestionar el ciclo de vida de la informacion documentada del programa: creacion, revision, aprobacion, distribucion, control de versiones, retencion y disposicion.',
        responsibilities:
          'Gerente: aprueba los documentos y supervisa el sistema documental. Especialista: gestiona operativamente el repositorio y los controles de version. DPO: valida los documentos que requieren su aprobacion.',
        outputs:
          'Documentos controlados y versionados, listado maestro de documentos del programa, registros de distribucion.',
        policies: 'Politica general de proteccion de datos personales.',
        technology:
          'Sistema de gestion documental, control de versiones, repositorio del programa.',
      },
      {
        code: 'PRC-PDP-20',
        name: 'Gestion del programa de formacion y sensibilizacion',
        objective:
          'Planificar, ejecutar y evaluar las actividades de formacion y sensibilizacion en proteccion de datos personales, asegurando que el personal de la organizacion tiene las competencias y la conciencia necesarias para cumplir sus responsabilidades.',
        responsibilities:
          'Gerente: aprueba el plan de formacion. Especialista: disena y ejecuta las actividades. DPO: valida el contenido tecnico. RRHH: coordina la logistica y los registros de participacion.',
        outputs:
          'Plan de formacion, materiales de capacitacion, registros de participacion, evaluaciones de conocimiento, informe de resultados.',
        policies: 'Politica general de proteccion de datos personales.',
        technology:
          'Plataformas de formacion en linea (LMS), herramientas de evaluacion.',
      },
      {
        code: 'PRC-PDP-21',
        name: 'Gestion de consultas internas en proteccion de datos personales',
        objective:
          'Atender las consultas del personal de la organizacion sobre la aplicacion de las politicas, procedimientos y requisitos de proteccion de datos personales en su operacion cotidiana.',
        responsibilities:
          'Especialista: atiende las consultas. DPO: asesora en consultas complejas. Privacy champion: canaliza las consultas de su area.',
        outputs:
          'Registro de consultas y respuestas, base de conocimiento de consultas frecuentes.',
        policies: 'Todas las politicas (funcion transversal).',
        technology:
          'Herramienta de gestion de consultas, base de conocimiento interna.',
      },
    ],
  },
];

export interface FlowRow {
  origin: string;
  originDesc: string;
  produced: string;
  destinations: string;
}

export const FLOW_ROWS: FlowRow[] = [
  {
    origin: 'GOB-PDP-01',
    originDesc: 'Responsabilidad proactiva',
    produced: 'Estructura de gobierno aprobada, mandato de la funcion PDP',
    destinations: 'Todos los procesos de gestion',
  },
  {
    origin: 'GOB-PDP-02',
    originDesc: 'Direccion estrategica',
    produced: 'Direccion estrategica, objetivos del programa',
    destinations:
      'GES-PDP-05 (monitoreo y mejora, via PRC-PDP-25), GES-PDP-06 (capacidades, via PRC-PDP-17)',
  },
  {
    origin: 'GOB-PDP-03',
    originDesc: 'Gobernanza del riesgo',
    produced: 'Apetito de riesgo definido',
    destinations:
      'GES-PDP-02 (gestion operativa, via PRC-PDP-07 gestion integral del riesgo)',
  },
  {
    origin: 'GOB-PDP-04',
    originDesc: 'Dotacion de recursos',
    produced: 'Asignacion de recursos aprobada',
    destinations: 'Todos los procesos de gestion',
  },
  {
    origin: 'GES-PDP-01',
    originDesc: 'Relacion con titulares',
    produced:
      'Registros de solicitudes atendidas, registros de consentimiento',
    destinations:
      'GES-PDP-05 (monitoreo y mejora), GES-PDP-06 (capacidades, reporte)',
  },
  {
    origin: 'GES-PDP-02',
    originDesc: 'Gestion operativa',
    produced:
      'RAT actualizado, evaluaciones de impacto, analisis de riesgo, registros de habilitacion',
    destinations:
      'GES-PDP-03 (terceros y contratos), GES-PDP-04 (incidentes), GES-PDP-05 (monitoreo y mejora), GES-PDP-06 (capacidades)',
  },
  {
    origin: 'GES-PDP-03',
    originDesc: 'Terceros y contratos',
    produced: 'Registro de terceros, instrumentos contractuales',
    destinations:
      'GES-PDP-02 (gestion operativa, insumo para RAT), GES-PDP-05 (monitoreo y mejora)',
  },
  {
    origin: 'GES-PDP-04',
    originDesc: 'Incidentes y autoridades',
    produced: 'Registros de incidentes, lecciones aprendidas',
    destinations:
      'GES-PDP-05 (monitoreo y mejora, via PRC-PDP-16 no conformidades), GES-PDP-06 (capacidades, via PRC-PDP-17 reporte)',
  },
  {
    origin: 'GES-PDP-05',
    originDesc: 'Monitoreo y mejora',
    produced:
      'Hallazgos de monitoreo, informes de auditoria, no conformidades, indicadores, alertas regulatorias',
    destinations:
      'GOB-PDP-02 (direccion estrategica), GOB-PDP-03 (gobernanza del riesgo), GES-PDP-06 (capacidades), todos los procesos afectados',
  },
  {
    origin: 'GES-PDP-06',
    originDesc: 'Capacidades del programa',
    produced:
      'Informes a la alta direccion, registros de asesoramiento, documentacion controlada, personal formado',
    destinations:
      'GOB-PDP-01 a GOB-PDP-04 (todos los procesos de gobierno), todos los procesos de gestion',
  },
];

export interface Faq {
  question: string;
  answer: string;
}

export const FAQS: Faq[] = [
  {
    question: 'Que es el Privacy Governance Framework?',
    answer:
      'Es un marco de trabajo que organiza los componentes necesarios para implementar un sistema de gobierno en proteccion de datos personales. Proporciona la arquitectura de referencia (procesos, roles, politicas, procedimientos, tecnologia, informacion y cultura) y la orientacion para que cada organizacion la adapte a su contexto.',
  },
  {
    question: 'En que se diferencia de una lista de verificacion de cumplimiento?',
    answer:
      'Una lista de verificacion mide si la organizacion cumple o no cumple un requisito especifico. El framework proporciona el sistema que hace posible ese cumplimiento: los procesos que lo ejecutan, las personas que lo operan, las politicas que lo orientan y la informacion que lo demuestra. No es una fotografia de cumplimiento; es la infraestructura que lo produce.',
  },
  {
    question: 'Como se adapta a distintas jurisdicciones?',
    answer:
      'El framework separa los componentes globales (estructura de procesos, modelo de gobierno, principios, arquitectura de roles) de los componentes que requieren adaptacion jurisdiccional (requisitos legales especificos, plazos, obligaciones de notificacion, requisitos de designacion de DPO). Una organizacion que opera en Ecuador, Chile y Peru implementa la misma estructura de procesos pero configura los requisitos legales y las politicas especificas conforme a la normativa de cada jurisdiccion.',
  },
  {
    question:
      'Puede integrarse con marcos existentes como ISO 27001, ISO 27701 o NIST Privacy Framework?',
    answer:
      'El framework esta disenado para integrarse. Su estructura de siete componentes es compatible con ISO 27701 (que comparte el modelo de sistema de gestion), con ISO 27001 (en la dimension de seguridad de la informacion) y con otros marcos de gobernanza. La organizacion que ya tiene un SGSI implementado no necesita duplicar procesos; el programa de proteccion de datos se articula con los procesos existentes.',
  },
  {
    question: 'Como aborda la gobernanza de inteligencia artificial?',
    answer:
      'El framework trata la IA en dos dimensiones: como objeto de gobierno (los sistemas de IA que tratan datos personales deben cumplir todos los requisitos del programa) y como herramienta del programa (las herramientas de IA pueden soportar la operacion del sistema de gobierno). La seccion 6 desarrolla los criterios generales, los puntos de integracion y los errores comunes.',
  },
  {
    question: 'Que son los kits de implementacion?',
    answer:
      'Son conjuntos de herramientas operativas que acompanan al framework: guias de implementacion, plantillas de documentos, herramientas de trabajo, materiales de capacitacion y modelos de referencia. Cada kit esta asociado a una iniciativa de implementacion y proporciona los artefactos necesarios para que el equipo de la organizacion ejecute los procesos del programa.',
  },
  {
    question: 'Como se mantiene actualizado el framework?',
    answer:
      'El framework tiene un ciclo de mantenimiento que incluye la vigilancia del entorno regulatorio (PRC-PDP-26), la incorporacion de lecciones aprendidas de la operacion con organizaciones y la revision periodica de la arquitectura conforme evoluciona el estado de las mejores practicas. Los cambios se gestionan desde el texto canonico (.md) y se propagan a los artefactos derivados.',
  },
  {
    question:
      'Que nivel de madurez necesita una organizacion para empezar a usarlo?',
    answer:
      'Cualquier nivel. Una organizacion sin programa formal de proteccion de datos usa el framework como hoja de ruta para construirlo desde cero. Una organizacion con un programa existente lo usa como referencia para identificar brechas y estructurar la mejora. La escala de priorizacion tecnologica (seccion 4.5) y la secuencia de procesos orientan la implementacion progresiva.',
  },
  {
    question: 'El framework prescribe herramientas tecnologicas especificas?',
    answer:
      'No. El framework describe categorias funcionales de herramientas y criterios de seleccion, pero no recomienda productos comerciales especificos. La seleccion de herramientas es una decision de cada organizacion, orientada por sus necesidades funcionales, su nivel de riesgo y su capacidad de integracion.',
  },
  {
    question:
      'Como se articula la proteccion de datos con la ciberseguridad en el framework?',
    answer:
      'La seccion 5 desarrolla la integracion. El principio rector es que el programa de proteccion de datos no sustituye al SGSI; se articula con el. Los puntos de integracion principales son la gestion de incidentes, los controles de acceso e identidad, los requisitos de seguridad en terceros y la implementacion tecnica de controles. El framework evita la duplicacion de esfuerzos: cada control tiene un dueno claro y la coordinacion se define explicitamente.',
  },
  {
    question: 'La organizacion puede externalizar la operacion del programa?',
    answer:
      'Si, parcial o totalmente segun el proceso. La seccion 4.3 detalla el perfil de externalizacion por proceso de gestion. La restriccion principal es que el gobierno del programa, el diseno de procesos, las decisiones estrategicas y ciertos roles (privacy champion, dueno de proceso) los retiene siempre la organizacion.',
  },
];
