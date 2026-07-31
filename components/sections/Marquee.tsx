"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

interface MarqueeProps {
  items: string[];
}

/**
 * Velocity-marquee (DESIGN.md §10): базовая скорость + импульс
 * от скорости скролла, rAF, только transform.
 * prefers-reduced-motion — статичная строка без анимации.
 */
export default function Marquee({ items }: MarqueeProps) {
  const reduceMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduceMotion) return;
    let raf = 0;
    let last = performance.now();
    let lastScroll = window.scrollY;
    let offset = 0;
    let boost = 0;

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const y = window.scrollY;
      boost += (Math.abs(y - lastScroll) * 6 - boost) * 0.06;
      lastScroll = y;
      const track = trackRef.current;
      if (track) {
        const half = track.scrollWidth / 2;
        offset -= (48 + boost) * dt;
        if (half > 0 && offset <= -half) offset += half;
        track.style.transform = `translate3d(${offset}px, 0, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduceMotion]);

  // 4 повтора гарантируют ширину ≥ 2× вьюпорта для бесшовного wrap на -50%
  const row = [...items, ...items, ...items, ...items];

  return (
    <div
      aria-hidden
      className="relative overflow-hidden border-y border-surface-3 py-4"
    >
      <div
        ref={trackRef}
        className="flex w-max whitespace-nowrap will-change-transform"
      >
        {row.map((item, i) => (
          <span
            key={i}
            className="flex items-center font-mono text-xs uppercase tracking-widest text-text-tertiary"
          >
            <span className="px-6">{item}</span>
            <span className="text-accent">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
