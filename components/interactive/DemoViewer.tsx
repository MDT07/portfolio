"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EASE } from "@/lib/animations";

interface DemoViewerProps {
  src: string;
  title: string;
  openLabel: string;
  closeLabel?: string;
}

/**
 * Полноэкранный просмотр живого демо (iframe).
 * Кнопка → overlay на весь экран, Esc/крестик закрывают.
 * Переключатель desktop/mobile показывает адаптивность шаблона.
 */
export default function DemoViewer({
  src,
  title,
  openLabel,
  closeLabel = "Esc",
}: DemoViewerProps) {
  const [open, setOpen] = useState(false);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open, close]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-12 items-center justify-center rounded-md bg-accent px-6 text-sm font-medium text-white transition-colors duration-150 hover:bg-accent-hover"
      >
        {openLabel} ↗
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex flex-col bg-surface-0"
            role="dialog"
            aria-modal="true"
            aria-label={title}
          >
            {/* Тулбар */}
            <div className="flex h-14 shrink-0 items-center justify-between border-b border-surface-3 px-4 md:px-6">
              <p className="truncate font-mono text-xs text-text-secondary">
                {title}
                <span className="ml-3 text-text-tertiary">{src}</span>
              </p>
              <div className="flex items-center gap-2">
                <div className="hidden items-center rounded-md border border-surface-3 font-mono text-xs sm:flex">
                  {(["desktop", "mobile"] as const).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDevice(d)}
                      className={`px-2.5 py-1.5 uppercase transition-colors ${
                        device === d
                          ? "text-text-primary"
                          : "text-text-tertiary hover:text-text-primary"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
                <a
                  href={src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md border border-surface-3 px-3 py-1.5 font-mono text-xs text-text-secondary transition-colors hover:text-text-primary"
                >
                  ↗
                </a>
                <button
                  type="button"
                  onClick={close}
                  className="rounded-md border border-surface-3 px-3 py-1.5 font-mono text-xs text-text-secondary transition-colors hover:text-text-primary"
                >
                  ✕ {closeLabel}
                </button>
              </div>
            </div>

            {/* iframe */}
            <motion.div
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="flex flex-1 justify-center overflow-hidden bg-surface-1 p-0 md:p-6"
            >
              <iframe
                src={src}
                title={title}
                className={`h-full bg-white transition-[width] duration-300 ${
                  device === "mobile"
                    ? "w-[390px] rounded-lg border border-surface-3"
                    : "w-full md:rounded-lg md:border md:border-surface-3"
                }`}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
