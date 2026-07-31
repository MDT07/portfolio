"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CINE_EASE, lineMask, cineFade } from "@/lib/animations";
import { withLocale, type Locale } from "@/lib/i18n";
import { siteConfig } from "@/lib/config";
import type { Dictionary } from "@/lib/dictionaries/ru";

interface PosterHeroProps {
  lang: Locale;
  dict: Dictionary;
}

const INTRO_KEY = "dd-intro";
const INTRO_DURATION = 1100;

/** SVG-noise data-uri (§10 — зернистость ≤ 0.05) */
const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E\")";

function mskTime(): string {
  return new Intl.DateTimeFormat("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Europe/Moscow",
  }).format(new Date());
}

/**
 * Постерный hero главной (DESIGN.md §11):
 * preloader 0→100 раз за сессию, line-mask headline (Prata),
 * live-часы MSK, hairline-направляющие, плёночное зерно.
 */
export default function PosterHero({ lang, dict }: PosterHeroProps) {
  const reduceMotion = useReducedMotion();
  const [showIntro, setShowIntro] = useState(false);
  const [ready, setReady] = useState(false);
  const [count, setCount] = useState(0);
  const [time, setTime] = useState<string | null>(null);

  // Прелоадер: один раз за сессию, off при prefers-reduced-motion
  useEffect(() => {
    if (reduceMotion || sessionStorage.getItem(INTRO_KEY)) {
      setReady(true);
      return;
    }
    sessionStorage.setItem(INTRO_KEY, "1");
    setShowIntro(true);
    const start = performance.now();
    let raf = requestAnimationFrame(function tick(now) {
      const p = Math.min((now - start) / INTRO_DURATION, 1);
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setShowIntro(false);
          setReady(true);
        }, 200);
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [reduceMotion]);

  // Live-часы MSK (§10 — live-data штрих, не чаще 1 раза в секунду)
  useEffect(() => {
    setTime(mskTime());
    const id = setInterval(() => setTime(mskTime()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden pt-16">
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
          animate={ready ? "visible" : "hidden"}
          custom={5}
          className="flex items-center justify-between pt-6 font-mono text-[11px] uppercase tracking-widest text-text-tertiary"
        >
          <span>{dict.hero.label}</span>
          <span suppressHydrationWarning>MSK {time ?? "--:--:--"}</span>
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
                animate={ready ? "visible" : "hidden"}
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
            animate={ready ? "visible" : "hidden"}
            custom={5}
            className="max-w-md text-base leading-relaxed text-text-secondary md:text-lg"
          >
            {dict.hero.subtitle}
          </motion.p>
          <motion.div
            variants={cineFade}
            initial="hidden"
            animate={ready ? "visible" : "hidden"}
            custom={6}
            className="flex flex-wrap items-center gap-6"
          >
            <Link
              href={withLocale(lang, "/works")}
              className="group text-base font-medium text-accent transition-colors hover:text-accent-hover"
            >
              {dict.hero.ctaPrimary}{" "}
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </Link>
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
          animate={ready ? "visible" : "hidden"}
          custom={7}
          className="mt-14 flex items-center gap-3 pb-8"
        >
          <span className="font-mono text-[11px] uppercase tracking-widest text-text-tertiary">
            {dict.hero.scroll}
          </span>
          <motion.span
            className="h-px w-16 origin-left bg-text-tertiary"
            animate={reduceMotion ? undefined : { scaleX: [0.3, 1, 0.3] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>

      {/* Плёночное зерно (§10, opacity ≤ 0.05) */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[5] opacity-[0.05]"
        style={{ backgroundImage: NOISE }}
      />

      {/* Прелоадер */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            key="intro"
            className="fixed inset-0 z-[90] flex flex-col justify-between bg-surface-0 px-6 py-6 md:px-12 md:py-10"
            exit={{ y: "-100%" }}
            transition={{ duration: 0.9, ease: CINE_EASE }}
          >
            <p className="font-mono text-[11px] uppercase tracking-widest text-text-tertiary">
              dev<span className="text-accent">.</span>developer
            </p>
            <div className="flex items-end justify-between">
              <p className="font-display leading-none tabular-nums text-[26vw] md:text-[14vw]">
                {count}
              </p>
              <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-text-tertiary">
                {dict.hero.label}
              </p>
            </div>
            <div className="h-px w-full bg-surface-3">
              <div
                className="h-px origin-left bg-text-primary"
                style={{ transform: `scaleX(${count / 100})` }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
