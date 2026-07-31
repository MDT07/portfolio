import type { Variants, Transition } from "framer-motion";

/**
 * Пресеты анимаций по DESIGN.md:
 * 150–300ms для компонентов, до 400ms для сцен; ease / ease-out.
 * Никаких spring-bounce — инженерная сдержанность.
 */

export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const t = {
  fast: { duration: 0.15, ease: "easeOut" } satisfies Transition,
  base: { duration: 0.25, ease: "easeOut" } satisfies Transition,
  scene: { duration: 0.4, ease: EASE } satisfies Transition,
};

/** Базовое появление снизу */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: EASE, delay: i * 0.08 },
  }),
};

/** Простое появление */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: (i: number = 0) => ({
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut", delay: i * 0.08 },
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

/** Контейнер со стаггером детей */
export const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } } ,
};

/** Viewport-конфиг для whileInView */
export const inView = { once: true, margin: "-80px" } as const;

/* ---------- Кинематографический слой (DESIGN.md §10/§11) ---------- */

/** Cinematic ease — только крупные сцены: 800–1100ms */
export const CINE_EASE: [number, number, number, number] = [0.65, 0, 0.35, 1];

/** Line-mask reveal: строка выезжает из overflow-hidden маски */
export const lineMask: Variants = {
  hidden: { y: "112%" },
  visible: (i: number = 0) => ({
    y: "0%",
    transition: { duration: 1, ease: CINE_EASE, delay: i * 0.09 },
  }),
};

/** Clip-reveal медиа: снизу вверх + лёгкий zoom-out внутри */
export const clipReveal: Variants = {
  hidden: { clipPath: "inset(100% 0 0 0)" },
  visible: (i: number = 0) => ({
    clipPath: "inset(0% 0 0 0)",
    transition: { duration: 1.1, ease: CINE_EASE, delay: i * 0.09 },
  }),
};

/** Простое кинематографичное появление (метаданные, подписи) */
export const cineFade: Variants = {
  hidden: { opacity: 0 },
  visible: (i: number = 0) => ({
    opacity: 1,
    transition: { duration: 0.8, ease: CINE_EASE, delay: i * 0.09 },
  }),
};
