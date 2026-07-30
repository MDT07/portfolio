import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Tag from "@/components/ui/Tag";
import Reveal from "@/components/ui/Reveal";
import DemoViewer from "@/components/interactive/DemoViewer";
import { getWork, getWorkSlugs } from "@/lib/mdx";
import { getDictionary, isLocale, locales, withLocale } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    getWorkSlugs().map((slug) => ({ lang, slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const work = await getWork(slug, lang);
  if (!work) return {};
  return {
    title: work.frontmatter.title,
    description: work.frontmatter.description,
  };
}

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const work = await getWork(slug, lang);
  if (!work) notFound();

  const { frontmatter: w, content } = work;

  const meta = [
    { label: dict.common.year, value: w.year },
    { label: dict.common.role, value: w.role },
    { label: dict.common.stack, value: w.stack.join(" / ") },
    ...(w.client ? [{ label: dict.common.client, value: w.client }] : []),
    ...(w.status ? [{ label: dict.common.status, value: w.status }] : []),
  ];

  return (
    <section className="pb-24 pt-32 md:pb-32 md:pt-40">
      <Container>
        <Reveal>
          <Link
            href={withLocale(lang, "/works")}
            className="text-sm text-text-tertiary transition-colors hover:text-text-primary"
          >
            {dict.common.backToWorks}
          </Link>
        </Reveal>

        <Reveal i={1} className="mt-8">
          <div className="mb-4 flex flex-wrap gap-2">
            {w.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
            {w.title}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-text-secondary">
            {w.description}
          </p>
        </Reveal>

        <Reveal i={2} className="mt-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {meta.map((item) => (
              <div key={item.label} className="border-b border-surface-3 pb-4">
                <p className="font-mono text-xs text-text-tertiary">
                  {item.label}
                </p>
                <p className="mt-1 text-lg font-semibold">{item.value}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal i={3} className="mt-12">
          <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-surface-3 bg-surface-1">
            <Image
              src={w.cover}
              alt={w.title}
              fill
              priority
              sizes="(min-width: 1200px) 1200px, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>

        <Reveal i={4} className="mt-16">
          <div className="max-w-3xl">{content}</div>
        </Reveal>

        {w.demo && (
          <Reveal i={5} className="mt-12">
            <div className="rounded-lg border border-surface-3 bg-surface-1 p-8">
              <h2 className="text-2xl font-semibold">Live demo</h2>
              <p className="mt-2 text-text-secondary">
                {lang === "ru"
                  ? "Полностью рабочая версия — полноэкранный просмотр прямо здесь или в новой вкладке."
                  : "A fully working version — fullscreen preview right here or in a new tab."}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <DemoViewer
                  src={w.demo}
                  title={w.title}
                  openLabel={dict.common.openDemo}
                />
                <a
                  href={w.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-text-tertiary transition-colors hover:text-text-primary"
                >
                  {w.demo} ↗
                </a>
              </div>
            </div>
          </Reveal>
        )}
      </Container>
    </section>
  );
}
