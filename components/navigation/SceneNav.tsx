"use client";

import { useScene } from "@/components/providers/SceneProvider";

export default function SceneNav() {
  const { scenes, scene, goToScene, reducedMotion } = useScene();
  if (reducedMotion) return null;

  return (
    <nav
      aria-label="Scene navigation"
      className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-surface-3 bg-surface-0/80 px-3 py-2 backdrop-blur-md"
    >
      {scenes.map((s, i) => (
        <button
          key={s.id}
          onClick={() => goToScene(i)}
          className={`flex h-6 w-6 items-center justify-center rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent`}
          aria-label={`Go to scene ${i + 1}`}
          aria-current={s.id === scene.id ? "true" : undefined}
        >
          <span
            className={`block rounded-full transition-all duration-300 ${
              s.id === scene.id ? "h-2.5 w-6 bg-accent" : "h-2 w-2 bg-text-tertiary/60 hover:bg-text-secondary"
            }`}
          />
        </button>
      ))}
    </nav>
  );
}
