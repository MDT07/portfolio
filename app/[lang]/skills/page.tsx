import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Tag from "@/components/ui/Tag";
import Reveal from "@/components/ui/Reveal";
import { getDictionary, isLocale } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionary(isLocale(lang) ? lang : "ru");
  return { title: dict.skills.title, description: dict.skills.subtitle };
}

export default async function SkillsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <section className="pb-24 pt-32 md:pb-32 md:pt-40">
      <Container>
        <Reveal>
          <p className="mb-4 font-mono text-xs font-medium uppercase tracking-widest text-text-tertiary">
            {dict.skills.label}
          </p>
          <h1 className="max-w-2xl text-4xl font-bold tracking-tight md:text-5xl">
            {dict.skills.title}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-text-secondary">
            {dict.skills.subtitle}
          </p>
        </Reveal>

        <div className="mt-16 grid gap-12 md:grid-cols-2">
          {dict.skills.groups.map((group, gi) => (
            <Reveal key={group.domain} i={gi}>
              <h2 className="mb-6 font-mono text-sm font-medium uppercase tracking-wider text-text-tertiary">
                {group.domain}
              </h2>
              <div className="flex flex-wrap gap-2">
                {group.items.map((skill) => (
                  <Tag key={skill}>{skill}</Tag>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
