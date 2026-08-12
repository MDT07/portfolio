"use client";

import { useScene } from "@/components/providers/SceneProvider";
import { interpolateCamera } from "@/lib/scenes";
import type { Dictionary } from "@/lib/dictionaries/ru";
import type { Locale } from "@/lib/i18n";
import Image from "next/image";

interface WorkPreview {
  slug: string;
  title: string;
  year: string;
  tags: string[];
  cover: string;
  role: string;
  featured?: boolean;
}

interface SpatialWorksSceneProps {
  dict: Dictionary;
  lang?: Locale;
  works: WorkPreview[];
}

export default function SpatialWorksScene({ dict, lang = "ru", works }: SpatialWorksSceneProps) {
  const { scene, localProgress, reducedMotion } = useScene();
  const isActive = scene.id === "works";
  const featuredWorks = works.filter((w) => w.featured !== false).slice(0, 6);

  if (reducedMotion) {
    return (
      <section className="px-6 py-24 md:px-12">
        <div className="mx-auto max-w-6xl">
          <p className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
            {dict.works.label}
          </p>
          <h2 className="mt-6 font-display text-4xl md:text-6xl">{dict.works.title}</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredWorks.map((w) => (
              <a
                key={w.slug}
                href={`/${lang === "ru" ? "" : lang + "/"}works/${w.slug}`}
                className="group block overflow-hidden border border-surface-3 bg-surface-1"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={w.cover}
                    alt={w.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-5">
                  <span className="font-mono text-xs text-accent">{w.year}</span>
                  <h3 className="mt-1 font-display text-xl">{w.title}</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {w.tags.map((tag) => (
                      <span key={tag} className="font-mono text-[10px] uppercase text-text-tertiary">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </a>
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
      id="scene-works"
      className="cinematic-scene"
      aria-label={dict.works.title}
      style={{ opacity, pointerEvents: isActive ? "auto" : "none" }}
    >
      <div className="mx-auto w-full max-w-7xl px-6 md:px-12">
        <div className="mb-12">
          <p className="font-mono text-[11px] uppercase tracking-widest text-text-tertiary">
            {dict.works.label}
          </p>
          <h2 className="mt-4 font-display text-[clamp(2rem,5vw,4rem)] leading-tight">
            {dict.works.title}
          </h2>
        </div>

        <div
          className="flex gap-6 overflow-x-auto pb-8"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {featuredWorks.map((w, i) => (
            <a
              key={w.slug}
              href={`/${lang === "ru" ? "" : lang + "/"}works/${w.slug}`}
              className="group relative shrink-0 scroll-snap-align-start"
              style={{
                width: "min(72vw, 560px)",
                transform: `translateZ(${-i * 40}px) rotateY(${i % 2 === 0 ? -2 : 2}deg)`,
              }}
              data-cursor="expand"
            >
              <div className="relative aspect-[16/10] overflow-hidden border border-surface-3">
                <Image
                  src={w.cover}
                  alt={w.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 80vw, 560px"
                />
              </div>
              <div className="mt-4">
                <span className="font-mono text-xs text-accent">{w.year}</span>
                <h3 className="mt-1 font-display text-2xl">{w.title}</h3>
                <p className="mt-1 text-sm text-text-secondary">{w.role}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
