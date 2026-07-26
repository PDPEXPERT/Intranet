const VALORES = [
  'Pensar en grande (30x), trabajar duro y cumplir la palabra.',
  'Servir a la sociedad, a nuestros clientes y colaboradores.',
  'Ser auténticos y veraces.',
  'Ser buena onda y no temer a las conversaciones difíciles.',
  'Apasionar a nuestros clientes por nosotros.',
];

export default function PorQuePage() {
  return (
    <div className="max-w-[820px] mx-auto space-y-6">
      <header className="space-y-1">
        <h1 className="font-heading text-2xl font-bold text-primary">Por qué</h1>
        <p className="font-heading text-lg font-semibold text-accent">Life by design</p>
      </header>

      <div className="space-y-4 font-body text-sm leading-relaxed text-neutral-dark/85">
        <p>
          El éxito sostenido es para nosotros servir a las personas, a su bien integral
          (físico, psicológico, emocional, espiritual), en primer lugar a quienes hacen
          parte de PDP Expert. La empresa es un medio para poder lograr esa vida plena, es
          un ejercicio de diseño de vida.
        </p>

        <div>
          <p className="font-medium text-primary mb-2">Recuerda nuestros valores:</p>
          <ol className="list-decimal pl-5 space-y-1.5">
            {VALORES.map((v, i) => (
              <li key={i}>{v}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
