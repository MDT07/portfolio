import Link from "next/link";
import Container from "@/components/layout/Container";
import Reveal from "@/components/ui/Reveal";
import BuildEngineArchive from "@/components/interactive/BuildEngineArchive";
import { getAllWorks } from "@/lib/works";
import { withLocale, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries/ru";

interface WorksGridProps {
  lang: Locale;
  dict: Dictionary;
  /** Показать только featured (для главной) */
  featuredOnly?: boolean;
  /** Скрыть внутренний заголовок секции (когда страница рисует свой) */
  hideHeader?: boolean;
}

export default function WorksGrid({
  lang,
  dict,
  featuredOnly,
  hideHeader,
}: WorksGridProps) {
  let works = getAllWorks(lang);
  if (featuredOnly) works = works.filter((w) => w.frontmatter.featured);

  return (
    <section className="work-archive pb-24 md:pb-32">
      <Container>
        {!hideHeader && (
          <Reveal>
            <div className="mb-16 flex items-end justify-between">
              <div>
                <p className="mb-4 font-mono text-xs font-medium uppercase tracking-widest text-text-tertiary">
                  {dict.works.label}
                </p>
                <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                  {dict.works.title}
                </h2>
              </div>
              {featuredOnly && (
                <Link
                  href={withLocale(lang, "/works")}
                  className="hidden text-sm text-text-secondary transition-colors hover:text-text-primary md:block"
                >
                  {dict.works.allWorks}
                </Link>
              )}
            </div>
          </Reveal>
        )}

        <BuildEngineArchive works={works} lang={lang} />
      </Container>
    </section>
  );
}
