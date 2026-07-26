export default function ComoPage() {
  return (
    <div className="max-w-[820px] mx-auto space-y-6">
      <header>
        <h1 className="font-heading text-2xl font-bold text-primary">Cómo</h1>
      </header>

      <p className="font-body text-sm text-neutral-dark/85">
        Conoce nuestro mapa de procesos:
      </p>

      <div className="border border-dashed border-neutral rounded-lg py-16 flex flex-col items-center justify-center text-center">
        <span className="font-heading text-lg font-semibold text-neutral-dark/50">
          Próximamente
        </span>
        <span className="font-body text-xs text-neutral-dark/40 mt-1">
          Mapa de procesos en construcción.
        </span>
      </div>
    </div>
  );
}
