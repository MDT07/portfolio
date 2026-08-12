import { createNoise2D } from "simplex-noise";
import { clamp, lerp, resizeCanvas, type Size } from "@/lib/canvas";

export interface ParticleFieldOptions {
  count: number;
  connectionDistance: number;
  maxConnections: number;
  color: string;
  accent: string;
  cursorRadius: number;
  cursorForce: number;
  scrollTurbulence: number;
}

interface Particle {
  x: number;
  y: number;
  z: number; // simulated depth 0..1
  vx: number;
  vy: number;
  baseVx: number;
  baseVy: number;
  size: number;
  alpha: number;
  phase: number;
}

export class ParticleField {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private noise = createNoise2D();
  private size: Size = { width: 0, height: 0, dpr: 1 };
  private opts: ParticleFieldOptions;
  private cursor = { x: 0.5, y: 0.5, active: false };
  private velocity = 0;
  private time = 0;
  private destroyed = false;

  constructor(canvas: HTMLCanvasElement, opts: Partial<ParticleFieldOptions> = {}) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not get 2d context");
    this.ctx = ctx;
    this.opts = {
      count: opts.count ?? 120,
      connectionDistance: opts.connectionDistance ?? 120,
      maxConnections: opts.maxConnections ?? 3,
      color: opts.color ?? "rgb(237, 237, 237)",
      accent: opts.accent ?? "rgb(0, 112, 243)",
      cursorRadius: opts.cursorRadius ?? 180,
      cursorForce: opts.cursorForce ?? 0.4,
      scrollTurbulence: opts.scrollTurbulence ?? 0.08,
    };
    this.resize();
    this.spawn();
  }

  resize() {
    this.size = resizeCanvas(this.canvas, { maxDpr: 1.5 });
  }

  setCursor(x: number, y: number, active: boolean) {
    this.cursor = { x: x * this.size.width, y: y * this.size.height, active };
  }

  setVelocity(v: number) {
    this.velocity = v;
  }

  destroy() {
    this.destroyed = true;
  }

  private spawn() {
    this.particles = [];
    for (let i = 0; i < this.opts.count; i++) {
      const z = Math.pow(Math.random(), 2); // more particles near "camera"
      this.particles.push({
        x: Math.random() * this.size.width,
        y: Math.random() * this.size.height,
        z,
        vx: 0,
        vy: 0,
        baseVx: (Math.random() - 0.5) * 0.2,
        baseVy: (Math.random() - 0.5) * 0.2,
        size: lerp(0.8, 2.6, z),
        alpha: lerp(0.4, 0.9, z),
        phase: Math.random() * Math.PI * 2,
      });
    }
  }

  draw() {
    if (this.destroyed) return;
    const { ctx, size, opts } = this;
    ctx.clearRect(0, 0, size.width, size.height);

    this.time += 0.004;
    const turbulence = clamp(Math.abs(this.velocity) * opts.scrollTurbulence, 0, 6);

    for (const p of this.particles) {
      // Flow field influence
      const n = this.noise(p.x * 0.0015 + this.time, p.y * 0.0015 + this.time * 0.7);
      const angle = n * Math.PI * 2;
      const fx = Math.cos(angle) * 0.08 * (1 + turbulence);
      const fy = Math.sin(angle) * 0.08 * (1 + turbulence);

      // Cursor interaction
      let cx = 0;
      let cy = 0;
      if (this.cursor.active) {
        const dx = p.x - this.cursor.x;
        const dy = p.y - this.cursor.y;
        const dist = Math.hypot(dx, dy);
        if (dist < opts.cursorRadius * p.z + 40) {
          const force = (1 - dist / (opts.cursorRadius * p.z + 40)) * opts.cursorForce;
          cx = (dx / (dist || 1)) * force * 3;
          cy = (dy / (dist || 1)) * force * 3;
        }
      }

      // Scroll turbulence push
      const sx = (Math.random() - 0.5) * turbulence * 0.3;
      const sy = (Math.random() - 0.5) * turbulence * 0.3 + this.velocity * 0.005 * p.z;

      p.vx = lerp(p.vx, p.baseVx + fx + cx + sx, 0.06);
      p.vy = lerp(p.vy, p.baseVy + fy + cy + sy, 0.06);

      p.x += p.vx;
      p.y += p.vy;

      // Wrap
      if (p.x < 0) p.x += size.width;
      if (p.x > size.width) p.x -= size.width;
      if (p.y < 0) p.y += size.height;
      if (p.y > size.height) p.y -= size.height;

      // Pulse alpha
      const alpha = p.alpha * (0.85 + 0.15 * Math.sin(this.time * 2 + p.phase));
      ctx.fillStyle = opts.color.replace(")", `, ${alpha})`).replace("rgb", "rgba");
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * size.dpr * 1.25, 0, Math.PI * 2);
      ctx.fill();
    }

    // Proximity lines
    ctx.lineWidth = 0.5 * size.dpr;
    for (let i = 0; i < this.particles.length; i++) {
      const a = this.particles[i];
      let connections = 0;
      for (let j = i + 1; j < this.particles.length; j++) {
        if (connections >= opts.maxConnections) break;
        const b = this.particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        const threshold = opts.connectionDistance * a.z;
        if (dist < threshold) {
          const alpha = (1 - dist / threshold) * 0.28 * a.z;
          ctx.strokeStyle = opts.accent.replace(")", `, ${alpha})`).replace("rgb", "rgba");
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
          connections++;
        }
      }
    }
  }
}
