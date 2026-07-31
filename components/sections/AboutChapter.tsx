import Container from "@/components/layout/Container";
import Reveal from "@/components/ui/Reveal";
import MaskText from "@/components/ui/MaskText";
import type { Dictionary } from "@/lib/dictionaries/ru";

/**
 * Глава 001 «Подход» (DESIGN.md §11): маркер главы + hairline,
 * serif-заголовок с line-mask, редакционные строки принципов.
 */
export default function AboutChapter({ dict }: { dict: Dictionary }) {
  return (
    <section className="py-24 md:py-32">
      <Container>
        <Reveal>
          <div className="flex items-center gap-4">
            <p className="shrink-0 font-mono text-[11px] font-medium uppercase tracking-widest text-text-tertiary">
              001 / {dict.manifesto.label}
            </p>
            <div className="h-px flex-1 bg-surface-3" />
          </div>
        </Reveal>

        <MaskText
          lines={[dict.manifesto.title]}
          className="mt-10 font-display text-[clamp(2.25rem,5vw,4.5rem)] leading-[1.02]"
        />

        <div className="mt-16 md:mt-20">
          {dict.manifesto.principles.map((p, i) => (
            <Reveal key={p.number} i={i}>
              <div className="grid gap-3 border-t border-surface-3 py-8 md:grid-cols-12 md:gap-6 md:py-10">
                <span className="font-mono text-sm text-accent md:col-span-2">
                  {p.number}
                </span>
                <h3 className="font-display text-2xl leading-tight md:col-span-4 md:text-3xl">
                  {p.title}
                </h3>
                <p className="max-w-xl leading-relaxed text-text-secondary md:col-span-6">
                  {p.description}
                </p>
              </div>
            </Reveal>
          ))}
          <div className="border-t border-surface-3" />
        </div>
      </Container>
    </section>
  );
}
