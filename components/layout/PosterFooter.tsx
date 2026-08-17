import Link from "next/link";
import Container from "./Container";
import Button from "@/components/ui/Button";
import { siteConfig } from "@/lib/config";
import { withLocale, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries/ru";

interface PosterFooterProps {
  lang: Locale;
  dict: Dictionary;
}

/**
 * Постерный футер (DESIGN.md §10/§11): serif-CTA, компактное меню,
 * гигантский clipped wordmark во всю ширину, mono-статусная строка.
 */
export default function PosterFooter({ lang, dict }: PosterFooterProps) {
  const socials = [
    { label: "GitHub", href: siteConfig.githubUrl },
    { label: "Telegram", href: siteConfig.telegramUrl },
    { label: "LinkedIn", href: siteConfig.linkedinUrl },
    { label: "Email", href: `mailto:${siteConfig.email}` },
  ];

  const menu = [
    { path: "/", label: dict.nav.about },
    { path: "/works", label: dict.nav.works },
    { path: "/ai-works", label: dict.nav.aiWorks },
  ];

  return (
    <footer className="border-t border-surface-3">
      <Container className="py-20 md:py-28">
        <p className="font-mono text-[11px] uppercase tracking-widest text-text-tertiary">
          {siteConfig.email}
        </p>
        <h2 className="mt-6 max-w-4xl font-display text-[clamp(2.25rem,6vw,5rem)] leading-[1.02]">
          {dict.cta.title}
        </h2>
        <p className="mt-6 max-w-xl leading-relaxed text-text-secondary">
          {dict.cta.subtitle}
        </p>
        <div className="mt-10">
          <Button href={`mailto:${siteConfig.email}`} size="lg">
            {dict.cta.button}
          </Button>
        </div>

        <div className="mt-20 grid gap-10 border-t border-surface-3 pt-10 md:grid-cols-3">
          <div className="max-w-xs">
            <Link
              href={withLocale(lang, "/")}
              className="font-mono text-sm font-medium tracking-wider"
            >
              {siteConfig.name}
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-text-tertiary">
              {dict.footer.tagline}
            </p>
          </div>

          <nav aria-label="Menu" className="flex flex-col gap-2.5">
            <p className="mb-1 font-mono text-xs uppercase tracking-widest text-text-tertiary">
              Menu
            </p>
            {menu.map((item) => (
              <Link
                key={item.path}
                href={withLocale(lang, item.path)}
                className="text-sm text-text-secondary transition-colors hover:text-text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-2.5">
            <p className="mb-1 font-mono text-xs uppercase tracking-widest text-text-tertiary">
              Social
            </p>
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target={social.href.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="text-sm text-text-secondary transition-colors hover:text-text-primary"
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </Container>

      {/* Wordmark, clipped снизу */}
      <div
        aria-hidden
        className="select-none overflow-hidden border-t border-surface-3"
      >
        <p className="-mb-[0.16em] whitespace-nowrap text-center font-display text-[min(10vw,9rem)] uppercase leading-[0.8]">
          {siteConfig.name}
        </p>
      </div>

      <div className="border-t border-surface-3">
        <Container className="flex flex-col gap-2 py-6 md:flex-row md:items-center md:justify-between">
          <p className="font-mono text-[11px] text-text-tertiary">
            &copy; {new Date().getFullYear()} {siteConfig.name} —{" "}
            {dict.footer.rights}
          </p>
          <p className="font-mono text-[11px] text-text-tertiary">
            Next.js · Tailwind CSS · Framer Motion
          </p>
        </Container>
      </div>
    </footer>
  );
}
