"use client";

import { motion } from "framer-motion";
import { fadeUp, tiltIn, inView } from "@/lib/animations";

interface RevealProps {
  children: React.ReactNode;
  /** Порядковый индекс для stagger-задержки */
  i?: number;
  /** fadeUp — классика; tiltIn — лёгкая смена ракурса (CSS 3D) */
  variant?: "fadeUp" | "tiltIn";
  className?: string;
}

/**
 * Обёртка появления при скролле для Server Components:
 * позволяет держать секции серверными, не помечая их "use client".
 */
export default function Reveal({
  children,
  i = 0,
  variant = "fadeUp",
  className,
}: RevealProps) {
  return (
    <motion.div
      className={className}
      variants={variant === "tiltIn" ? tiltIn : fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={inView}
      custom={i}
    >
      {children}
    </motion.div>
  );
}
