import { notFound } from "next/navigation";
import Hero from "@/components/sections/Hero";
import Manifesto from "@/components/sections/Manifesto";
import WorksGrid from "@/components/sections/WorksGrid";
import CtaSection from "@/components/sections/CtaSection";
import { getDictionary, isLocale } from "@/lib/i18n";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <>
      <Hero lang={lang} dict={dict} />
      <Manifesto dict={dict} />
      <WorksGrid lang={lang} dict={dict} featuredOnly />
      <CtaSection lang={lang} dict={dict} />
    </>
  );
}
