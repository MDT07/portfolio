"use client";

import { useEffect, useRef } from "react";
import { useScene } from "@/components/providers/SceneProvider";
import { ParticleField } from "@/components/canvas/ParticleField";
import { isHighPowerDevice } from "@/lib/canvas";
import { useMounted } from "@/lib/hooks";

/**
 * Persistent Canvas 2D atmosphere.
 * Renders a constellation particle field that reacts to cursor and scroll velocity.
 * Disabled entirely when prefers-reduced-motion is active or on low-power devices.
 */
export default function CanvasEnvironment() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fieldRef = useRef<ParticleField | null>(null);
  const { cursor, velocity, reducedMotion } = useScene();
  const mounted = useMounted();
  const rafRef = useRef(0);
  const cursorRef = useRef(cursor);
  const velocityRef = useRef(velocity);

  useEffect(() => {
    cursorRef.current = cursor;
  }, [cursor]);

  useEffect(() => {
    velocityRef.current = velocity;
  }, [velocity]);

  useEffect(() => {
    if (reducedMotion || !isHighPowerDevice()) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const style = getComputedStyle(document.documentElement);
    const textPrimary = style.getPropertyValue("--color-text-primary").trim() || "237 237 237";
    const accent = style.getPropertyValue("--color-accent").trim() || "0 112 243";
    const textRgb = textPrimary.includes(" ") ? `rgb(${textPrimary})` : textPrimary;
    const accentRgb = accent.includes(" ") ? `rgb(${accent})` : accent;

    const field = new ParticleField(canvas, {
      count: window.innerWidth < 768 ? 50 : 140,
      connectionDistance: 150,
      maxConnections: 3,
      color: textRgb,
      accent: accentRgb,
    });
    fieldRef.current = field;

    let last = performance.now();
    const loop = (now: number) => {
      const dt = now - last;
      // Throttle to ~30fps on low-power mode if needed, otherwise rAF native.
      if (dt >= 16) {
        field.setCursor(cursorRef.current.x, cursorRef.current.y, true);
        field.setVelocity(velocityRef.current);
        field.draw();
        last = now;
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    const onResize = () => field.resize();
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafRef.current);
      } else {
        rafRef.current = requestAnimationFrame(loop);
      }
    };

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      field.destroy();
      fieldRef.current = null;
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1]"
      style={{ opacity: mounted && isHighPowerDevice() ? 0.9 : 0 }}
    />
  );
}
