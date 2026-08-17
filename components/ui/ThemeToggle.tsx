"use client";

import { useSyncExternalStore } from "react";

type Theme = "dark" | "light";

function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

function getSnapshot(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function getServerSnapshot(): Theme {
  return "light";
}

/**
 * Переключатель темы. Состояние — в data-theme на <html>, зеркалируется в localStorage.
 */
export default function ThemeToggle({ label }: { label: string }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* private mode */
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-md text-text-secondary transition-colors duration-150 hover:bg-surface-2 hover:text-text-primary"
    >
      {theme === "light" ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
          <circle cx="8" cy="8" r="3.25" stroke="currentColor" strokeWidth="1.25" />
          <path
            d="M8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1 1M11.6 11.6l1 1M12.6 3.4l-1 1M4.4 11.6l-1 1"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path
            d="M13.5 9.5A5.5 5.5 0 0 1 6.5 2.5a5.5 5.5 0 1 0 7 7Z"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
