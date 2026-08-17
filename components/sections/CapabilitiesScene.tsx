"use client";

import { useScene } from "@/components/providers/SceneProvider";
import { interpolateCamera } from "@/lib/scenes";
import type { Dictionary } from "@/lib/dictionaries/ru";

export default function CapabilitiesScene({ dict }: { dict: Dictionary }) {
  const { scene, localProgress, reducedMotion } = useScene();
  const isActive = scene.id === "capabilities";

  if (reducedMotion) {
    return (
      <section className="px-6 py-24 md:px-12">
        <div className="mx-auto max-w-6xl">
          <p className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
            {dict.manifesto.label}
          </p>
          <h2 className="mt-6 font-display text-4xl md:text-6xl">{dict.manifesto.title}</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {dict.manifesto.principles.map((p) => (
              <div key={p.number} className="border-t border-surface-3 pt-6">
                <span className="font-mono text-sm text-accent">{p.number}</span>
                <h3 className="mt-3 font-display text-2xl">{p.title}</h3>
                <p className="mt-3 text-text-secondary">{p.description}</p>
              </div>
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
      id="scene-capabilities"
      className="cinematic-scene"
      aria-label={dict.manifesto.title}
      style={{ opacity, visibility: isActive ? "visible" : "hidden", pointerEvents: isActive ? "auto" : "none" }}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col px-6 md:px-12">
        <div className="mb-16">
          <p className="font-mono text-[11px] uppercase tracking-widest text-text-tertiary">
            {dict.manifesto.label}
          </p>
          <h2 className="mt-4 font-display text-[clamp(2rem,5vw,4rem)] leading-tight">
            {dict.manifesto.title}
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {dict.manifesto.principles.map((p, i) => (
            <article
              key={p.number}
              className="relative border-l-2 border-surface-3 bg-surface-1/40 p-8 backdrop-blur-sm"
              style={{ transform: `translateZ(${i * 30}px)` }}
            >
              <span className="font-mono text-sm text-accent">{p.number}</span>
              <h3 className="mt-3 font-display text-2xl md:text-3xl">{p.title}</h3>
              <p className="mt-4 text-text-secondary">{p.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
