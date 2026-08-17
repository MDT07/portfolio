import { notFound } from "next/navigation";
import PosterHero from "@/components/sections/PosterHero";
import AboutChapter from "@/components/sections/AboutChapter";
import WorksIndex from "@/components/sections/WorksIndex";
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
    <div className="about-flow">
      <PosterHero dict={dict} />
      <AboutChapter dict={dict} />
      <WorksIndex lang={lang} dict={dict} />
    </div>
  );
}
