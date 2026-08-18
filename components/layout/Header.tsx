"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ui/ThemeToggle";
import LangSwitcher from "@/components/ui/LangSwitcher";
import { stripLocale, withLocale, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface HeaderProps {
  lang: Locale;
  labels: {
    services: string;
    works: string;
    aiWorks: string;
    contact: string;
    language: string;
    theme: string;
    openMenu: string;
  };
}

export default function Header({ lang, labels }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { path: currentPath } = stripLocale(pathname || "/");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  const links = [
    { path: "/#services", label: labels.services, anchor: true },
    { path: "/works", label: labels.works },
    { path: "/ai-works", label: labels.aiWorks },
  ];

  const localizedHref = (path: string, anchor?: boolean) =>
    anchor
      ? `${withLocale(lang, "/")}#${path.split("#")[1]}`
      : withLocale(lang, path);

  const isActive = (path: string) =>
    path === "/" ? currentPath === "/" : currentPath.startsWith(path);

  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-50 h-[4.5rem] border-b transition-colors duration-200",
        scrolled || menuOpen
          ? "border-surface-3 bg-surface-0"
          : "border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-full max-w-[1320px] items-center justify-between px-5 md:px-8 lg:px-12">
        <Link
          href={withLocale(lang, "/")}
          className="whitespace-nowrap font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-text-primary"
        >
          Emir.Semenov <span className="text-accent">/ Dev</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-5 md:flex lg:gap-7" aria-label="Main">
          {links.map((link) => (
            <Link
              key={link.path}
              href={localizedHref(link.path, link.anchor)}
              className={cn(
                "relative py-1 text-sm transition-colors duration-150",
                isActive(link.path)
                  ? "text-text-primary after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:bg-accent"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-1 md:flex">
          <LangSwitcher lang={lang} label={labels.language} />
          <ThemeToggle label={labels.theme} />
          <Link
            href={`${withLocale(lang, "/")}#contact`}
            className="ml-2 border border-text-primary px-3 py-2 font-mono text-[10px] uppercase tracking-[0.1em] transition-colors hover:bg-text-primary hover:text-surface-0"
          >
            {labels.contact}
          </Link>
        </div>

        {/* Mobile burger */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-10 w-10 items-center justify-center md:hidden"
          aria-label={labels.openMenu}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
        >
          <div className="flex flex-col gap-1.5">
            <span
              className={cn(
                "block h-px w-5 bg-text-primary transition-transform duration-200",
                menuOpen && "translate-y-[3.5px] rotate-45"
              )}
            />
            <span
              className={cn(
                "block h-px w-5 bg-text-primary transition-transform duration-200",
                menuOpen && "-translate-y-[3.5px] -rotate-45"
              )}
            />
          </div>
        </button>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <nav
          id="mobile-navigation"
          className="border-b border-surface-3 bg-surface-0 px-6 pb-4 md:hidden"
        >
          {links.map((link) => (
            <Link
              key={link.path}
              href={localizedHref(link.path, link.anchor)}
              onClick={() => setMenuOpen(false)}
              className={cn(
                "block py-3 text-sm transition-colors",
                isActive(link.path)
                  ? "text-text-primary"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-3 flex items-center gap-2 border-t border-surface-3 pt-4">
            <LangSwitcher lang={lang} label={labels.language} />
            <ThemeToggle label={labels.theme} />
          </div>
          <Link
            href={`${withLocale(lang, "/")}#contact`}
            onClick={() => setMenuOpen(false)}
            className="mt-4 flex min-h-11 items-center justify-between border border-text-primary px-4 font-mono text-[11px] uppercase tracking-[0.1em]"
          >
            {labels.contact}<span aria-hidden>↘</span>
          </Link>
        </nav>
      )}
    </header>
  );
}
