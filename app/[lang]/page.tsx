import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PremiumHome from "@/components/sections/PremiumHome";
import { siteConfig } from "@/lib/config";
import { getDictionary, isLocale, withLocale } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  const title =
    lang === "ru"
      ? "Эмир Семенов — web-разработчик и AI-боты"
      : "Emir Semenov — web developer and AI bots";
  const description = getDictionary(lang).home.hero.description;
  const canonical = withLocale(lang, "/");

  return {
    metadataBase: new URL(siteConfig.url),
    title: { absolute: title },
    description,
    alternates: {
      canonical,
      languages: { ru: "/", en: "/en" },
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

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${siteConfig.url}/#person`,
        name: lang === "ru" ? "Эмир Семенов" : "Emir Semenov",
        url: siteConfig.url,
        jobTitle:
          lang === "ru"
            ? "Web-разработчик и разработчик AI-систем"
            : "Web developer and AI systems developer",
        description: dict.home.hero.description,
        sameAs: [siteConfig.profiUrl, siteConfig.githubUrl, siteConfig.telegramUrl],
        knowsAbout: [
          "Web development",
          "UX/UI",
          "Next.js",
          "React",
          "TypeScript",
          "Python",
          "FastAPI",
          "PostgreSQL",
          "AI integrations",
          "RAG",
          "Bots",
          "Workflow automation",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: siteConfig.name,
        inLanguage: lang === "ru" ? "ru-RU" : "en-US",
        author: { "@id": `${siteConfig.url}/#person` },
      },
      {
        "@type": "ProfessionalService",
        "@id": `${siteConfig.url}/#service`,
        name: siteConfig.name,
        url: siteConfig.url,
        description: dict.home.services.intro,
        provider: { "@id": `${siteConfig.url}/#person` },
        serviceType: ["Web development", "AI systems", "Bots", "Automation"],
        areaServed: "Remote",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <PremiumHome lang={lang} dict={dict} />
    </>
  );
}
