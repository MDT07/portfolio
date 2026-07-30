import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Tag from "@/components/ui/Tag";
import Reveal from "@/components/ui/Reveal";
import { getPost, getPostSlugs } from "@/lib/mdx";
import { getDictionary, isLocale, locales, withLocale } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    getPostSlugs().map((slug) => ({ lang, slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const post = await getPost(slug, lang);
  if (!post) return {};
  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const post = await getPost(slug, lang);
  if (!post) notFound();

  const { frontmatter: p, content } = post;

  return (
    <section className="pb-24 pt-32 md:pb-32 md:pt-40">
      <Container>
        <Reveal>
          <Link
            href={withLocale(lang, "/blog")}
            className="text-sm text-text-tertiary transition-colors hover:text-text-primary"
          >
            {dict.common.backToBlog}
          </Link>
        </Reveal>

        <article className="mt-10 max-w-3xl">
          <Reveal i={1}>
            <div className="mb-4 flex flex-wrap gap-2">
              {p.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
            <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl">
              {p.title}
            </h1>
            <div className="mt-6 flex items-center gap-3 border-b border-surface-3 pb-8 font-mono text-xs text-text-tertiary">
              <time dateTime={p.date}>{p.date}</time>
              <span>·</span>
              <span>
                {p.readingTime} {dict.common.minRead}
              </span>
            </div>
          </Reveal>

          <Reveal i={2} className="mt-10">
            {content}
          </Reveal>
        </article>
      </Container>
    </section>
  );
}
