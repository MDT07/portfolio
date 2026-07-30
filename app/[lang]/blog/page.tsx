import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Tag from "@/components/ui/Tag";
import Reveal from "@/components/ui/Reveal";
import { getAllPosts } from "@/lib/mdx";
import { getDictionary, isLocale, withLocale } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionary(isLocale(lang) ? lang : "ru");
  return { title: dict.blog.title, description: dict.blog.subtitle };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const posts = getAllPosts(lang);

  return (
    <section className="pb-24 pt-32 md:pb-32 md:pt-40">
      <Container>
        <Reveal>
          <p className="mb-4 font-mono text-xs font-medium uppercase tracking-widest text-text-tertiary">
            {dict.blog.label}
          </p>
          <h1 className="max-w-2xl text-4xl font-bold tracking-tight md:text-5xl">
            {dict.blog.title}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-text-secondary">
            {dict.blog.subtitle}
          </p>
        </Reveal>

        {posts.length === 0 ? (
          <p className="mt-16 font-mono text-sm text-text-tertiary">
            {dict.blog.empty}
          </p>
        ) : (
          <div className="mt-16 divide-y divide-surface-3 border-y border-surface-3">
            {posts.map((post, i) => (
              <Reveal key={post.slug} i={i}>
                <Link
                  href={withLocale(lang, `/blog/${post.slug}`)}
                  className="group flex flex-col gap-3 py-8 transition-colors md:flex-row md:items-baseline md:justify-between"
                >
                  <div className="max-w-2xl">
                    <h2 className="text-xl font-semibold transition-colors group-hover:text-accent">
                      {post.frontmatter.title}
                    </h2>
                    <p className="mt-2 leading-relaxed text-text-secondary">
                      {post.frontmatter.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {post.frontmatter.tags.map((tag) => (
                        <Tag key={tag}>{tag}</Tag>
                      ))}
                    </div>
                  </div>
                  <div className="shrink-0 font-mono text-xs text-text-tertiary md:text-right">
                    <time dateTime={post.frontmatter.date}>
                      {post.frontmatter.date}
                    </time>
                    <span className="mx-2">·</span>
                    <span>
                      {post.frontmatter.readingTime} {dict.common.minRead}
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
