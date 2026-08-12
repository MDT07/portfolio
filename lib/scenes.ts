export interface CameraKeyframe {
  /** Scroll progress within the scene (0–1) */
  progress: number;
  /** CSS transform values */
  x?: string;
  y?: string;
  z?: string;
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  scale?: number;
  opacity?: number;
}

export interface Scene {
  id: string;
  index: number;
  /** Scroll range on the global page (0–1) */
  start: number;
  end: number;
  /** Whether the section is pinned during its active range */
  pinned: boolean;
  /** Optional extra scroll distance when pinned (in vh) */
  pinDistance?: number;
  /** Camera path local to the scene */
  camera: CameraKeyframe[];
  /** i18n key for labels */
  labelKey: string;
}

/** Total cinematic scroll length expressed as a multiplier of viewport height. */
export const CINEMATIC_SCROLL_VH = 1400;

/** Scene metadata used by the camera rig and scene navigation. */
export function getScenes(): Scene[] {
  return [
    {
      id: "portal",
      index: 0,
      start: 0,
      end: 0.05,
      pinned: true,
      pinDistance: 100,
      camera: [
        { progress: 0, scale: 1, opacity: 1 },
        { progress: 1, scale: 1.05, opacity: 0 },
      ],
      labelKey: "nav.about",
    },
    {
      id: "hero",
      index: 1,
      start: 0.05,
      end: 0.25,
      pinned: true,
      pinDistance: 300,
      camera: [
        { progress: 0, scale: 4, rotateX: 4, rotateY: -6, x: "18vw", y: "12vh" },
        { progress: 0.35, scale: 1.6, rotateX: 2, rotateY: -2, x: "6vw", y: "4vh" },
        { progress: 1, scale: 1, rotateX: 0, rotateY: 0, x: "0", y: "0" },
      ],
      labelKey: "nav.about",
    },
    {
      id: "capabilities",
      index: 2,
      start: 0.25,
      end: 0.45,
      pinned: true,
      pinDistance: 300,
      camera: [
        { progress: 0, x: "0", y: "0", rotateY: 0 },
        { progress: 0.5, x: "-25vw", y: "0", rotateY: 6 },
        { progress: 1, x: "-50vw", y: "0", rotateY: 0 },
      ],
      labelKey: "manifesto.label",
    },
    {
      id: "works",
      index: 3,
      start: 0.45,
      end: 0.65,
      pinned: true,
      pinDistance: 400,
      camera: [
        { progress: 0, z: "0", x: "0", rotateY: 0 },
        { progress: 0.5, z: "-30vh", x: "-30vw", rotateY: -8 },
        { progress: 1, z: "-60vh", x: "-60vw", rotateY: 0 },
      ],
      labelKey: "works.label",
    },
    {
      id: "lab",
      index: 4,
      start: 0.65,
      end: 0.8,
      pinned: true,
      pinDistance: 250,
      camera: [
        { progress: 0, scale: 0.9, rotateX: 4, rotateY: -10 },
        { progress: 0.5, scale: 1, rotateX: 0, rotateY: 0 },
        { progress: 1, scale: 1.05, rotateX: -2, rotateY: 10 },
      ],
      labelKey: "nav.about",
    },
    {
      id: "tech",
      index: 5,
      start: 0.8,
      end: 0.9,
      pinned: true,
      pinDistance: 200,
      camera: [
        { progress: 0, y: "-40vh", rotateX: 12 },
        { progress: 0.5, y: "0", rotateX: 0 },
        { progress: 1, y: "30vh", rotateX: -8 },
      ],
      labelKey: "nav.about",
    },
    {
      id: "contact",
      index: 6,
      start: 0.9,
      end: 1,
      pinned: false,
      camera: [
        { progress: 0, scale: 1.05, opacity: 0 },
        { progress: 0.25, scale: 1, opacity: 1 },
        { progress: 1, scale: 1, opacity: 1 },
      ],
      labelKey: "cta.title",
    },
  ];
}

/** Returns the active scene and local progress for a given global scroll progress. */
export function getSceneState(scenes: Scene[], globalProgress: number) {
  const clamped = Math.max(0, Math.min(1, globalProgress));
  const scene =
    scenes.find((s) => clamped >= s.start && clamped < s.end) ??
    scenes[scenes.length - 1];
  const localProgress =
    (clamped - scene.start) / Math.max(1e-6, scene.end - scene.start);
  return { scene, localProgress: Math.max(0, Math.min(1, localProgress)) };
}

/** Interpolates between camera keyframes for a scene. */
export function interpolateCamera(
  scene: Scene,
  localProgress: number,
): Required<Omit<CameraKeyframe, "progress">> {
  const keys = scene.camera;
  if (keys.length === 0) {
    return {
      x: "0",
      y: "0",
      z: "0",
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      scale: 1,
      opacity: 1,
    };
  }
  if (keys.length === 1 || localProgress <= keys[0].progress) {
    return { ...defaultKeyframe(), ...keys[0] };
  }
  if (localProgress >= keys[keys.length - 1].progress) {
    return { ...defaultKeyframe(), ...keys[keys.length - 1] };
  }

  let from = keys[0];
  let to = keys[keys.length - 1];
  for (let i = 0; i < keys.length - 1; i++) {
    if (localProgress >= keys[i].progress && localProgress <= keys[i + 1].progress) {
      from = keys[i];
      to = keys[i + 1];
      break;
    }
  }

  const span = to.progress - from.progress;
  const t = span > 0 ? (localProgress - from.progress) / span : 0;
  const eased = easeInOutCubic(t);

  return {
    x: lerpString(from.x ?? "0", to.x ?? "0", eased),
    y: lerpString(from.y ?? "0", to.y ?? "0", eased),
    z: lerpString(from.z ?? "0", to.z ?? "0", eased),
    rotateX: lerpNumber(from.rotateX ?? 0, to.rotateX ?? 0, eased),
    rotateY: lerpNumber(from.rotateY ?? 0, to.rotateY ?? 0, eased),
    rotateZ: lerpNumber(from.rotateZ ?? 0, to.rotateZ ?? 0, eased),
    scale: lerpNumber(from.scale ?? 1, to.scale ?? 1, eased),
    opacity: lerpNumber(from.opacity ?? 1, to.opacity ?? 1, eased),
  };
}

function defaultKeyframe(): Required<Omit<CameraKeyframe, "progress">> {
  return {
    x: "0",
    y: "0",
    z: "0",
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    scale: 1,
    opacity: 1,
  };
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function lerpNumber(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/** Linearly interpolate CSS length strings that contain vw/vh/px/% units. */
function lerpString(a: string, b: string, t: number): string {
  const parsedA = parseCssLength(a);
  const parsedB = parseCssLength(b);
  if (parsedA.unit !== parsedB.unit) {
    // Fallback: switch to the target value mid-way.
    return t < 0.5 ? a : b;
  }
  const value = parsedA.value + (parsedB.value - parsedA.value) * t;
  return `${Number.isInteger(value) ? value : value.toFixed(2)}${parsedA.unit}`;
}

function parseCssLength(value: string): { value: number; unit: string } {
  const match = value.trim().match(/^(-?\d+(?:\.\d+)?)(.*)$/);
  if (!match) return { value: 0, unit: "px" };
  return { value: parseFloat(match[1]), unit: match[2] || "px" };
}
