"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { CINE_EASE, fadeUp, inView } from "@/lib/animations";
import { withLocale, type Locale } from "@/lib/i18n";

interface WorkItem {
  slug: string;
  title: string;
  year: string;
  tags: string[];
  cover: string;
}

interface WorksIndexClientProps {
  works: WorkItem[];
  lang: Locale;
  allWorksLabel: string;
}

/**
 * Редакционный индекс работ (DESIGN.md §11): архивная нумерация,
 * serif-строки, плавающее hover-превью обложки за курсором (desktop).
 */
export default function WorksIndexClient({
  works,
  lang,
  allWorksLabel,
}: WorksIndexClientProps) {
  const reduceMotion = useReducedMotion();
  const [hover, setHover] = useState<number | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  // Курсор-lerp для плавающего превью (rAF, только transform)
  useEffect(() => {
    if (reduceMotion) return;
    const onMove = (e: MouseEvent) => {
      pos.current.tx = e.clientX;
      pos.current.ty = e.clientY;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    let raf = requestAnimationFrame(function loop() {
      const p = pos.current;
      p.x += (p.tx - p.x) * 0.12;
      p.y += (p.ty - p.y) * 0.12;
      const el = previewRef.current;
      if (el) {
        el.style.transform = `translate3d(${p.x + 28}px, ${p.y - 120}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [reduceMotion]);

  // Прелоад обложек — мгновенная смена превью
  useEffect(() => {
    works.forEach((w) => {
      const img = new Image();
      img.src = w.cover;
    });
  }, [works]);

  return (
    <div onMouseLeave={() => setHover(null)}>
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
            onMouseEnter={() => setHover(i)}
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
        onMouseEnter={() => setHover(null)}
        className="group flex items-center justify-between border-y border-surface-3 py-5 font-mono text-xs uppercase tracking-widest text-text-secondary transition-colors hover:text-text-primary"
      >
        <span>{allWorksLabel}</span>
        <span className="transition-transform duration-200 group-hover:translate-x-1">
          →
        </span>
      </Link>

      {/* Плавающее превью (desktop, off при reduced motion) */}
      {!reduceMotion && (
        <div
          ref={previewRef}
          className="pointer-events-none fixed left-0 top-0 z-40 hidden md:block"
        >
          <motion.div
            animate={{
              opacity: hover === null ? 0 : 1,
              scale: hover === null ? 0.92 : 1,
            }}
            transition={{ duration: 0.35, ease: CINE_EASE }}
            className="h-[220px] w-[340px] overflow-hidden rounded-md border border-surface-3 bg-surface-1"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={works[hover ?? 0]?.cover}
              alt=""
              className="h-full w-full object-cover"
            />
          </motion.div>
        </div>
      )}
    </div>
  );
}
