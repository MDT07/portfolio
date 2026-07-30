import Image from "next/image";
import Link from "next/link";
import Container from "@/components/layout/Container";
import Card from "@/components/ui/Card";
import Tag from "@/components/ui/Tag";
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
  return (
    <Reveal i={i} variant="tiltIn" className="h-full">
      <Link href={withLocale(lang, `/works/${work.slug}`)} className="block h-full">
        <Card className="group flex h-full cursor-pointer flex-col">
          <div className="relative mb-4 aspect-[16/10] overflow-hidden rounded-md bg-surface-2">
            <Image
              src={w.cover}
              alt={w.title}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </div>
          <div className="flex flex-1 items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold transition-colors group-hover:text-accent">
                {w.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {w.description}
              </p>
            </div>
            <span className="ml-4 shrink-0 font-mono text-xs text-text-tertiary">
              {w.year}
            </span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {w.tags.slice(0, 4).map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        </Card>
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
    <section className="border-t border-surface-3 py-24 md:py-32">
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

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
