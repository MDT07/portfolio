"use client";

import { useScene } from "@/components/providers/SceneProvider";
import { interpolateCamera } from "@/lib/scenes";
import type { Dictionary } from "@/lib/dictionaries/ru";

const experiments = [
  { id: "attractor", label: "Cursor attractor", description: "Particles follow the pointer through a force field." },
  { id: "magnetic", label: "Magnetic button", description: "Buttons pulled toward the cursor within radius." },
  { id: "scramble", label: "Text scramble", description: "Mono labels decode on hover." },
  { id: "distortion", label: "Liquid distortion", description: "Canvas 2D displacement on still surfaces." },
];

export default function ExperimentsScene({ dict }: { dict: Dictionary }) {
  const { scene, localProgress, reducedMotion } = useScene();
  const isActive = scene.id === "lab";

  if (reducedMotion) {
    return (
      <section className="px-6 py-24 md:px-12">
        <div className="mx-auto max-w-6xl">
          <p className="font-mono text-xs uppercase tracking-widest text-text-tertiary">{dict.lab}</p>
          <h2 className="mt-6 font-display text-4xl md:text-6xl">{dict.lab}</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {experiments.map((e) => (
              <div key={e.id} className="border border-surface-3 p-6">
                <h3 className="font-display text-xl">{e.label}</h3>
                <p className="mt-2 text-text-secondary">{e.description}</p>
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
      id="scene-lab"
      className="cinematic-scene"
      aria-label="Experiments"
      style={{ opacity, visibility: isActive ? "visible" : "hidden", pointerEvents: isActive ? "auto" : "none" }}
    >
      <div className="mx-auto w-full max-w-6xl px-6 md:px-12">
        <p className="font-mono text-[11px] uppercase tracking-widest text-text-tertiary">{dict.lab}</p>
        <h2 className="mt-4 font-display text-[clamp(2rem,5vw,4rem)] leading-tight">{dict.lab}</h2>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {experiments.map((e, i) => (
            <article
              key={e.id}
              className="border border-surface-3 bg-surface-1/40 p-8 backdrop-blur-sm transition-colors hover:border-accent/50"
              style={{ transform: `translateZ(${i * 20}px)` }}
              data-cursor="expand"
            >
              <h3 className="font-display text-2xl">{e.label}</h3>
              <p className="mt-3 text-text-secondary">{e.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
