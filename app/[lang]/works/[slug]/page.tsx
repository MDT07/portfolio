import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Tag from "@/components/ui/Tag";
import Reveal from "@/components/ui/Reveal";
import DemoViewer from "@/components/interactive/DemoViewer";
import { getWork, getWorkSlugs } from "@/lib/works";
import { getDictionary, isLocale, locales, withLocale } from "@/lib/i18n";
import { siteConfig } from "@/lib/config";

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
  const canonical = withLocale(lang, `/works/${slug}`);
  return {
    title: work.frontmatter.title,
    description: work.frontmatter.description,
    alternates: {
      canonical,
      languages: {
        ru: `/works/${slug}`,
        en: `/en/works/${slug}`,
      },
    },
    openGraph: {
      type: "article",
      title: work.frontmatter.title,
      description: work.frontmatter.description,
      url: canonical,
      siteName: siteConfig.name,
      images: [{ url: work.frontmatter.cover, width: 1200, height: 750 }],
    },
    twitter: {
      card: "summary_large_image",
      title: work.frontmatter.title,
      description: work.frontmatter.description,
      images: [work.frontmatter.cover],
    },
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

  const { frontmatter: w, sections } = work;

  const meta = [
    { label: dict.common.year, value: w.year },
    { label: dict.common.role, value: w.role },
    { label: dict.common.stack, value: w.stack.join(" / ") },
    ...(w.status ? [{ label: dict.common.status, value: w.status }] : []),
  ];

  const status =
    w.status ?? (lang === "ru" ? "Концепт · рабочий прототип" : "Concept · working prototype");
  const canonical = `${siteConfig.url}${withLocale(lang, `/works/${slug}`)}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: w.title,
    description: w.description,
    url: canonical,
    image: `${siteConfig.url}${w.cover}`,
    dateCreated: w.year,
    creator: {
      "@type": "Person",
      "@id": `${siteConfig.url}/#person`,
      name: lang === "ru" ? "Эмир Семенов" : "Emir Semenov",
    },
    ...(w.demo ? { workExample: `${siteConfig.url}${w.demo}` } : {}),
    keywords: [...w.tags, ...w.stack].join(", "),
  };

  return (
    <article className="case-study pb-24 pt-28 md:pb-32 md:pt-36">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Container>
        <header className="case-study__hero">
          <Reveal>
            <div className="case-study__topline">
              <Link href={withLocale(lang, "/works")}>{dict.common.backToWorks}</Link>
              <span>{status}</span>
            </div>
          </Reveal>

          <Reveal i={1}>
            <div className="case-study__heading">
              <p className="editorial-label">Case / {w.role}</p>
              <h1>{w.title}</h1>
              <p>{w.description}</p>
            </div>
          </Reveal>

          <div className="case-study__tags" aria-label={dict.common.stack}>
            {w.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
          </div>

          <Reveal i={2}>
            <dl className="case-study__meta">
            {meta.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
            </dl>
          </Reveal>
        </header>

        <Reveal i={3} className="case-study__cover">
          <figure>
            <Image
              src={w.cover}
              alt=""
              fill
              priority
              sizes="(min-width: 1320px) 1224px, 100vw"
              className="object-cover"
            />
          </figure>
        </Reveal>

        <div className="case-study__body">
          <aside>
            <p className="editorial-label">{lang === "ru" ? "Контекст" : "Context"}</p>
            <p>{status}</p>
            <p>{lang === "ru" ? "Интерактивный прототип с рабочими пользовательскими сценариями." : "Interactive prototype with working user flows."}</p>
          </aside>
          <Reveal i={4}>
            <div className="case-study__content">
              {sections.map((section) => (
                <section key={section.title}>
                  <h2>{section.title}</h2>
                  {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  {section.bullets && (
                    <ul>
                      {section.bullets.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  )}
                </section>
              ))}
            </div>
          </Reveal>
        </div>

        {w.demo && (
          <Reveal i={5} className="case-demo">
            <div>
              <p className="editorial-label">Interactive evidence</p>
              <h2>Live demo</h2>
              <p>
                {lang === "ru"
                  ? "Полностью рабочая версия — полноэкранный просмотр прямо здесь или в новой вкладке."
                  : "A fully working version — fullscreen preview right here or in a new tab."}
              </p>
              <div className="case-demo__actions">
                <DemoViewer
                  src={w.demo}
                  title={w.title}
                  openLabel={dict.common.openDemo}
                />
                <a
                  href={w.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="case-demo__link"
                >
                  {w.demo} ↗
                </a>
              </div>
            </div>
          </Reveal>
        )}

        <nav className="case-study__next" aria-label={lang === "ru" ? "Другие работы" : "Other work"}>
          <span>{lang === "ru" ? "Следующий шаг" : "Next step"}</span>
          <Link href={withLocale(lang, "/works")}>{dict.common.allWorks} ↗</Link>
        </nav>
      </Container>
    </article>
  );
}
