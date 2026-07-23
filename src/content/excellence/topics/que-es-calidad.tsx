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
      <WikiTitle>¿Qué es calidad?</WikiTitle>
      <WikiSubtitle>Quality, Reliability, Satisfaction &amp; Loyalty</WikiSubtitle>
      <WikiLede>
        La calidad no es un valor fijo ni universal: es cumplir con lo que el cliente necesita y
        espera. Un mismo producto puede ser &quot;de calidad&quot; o &quot;de mala calidad&quot;
        según qué busque quien lo usa, no existe una vara objetiva independiente del cliente.
      </WikiLede>

      <WikiSection title="Definiciones clásicas" first>
        <WikiP>
          Distintos autores de referencia en gestión de calidad coinciden en esta idea central,
          aunque la redactan de forma distinta:
        </WikiP>
        <WikiTable
          headers={['Autor / Norma', 'Definición']}
          widths={['22%', '78%']}
          rows={[
            ['Juran', 'Aptitud para el uso ("fitness for purpose or use").'],
            [
              'Deming',
              'La calidad debe apuntar a las necesidades del consumidor, presentes y futuras.',
            ],
            [
              'Feigenbaum',
              'El conjunto de características de marketing, ingeniería, fabricación y mantenimiento a través de las cuales el producto o servicio satisface las expectativas del cliente en su uso.',
            ],
            ['Crosby', 'Conformidad con los requisitos.'],
            [
              'ISO 9000:2000',
              'Grado en que un conjunto de características inherentes cumple los requisitos.',
            ],
          ]}
        />
      </WikiSection>

      <WikiSection title="Calidad, confiabilidad, satisfacción y fidelización">
        <WikiP>
          Son cuatro conceptos relacionados pero distintos. Conviene no usarlos como sinónimos.
        </WikiP>
        <WikiTable
          headers={['Concepto', 'Qué es']}
          widths={['20%', '80%']}
          rows={[
            ['Calidad', 'Cumplir con lo que el cliente necesita y espera, en un momento dado.'],
            [
              'Confiabilidad',
              'Que esa calidad se mantenga en el tiempo. No es cumplir una vez, es seguir cumpliendo.',
            ],
            [
              'Satisfacción',
              'Lo que siente el cliente cuando sus requisitos se cumplen. Si se cumplen de forma repetida y consistente, se puede llegar a un nivel superior: el deleite.',
            ],
            [
              'Fidelización',
              'El resultado de mantener esa satisfacción a lo largo del tiempo. El cliente vuelve, gasta más y recomienda a otros.',
            ],
          ]}
        />
        <WikiCallout label="Cómo se relacionan">
          <p>
            La calidad, cuando se sostiene en el tiempo, se convierte en confiabilidad. Cuando esa
            confiabilidad es constante, produce satisfacción constante. Y cuando la satisfacción es
            constante, termina generando fidelización.
          </p>
        </WikiCallout>
        <WikiCallout label="Cómo se diferencian">
          <p>
            La calidad y la confiabilidad son propiedades del producto o servicio. La satisfacción
            y la fidelización son reacciones del cliente frente a esas propiedades.
          </p>
          <p>
            La calidad es algo que se evalúa en un momento dado; la confiabilidad es esa misma
            calidad sostenida en el tiempo. La satisfacción es una experiencia puntual; la
            fidelización es esa satisfacción sostenida que termina convirtiéndose en
            comportamiento, como repetir la compra o recomendar.
          </p>
        </WikiCallout>
      </WikiSection>

      <WikiSection title="Por qué importa la fidelización">
        <WikiP>
          No es un efecto secundario menor. Enfocarse en la fidelización del cliente trae ventajas
          comerciales concretas:
        </WikiP>
        <WikiUL>
          <li>Retener clientes cuesta menos que adquirir nuevos.</li>
          <li>A mayor duración de la relación, mayor rentabilidad.</li>
          <li>Un cliente fiel gasta más con su proveedor habitual.</li>
          <li>
            Cerca de la mitad de los nuevos clientes llegan por referencias de clientes
            existentes.
          </li>
        </WikiUL>
      </WikiSection>

      <WikiSources>
        Material de referencia sobre gestión de calidad: definiciones de Juran, Deming,
        Feigenbaum, Crosby, y BS 4778 / ISO 8402 / ISO 9000:2000 Quality Management Systems.
      </WikiSources>
    </article>
  );
}
