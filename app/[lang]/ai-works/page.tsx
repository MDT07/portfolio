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
      ? "AI-мастерская — Эмир Семенов"
      : "AI workshop — Emir Semenov";
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
      images: [{ url: "/-/opengraph-image.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/-/opengraph-image.png"],
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
    <article className="pt-16">
      <section className="border-b border-surface-3 py-12 md:py-20">
        <Container>
          <div className="grid gap-8 md:grid-cols-12 md:gap-6">
            <p className="editorial-label md:col-span-3">{ai.label}</p>
            <div className="md:col-span-8 md:col-start-5">
              <h1 className="max-w-3xl font-display text-[clamp(2.625rem,6vw,4rem)] leading-[1.04] tracking-[-0.02em]">
                {ai.title}
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-text-secondary md:text-xl">
                {ai.intro}
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-surface-3 py-14 md:py-20">
        <Container>
          <div className="grid gap-8 md:grid-cols-12 md:gap-6">
            <div className="md:col-span-4">
              <p className="editorial-label">{ai.solutions.label}</p>
              <h2 className="mt-4 font-display text-3xl leading-tight md:text-4xl">
                {ai.solutions.title}
              </h2>
            </div>
            <div className="md:col-span-7 md:col-start-6">
              {ai.solutions.items.map((item) => (
                <div
                  key={item.title}
                  className="grid gap-3 border-t border-surface-3 py-6 sm:grid-cols-[1fr_2fr] sm:gap-5"
                >
                  <h3 className="text-base font-medium">{item.title}</h3>
                  <p className="leading-relaxed text-text-secondary">
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
          <div className="grid gap-4 md:grid-cols-12 md:gap-6">
            <p className="editorial-label md:col-span-3">{ai.process.label}</p>
            <h2 className="font-display text-3xl leading-tight md:col-span-8 md:col-start-5 md:text-4xl">
              {ai.process.title}
            </h2>
          </div>
          <AIProcessDiagram process={ai.process} scenarios={ai.scenarios} />
        </Container>
      </section>

      <section className="border-b border-surface-3 py-14 md:py-20">
        <Container>
          <div className="grid gap-8 md:grid-cols-12 md:gap-6">
            <p className="editorial-label md:col-span-3">{ai.principles.label}</p>
            <ul className="divide-y divide-surface-3 border-y border-surface-3 md:col-span-7 md:col-start-6">
              {ai.principles.items.map((principle) => (
                <li key={principle} className="py-5">
                  {principle}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section className="py-14 md:py-20">
        <Container>
          <div className="grid gap-8 md:grid-cols-12 md:gap-6">
            <h2 className="font-display text-3xl leading-tight md:col-span-5 md:text-4xl">
              {ai.cta.title}
            </h2>
            <div className="md:col-span-6 md:col-start-7">
              <p className="max-w-xl text-lg leading-relaxed text-text-secondary">
                {ai.cta.subtitle}
              </p>
              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3">
                <a
                  className="editorial-link"
                  href={siteConfig.telegramUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {ai.cta.telegram} ↗
                </a>
                <a
                  className="editorial-link"
                  href={siteConfig.profiUrl}
                  target="_blank"
                  rel="noreferrer"
                >
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
