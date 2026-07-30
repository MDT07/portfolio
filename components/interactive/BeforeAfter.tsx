"use client";

import { useCallback, useRef, useState } from "react";

interface BeforeAfterProps {
  before: string;
  after: string;
  beforeLabel?: string;
  afterLabel?: string;
  alt?: string;
}

/**
 * Слайдер «до/после»: перетаскивание разделителя — pointer events,
 * верхний слой обрезается clip-path. Работает мышью и тачем.
 */
export default function BeforeAfter({
  before,
  after,
  beforeLabel = "Before",
  afterLabel = "After",
  alt = "",
}: BeforeAfterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(96, Math.max(4, x)));
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    setDragging(true);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    updateFromClientX(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (dragging) updateFromClientX(e.clientX);
  };

  const stop = () => setDragging(false);

  return (
    <div
      ref={containerRef}
      role="slider"
      aria-valuenow={Math.round(pos)}
      aria-valuemin={0}
      aria-valuemax={100}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") setPos((p) => Math.max(4, p - 4));
        if (e.key === "ArrowRight") setPos((p) => Math.min(96, p + 4));
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stop}
      onPointerCancel={stop}
      className="relative aspect-[16/9] w-full cursor-ew-resize select-none overflow-hidden rounded-lg border border-surface-3 bg-surface-1 touch-none"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={after}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={before}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />
      </div>

      {/* Разделитель */}
      <div
        className="absolute inset-y-0 w-px bg-text-primary/70"
        style={{ left: `${pos}%` }}
      >
        <span className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-surface-3 bg-surface-0/90 font-mono text-[10px] text-text-primary backdrop-blur">
          ⇔
        </span>
      </div>

      {/* Метки */}
      <span className="absolute left-3 top-3 rounded border border-surface-3 bg-surface-0/80 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-text-secondary backdrop-blur">
        {beforeLabel}
      </span>
      <span className="absolute right-3 top-3 rounded border border-surface-3 bg-surface-0/80 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-text-secondary backdrop-blur">
        {afterLabel}
      </span>
    </div>
  );
}
