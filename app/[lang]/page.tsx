import { notFound } from "next/navigation";
import CinematicPage from "@/components/sections/CinematicPage";
import { SceneProvider } from "@/components/providers/SceneProvider";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { getAllWorks } from "@/lib/mdx";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const works = getAllWorks(lang as Locale).map((w) => ({
    slug: w.slug,
    title: w.frontmatter.title,
    year: w.frontmatter.year,
    tags: w.frontmatter.tags.slice(0, 3),
    cover: w.frontmatter.cover,
    role: w.frontmatter.role,
    featured: w.frontmatter.featured,
  }));

  return (
    <SceneProvider>
      <CinematicPage dict={dict} lang={lang as Locale} works={works} />
    </SceneProvider>
  );
}
