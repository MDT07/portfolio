import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Reveal from "@/components/ui/Reveal";
import ContactForm from "@/components/sections/ContactForm";
import { siteConfig } from "@/lib/config";
import { getDictionary, isLocale } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionary(isLocale(lang) ? lang : "ru");
  return { title: dict.contact.title, description: dict.contact.subtitle };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);

  const channels = [
    {
      label: dict.contact.emailLabel,
      value: siteConfig.email,
      href: `mailto:${siteConfig.email}`,
    },
    {
      label: dict.contact.telegramLabel,
      value: siteConfig.telegramHandle,
      href: siteConfig.telegramUrl,
    },
    {
      label: dict.contact.githubLabel,
      value: siteConfig.githubHandle,
      href: siteConfig.githubUrl,
    },
  ];

  return (
    <section className="pb-24 pt-32 md:pb-32 md:pt-40">
      <Container>
        <Reveal>
          <p className="mb-4 font-mono text-xs font-medium uppercase tracking-widest text-text-tertiary">
            {dict.contact.label}
          </p>
          <h1 className="max-w-2xl text-4xl font-bold tracking-tight md:text-5xl">
            {dict.contact.title}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-text-secondary">
            {dict.contact.subtitle}
          </p>
        </Reveal>

        <div className="mt-16 grid gap-16 md:grid-cols-2">
          <Reveal i={1} className="space-y-8">
            {channels.map((channel) => (
              <div key={channel.label}>
                <p className="font-mono text-xs text-text-tertiary">
                  {channel.label}
                </p>
                <a
                  href={channel.href}
                  target={channel.href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="mt-1 block text-xl font-semibold text-accent transition-colors hover:text-accent-hover"
                >
                  {channel.value}
                </a>
              </div>
            ))}
          </Reveal>

          <ContactForm dict={dict} />
        </div>
      </Container>
    </section>
  );
}
