import { ru } from "./dictionaries/ru";
import { en } from "./dictionaries/en";
import type { Dictionary } from "./dictionaries/ru";

export const locales = ["ru", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ru";

const dictionaries: Record<Locale, Dictionary> = {
  ru: ru as unknown as Dictionary,
  en,
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function getDictionary(lang: Locale): Dictionary {
  return dictionaries[lang] ?? dictionaries[defaultLocale];
}

/**
 * Путь с учётом локали: ru — корневые пути, en — с префиксом /en.
 * withLocale("ru", "/works") → "/works"
 * withLocale("en", "/works") → "/en/works"
 */
export function withLocale(lang: Locale, path: string): string {
  const clean = path === "/" ? "" : path;
  return lang === defaultLocale ? clean || "/" : `/${lang}${clean}`;
}

/** Убрать префикс локали из пути: "/en/works" → "/works" */
export function stripLocale(pathname: string): { lang: Locale; path: string } {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0 && isLocale(segments[0]) && segments[0] !== defaultLocale) {
    const rest = "/" + segments.slice(1).join("/");
    return { lang: segments[0] as Locale, path: rest === "/" ? "/" : rest.replace(/\/$/, "") || "/" };
  }
  return { lang: defaultLocale, path: pathname };
}
