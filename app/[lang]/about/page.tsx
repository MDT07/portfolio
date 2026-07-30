import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Reveal from "@/components/ui/Reveal";
import ProcessSteps from "@/components/interactive/ProcessSteps";
import { getDictionary, isLocale } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionary(isLocale(lang) ? lang : "ru");
  return { title: dict.about.title, description: dict.about.bio[0] };
}

export default async function AboutPage({
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
            {dict.about.label}
          </p>
          <h1 className="max-w-2xl text-4xl font-bold tracking-tight md:text-5xl">
            {dict.about.title}
          </h1>
        </Reveal>

        <div className="mt-16 grid gap-16 md:grid-cols-[1fr_320px]">
          <Reveal i={1} className="space-y-6 text-lg leading-relaxed text-text-secondary">
            {dict.about.bio.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </Reveal>

          <Reveal i={2}>
            <div className="overflow-hidden rounded-lg border border-surface-3 bg-surface-1">
              <Image
                src="/images/portrait-dot.webp"
                alt={dict.about.portraitAlt}
                width={640}
                height={800}
                className="h-auto w-full object-cover"
                priority
              />
            </div>
            <div className="mt-6 space-y-6">
              {dict.about.facts.map((fact) => (
                <div key={fact.label} className="border-b border-surface-3 pb-4">
                  <p className="font-mono text-xs text-text-tertiary">
                    {fact.label}
                  </p>
                  <p className="mt-1 text-xl font-semibold">{fact.value}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Услуги */}
        <div className="mt-24 border-t border-surface-3 pt-16 md:mt-32 md:pt-24">
          <Reveal>
            <p className="mb-4 font-mono text-xs font-medium uppercase tracking-widest text-text-tertiary">
              {dict.about.services.label}
            </p>
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              {dict.about.services.title}
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {dict.about.services.items.map((service, i) => (
              <Reveal key={service.title} i={i}>
                <div className="h-full rounded-lg border border-surface-3 bg-surface-1 p-8 transition-colors duration-200 hover:border-text-tertiary">
                  <p className="font-mono text-xs text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-4 text-lg font-semibold">{service.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                    {service.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Процесс */}
        <div className="mt-24 border-t border-surface-3 pt-16 md:mt-32 md:pt-24">
          <Reveal>
            <p className="mb-4 font-mono text-xs font-medium uppercase tracking-widest text-text-tertiary">
              {dict.about.process.label}
            </p>
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              {dict.about.process.title}
            </h2>
          </Reveal>
          <div className="mt-12 max-w-2xl">
            <ProcessSteps steps={[...dict.about.process.steps]} />
          </div>
        </div>
      </Container>
    </section>
  );
}
