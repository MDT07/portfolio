"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode, RefObject } from "react";
import { getScenes, getSceneState, type Scene } from "@/lib/scenes";
import { useReducedMotion, useCoarsePointer, useLowPower } from "@/lib/hooks";

interface SceneContextValue {
  /** Global scroll progress through the cinematic layer (0–1) */
  globalProgress: number;
  /** Current active scene */
  scene: Scene;
  /** Progress within the current scene (0–1) */
  localProgress: number;
  /** Instantaneous scroll velocity in px/frame */
  velocity: number;
  /** Whether the user prefers reduced motion */
  reducedMotion: boolean;
  /** Whether the cinematic layer is active (false = static fallback) */
  cinematic: boolean;
  /** Normalized cursor position relative to viewport (0–1) */
  cursor: { x: number; y: number };
  /** Whether the primary pointer is coarse (touch) */
  coarsePointer: boolean;
  /** Whether the device is considered low-power */
  lowPower: boolean;
  /** Whether sound is enabled */
  sound: boolean;
  /** Toggle sound on/off */
  setSound: (enabled: boolean) => void;
  /** Jump to a scene by index */
  goToScene: (index: number) => void;
  /** All scene metadata */
  scenes: Scene[];
  /** Physical scroll container for the cinematic page */
  scrollContainerRef: RefObject<HTMLDivElement | null>;
}

const SceneContext = createContext<SceneContextValue | null>(null);

interface SceneProviderProps {
  children: ReactNode;
}

export function SceneProvider({ children }: SceneProviderProps) {
  const scenes = useMemo(() => getScenes(), []);
  const [globalProgress, setGlobalProgress] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [cursor, setCursor] = useState({ x: 0.5, y: 0.5 });
  const [sound, setSound] = useState(false);
  const reducedMotion = useReducedMotion();
  const coarsePointer = useCoarsePointer();
  const lowPower = useLowPower();
  const cinematic = !reducedMotion;

  const lastScrollRef = useRef(0);
  const lastTimeRef = useRef(0);
  const rafRef = useRef(0);
  const velocityRef = useRef(0);
  const progressRef = useRef(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cinematic) return;

    const onPointerMove = (e: PointerEvent) => {
      setCursor({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    const loop = () => {
      const now = performance.now();
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.05) || 1 / 60;
      lastTimeRef.current = now;

      const currentScroll = window.scrollY;
      const targetVelocity = (currentScroll - lastScrollRef.current) / dt;
      const nextVelocity = velocityRef.current + (targetVelocity - velocityRef.current) * 0.08;
      velocityRef.current = Math.abs(nextVelocity) < 0.01 ? 0 : nextVelocity;
      setVelocity(velocityRef.current);
      lastScrollRef.current = currentScroll;

      const container = scrollContainerRef.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        const scrollDistance = Math.max(1, rect.height - window.innerHeight);
        const progress = Math.max(0, Math.min(1, -rect.top / scrollDistance));
        if (Math.abs(progress - progressRef.current) > 0.0001) {
          progressRef.current = progress;
          setGlobalProgress(progress);
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    lastScrollRef.current = window.scrollY;
    lastTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [cinematic]);

  const { scene, localProgress } = useMemo(
    () => getSceneState(scenes, globalProgress),
    [scenes, globalProgress],
  );

  const goToScene = (index: number) => {
    const target = scenes[index];
    const container = scrollContainerRef.current;
    if (!target || !container) return;
    const rect = container.getBoundingClientRect();
    const containerTop = window.scrollY + rect.top;
    const scrollDistance = Math.max(1, rect.height - window.innerHeight);
    const targetScroll = containerTop + target.start * scrollDistance;
    window.scrollTo({ top: targetScroll, behavior: reducedMotion ? "auto" : "smooth" });
  };

  const value: SceneContextValue = {
    globalProgress,
    scene,
    localProgress,
    velocity,
    reducedMotion,
    cinematic,
    cursor,
    coarsePointer,
    lowPower,
    sound,
    setSound,
    goToScene,
    scenes,
    scrollContainerRef,
  };

  return (
    <SceneContext.Provider value={value}>{children}</SceneContext.Provider>
  );
}

export function useScene() {
  const ctx = useContext(SceneContext);
  if (!ctx) {
    throw new Error("useScene must be used within SceneProvider");
  }
  return ctx;
}
