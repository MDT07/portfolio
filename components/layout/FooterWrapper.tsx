"use client";

import { usePathname } from "next/navigation";
import PosterFooter from "@/components/layout/PosterFooter";
import { stripLocale, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries/ru";

interface FooterWrapperProps {
  lang: Locale;
  dict: Dictionary;
}

export default function FooterWrapper({ lang, dict }: FooterWrapperProps) {
  const pathname = usePathname();
  const { path: currentPath } = stripLocale(pathname || "/");
  const isHome = currentPath === "/";

  if (isHome) return null;
  return <PosterFooter lang={lang} dict={dict} />;
}
