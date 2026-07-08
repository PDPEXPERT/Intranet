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

export default function QueEsCalidad() {
  return (
    <article>
      <WikiEyebrow>Calidad · Fundamentos</WikiEyebrow>
      <WikiTitle>¿Que es calidad?</WikiTitle>
      <WikiSubtitle>Quality, Reliability, Satisfaction &amp; Loyalty</WikiSubtitle>
      <WikiLede>
        La calidad no es un valor fijo ni universal: es cumplir con lo que el cliente necesita y
        espera. Un mismo producto puede ser &quot;de calidad&quot; o &quot;de mala calidad&quot;
        segun que busque quien lo usa — no existe una vara objetiva independiente del cliente.
      </WikiLede>

      <WikiSection title="Definiciones clasicas" first>
        <WikiP>
          Distintos autores de referencia en gestion de calidad coinciden en esta idea central,
          aunque la redactan de forma distinta:
        </WikiP>
        <WikiTable
          headers={['Autor / Norma', 'Definicion']}
          widths={['22%', '78%']}
          rows={[
            ['Juran', 'Aptitud para el uso ("fitness for purpose or use").'],
            [
              'Deming',
              'La calidad debe apuntar a las necesidades del consumidor, presentes y futuras.',
            ],
            [
              'Feigenbaum',
              'El conjunto de caracteristicas de marketing, ingenieria, fabricacion y mantenimiento a traves de las cuales el producto o servicio satisface las expectativas del cliente en su uso.',
            ],
            ['Crosby', 'Conformidad con los requisitos.'],
            [
              'ISO 9000:2000',
              'Grado en que un conjunto de caracteristicas inherentes cumple los requisitos.',
            ],
          ]}
        />
      </WikiSection>

      <WikiSection title="Calidad, confiabilidad, satisfaccion y fidelizacion">
        <WikiP>
          Son cuatro conceptos relacionados pero distintos. Conviene no usarlos como sinonimos.
        </WikiP>
        <WikiTable
          headers={['Concepto', 'Que es']}
          widths={['20%', '80%']}
          rows={[
            ['Calidad', 'Cumplir con lo que el cliente necesita y espera, en un momento dado.'],
            [
              'Confiabilidad',
              'Que esa calidad se mantenga en el tiempo. No es cumplir una vez, es seguir cumpliendo.',
            ],
            [
              'Satisfaccion',
              'Lo que siente el cliente cuando sus requisitos se cumplen. Si se cumplen de forma repetida y consistente, se puede llegar a un nivel superior: el deleite.',
            ],
            [
              'Fidelizacion',
              'El resultado de mantener esa satisfaccion a lo largo del tiempo. El cliente vuelve, gasta mas y recomienda a otros.',
            ],
          ]}
        />
        <WikiCallout label="Como se relacionan">
          <p>
            La calidad, cuando se sostiene en el tiempo, se convierte en confiabilidad. Cuando esa
            confiabilidad es constante, produce satisfaccion constante. Y cuando la satisfaccion es
            constante, termina generando fidelizacion.
          </p>
        </WikiCallout>
        <WikiCallout label="Como se diferencian">
          <p>
            La calidad y la confiabilidad son propiedades del producto o servicio. La satisfaccion
            y la fidelizacion son reacciones del cliente frente a esas propiedades.
          </p>
          <p>
            La calidad es algo que se evalua en un momento dado; la confiabilidad es esa misma
            calidad sostenida en el tiempo. La satisfaccion es una experiencia puntual; la
            fidelizacion es esa satisfaccion sostenida que termina convirtiendose en
            comportamiento, como repetir la compra o recomendar.
          </p>
        </WikiCallout>
      </WikiSection>

      <WikiSection title="Por que importa la fidelizacion">
        <WikiP>
          No es un efecto secundario menor. Enfocarse en la fidelizacion del cliente trae ventajas
          comerciales concretas:
        </WikiP>
        <WikiUL>
          <li>Retener clientes cuesta menos que adquirir nuevos.</li>
          <li>A mayor duracion de la relacion, mayor rentabilidad.</li>
          <li>Un cliente fiel gasta mas con su proveedor habitual.</li>
          <li>
            Cerca de la mitad de los nuevos clientes llegan por referencias de clientes
            existentes.
          </li>
        </WikiUL>
      </WikiSection>

      <WikiSources>
        Material de referencia sobre gestion de calidad — definiciones de Juran, Deming,
        Feigenbaum, Crosby, y BS 4778 / ISO 8402 / ISO 9000:2000 Quality Management Systems.
      </WikiSources>
    </article>
  );
}
