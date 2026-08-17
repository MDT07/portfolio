"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp, inView } from "@/lib/animations";
import { withLocale, type Locale } from "@/lib/i18n";

interface WorkItem {
  slug: string;
  title: string;
  year: string;
  tags: string[];
}

interface WorksIndexClientProps {
  works: WorkItem[];
  lang: Locale;
  allWorksLabel: string;
}

/**
 * Редакционный индекс работ (DESIGN.md §11): архивная нумерация,
 * serif-строки и короткий одноразовый reveal без фоновых rAF-циклов.
 */
export default function WorksIndexClient({
  works,
  lang,
  allWorksLabel,
}: WorksIndexClientProps) {
  return (
    <div>
      {works.map((w, i) => (
        <motion.div
          key={w.slug}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={inView}
          custom={i}
        >
          <Link
            href={withLocale(lang, w.slug === "ai" ? "/ai-works" : `/works/${w.slug}`)}
            className="group grid gap-2 border-t border-surface-3 py-7 md:grid-cols-12 md:items-baseline md:gap-6 md:py-9"
          >
            <span className="font-mono text-xs text-text-tertiary transition-colors group-hover:text-accent md:col-span-2">
              n0.0{i + 1}
            </span>
            <h3 className="font-display text-[clamp(1.75rem,4vw,3.25rem)] leading-[1.05] transition-transform duration-300 group-hover:translate-x-2 md:col-span-7">
              {w.title}
              <span className="ml-3 inline-block text-accent opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                →
              </span>
            </h3>
            <span className="font-mono text-xs text-text-tertiary md:col-span-3 md:text-right">
              {w.tags.join(" · ")} — {w.year}
            </span>
          </Link>
        </motion.div>
      ))}

      <Link
        href={withLocale(lang, "/works")}
        className="group flex items-center justify-between border-y border-surface-3 py-5 font-mono text-xs uppercase tracking-widest text-text-secondary transition-colors hover:text-text-primary"
      >
        <span>{allWorksLabel}</span>
        <span className="transition-transform duration-200 group-hover:translate-x-1">
          →
        </span>
      </Link>

    </div>
  );
}
