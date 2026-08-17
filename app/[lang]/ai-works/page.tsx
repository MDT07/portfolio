import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale } from "@/lib/i18n";
import { siteConfig } from "@/lib/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  const title = lang === "ru" ? "AI работы" : "AI works";
  const description =
    lang === "ru"
      ? "Интерактивная витрина AI-интеграций, ассистентов и бизнес-сценариев."
      : "An interactive showcase of AI integrations, assistants, and business workflows.";

  return {
    metadataBase: new URL(siteConfig.url),
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: siteConfig.name,
      images: [{ url: "/-/opengraph-image.png", width: 1200, height: 630 }],
    },
    twitter: {
      title,
      description,
      images: ["/-/opengraph-image.png"],
    },
    alternates: { languages: { ru: "/ai-works", en: "/en/ai-works" } },
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

  return (
    <section className="h-[100dvh] overflow-hidden bg-[#08080f] pt-16" data-lenis-prevent>
      <h1 className="sr-only">{dict.nav.aiWorks}</h1>
      <iframe
        src="/templates/ai/index.html?embedded=1"
        title={dict.common.aiWorksFrame}
        className="block h-[calc(100dvh-4rem)] w-full border-0 bg-[#08080f]"
        loading="eager"
      />
    </section>
  );
}
