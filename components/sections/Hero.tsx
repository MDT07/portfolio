import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import { siteConfig } from "@/lib/config";
import { withLocale, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries/ru";

interface HeroProps {
  lang: Locale;
  dict: Dictionary;
}

export default function Hero({ lang, dict }: HeroProps) {
  return (
    <section className="flex min-h-screen items-center pt-16">
      <Container className="w-full">
        <Reveal i={0}>
          <p className="mb-6 font-mono text-xs font-medium uppercase tracking-widest text-text-tertiary">
            {dict.hero.label}
          </p>
        </Reveal>

        <Reveal i={1}>
          <h1 className="max-w-3xl text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
            {dict.hero.title}
          </h1>
        </Reveal>

        <Reveal i={2}>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-text-secondary">
            {dict.hero.subtitle}
          </p>
        </Reveal>

        <Reveal i={3}>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button href={withLocale(lang, "/works")} size="lg">
              {dict.hero.ctaPrimary}
            </Button>
            <Button
              href={`mailto:${siteConfig.email}`}
              variant="secondary"
              size="lg"
            >
              {dict.hero.ctaSecondary}
            </Button>
          </div>
        </Reveal>

        <Reveal i={4}>
          <dl className="mt-20 grid max-w-2xl grid-cols-3 gap-6 border-t border-surface-3 pt-8">
            {dict.hero.stats.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-mono text-2xl font-medium tracking-tight text-text-primary md:text-3xl">
                  {stat.value}
                </dd>
                <dd className="mt-1 text-xs text-text-tertiary md:text-sm">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Container>
    </section>
  );
}
