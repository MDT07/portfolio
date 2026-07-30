"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { stripLocale, withLocale, type Locale } from "@/lib/i18n";

/**
 * Переключатель локали RU / EN. Сохраняет текущий путь.
 */
export default function LangSwitcher({
  lang,
  label,
}: {
  lang: Locale;
  label: string;
}) {
  const pathname = usePathname();
  const { path } = stripLocale(pathname || "/");

  const other: Locale = lang === "ru" ? "en" : "ru";

  return (
    <div
      className="flex items-center rounded-md border border-surface-3 font-mono text-xs"
      role="group"
      aria-label={label}
    >
      {(["ru", "en"] as const).map((l) =>
        l === lang ? (
          <span
            key={l}
            className="px-2.5 py-1.5 uppercase text-text-primary"
            aria-current="true"
          >
            {l}
          </span>
        ) : (
          <Link
            key={l}
            href={withLocale(other, path)}
            className="px-2.5 py-1.5 uppercase text-text-tertiary transition-colors duration-150 hover:text-text-primary"
          >
            {l}
          </Link>
        )
      )}
    </div>
  );
}
