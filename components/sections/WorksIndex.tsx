import Container from "@/components/layout/Container";
import Reveal from "@/components/ui/Reveal";
import MaskText from "@/components/ui/MaskText";
import WorksIndexClient from "@/components/sections/WorksIndexClient";
import { getAllWorks } from "@/lib/mdx";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries/ru";

interface WorksIndexProps {
  lang: Locale;
  dict: Dictionary;
}

/**
 * Глава 002 «Кейсы» (DESIGN.md §11): редакционный индекс-список
 * работ вместо сетки карточек. Интерактив — в WorksIndexClient.
 */
export default function WorksIndex({ lang, dict }: WorksIndexProps) {
  const works = getAllWorks(lang).map((w) => ({
    slug: w.slug,
    title: w.frontmatter.title,
    year: w.frontmatter.year,
    tags: w.frontmatter.tags.slice(0, 3),
  }));

  return (
    <section
      id="works"
      className="min-h-[100svh] scroll-mt-16 border-t border-surface-3 py-24 md:py-32"
    >
      <Container>
        <Reveal>
          <div className="flex items-center gap-4">
            <p className="shrink-0 font-mono text-[11px] font-medium uppercase tracking-widest text-text-tertiary">
              002 / {dict.works.label}
            </p>
            <div className="h-px flex-1 bg-surface-3" />
          </div>
        </Reveal>

        <MaskText
          lines={[dict.works.title]}
          className="mt-10 font-display text-[clamp(2.25rem,5vw,4.5rem)] leading-[1.02]"
        />

        <div className="mt-16 md:mt-20">
          <WorksIndexClient
            works={works}
            lang={lang}
            allWorksLabel={dict.works.allWorks}
          />
        </div>
      </Container>
    </section>
  );
}
