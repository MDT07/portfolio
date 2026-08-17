"use client";

import { useScene } from "@/components/providers/SceneProvider";
import { interpolateCamera } from "@/lib/scenes";
import type { Dictionary } from "@/lib/dictionaries/ru";
import TextScramble from "@/components/ui/TextScramble";

const stack = [
  { name: "Next.js", group: "Framework" },
  { name: "React", group: "Framework" },
  { name: "TypeScript", group: "Language" },
  { name: "Tailwind CSS", group: "Style" },
  { name: "Framer Motion", group: "Motion" },
  { name: "GSAP", group: "Motion" },
  { name: "Canvas 2D", group: "Graphics" },
  { name: "Lenis", group: "Scroll" },
  { name: "MDX", group: "Content" },
  { name: "Sentry", group: "Ops" },
];

export default function TechScene({ dict }: { dict: Dictionary }) {
  const { scene, localProgress, reducedMotion } = useScene();
  const isActive = scene.id === "tech";

  if (reducedMotion) {
    return (
      <section className="px-6 py-24 md:px-12">
        <div className="mx-auto max-w-6xl">
          <p className="font-mono text-xs uppercase tracking-widest text-text-tertiary">{dict.tech}</p>
          <h2 className="mt-6 font-display text-4xl md:text-6xl">{dict.tech}</h2>
          <div className="mt-12 flex flex-wrap gap-3">
            {stack.map((s) => (
              <span
                key={s.name}
                className="rounded-full border border-surface-3 px-4 py-2 font-mono text-sm"
              >
                {s.name}
              </span>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const camera = isActive ? interpolateCamera(scene, localProgress) : null;
  const opacity = isActive ? camera?.opacity ?? 1 : 0;

  return (
    <section
      id="scene-tech"
      className="cinematic-scene"
      aria-label="Technology stack"
      style={{ opacity, visibility: isActive ? "visible" : "hidden", pointerEvents: isActive ? "auto" : "none" }}
    >
      <div className="mx-auto w-full max-w-6xl px-6 md:px-12">
        <p className="font-mono text-[11px] uppercase tracking-widest text-text-tertiary">{dict.tech}</p>
        <h2 className="mt-4 font-display text-[clamp(2rem,5vw,4rem)] leading-tight">{dict.tech}</h2>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stack.map((s, i) => (
            <div
              key={s.name}
              className="flex items-center justify-between border-b border-surface-3 py-4"
              style={{ transform: `translateZ(${(i % 3) * 30}px)` }}
            >
              <span className="font-display text-2xl">
                <TextScramble text={s.name} />
              </span>
              <span className="font-mono text-xs text-text-tertiary">{s.group}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
