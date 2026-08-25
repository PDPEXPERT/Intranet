import Link from 'next/link';
import {
  WikiCallout,
  WikiEyebrow,
  WikiLede,
  WikiP,
  WikiSection,
  WikiSources,
  WikiSubtitle,
  WikiTitle,
} from '@/components/excellence/wiki';

export default function ErroresComunes() {
  return (
    <article>
      <WikiEyebrow>Arquitectura Empresarial · Protección de Datos Personales</WikiEyebrow>
      <WikiTitle>Errores comunes</WikiTitle>
      <WikiSubtitle>Lecciones aprendidas al aplicar el enfoque de capacidades</WikiSubtitle>
      <WikiLede>
        Este artículo recoge errores ya cometidos y corregidos al aplicar el enfoque de capacidades
        a la protección de datos personales, para que no se repitan. No son fallas de la teoría, sino
        de la traducción de la teoría a la práctica de consultoría.
      </WikiLede>

      <WikiSection title="Ir directo al 'cómo' sin pasar por el 'qué'" first>
        <WikiP>
          <strong>Error.</strong> Tomar un marco de gobernanza de tecnología de la información (como
          COBIT) e implementarlo traduciéndolo directamente a una plantilla de procesos genérica,
          asumiendo que esa plantilla serviría igual para cualquier cliente.
        </WikiP>
        <WikiP>
          <strong>Por qué falla.</strong> Inspirarse en un marco de gobernanza de TI para pensar la
          gobernanza de protección de datos personales es correcto: ese marco aporta un vocabulario y
          una estructura valiosos. El error no está ahí, sino en saltar directamente al cómo (una
          arquitectura de procesos fija) sin pasar antes por el qué: entender qué debe hacer la
          organización, independientemente de cómo lo hace hoy, de qué personas tiene o de qué
          tecnología usa. Una plantilla de procesos salvaje resulta demasiado (&quot;too much&quot;)
          para clientes que no tienen la estructura para sostenerla, y demasiado poco para los que sí
          la tienen.
        </WikiP>
        <WikiCallout label="Corrección">
          <p>
            Usar el enfoque de capacidades como puente: primero identificar la capacidad (el qué),
            clasificarla dentro de la ontología de capacidades de protección de datos, y solo
            entonces construir con el cliente el cómo — los procesos, personas, tecnología e
            información concretos que instancian esa capacidad en su realidad particular. Ver{' '}
            <Link
              href="/excellence/arquitectura-empresarial-y-negocio/"
              className="text-accent hover:underline"
            >
              Arquitectura empresarial y arquitectura de negocio
            </Link>
            .
          </p>
        </WikiCallout>
      </WikiSection>

      <WikiSection title="Nombrar mal una iniciativa antes de resolver la gobernanza de base">
        <WikiP>
          <strong>Error.</strong> Nombrar una iniciativa de trabajo como &quot;instrumentar
          documentalmente la operación de protección de datos personales&quot;, dando por hecho que
          el problema es solo generar documentos, sin haber resuelto antes si la organización tiene
          o no una gobernanza de información documentada a nivel general.
        </WikiP>
        <WikiP>
          <strong>Por qué falla.</strong> Ese nombre no es incorrecto porque el trabajo sea
          irrelevante — documentos hay que generar, y muchos — sino porque no le da el enfoque
          correcto al problema real: definir primero cómo la organización va a gestionar y gobernar su
          información documentada (roles, responsabilidades, políticas, procedimientos básicos), y
          solo después decidir cómo se aplica eso a la documentación específica que exige el programa
          de protección de datos.
        </WikiP>
        <WikiCallout label="Corrección">
          <p>
            El nombre correcto de esa gestión es{' '}
            <em>gestión de información documentada del programa de protección de datos
            personales</em>, no &quot;instrumentar documentalmente&quot;. Antes de generar
            documentación puntual, hay que subsanar los mínimos de gobernanza documental general si
            la organización no los tiene: quién aprueba, quién controla versiones, dónde vive el
            repositorio oficial. Ver{' '}
            <Link
              href="/excellence/informacion-e-informacion-documentada/"
              className="text-accent hover:underline"
            >
              Información e información documentada
            </Link>
            .
          </p>
        </WikiCallout>
      </WikiSection>

      <WikiSection title="No distinguir desde el inicio qué documentación es de quién">
        <WikiP>
          <strong>Error.</strong> Empezar a generar la documentación del programa de protección de
          datos sin haber aclarado antes, con todos los interesados, qué documentación es propia del
          área de protección de datos, cuál es propia de las áreas de soporte que ya existen
          (seguridad de la información, gobierno de datos, gestión por procesos, gestión de
          terceros), y cuál es evidencia que deben generar y mantener las áreas que tratan datos
          personales en su operación diaria.
        </WikiP>
        <WikiP>
          <strong>Por qué falla.</strong> Sin esa distinción hecha desde el arranque, cada interesado
          — seguridad de la información, el área de protección de datos del cliente, el área de
          procesos, el gerente de proyecto — termina pidiendo por separado una visión distinta de la
          misma documentación, lo que genera reprocesos, fricción y, en el límite, política y
          procedimiento duplicados en dos manuales distintos para la misma actividad.
        </WikiP>
        <WikiCallout label="Corrección">
          <p>
            Sentar a todos los interesados desde el inicio de la implementación y explicarles, en un
            solo espacio, la distinción entre documentación propia de protección de datos,
            documentación de las áreas de soporte, y evidencia que corresponde a las áreas que tratan
            datos personales. Ver la sección &quot;Gestión de la información documentada en PDP
            Expert&quot; en{' '}
            <Link
              href="/excellence/informacion-e-informacion-documentada/"
              className="text-accent hover:underline"
            >
              Información e información documentada
            </Link>
            .
          </p>
        </WikiCallout>
      </WikiSection>

      <WikiSources>
        Lecciones aprendidas de la aplicación práctica del enfoque de capacidades a programas de
        protección de datos personales en clientes de PDP Expert.
      </WikiSources>
    </article>
  );
}
