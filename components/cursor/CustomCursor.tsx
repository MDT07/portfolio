"use client";

import { useEffect, useRef, useState } from "react";
import { useScene } from "@/components/providers/SceneProvider";

export default function CustomCursor() {
  const { cursor, reducedMotion } = useScene();
  const [hovering, setHovering] = useState(false);
  const [hidden, setHidden] = useState(true);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion) return;
    const onMouseEnter = () => setHidden(false);
    const onMouseLeave = () => setHidden(true);
    const onHoverStart = (e: Event) => {
      const target = e.target as HTMLElement;
      if (
        target.closest(
          "a, button, [role='button'], input, textarea, [data-cursor='expand']"
        )
      ) {
        setHovering(true);
      }
    };
    const onHoverEnd = () => setHovering(false);

    document.addEventListener("mouseenter", onMouseEnter);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseover", onHoverStart);
    document.addEventListener("mouseout", onHoverEnd);
    return () => {
      document.removeEventListener("mouseenter", onMouseEnter);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseover", onHoverStart);
      document.removeEventListener("mouseout", onHoverEnd);
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div
      ref={dotRef}
      aria-hidden
      className={`pointer-events-none fixed z-[100] hidden mix-blend-difference md:block ${
        hidden ? "opacity-0" : "opacity-100"
      }`}
      style={{
        left: cursor.x * 100 + "vw",
        top: cursor.y * 100 + "vh",
        transform: "translate(-50%, -50%)",
        transition: "width 0.2s ease, height 0.2s ease, opacity 0.2s ease",
      }}
    >
      <div
        className={`rounded-full border border-white/80 bg-white transition-[width,height] duration-200 ${
          hovering ? "h-12 w-12" : "h-3 w-3"
        }`}
      />
    </div>
  );
}
