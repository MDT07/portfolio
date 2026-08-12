"use client";

import { useRef, useState, type ReactNode } from "react";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  radius?: number;
}

/**
 * Magnetic hover wrapper.
 * Pulls the child toward the cursor when the pointer is within radius.
 * Falls back to no transform on touch devices.
 */
export default function MagneticButton({
  children,
  className = "",
  strength = 0.3,
  radius = 120,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("translate3d(0,0,0)");

  const onMove = (e: React.PointerEvent) => {
    if (!ref.current || window.matchMedia("(pointer: coarse)").matches) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);
    if (dist < radius) {
      const pull = (1 - dist / radius) * strength;
      setTransform(`translate3d(${dx * pull}px, ${dy * pull}px, 0)`);
    } else {
      setTransform("translate3d(0,0,0)");
    }
  };

  const onLeave = () => setTransform("translate3d(0,0,0)");

  return (
    <div
      ref={ref}
      className={`inline-block will-change-transform ${className}`}
      style={{ transform, transition: "transform 0.15s ease-out" }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      data-cursor="expand"
    >
      {children}
    </div>
  );
}
