import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/layout/Container";
import AIProcessDiagram from "@/components/interactive/AIProcessDiagram";
import { getDictionary, isLocale, withLocale } from "@/lib/i18n";
import { siteConfig } from "@/lib/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  const dict = getDictionary(lang);
  const title =
    lang === "ru"
      ? "AI-системы и CRMP — Эмир Семенов"
      : "AI systems and CRMP — Emir Semenov";
  const description = dict.aiWorks.intro;
  const canonical = withLocale(lang, "/ai-works");

  return {
    metadataBase: new URL(siteConfig.url),
    title: { absolute: title },
    description,
    alternates: {
      canonical,
      languages: { ru: "/ai-works", en: "/en/ai-works" },
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonical,
      siteName: siteConfig.name,
      locale: lang === "ru" ? "ru_RU" : "en_US",
      images: [{ url: "/images/portfolio-og.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/portfolio-og.png"],
    },
  };
}

export default async function AIWorksPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const ai = dict.aiWorks;

  return (
    <article className="ai-works-page pt-16">
      <section className="ai-works-hero border-b border-surface-3 py-10 md:py-16">
        <Container>
          <div className="grid items-stretch gap-10 lg:grid-cols-12 lg:gap-6">
            <div className="flex flex-col justify-between lg:col-span-7">
              <div>
                <p className="editorial-label">{ai.label}</p>
                <h1 className="mt-6 max-w-3xl font-display text-[clamp(2.75rem,6vw,4rem)] leading-[1.02] tracking-[-0.025em]">
                  {ai.title}
                </h1>
                <p className="mt-7 max-w-2xl text-lg leading-relaxed text-text-secondary md:text-xl">
                  {ai.intro}
                </p>
              </div>
              <a className="ai-hero-jump mt-10" href="#ai-process">
                <span>{ai.explore}</span>
                <span aria-hidden>↓</span>
              </a>
            </div>

            <div className="ai-system-map lg:col-span-5" aria-hidden="true">
              <div className="ai-system-map__corner ai-system-map__corner--start">
                {ai.process.steps[0].label}
              </div>
              <div className="ai-system-map__corner ai-system-map__corner--end">
                {ai.process.steps[4].label}
              </div>
              <div className="ai-system-map__axis ai-system-map__axis--x" />
              <div className="ai-system-map__axis ai-system-map__axis--y" />
              <div className="ai-system-map__core">
                <span>AI</span>
                <small>{ai.process.steps[2].label}</small>
              </div>
              <span className="ai-system-map__node ai-system-map__node--context">
                {ai.process.steps[1].label}
              </span>
              <span className="ai-system-map__node ai-system-map__node--validation">
                {ai.process.steps[3].label}
              </span>
            </div>
          </div>

          <dl className="ai-signal-strip mt-10">
            {ai.heroMeta.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <section className="border-b border-surface-3 py-14 md:py-24">
        <Container>
          <div className="grid gap-10 md:grid-cols-12 md:gap-6">
            <div className="md:col-span-4">
              <p className="editorial-label">{ai.solutions.label}</p>
              <h2 className="mt-5 max-w-sm font-display text-3xl leading-tight md:text-4xl">
                {ai.solutions.title}
              </h2>
            </div>
            <ul className="ai-solution-grid md:col-span-7 md:col-start-6">
              {ai.solutions.items.map((item) => (
                <li key={item.title} className="ai-solution-card">
                  <span className="ai-solution-card__mark" aria-hidden />
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section id="ai-process" className="border-b border-surface-3 bg-surface-1 py-14 scroll-mt-20 md:py-24">
        <Container>
          <div className="grid gap-5 md:grid-cols-12 md:gap-6">
            <p className="editorial-label md:col-span-3">{ai.process.label}</p>
            <h2 className="max-w-2xl font-display text-3xl leading-tight md:col-span-8 md:col-start-5 md:text-4xl">
              {ai.process.title}
            </h2>
          </div>
          <AIProcessDiagram process={ai.process} scenarios={ai.scenarios} />
        </Container>
      </section>

      <section className="border-b border-surface-3 py-14 md:py-24">
        <Container>
          <div className="mb-8 grid gap-4 md:grid-cols-12 md:gap-6">
            <p className="editorial-label md:col-span-3">{ai.featured.label}</p>
            <p className="max-w-xl text-sm leading-relaxed text-text-secondary md:col-span-6 md:col-start-7">
              {ai.featured.competition}
            </p>
          </div>

          <a
            className="ai-crmp-card"
            href={siteConfig.crmpUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={ai.featured.ariaLabel}
          >
            <div className="ai-crmp-card__copy">
              <p className="ai-crmp-card__competition">{ai.featured.competition}</p>
              <h2>{ai.featured.title}</h2>
              <p className="ai-crmp-card__description">{ai.featured.description}</p>
              <ul className="ai-crmp-card__stack">
                {ai.featured.stack.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <span className="ai-crmp-card__link">
                {ai.featured.link}
                <span aria-hidden>↗</span>
              </span>
            </div>

            <div className="ai-crmp-preview" aria-hidden="true">
              <div className="ai-crmp-preview__topbar">
                <span>CRMP</span>
                <span>{ai.featured.preview.pipeline}</span>
              </div>
              <div className="ai-crmp-preview__body">
                <div className="ai-crmp-preview__pipeline">
                  {ai.featured.preview.columns.map((column) => (
                    <div key={column} className="ai-crmp-preview__column">
                      <span>{column}</span>
                      <i />
                      <i />
                    </div>
                  ))}
                </div>
                <div className="ai-crmp-preview__agent">
                  <span>{ai.featured.preview.agent}</span>
                  <strong>{ai.featured.preview.signal}</strong>
                  <i />
                </div>
              </div>
            </div>
          </a>
        </Container>
      </section>

      <section className="border-b border-surface-3 py-14 md:py-24">
        <Container>
          <div className="grid gap-10 md:grid-cols-12 md:gap-6">
            <p className="editorial-label md:col-span-3">{ai.principles.label}</p>
            <ul className="ai-principles md:col-span-8 md:col-start-5">
              {ai.principles.items.map((principle) => (
                <li key={principle}>
                  <span aria-hidden>—</span>
                  {principle}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section className="py-14 md:py-24">
        <Container>
          <div className="ai-contact-block">
            <h2>{ai.cta.title}</h2>
            <div>
              <p>{ai.cta.subtitle}</p>
              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3">
                <a href={siteConfig.telegramUrl} target="_blank" rel="noreferrer">
                  {ai.cta.telegram} ↗
                </a>
                <a href={siteConfig.profiUrl} target="_blank" rel="noreferrer">
                  {ai.cta.profi} ↗
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </article>
  );
}
