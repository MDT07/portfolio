import { clamp, resizeCanvas } from "@/lib/canvas";

interface Ripple {
  x: number;
  y: number;
  radius: number;
  strength: number;
  age: number;
  life: number;
}

export class LiquidDistortion {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private ripples: Ripple[] = [];
  private destroyed = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not get 2d context");
    this.ctx = ctx;
    this.resize();
  }

  resize() {
    resizeCanvas(this.canvas, { maxDpr: 1.5, fitParent: true });
  }

  addRipple(x: number, y: number, strength = 1, radius = 120) {
    this.ripples.push({
      x: x * this.canvas.width,
      y: y * this.canvas.height,
      radius,
      strength,
      age: 0,
      life: 60,
    });
  }

  destroy() {
    this.destroyed = true;
  }

  draw(sourceImage?: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | null) {
    if (this.destroyed) return;
    const { ctx, canvas } = this;
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Remove dead ripples
    this.ripples = this.ripples.filter((r) => {
      r.age++;
      return r.age < r.life;
    });

    if (this.ripples.length === 0) return;

    // Draw source with displacement rings visualized as subtle color rings.
    // Full displacement sampling would require getImageData per frame; this is
    // a lightweight GPU-friendly approximation using radial gradients.
    if (sourceImage) {
      ctx.save();
      ctx.globalAlpha = 0.85;
      ctx.drawImage(sourceImage, 0, 0, w, h);
      ctx.restore();
    }

    for (const r of this.ripples) {
      const progress = r.age / r.life;
      const radius = r.radius * (0.2 + 0.8 * progress);
      const strength = r.strength * (1 - progress);
      const alpha = clamp(strength * 0.25, 0, 0.35);

      const gradient = ctx.createRadialGradient(r.x, r.y, radius * 0.3, r.x, r.y, radius);
      gradient.addColorStop(0, `rgba(0, 112, 243, 0)`);
      gradient.addColorStop(0.5, `rgba(0, 112, 243, ${alpha})`);
      gradient.addColorStop(1, `rgba(0, 112, 243, 0)`);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(r.x, r.y, radius, 0, Math.PI * 2);
      ctx.fill();

      // Inner highlight ring
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.6})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(r.x, r.y, radius * 0.6, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}
