"use client";

import { useRef, useEffect, type ReactNode } from "react";
import { useScene } from "@/components/providers/SceneProvider";
import { interpolateCamera } from "@/lib/scenes";

interface CameraRigProps {
  children: ReactNode;
}

/**
 * Scroll-driven cinematic camera.
 * Applies CSS 3D transforms based on the active scene and local progress.
 * Children live inside a perspective-3d world and should be absolutely positioned scenes.
 */
export default function CameraRig({ children }: CameraRigProps) {
  const { scene, localProgress, reducedMotion, coarsePointer } = useScene();
  const worldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion) return;
    const camera = interpolateCamera(scene, localProgress);
    const world = worldRef.current;
    if (!world) return;

    const dampen = coarsePointer ? 0.35 : 1;
    const x = camera.x;
    const y = camera.y;
    const z = camera.z;
    const rotateX = camera.rotateX * dampen;
    const rotateY = camera.rotateY * dampen;
    const rotateZ = camera.rotateZ * dampen;
    const scale = 1 + (camera.scale - 1) * dampen;

    world.style.transform = `
      translate3d(${x}, ${y}, ${z})
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      rotateZ(${rotateZ}deg)
      scale(${scale})
    `;
    world.style.opacity = String(camera.opacity);
  }, [scene, localProgress, reducedMotion, coarsePointer]);

  return (
    <div
      className="cinematic-camera"
      aria-hidden={reducedMotion}
      style={{ pointerEvents: reducedMotion ? "none" : "auto" }}
    >
      <div
        ref={worldRef}
        className="cinematic-world"
        style={{
          transformStyle: "preserve-3d",
          willChange: reducedMotion ? "auto" : "transform, opacity",
        }}
      >
        {children}
      </div>
    </div>
  );
}
