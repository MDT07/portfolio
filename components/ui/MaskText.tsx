"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { lineMask } from "@/lib/animations";

interface MaskTextProps {
  lines: string[];
  className?: string;
}

/**
 * Line-mask reveal для display-заголовков (DESIGN.md §10/§11):
 * каждая строка выезжает из overflow-hidden маски, stagger 90ms.
 * IntersectionObserver — на статичном контейнере (useInView):
 * наблюдение за трансформированной строкой ненадёжно.
 */
export default function MaskText({ lines, className }: MaskTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const visible = useInView(ref, { once: true, margin: "-80px" });

  return (
    <span ref={ref} className={`block ${className ?? ""}`}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            className="block"
            variants={lineMask}
            initial="hidden"
            animate={visible ? "visible" : "hidden"}
            custom={i}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
