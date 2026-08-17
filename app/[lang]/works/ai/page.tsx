import { notFound, permanentRedirect } from "next/navigation";
import { isLocale, locales, withLocale } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

/** Legacy AI case URL, preserved as a static 308 redirect. */
export default async function LegacyAIWorkPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  permanentRedirect(withLocale(lang, "/ai-works"));
}
