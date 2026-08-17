"use client";

import { useEffect, useRef, useState } from "react";
import { useScene } from "@/components/providers/SceneProvider";
import { interpolateCamera } from "@/lib/scenes";
import type { Dictionary } from "@/lib/dictionaries/ru";

export default function CinematicHero({ dict }: { dict: Dictionary }) {
  const { scene, localProgress, reducedMotion, goToScene, scenes } = useScene();
  const isActive = scene.id === "hero";
  const [clock, setClock] = useState("");
  const clockRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const update = () => {
      setClock(
        new Intl.DateTimeFormat("ru-RU", {
          timeZone: "Europe/Moscow",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }).format(new Date())
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  if (reducedMotion) {
    return (
      <section className="relative flex min-h-screen flex-col justify-center px-6 py-32 md:px-12">
        <div className="mx-auto max-w-6xl">
          <p className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
            {dict.hero.label}
          </p>
          <h1 className="mt-6 font-display text-[clamp(2.5rem,7vw,6rem)] leading-[1.02]">
            {dict.hero.titleLines.map((line, i) => (
              <span key={i} className="block">{line}</span>
            ))}
          </h1>
          <p className="mt-8 max-w-xl text-lg text-text-secondary">{dict.hero.subtitle}</p>
        </div>
      </section>
    );
  }

  const camera = isActive ? interpolateCamera(scene, localProgress) : null;
  const opacity = isActive ? camera?.opacity ?? 1 : 0;

  return (
    <section
      id="scene-hero"
      className="cinematic-scene"
      aria-label={dict.hero.label}
      style={{
        opacity,
        visibility: isActive ? "visible" : "hidden",
        pointerEvents: isActive ? "auto" : "none",
      }}
    >
      <div className="pointer-events-none absolute inset-0 z-0">
        {/* Decorative depth planes */}
        <DepthPlane z={-80} opacity={0.03} />
        <DepthPlane z={-160} opacity={0.05} />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-start px-6 md:px-12">
        <div className="flex w-full items-center justify-between">
          <p className="font-mono text-[11px] uppercase tracking-widest text-text-tertiary">
            {dict.hero.label}
          </p>
          <span
            ref={clockRef}
            className="font-mono text-[11px] tabular-nums uppercase tracking-widest text-text-tertiary"
          >
            MSK {clock}
          </span>
        </div>

        <div className="mt-12 md:mt-16">
          {dict.hero.titleLines.map((line, i) => (
            <div
              key={i}
              className="overflow-hidden"
              style={{
                transform: `translateZ(${(i - 1) * 24}px)`,
              }}
            >
              <h1 className="font-display text-[clamp(2.5rem,8vw,7.5rem)] leading-[1.02]">
                {line}
              </h1>
            </div>
          ))}
        </div>

        <p className="mt-8 max-w-xl text-base leading-relaxed text-text-secondary md:text-lg">
          {dict.hero.subtitle}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href="#scene-scroll-works"
            onClick={(e) => {
              e.preventDefault();
              goToScene(scenes.findIndex((item) => item.id === "works"));
            }}
            className="inline-flex items-center rounded-full bg-accent px-6 py-3 font-mono text-sm font-medium text-white transition-colors hover:bg-accent-hover"
          >
            {dict.hero.ctaPrimary}
          </a>
          <a
            href="mailto:hello@example.com"
            className="inline-flex items-center rounded-full border border-surface-3 px-6 py-3 font-mono text-sm transition-colors hover:bg-surface-1"
          >
            {dict.hero.ctaSecondary}
          </a>
        </div>
      </div>
    </section>
  );
}

function DepthPlane({ z, opacity }: { z: number; opacity: number }) {
  return (
    <div
      className="absolute left-1/2 top-1/2 h-[140%] w-[140%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-text-primary"
      style={{
        transform: `translate3d(-50%, -50%, ${z}px)`,
        opacity,
      }}
    />
  );
}
