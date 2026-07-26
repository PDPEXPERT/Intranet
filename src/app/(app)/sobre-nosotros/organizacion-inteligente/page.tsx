const PARRAFOS = [
  'Nuestra postura ante la inteligencia artificial, y más allá de ella, es ser una "Organización inteligente". Nos inspira una visión cristiana de la Inteligencia y la empresa. Hemos adoptado una visión aristotélico tomista que informa todo nuestro día a día.',
  'Entendemos la organización como un conjunto de componentes que se interrelacionan entre sí y están ordenados a un fin. No somos una suma de tareas aisladas, sino un sistema vivo donde cada persona y cada proceso aportan a un propósito compartido.',
  'Hablamos de organización inteligente porque su causa eficiente, aquello que la produce y la hace ser lo que es, lo es: son personas quienes la piensan, la sostienen y la hacen avanzar día a día. Ser inteligentes en nuestro contexto práctico implica que actuemos con prudencia (recta razón aplicada al obrar) y arte (recta razón aplicada al hacer).',
  'La manifestación más propia de esa inteligencia práctica es justamente ordenar bien la organización hacia el fin para el que fue hecha. Ese fin tiene un doble nivel. Está el fin natural de la empresa: producir servicios de valor, generar resultados sostenibles y dar sustento a quienes trabajamos en ella. Este fin es bueno en sí mismo.',
  'Pero ese fin natural no agota el sentido de lo que hacemos. Buscamos que nuestra actividad se ordene también a algo más amplio: el servicio real a quienes dependen de nosotros, clientes, colaboradores y sociedad, como un ejercicio concreto de justicia y cuidado hacia el prójimo. Perseguimos hacer el bien, de manera integral, en el orden natural y espiritual. En ello está el éxito sostenido, en aportar profundamente a atender las necesidades de nuestras partes interesadas.',
];

export default function OrganizacionInteligentePage() {
  return (
    <div className="max-w-[820px] mx-auto space-y-6">
      <header>
        <h1 className="font-heading text-2xl font-bold text-primary">
          ¿Organización inteligente?
        </h1>
      </header>

      <div className="space-y-4 font-body text-sm leading-relaxed text-neutral-dark/85">
        {PARRAFOS.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        <p className="font-medium text-primary">
          Una organización es inteligente solo si nosotros, su causa eficiente, lo somos.
          ¡Vayamos cada vez más alto!
        </p>
      </div>
    </div>
  );
}
