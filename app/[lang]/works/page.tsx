import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Reveal from "@/components/ui/Reveal";
import WorksGrid from "@/components/sections/WorksGrid";
import { siteConfig } from "@/lib/config";
import { getDictionary, isLocale, withLocale } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = getDictionary(isLocale(lang) ? lang : "ru");
  const canonical = withLocale(lang, "/works");
  return {
    metadataBase: new URL(siteConfig.url),
    title: dict.works.title,
    description: dict.works.subtitle,
    alternates: {
      canonical,
      languages: { ru: "/works", en: "/en/works" },
    },
    openGraph: {
      type: "website",
      title: dict.works.title,
      description: dict.works.subtitle,
      url: canonical,
      siteName: siteConfig.name,
      locale: lang === "ru" ? "ru_RU" : "en_US",
      images: [{ url: "/images/portfolio-og.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.works.title,
      description: dict.works.subtitle,
      images: ["/images/portfolio-og.png"],
    },
  };
}

export default async function WorksPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <>
      <section className="works-hero pt-32 md:pt-44">
        <Container>
          <Reveal>
            <div className="works-hero__grid">
              <p className="editorial-label">Archive / {dict.works.label}</p>
              <h1>{dict.works.title}</h1>
              <div>
                <p>{dict.works.subtitle}</p>
                <span>{lang === "ru" ? "Концепты отмечены явно · Все демо интерактивны" : "Concepts are labelled · Every demo is interactive"}</span>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
      <WorksGrid lang={lang} dict={dict} hideHeader />
    </>
  );
}
