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

export default function GestionConocimiento() {
  return (
    <article>
      <WikiEyebrow>Gestión del conocimiento · Fundamentos</WikiEyebrow>
      <WikiTitle>Qué es la gestión del conocimiento</WikiTitle>
      <WikiSubtitle>UNE-ISO 30401:2021 · Sistemas de gestión del conocimiento</WikiSubtitle>
      <WikiLede>
        El conocimiento es un activo intangible de la organización que, bien gestionado, permite
        tomar mejores decisiones y actuar con eficacia. La ISO 30401 ofrece un marco para
        gestionarlo de forma deliberada, en lugar de dejarlo a la difusión espontánea entre las
        personas.
      </WikiLede>

      <WikiSection title="Qué es el conocimiento" first>
        <WikiP>
          La norma define el conocimiento como un activo humano u organizativo que permite una
          buena toma de decisiones y llevar a cabo actuaciones eficaces. Se adquiere mediante el
          aprendizaje o la experiencia, y puede ser individual, colectivo u organizativo.
        </WikiP>
        <WikiP>
          Conviene no confundir conocimiento con información ni con datos. Son tres cosas distintas
          dentro de una misma cadena:
        </WikiP>
        <WikiTable
          headers={['Concepto', 'Qué es']}
          widths={['22%', '78%']}
          rows={[
            ['Datos', 'Registros en bruto, sin interpretación. Cifras, hechos o señales aisladas.'],
            [
              'Información',
              'Datos significativos. Datos organizados en un contexto que les da sentido.',
            ],
            [
              'Conocimiento',
              'La información aplicada por una persona para decidir bien y actuar con eficacia. Vive en las personas y en las prácticas de la organización, no solo en los documentos.',
            ],
          ]}
        />
        <WikiCallout label="Idea clave">
          <p>
            La tecnología por sí sola no crea conocimiento. Comprar una herramienta no basta para
            que la gestión del conocimiento genere valor: el conocimiento lo crean las personas.
          </p>
        </WikiCallout>
      </WikiSection>

      <WikiSection title="Qué tipos de conocimiento hay">
        <WikiP>
          El conocimiento no se divide en cajones cerrados, sino que forma un continuo. En un
          extremo está el conocimiento que no se ha puesto en palabras y vive en la experiencia de
          las personas; en el otro, el conocimiento documentado y codificado con reglas bien
          definidas. Entender ese espectro ayuda a decidir cómo tratar cada tipo.
        </WikiP>
        <WikiTable
          headers={['Punto del espectro', 'Ejemplo']}
          widths={['38%', '62%']}
          rows={[
            [
              'Conocimiento del que la persona ni es consciente',
              'Hábitos y automatismos que se aplican sin darse cuenta.',
            ],
            [
              'Conocimiento consciente pero no expresable',
              'El juicio o la intuición que cuesta poner en palabras o símbolos.',
            ],
            [
              'Conocimiento difícil de explicar',
              'Experticia que la persona posee pero le resulta difícil transmitir.',
            ],
            [
              'Conocimiento documentado o registrado',
              'Libros, archivos de documentos, contenido de aprendizaje digital.',
            ],
            [
              'Conocimiento codificado con reglas',
              'Manuales, diagramas, procedimientos, algoritmos.',
            ],
          ]}
        />
        <WikiCallout label="Cómo se mueve">
          <p>
            El conocimiento se transforma de una forma a otra según el contexto y el valor que
            aporta. Una parte del trabajo de la gestión del conocimiento es decidir en qué punto
            del espectro conviene que esté cada área de conocimiento y qué hacer para aprovecharlo,
            aplicarlo o transferirlo.
          </p>
        </WikiCallout>
      </WikiSection>

      <WikiSection title="Por qué importa para la organización">
        <WikiP>
          El trabajo produce resultados valiosos cuando se aplica conocimiento. Por eso el
          conocimiento organizativo se ha vuelto un factor clave de eficacia, colaboración y
          ventaja competitiva. Gestionarlo bien trae beneficios concretos:
        </WikiP>
        <WikiUL>
          <li>Permite tomar decisiones eficaces y alineadas, basadas en la experiencia acumulada.</li>
          <li>Apoya la eficiencia de los procesos y contribuye a mejorarlos.</li>
          <li>Crea capacidad de recuperación y adaptación frente al cambio.</li>
          <li>Puede convertirse en ventaja competitiva e incluso en un producto en sí mismo.</li>
          <li>
            Reduce el riesgo de descapitalización cuando un experto rota o deja la organización y
            se lleva consigo el conocimiento crítico.
          </li>
          <li>
            Habilita la colaboración entre sedes y equipos dispersos que ejecutan los mismos
            procesos en lugares distintos.
          </li>
        </WikiUL>
        <WikiCallout label="El punto de fondo">
          <p>
            Las organizaciones ya no pueden depender de la difusión espontánea del conocimiento
            para seguir el ritmo de los cambios. El conocimiento debe crearse, consolidarse,
            aplicarse y reutilizarse de forma deliberada, y a mayor velocidad que el propio cambio.
          </p>
        </WikiCallout>
      </WikiSection>

      <WikiSection title="Cómo se gestiona según la ISO 30401">
        <WikiP>
          La norma plantea un sistema de gestión del conocimiento que se establece, implanta,
          mantiene y mejora de forma continua. El conocimiento no se gestiona directamente: lo que
          se gestiona es el entorno de trabajo que enriquece su ciclo de vida. El sistema se apoya
          en tres dimensiones interdependientes.
        </WikiP>
        <WikiP>
          <strong>Desarrollo del conocimiento.</strong> Gestionar el conocimiento en todas sus
          etapas:
        </WikiP>
        <WikiTable
          headers={['Actividad', 'En qué consiste']}
          widths={['32%', '68%']}
          rows={[
            [
              'Adquirir nuevo conocimiento',
              'Incorporar conocimiento que antes no existía o no estaba disponible: creación, innovación, investigación, lecciones aprendidas, fuentes externas.',
            ],
            [
              'Aplicar el conocimiento existente',
              'Apalancar el conocimiento clave para actuar y decidir mejor: transferencia, intercambio, reutilización, solución de problemas.',
            ],
            [
              'Retener el conocimiento actual',
              'Proteger a la organización de la pérdida de conocimiento: documentación, respaldo, planes de sucesión, mentoría.',
            ],
            [
              'Gestionar el conocimiento obsoleto',
              'Evitar errores por usar conocimiento inapropiado: depuración, archivo, actualización, readiestramiento.',
            ],
          ]}
        />
        <WikiP>
          <strong>Transmisión y transformación.</strong> Los medios que hacen posible que el
          conocimiento fluya:
        </WikiP>
        <WikiTable
          headers={['Mecanismo', 'Ejemplos']}
          widths={['32%', '68%']}
          rows={[
            [
              'Interacción humana',
              'Comunidades de práctica, sesiones de ideas, equipos colaborativos, tutoría, mentoring, traspaso de turnos.',
            ],
            [
              'Representación',
              'Poner el conocimiento a disposición: procedimientos, guías, lecciones aprendidas, registros de traspaso.',
            ],
            [
              'Combinación',
              'Sintetizar y estructurar el conocimiento codificado para que sea accesible: taxonomías, etiquetado, resúmenes.',
            ],
            [
              'Internalización y aprendizaje',
              'Absorber el conocimiento y llevarlo a la práctica: planes de acogida, briefings, listas de control, e-learning.',
            ],
          ]}
        />
        <WikiP>
          <strong>Facilitadores.</strong> Los elementos que sostienen el sistema:
        </WikiP>
        <WikiTable
          headers={['Facilitador', 'Qué aporta']}
          widths={['32%', '68%']}
          rows={[
            ['Capital humano', 'Roles y responsabilidades, y personas que impulsan la gestión del conocimiento.'],
            ['Procesos', 'Actividades de conocimiento integradas en los procesos, con procedimientos e indicadores.'],
            [
              'Tecnología e infraestructura',
              'Canales digitales, entornos de trabajo y herramientas como portales, buscadores y wikis.',
            ],
            ['Gobernanza', 'Estrategia, políticas y medios para mantener el sistema alineado.'],
            ['Cultura', 'Actitudes y normas sobre compartir y aprender de los errores.'],
          ]}
        />
        <WikiCallout label="Cultura y liderazgo">
          <p>
            La cultura es crítica para que la gestión del conocimiento funcione de forma sostenida:
            hace falta un entorno donde el conocimiento se valore, se comparta y aprender de un
            error se premie en lugar de castigarse.
          </p>
          <p>
            La alta dirección debe alinear la política y los objetivos de conocimiento con la
            estrategia, asegurar recursos e integrar el sistema en los procesos del negocio.
          </p>
        </WikiCallout>
      </WikiSection>

      <WikiSection title="Relación con otros dominios">
        <WikiP>
          La gestión del conocimiento se confunde a menudo con disciplinas vecinas. No las
          reemplaza: se conecta con ellas y genera sinergias y sistemas de gestión integrados.
        </WikiP>
        <WikiTable
          headers={['Disciplina', 'Cómo se relaciona']}
          widths={['28%', '72%']}
          rows={[
            [
              'Gestión de la información',
              'Al codificar conocimiento se crea información, que luego se almacena y recupera. Pero mucho conocimiento no está codificado, así que la gestión de la información por sí sola no cubre el sistema.',
            ],
            [
              'Gestión de datos',
              'Aporta a la gestión del conocimiento cuando se combinan y analizan datos con algoritmos para obtener nuevas percepciones.',
            ],
            [
              'Inteligencia comercial',
              'Apoya la creación de conocimiento nuevo analizando datos e información para identificar patrones.',
            ],
            [
              'Gestión de relaciones con clientes',
              'Trabaja con datos, información y conocimiento de los clientes; la gestión del conocimiento sirve para mejorarla.',
            ],
            [
              'Capacitación',
              'La capacitación cierra brechas de conocimiento a nivel individual; la gestión del conocimiento lo hace en diversas formas y niveles.',
            ],
            [
              'Aprendizaje organizativo',
              'Para el aprendizaje organizativo el conocimiento es un medio para aprender; para la gestión del conocimiento es un medio para lograr los objetivos de la organización.',
            ],
            [
              'Recursos humanos',
              'Dependen una de otra: el trabajador necesita conocimiento para su labor y la organización lo necesita para prosperar. Ayuda a escalar prácticas y reducir la pérdida por rotación.',
            ],
            [
              'Gestión de la innovación',
              'La innovación se apoya en actividades de conocimiento como el intercambio y el desarrollo, que crean conocimiento nuevo.',
            ],
            [
              'Gestión de riesgos',
              'Una buena gestión del conocimiento reduce riesgos, pero son disciplinas paralelas y complementarias, no superpuestas.',
            ],
            [
              'Gestión de la calidad',
              'ISO 9001:2015 exige el conocimiento organizacional (apartado 7.1.6). Un sistema de gestión del conocimiento es un medio para cumplir ese requisito.',
            ],
          ]}
        />
      </WikiSection>

      <WikiSources>
        UNE-ISO 30401:2021, Sistemas de gestión del conocimiento. Requisitos (idéntica a la Norma
        Internacional ISO 30401:2018). Introducción, términos y definiciones, capítulo 4, y anexos
        A y B.
      </WikiSources>
    </article>
  );
}
