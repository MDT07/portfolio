/** Shared Canvas 2D helpers for the cinematic layer. */

export interface Size {
  width: number;
  height: number;
  dpr: number;
}

/** Resize a canvas to its display size multiplied by a capped DPR. */
export function resizeCanvas(
  canvas: HTMLCanvasElement,
  options?: { maxDpr?: number; fitParent?: boolean },
): Size {
  const { maxDpr = 1.5, fitParent = false } = options ?? {};
  const parent = fitParent ? canvas.parentElement : null;
  const cssWidth = parent ? parent.clientWidth : window.innerWidth;
  const cssHeight = parent ? parent.clientHeight : window.innerHeight;
  const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
  const width = Math.floor(cssWidth * dpr);
  const height = Math.floor(cssHeight * dpr);

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  return { width, height, dpr };
}

/** Clamp a value between min and max. */
export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

/** Linear interpolation. */
export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/** Smooth step (Hermite) between edge0 and edge1. */
export function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

/** Returns true when the page should run heavy canvas effects. */
export function isHighPowerDevice() {
  if (typeof window === "undefined") return false;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lowCores = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  return !reduced && !lowCores && !coarse;
}

/** Draw a glow ring using radial gradients (Canvas 2D "bloom"). */
export function drawGlow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string,
  alpha = 0.15,
) {
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, color.replace(")", `, ${alpha})`).replace("rgb", "rgba"));
  gradient.addColorStop(1, color.replace(")", ", 0)").replace("rgb", "rgba"));
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

/** Hex / rgb string to rgb tuple for blending. */
export function parseColor(input: string): { r: number; g: number; b: number } {
  const hex = input.trim();
  if (hex.startsWith("#")) {
    const full = hex.length === 4 ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}` : hex;
    return {
      r: parseInt(full.slice(1, 3), 16),
      g: parseInt(full.slice(3, 5), 16),
      b: parseInt(full.slice(5, 7), 16),
    };
  }
  const match = hex.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (match) {
    return { r: +match[1], g: +match[2], b: +match[3] };
  }
  return { r: 237, g: 237, b: 237 }; // text-primary fallback
}

/** Format a CSS color string from parsed rgb values. */
export function toRgb({ r, g, b }: { r: number; g: number; b: number }, alpha?: number) {
  if (alpha !== undefined) return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${alpha})`;
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}
