import Link from "next/link";
import Container from "./Container";
import { siteConfig } from "@/lib/config";
import { withLocale, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries/ru";

interface FooterProps {
  lang: Locale;
  dict: Dictionary;
}

export default function Footer({ lang, dict }: FooterProps) {
  const socials = [
    { label: "GitHub", href: siteConfig.githubUrl },
    { label: "Telegram", href: siteConfig.telegramUrl },
    { label: "LinkedIn", href: siteConfig.linkedinUrl },
    { label: "Email", href: `mailto:${siteConfig.email}` },
  ];

  const sitemap = [
    { path: "/about", label: dict.nav.about },
    { path: "/skills", label: dict.nav.skills },
    { path: "/works", label: dict.nav.works },
    { path: "/blog", label: dict.nav.blog },
    { path: "/contact", label: dict.nav.contact },
  ];

  return (
    <footer className="border-t border-surface-3 py-12">
      <Container>
        <div className="flex flex-col items-start justify-between gap-10 md:flex-row">
          <div className="max-w-xs">
            <Link
              href={withLocale(lang, "/")}
              className="font-mono text-sm font-medium tracking-wider"
            >
              dev<span className="text-accent">.</span>developer
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-text-tertiary">
              {dict.footer.tagline}
            </p>
          </div>

          <nav aria-label="Sitemap" className="flex flex-col gap-2.5">
            <p className="mb-1 font-mono text-xs uppercase tracking-widest text-text-tertiary">
              Menu
            </p>
            {sitemap.map((item) => (
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

        <div className="mt-10 flex flex-col gap-2 border-t border-surface-3 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="font-mono text-xs text-text-tertiary">
            &copy; {new Date().getFullYear()} {siteConfig.name} —{" "}
            {dict.footer.rights}
          </p>
          <p className="font-mono text-xs text-text-tertiary">
            Next.js · Tailwind CSS · Framer Motion
          </p>
        </div>
      </Container>
    </footer>
  );
}
