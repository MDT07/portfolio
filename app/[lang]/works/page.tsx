import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Reveal from "@/components/ui/Reveal";
import WorksGrid from "@/components/sections/WorksGrid";
import { getDictionary, isLocale } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionary(isLocale(lang) ? lang : "ru");
  return { title: dict.works.title, description: dict.works.subtitle };
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
      <section className="pb-8 pt-32 md:pt-40">
        <Container>
          <Reveal>
            <p className="mb-4 font-mono text-xs font-medium uppercase tracking-widest text-text-tertiary">
              {dict.works.label}
            </p>
            <h1 className="max-w-2xl text-4xl font-bold tracking-tight md:text-5xl">
              {dict.works.title}
            </h1>
            <p className="mt-6 max-w-xl text-lg text-text-secondary">
              {dict.works.subtitle}
            </p>
          </Reveal>
        </Container>
      </section>
      <WorksGrid lang={lang} dict={dict} hideHeader />
    </>
  );
}
