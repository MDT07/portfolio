"use client";

import { useRef, useState } from "react";

interface GalleryProps {
  images: { src: string; alt?: string }[];
}

/**
 * Горизонтальная галерея скриншотов: scroll-snap + моношный счётчик.
 * Стрелки листают по одному кадру.
 */
export default function Gallery({ images }: GalleryProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const scrollTo = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(images.length - 1, i));
    track.scrollTo({ left: clamped * track.clientWidth, behavior: "smooth" });
    setIndex(clamped);
  };

  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    setIndex(Math.round(track.scrollLeft / track.clientWidth));
  };

  if (images.length === 0) return null;

  return (
    <div className="my-8">
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="flex snap-x snap-mandatory overflow-x-auto rounded-lg border border-surface-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {images.map((image, i) => (
          <div key={image.src} className="w-full shrink-0 snap-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.src}
              alt={image.alt ?? `Screenshot ${i + 1}`}
              className="aspect-[16/9] w-full object-cover"
              loading="lazy"
              draggable={false}
            />
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <p className="font-mono text-xs text-text-tertiary">
          {String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => scrollTo(index - 1)}
            disabled={index === 0}
            aria-label="Previous"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-surface-3 text-text-secondary transition-colors hover:text-text-primary disabled:opacity-30"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => scrollTo(index + 1)}
            disabled={index === images.length - 1}
            aria-label="Next"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-surface-3 text-text-secondary transition-colors hover:text-text-primary disabled:opacity-30"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
