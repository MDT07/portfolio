"use client";

import { useEffect } from "react";
import { MotionConfig } from "framer-motion";
import { usePathname } from "next/navigation";
import type Lenis from "lenis";
import { stripLocale } from "@/lib/i18n";

/**
 * Тактильный скролл (Lenis). Отключается при prefers-reduced-motion.
 */
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAboutPage = stripLocale(pathname || "/").path === "/";

  useEffect(() => {
    if (
      isAboutPage ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let disposed = false;
    let lenis: Lenis | null = null;
    let rafId = 0;

    void import("lenis").then(({ default: LenisController }) => {
      if (disposed) return;
      lenis = new LenisController({
        duration: 1.05,
        smoothWheel: true,
      });

      const raf = (time: number) => {
        lenis?.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      lenis?.destroy();
    };
  }, [isAboutPage]);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
