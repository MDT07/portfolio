"use client";

import { motion } from "framer-motion";
import { EASE } from "@/lib/animations";

/**
 * Кинематографичный вход страницы при каждой навигации.
 * template.tsx перемонтируется на каждый маршрут — анимация входа срабатывает всегда.
 * Короткая и сдержанная: 300ms, ease-out, лёгкий подъём.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
