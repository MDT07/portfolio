"use client";

import { useScene } from "@/components/providers/SceneProvider";
import { interpolateCamera } from "@/lib/scenes";
import type { Dictionary } from "@/lib/dictionaries/ru";
import { siteConfig } from "@/lib/config";
import MagneticButton from "@/components/ui/MagneticButton";

export default function ContactScene({ dict }: { dict: Dictionary }) {
  const { scene, localProgress, reducedMotion } = useScene();
  const isActive = scene.id === "contact";

  if (reducedMotion) {
    return (
      <section className="px-6 py-24 md:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-display text-4xl md:text-6xl">{dict.cta.title}</h2>
          <p className="mx-auto mt-6 max-w-xl text-text-secondary">{dict.cta.subtitle}</p>
          <a
            href={`mailto:${siteConfig.email}`}
            className="mt-8 inline-flex items-center rounded-full bg-accent px-8 py-4 font-mono text-base font-medium text-white transition-colors hover:bg-accent-hover"
          >
            {dict.cta.button}
          </a>
        </div>
      </section>
    );
  }

  const camera = isActive ? interpolateCamera(scene, localProgress) : null;
  const opacity = isActive ? camera?.opacity ?? 1 : 0;

  return (
    <section
      id="scene-contact"
      className="cinematic-scene"
      aria-label={dict.cta.title}
      style={{ opacity, pointerEvents: isActive ? "auto" : "none" }}
    >
      <div className="mx-auto w-full max-w-4xl px-6 text-center md:px-12">
        <h2 className="font-display text-[clamp(2.5rem,7vw,6rem)] leading-tight">
          {dict.cta.title}
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-text-secondary">
          {dict.cta.subtitle}
        </p>
        <MagneticButton>
          <a
            href={`mailto:${siteConfig.email}`}
            className="inline-flex items-center rounded-full bg-accent px-8 py-4 font-mono text-base font-medium text-white transition-colors hover:bg-accent-hover"
            data-cursor="expand"
          >
            {dict.cta.button}
          </a>
        </MagneticButton>

        <footer className="absolute bottom-0 left-0 right-0 border-t border-surface-3 bg-surface-0/80 px-6 py-8 backdrop-blur-md md:px-12">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-center md:text-left">
              <p className="font-mono text-sm font-medium">{siteConfig.name}</p>
              <p className="mt-1 text-sm text-text-secondary">{dict.footer.tagline}</p>
            </div>
            <div className="flex items-center gap-6">
              <a href={siteConfig.githubUrl} className="font-mono text-xs uppercase tracking-wider text-text-secondary hover:text-text-primary">
                GitHub
              </a>
              <a href={siteConfig.telegramUrl} className="font-mono text-xs uppercase tracking-wider text-text-secondary hover:text-text-primary">
                Telegram
              </a>
              <a href={siteConfig.linkedinUrl} className="font-mono text-xs uppercase tracking-wider text-text-secondary hover:text-text-primary">
                LinkedIn
              </a>
              <a href={`mailto:${siteConfig.email}`} className="font-mono text-xs uppercase tracking-wider text-text-secondary hover:text-text-primary">
                Email
              </a>
            </div>
            <p className="font-mono text-xs text-text-tertiary">
              © {new Date().getFullYear()} {siteConfig.name} — {dict.footer.rights}
            </p>
          </div>
        </footer>

        <div className="pointer-events-none absolute inset-0 -z-10 flex items-end justify-center overflow-hidden">
          <span className="select-none font-display text-[20vw] leading-none text-surface-2">
            {siteConfig.name}
          </span>
        </div>
      </div>
    </section>
  );
}
