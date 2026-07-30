import Container from "@/components/layout/Container";
import Reveal from "@/components/ui/Reveal";
import type { Dictionary } from "@/lib/dictionaries/ru";

export default function Manifesto({ dict }: { dict: Dictionary }) {
  return (
    <section className="border-t border-surface-3 py-24 md:py-32">
      <Container>
        <Reveal>
          <p className="mb-4 font-mono text-xs font-medium uppercase tracking-widest text-text-tertiary">
            {dict.manifesto.label}
          </p>
          <h2 className="mb-16 text-3xl font-semibold tracking-tight md:text-4xl">
            {dict.manifesto.title}
          </h2>
        </Reveal>

        <div className="grid gap-12 md:grid-cols-3 md:gap-8">
          {dict.manifesto.principles.map((p, i) => (
            <Reveal key={p.number} i={i} variant="tiltIn">
              <span className="font-mono text-sm text-accent">{p.number}</span>
              <h3 className="mt-3 text-xl font-semibold">{p.title}</h3>
              <p className="mt-3 leading-relaxed text-text-secondary">
                {p.description}
              </p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
