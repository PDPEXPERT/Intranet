import Link from 'next/link';
import {
  WikiCallout,
  WikiEyebrow,
  WikiLede,
  WikiP,
  WikiSection,
  WikiSources,
  WikiSubtitle,
  WikiTable,
  WikiTitle,
  WikiUL,
} from '@/components/excellence/wiki';

export default function InformacionEInformacionDocumentada() {
  return (
    <article>
      <WikiEyebrow>Arquitectura Empresarial · Protección de Datos Personales</WikiEyebrow>
      <WikiTitle>Información e información documentada</WikiTitle>
      <WikiSubtitle>ISO 9000:2015 · el enfoque de capacidades aplicado a PDP Expert</WikiSubtitle>
      <WikiLede>
        Dentro de la{' '}
        <Link
          href="/excellence/arquitectura-empresarial-y-negocio/"
          className="text-accent hover:underline"
        >
          ontología de capacidades para protección de datos
        </Link>
        , la gestión de información documentada es una capacidad de soporte: no es el núcleo de lo
        que hacemos, pero toda operación de protección de datos personales genera mucha
        documentación y mucha evidencia, y necesita un criterio propio para gobernarla bien.
      </WikiLede>

      <WikiSection title="Qué es información" first>
        <WikiP>
          Según ISO 9000:2015, la <strong>información</strong> es &quot;datos que poseen
          significado&quot;. Los datos, a su vez, son sencillamente &quot;hechos sobre un
          objeto&quot;. La información es entonces la interpretación o estructuración con sentido de
          esos hechos brutos. Puede ser explícita (un manual escrito) o tácita (el conocimiento
          práctico o la experiencia en la mente de una persona).
        </WikiP>
        <WikiCallout label="Distinta de la noción de información en arquitectura de negocio">
          <p>
            Cuando TOGAF y el enfoque de capacidades hablan de información en general (los datos que
            poseen significado y cómo fluyen dentro de la organización), es una noción amplia, sin
            obligación de control formal. Cuando hablamos de <strong>información documentada</strong>{' '}
            estamos usando ya un lenguaje distinto, propio de los marcos de gestión y gobierno: el de
            las normas ISO de calidad. En PDP Expert usamos ese vocabulario porque nuestro ecosistema
            de estándares está orientado a ISO, y porque nos da un lenguaje común con la mayoría de
            nuestros clientes.
          </p>
        </WikiCallout>
      </WikiSection>

      <WikiSection title="Qué es información documentada">
        <WikiP>
          La información documentada es &quot;la información que una organización tiene que
          controlar y mantener, y el medio que la contiene&quot;. Puede estar en cualquier formato o
          medio (papel, electrónico, magnético, óptico, fotografía, muestra patrón o digital) y
          provenir de cualquier fuente. Según las notas de la norma, abarca:
        </WikiP>
        <WikiUL>
          <li>La descripción del propio sistema de gestión, incluidos sus procesos.</li>
          <li>
            La información necesaria para que la organización opere (procedimientos, instrucciones,
            manuales).
          </li>
          <li>La evidencia de los resultados alcanzados (los registros).</li>
        </WikiUL>

        <WikiP>
          <strong>La frontera exacta: cuándo hay obligación de control formal.</strong> El Anexo A de
          ISO 9001:2015 aclara esta diferencia. Cuando la norma usa la palabra &quot;información&quot;
          a secas, no existe obligación de que deba documentarse ni controlarse formalmente: la
          organización decide si es adecuado hacerlo. Cuando la norma exige &quot;información
          documentada&quot;, es mandatorio aplicar controles estrictos de creación, actualización,
          aprobación, distribución, legibilidad, protección y retención.
        </WikiP>
        <WikiTable
          headers={['Dimensión', 'Información (a secas)', 'Información documentada']}
          widths={['22%', '39%', '39%']}
          rows={[
            [
              'Obligatoriedad de control',
              'La organización decide si documentarla o no.',
              'Mandatorio: creación, actualización, aprobación, distribución, legibilidad, protección y retención.',
            ],
            [
              'Presencia del medio o soporte',
              'Puede ser verbal o conocimiento intangible de una persona.',
              'Vincula indisolublemente el mensaje con su soporte (PDF, base de datos, papel impreso).',
            ],
          ]}
        />
      </WikiSection>

      <WikiSection title="Mantener vs. conservar">
        <WikiP>
          La información documentada tiene dos estados que no aplican a la información general:
          información que se debe <strong>mantener</strong> (documentos activos, dinámicos) e
          información que se debe <strong>conservar</strong> (registros estáticos, evidencia
          histórica).
        </WikiP>
        <WikiTable
          headers={['Aspecto', 'MANTENER (dinámica / documento)', 'CONSERVAR (estática / registro)']}
          widths={['20%', '40%', '40%']}
          rows={[
            [
              'Pregunta clave',
              '¿Cómo debemos actuar? ¿Cuál es la regla?',
              '¿Qué hicimos? ¿Cuáles fueron los resultados?',
            ],
            [
              'Frecuencia de revisión',
              'Periódica. Se modifica y mejora continuamente.',
              'Ninguna. Queda congelada en el tiempo una vez generada.',
            ],
            [
              'Control de versiones',
              'Obligatorio: número de versión, historial de cambios, revisión y aprobación.',
              'No aplica. No se manejan números de revisión de contenido.',
            ],
            [
              'Principal riesgo',
              'Trabajar con un documento obsoleto o desactualizado.',
              'Sufrir alteraciones no autorizadas, pérdida de datos o deterioro.',
            ],
            [
              'Ejemplo',
              'Un procedimiento en PDF en la intranet.',
              'El registro firmado de que un lote de producción fue liberado.',
            ],
          ]}
        />
        <WikiCallout label="El ciclo de vida de un formulario">
          <p>
            Un mismo formulario pasa por los dos estados. En blanco, la plantilla es información que
            se <strong>mantiene</strong>: si se añade un paso, cambia de versión y se aprueba de
            nuevo. Una vez usado, completado con datos y firmado, se archiva y se transforma
            instantáneamente en un registro que se debe <strong>conservar</strong>: ya no se modifica
            ni actualiza, y debe protegerse para demostrar ante una auditoría, quizás años después,
            que esa actividad se realizó correctamente ese día.
          </p>
        </WikiCallout>
        <WikiP>
          Esta distinción tiene un efecto práctico directo sobre el principio de responsabilidad
          demostrada: no basta con decir que tenemos la documentación, hay que poder demostrar que la
          tenemos y cómo la tenemos. El principio exige, sobre todo, conservar evidencia — un
          checklist o un procedimiento es información que se mantiene, pero la evidencia de que ese
          checklist se ejecutó (fecha, firma, resultado) es información que se conserva, y tiene otra
          naturaleza y otra forma de estructurarse.
        </WikiP>
      </WikiSection>

      <WikiSection title="Gestión de la información documentada en PDP Expert">
        <WikiP>
          La gestión de información documentada es, dentro de nuestra ontología de capacidades, una{' '}
          <strong>capacidad de soporte</strong> a la protección de datos personales, no una capacidad
          nuclear. Eso significa que cuando abordamos un programa de protección de datos en un
          cliente, no partimos de cero: preguntamos primero cómo esa organización gobierna hoy su
          información documentada (si tiene área de procesos, sistema de gestión documental,
          políticas y procedimientos propios) antes de decidir qué documentación es específica de
          protección de datos y cuál debe integrarse en lo que ya existe.
        </WikiP>

        <WikiP>
          <strong>Cómo decidimos qué va dónde.</strong> Ante cada job to be done de la arquitectura
          de procesos de protección de datos, aplicamos un criterio técnico, no una regla
          automática:
        </WikiP>
        <WikiTable
          headers={['Situación', 'Dónde va la documentación']}
          widths={['30%', '70%']}
          rows={[
            [
              'No hay ningún área que reciba ese proceso',
              'Va al manual de políticas y procedimientos de protección de datos, solo.',
            ],
            [
              'El proceso ya se gestiona dentro de otra área existente (por ejemplo, gestión de incidentes en seguridad de la información)',
              'Se referencia por vía de política, sin duplicar el procedimiento: la política de protección de datos remite al documento propio de esa área.',
            ],
            [
              'Hay flujo de información propio o integración de componentes de tecnología que lo ameritan (por ejemplo, gestión de terceras partes)',
              'Se documenta como flujo propio, coordinado con el área de soporte correspondiente.',
            ],
          ]}
        />
        <WikiCallout label="Por qué esto es una decisión técnica, no mecánica">
          <p>
            No es una decisión de blanco o negro que se resuelve solo con una plantilla: requiere
            entender primero qué capacidades de soporte tiene la organización (tecnología, seguridad
            de la información, gobierno de datos, gestión de terceros, gestión por procesos) y cómo
            están de maduras, antes de decidir si un proceso va al manual de protección de datos, se
            referencia hacia otra área, o se documenta como flujo propio.
          </p>
        </WikiCallout>

        <WikiP>
          <strong>Por qué hay que sentar a todos los interesados desde el inicio.</strong> En la
          práctica, la implementación de un programa de protección de datos convoca varios intereses
          distintos sobre la documentación al mismo tiempo: seguridad de la información quiere ver su
          actualización del SGSI, el área de protección de datos del cliente quiere saber qué
          documentos necesita de aquí en adelante, el área de procesos quiere una visión consolidada
          de cómo se afecta toda la documentación de la organización, y el gerente de proyecto quiere
          los entregables del proyecto. Atender esas demandas por separado, sobre la marcha, genera
          reprocesos y fricción evitable. La forma correcta es reunir a todos esos interesados desde
          el arranque del proyecto y explicar, en un solo espacio, qué documentación es propia del
          área de protección de datos, cuál es propia de las áreas de soporte, y cuál es evidencia
          que las áreas que tratan datos personales van a tener que generar y mantener.
        </WikiP>
      </WikiSection>

      <WikiSources>
        ISO 9000:2015 (fundamentos y vocabulario) e ISO 9001:2015 (Anexo A), aplicadas a la gestión
        de información documentada de un programa de protección de datos personales conforme al
        enfoque de capacidades de PDP Expert.
      </WikiSources>
    </article>
  );
}
