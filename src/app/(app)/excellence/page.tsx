import Link from 'next/link';
import { getTopicsByCategory } from '@/content/excellence/registry';

export default function ExcellencePage() {
  const groups = getTopicsByCategory();

  return (
    <div className="max-w-[960px] mx-auto space-y-8">
      <header className="space-y-2">
        <h1 className="font-heading text-2xl font-bold text-primary">Excellence Wiki</h1>
        <p className="font-body text-sm text-neutral-dark/80">
          En este entorno encontrarás información útil para lograr la excelencia operacional.
        </p>
      </header>

      {groups.map((group) => (
        <section key={group.category} className="space-y-3">
          <h2 className="font-body text-xs font-semibold uppercase tracking-widest text-neutral-dark/50">
            {group.category}
          </h2>
          <div className="space-y-2">
            {group.topics.map((topic) => (
              <Link
                key={topic.slug}
                href={`/excellence/${topic.slug}/`}
                className="block border border-neutral rounded-md px-4 py-3 hover:border-accent hover:bg-accent-light/5 transition-colors group"
              >
                <span className="font-body text-sm font-medium text-primary group-hover:text-accent">
                  {topic.label}
                </span>
                <span className="block font-body text-xs text-neutral-dark/50 mt-0.5">
                  {topic.category}
                </span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
