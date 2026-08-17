import Image from "next/image";
import Link from "next/link";
import portrait from "@/assets/emir-semenov.jpeg";
import Container from "@/components/layout/Container";
import { siteConfig } from "@/lib/config";
import { withLocale, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries/ru";

interface AboutDossierProps {
  dict: Dictionary;
  lang: Locale;
}

export default function AboutDossier({ dict, lang }: AboutDossierProps) {
  const portraitAlt =
    lang === "ru"
      ? "Портрет Эмира Семенова"
      : "Portrait of Emir Semenov";

  return (
    <article className="dossier-page pt-16">
      <section className="border-b border-surface-3 py-10 md:py-16">
        <Container>
          <div className="grid items-end gap-10 md:grid-cols-12 md:gap-6">
            <div className="md:col-span-7 md:pb-4">
              <p className="editorial-label">{dict.about.label}</p>
              <h1 className="mt-5 max-w-3xl font-display text-[clamp(2.625rem,6vw,4rem)] leading-[1.04] tracking-[-0.02em]">
                {dict.about.title}
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-text-secondary md:text-xl">
                {dict.about.intro}
              </p>

              <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 border-t border-surface-3 pt-5">
                <span className="editorial-label w-full sm:w-auto">
                  {dict.about.contacts.label}
                </span>
                <a
                  href={siteConfig.telegramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="editorial-link"
                >
                  {dict.about.contacts.telegram} ↗
                </a>
                <a
                  href={siteConfig.profiUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="editorial-link"
                >
                  {dict.about.contacts.profi} ↗
                </a>
              </div>
            </div>

            <figure className="relative md:col-span-4 md:col-start-9">
              <div className="aspect-[4/5] overflow-hidden bg-surface-2">
                <Image
                  src={portrait}
                  alt={portraitAlt}
                  priority
                  sizes="(min-width: 768px) 33vw, 100vw"
                  placeholder="blur"
                  className="h-full w-full object-cover object-[50%_42%] grayscale contrast-[1.08]"
                />
              </div>
              <figcaption className="mt-3 flex justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.14em] text-text-tertiary">
                <span>Emir Semenov</span>
                <span>Web / AI</span>
              </figcaption>
            </figure>
          </div>
        </Container>
      </section>

      <section className="border-b border-surface-3 py-14 md:py-20">
        <Container>
          <div className="grid gap-8 md:grid-cols-12 md:gap-6">
            <div className="md:col-span-4">
              <p className="editorial-label">{dict.about.directions.label}</p>
              <h2 className="mt-4 max-w-xs font-display text-3xl leading-tight md:text-4xl">
                {dict.about.directions.title}
              </h2>
            </div>

            <div className="md:col-span-7 md:col-start-6">
              {dict.about.directions.items.map((item, index) => (
                <div
                  key={item.title}
                  className="grid gap-3 border-t border-surface-3 py-6 sm:grid-cols-[3rem_1fr_2fr] sm:gap-5"
                >
                  <span className="font-mono text-[11px] text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-base font-medium">{item.title}</h3>
                  <p className="max-w-xl leading-relaxed text-text-secondary">
                    {item.description}
                  </p>
                </div>
              ))}
              <div className="border-t border-surface-3" />
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-surface-3 py-14 md:py-20">
        <Container>
          <div className="grid gap-12 md:grid-cols-12 md:gap-6">
            <div className="md:col-span-5">
              <p className="editorial-label">{dict.about.stack.label}</p>
              <ul className="mt-5 flex max-w-xl flex-wrap gap-x-4 gap-y-2" role="list">
                {dict.about.stack.items.map((item) => (
                  <li
                    key={item}
                    className="border-b border-surface-3 pb-1 text-sm text-text-secondary"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-5 md:col-start-8">
              <p className="editorial-label">{dict.about.skills.label}</p>
              <ul
                className="mt-5 divide-y divide-surface-3 border-y border-surface-3"
                role="list"
              >
                {dict.about.skills.items.map((item) => (
                  <li key={item} className="py-3 text-sm text-text-secondary">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-14 md:py-20">
        <Container>
          <div className="grid gap-8 md:grid-cols-12 md:gap-6">
            <p className="editorial-label md:col-span-3">{dict.about.approach.label}</p>
            <div className="md:col-span-7 md:col-start-5">
              <h2 className="font-display text-3xl leading-tight md:text-4xl">
                {dict.about.approach.title}
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary">
                {dict.about.approach.description}
              </p>
              <Link
                href={withLocale(lang, "/works")}
                className="editorial-link mt-9 inline-flex items-center gap-3 text-base"
              >
                {dict.about.worksLink}
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </article>
  );
}
