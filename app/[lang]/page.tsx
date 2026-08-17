import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AboutDossier from "@/components/sections/AboutDossier";
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
  const description = getDictionary(lang).about.intro;
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

  return <AboutDossier lang={lang} dict={getDictionary(lang)} />;
}
