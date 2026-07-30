"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import { EASE } from "@/lib/animations";

interface CounterProps {
  /** Конечное значение */
  to: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  /** Секунды; по DESIGN.md — короткие, поэтому 1.2s на всю анимацию */
  duration?: number;
  className?: string;
}

/**
 * Анимированный счётчик: досчитывает до значения при появлении в кадре.
 * Используется в MDX-кейсах и на страницах с метриками.
 */
export default function Counter({
  to,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1.2,
  className,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState((0).toFixed(decimals));

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration,
      ease: EASE,
      onUpdate: (v) => setDisplay(v.toFixed(decimals)),
    });
    return () => controls.stop();
  }, [inView, to, duration, decimals]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
