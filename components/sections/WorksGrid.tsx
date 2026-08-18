import Image from "next/image";
import Link from "next/link";
import Container from "@/components/layout/Container";
import Reveal from "@/components/ui/Reveal";
import { getAllWorks, type WorkEntry } from "@/lib/mdx";
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

function WorkCard({
  work,
  lang,
  i,
}: {
  work: WorkEntry;
  lang: Locale;
  i: number;
}) {
  const { frontmatter: w } = work;
  const href = `/works/${work.slug}`;
  const status =
    w.status ?? (lang === "ru" ? "Концепт · прототип" : "Concept · prototype");
  return (
    <Reveal i={i} className={i % 3 === 0 ? "work-archive-card--wide" : ""}>
      <Link href={withLocale(lang, href)} className="work-archive-card">
          <div className="work-archive-card__visual">
            <Image
              src={w.cover}
              alt=""
              fill
              sizes={i % 3 === 0 ? "(min-width: 1024px) 70vw, 100vw" : "(min-width: 768px) 50vw, 100vw"}
              className="object-cover"
            />
          </div>
          <div className="work-archive-card__meta">
            <span>{String(i + 1).padStart(2, "0")} / {status}</span>
            <span>{w.year}</span>
          </div>
          <h2>{w.title}</h2>
          <p>{w.description}</p>
          <div className="work-archive-card__footer">
            <span>{w.tags.slice(0, 3).join(" · ")}</span>
            <span aria-hidden>↗</span>
          </div>
      </Link>
    </Reveal>
  );
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

        <div className="work-archive-grid">
          {works.map((work, i) => (
            <WorkCard key={work.slug} work={work} lang={lang} i={i} />
          ))}
        </div>

        {featuredOnly && (
          <div className="mt-8 text-center md:hidden">
            <Link
              href={withLocale(lang, "/works")}
              className="text-sm text-text-secondary transition-colors hover:text-text-primary"
            >
              {dict.works.allWorks}
            </Link>
          </div>
        )}
      </Container>
    </section>
  );
}
