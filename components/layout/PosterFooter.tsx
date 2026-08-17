import Link from "next/link";
import Container from "./Container";
import { siteConfig } from "@/lib/config";
import { withLocale, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries/ru";

interface PosterFooterProps {
  lang: Locale;
  dict: Dictionary;
}

export default function PosterFooter({ lang, dict }: PosterFooterProps) {
  const contacts = [
    { label: dict.about.contacts.telegram, href: siteConfig.telegramUrl },
    { label: dict.about.contacts.profi, href: siteConfig.profiUrl },
  ];

  const menu = [
    { path: "/", label: dict.nav.about },
    { path: "/works", label: dict.nav.works },
    { path: "/ai-works", label: dict.nav.aiWorks },
  ];

  return (
    <footer className="border-t border-surface-3">
      <Container className="py-10 md:py-12">
        <div className="grid gap-10 md:grid-cols-12 md:gap-6">
          <div className="max-w-xs md:col-span-4">
            <Link
              href={withLocale(lang, "/")}
              className="font-display text-xl leading-tight"
            >
              {siteConfig.name}
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-text-tertiary">
              {dict.footer.tagline}
            </p>
          </div>

          <nav
            aria-label={lang === "ru" ? "Навигация" : "Navigation"}
            className="flex flex-col gap-2.5 md:col-span-3 md:col-start-7"
          >
            <p className="editorial-label mb-1">
              {lang === "ru" ? "Навигация" : "Navigation"}
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

          <div className="flex flex-col gap-2.5 md:col-span-3 md:col-start-10">
            <p className="editorial-label mb-1">{dict.about.contacts.label}</p>
            {contacts.map((contact) => (
              <a
                key={contact.label}
                href={contact.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-text-secondary transition-colors hover:text-text-primary"
              >
                {contact.label} ↗
              </a>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
