"use client";

import { motion } from "framer-motion";
import { lineMask, cineFade } from "@/lib/animations";
import { siteConfig } from "@/lib/config";
import type { Dictionary } from "@/lib/dictionaries/ru";

interface PosterHeroProps {
  dict: Dictionary;
}

/**
 * Самостоятельная первая глава: короткая entrance-анимация без
 * scroll-scrub, прелоадера, fixed-слоёв и фоновых rAF-циклов.
 */
export default function PosterHero({ dict }: PosterHeroProps) {
  return (
    <section
      id="about-top"
      className="relative flex min-h-[100svh] scroll-mt-16 flex-col overflow-hidden pt-16"
    >
      {/* Вертикальные hairline-направляющие */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mx-auto grid w-full max-w-[1200px] grid-cols-2 px-6 md:grid-cols-4 md:px-12"
      >
        <div className="border-l border-surface-3/40" />
        <div className="border-l border-r border-surface-3/40 md:border-r-0" />
        <div className="hidden border-l border-surface-3/40 md:block" />
        <div className="hidden border-l border-r border-surface-3/40 md:block" />
      </div>

      <div className="relative mx-auto flex w-full max-w-[1200px] flex-1 flex-col px-6 md:px-12">
        {/* Метаданные */}
        <motion.div
          variants={cineFade}
          initial="hidden"
          animate="visible"
          custom={0}
          className="pt-6 font-mono text-[11px] uppercase tracking-widest text-text-tertiary"
        >
          <span>{dict.hero.label}</span>
        </motion.div>

        <div className="flex-1" />

        {/* Headline */}
        <h1 className="font-display text-[clamp(2.75rem,9vw,8rem)] uppercase leading-[0.98]">
          {dict.hero.titleLines.map((line, i) => (
            <span key={i} className="block overflow-hidden pb-[0.08em]">
              <motion.span
                className="block"
                variants={lineMask}
                initial="hidden"
                animate="visible"
                custom={i}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        {/* Подзаголовок + CTA */}
        <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <motion.p
            variants={cineFade}
            initial="hidden"
            animate="visible"
            custom={1}
            className="max-w-md text-base leading-relaxed text-text-secondary md:text-lg"
          >
            {dict.hero.subtitle}
          </motion.p>
          <motion.div
            variants={cineFade}
            initial="hidden"
            animate="visible"
            custom={2}
            className="flex flex-wrap items-center gap-6"
          >
            <a
              href="#works"
              className="group text-base font-medium text-accent transition-colors hover:text-accent-hover"
            >
              {dict.hero.ctaPrimary}{" "}
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </a>
            <a
              href={`mailto:${siteConfig.email}`}
              className="text-base text-text-secondary underline decoration-surface-3 underline-offset-8 transition-colors hover:text-text-primary"
            >
              {dict.hero.ctaSecondary}
            </a>
          </motion.div>
        </div>

        {/* Скролл-подсказка */}
        <motion.div
          variants={cineFade}
          initial="hidden"
          animate="visible"
          custom={3}
          className="mt-14 flex items-center gap-3 pb-8"
        >
          <span className="font-mono text-[11px] uppercase tracking-widest text-text-tertiary">
            {dict.hero.scroll}
          </span>
          <span className="h-px w-16 bg-text-tertiary" />
        </motion.div>
      </div>
    </section>
  );
}
