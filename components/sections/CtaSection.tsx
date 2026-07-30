import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import { withLocale, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries/ru";

/**
 * Финальная CTA-секция на главной: конверсия посетителя в лид.
 */
export default function CtaSection({
  lang,
  dict,
}: {
  lang: Locale;
  dict: Dictionary;
}) {
  return (
    <section className="border-t border-surface-3 py-24 md:py-32">
      <Container>
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
            <div className="max-w-xl">
              <p className="mb-4 font-mono text-xs font-medium uppercase tracking-widest text-accent">
                {dict.nav.contact}
              </p>
              <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
                {dict.cta.title}
              </h2>
              <p className="mt-4 leading-relaxed text-text-secondary">
                {dict.cta.subtitle}
              </p>
            </div>
            <Button href={withLocale(lang, "/contact")} variant="primary">
              {dict.cta.button} →
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
