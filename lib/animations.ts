import type { Variants } from "framer-motion";

/**
 * Пресеты анимаций по DESIGN.md:
 * 150–300ms для компонентов, до 400ms для сцен; ease / ease-out.
 * Никаких spring-bounce — инженерная сдержанность.
 */

export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Базовое появление снизу */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: EASE, delay: i * 0.08 },
  }),
};

/** Смена ракурса: лёгкий 3D-наклон при появлении (CSS 3D, без WebGL) */
export const tiltIn: Variants = {
  hidden: { opacity: 0, y: 32, rotateX: 8, transformPerspective: 900 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.4, ease: EASE, delay: i * 0.08 },
  }),
};

/** Viewport-конфиг для whileInView */
export const inView = { once: true, margin: "-80px" } as const;
