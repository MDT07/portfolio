"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export interface ProcessStep {
  title: string;
  description: string;
}

/**
 * Пошаговый процесс со scroll-driven линией прогресса.
 * Линия заполняется по мере прокрутки блока (Framer Motion useScroll).
 */
export default function ProcessSteps({ steps }: { steps: ProcessStep[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.75", "end 0.6"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={ref} className="relative my-8 pl-10">
      {/* Рельс */}
      <div className="absolute bottom-2 left-[7px] top-2 w-px bg-surface-3" />
      {/* Прогресс */}
      <motion.div
        className="absolute bottom-2 left-[7px] top-2 w-px origin-top bg-accent"
        style={{ scaleY: lineScale }}
      />

      <ol className="space-y-10">
        {steps.map((step, i) => (
          <li key={step.title} className="relative">
            <span className="absolute -left-10 top-1 flex h-4 w-4 items-center justify-center">
              <span className="h-2 w-2 rounded-full border border-accent bg-surface-0" />
            </span>
            <p className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
              {String(i + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-1.5 text-lg font-semibold text-text-primary">
              {step.title}
            </h3>
            <p className="mt-1.5 leading-relaxed text-text-secondary">
              {step.description}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
