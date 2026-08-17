"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ui/ThemeToggle";
import LangSwitcher from "@/components/ui/LangSwitcher";
import SoundToggle from "@/components/ui/SoundToggle";
import { stripLocale, withLocale, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries/ru";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/config";

interface HeaderProps {
  lang: Locale;
  dict: Dictionary;
}

export default function Header({ lang, dict }: HeaderProps) {
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

  const links = [
    { path: "/", label: dict.nav.about },
    { path: "/works", label: dict.nav.works },
    { path: "/ai-works", label: dict.nav.aiWorks },
  ];

  const isActive = (path: string) =>
    path === "/" ? currentPath === "/" : currentPath.startsWith(path);

  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-50 h-16 border-b transition-colors duration-200",
        scrolled || menuOpen
          ? "border-surface-3 bg-surface-0/80 backdrop-blur-xl"
          : "border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between px-6 md:px-12">
        <Link
          href={withLocale(lang, "/")}
          className="whitespace-nowrap font-mono text-xs font-medium tracking-wide text-text-primary lg:text-sm"
        >
          {siteConfig.name}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-5 md:flex lg:gap-7" aria-label="Main">
          {links.map((link) => (
            <Link
              key={link.path}
              href={withLocale(lang, link.path)}
              className={cn(
                "relative py-1 text-sm transition-colors duration-150",
                isActive(link.path)
                  ? "text-text-primary after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:w-full after:bg-accent"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <SoundToggle label={dict.common.sound} />
          <LangSwitcher lang={lang} label={dict.common.language} />
          <ThemeToggle label={dict.common.theme} />
        </div>

        {/* Mobile burger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-10 w-10 items-center justify-center md:hidden"
          aria-label="Menu"
          aria-expanded={menuOpen}
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
        <nav className="border-b border-surface-3 bg-surface-0 px-6 pb-4 md:hidden">
          {links.map((link) => (
            <Link
              key={link.path}
              href={withLocale(lang, link.path)}
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
            <SoundToggle label={dict.common.sound} />
            <LangSwitcher lang={lang} label={dict.common.language} />
            <ThemeToggle label={dict.common.theme} />
          </div>
        </nav>
      )}
    </header>
  );
}
