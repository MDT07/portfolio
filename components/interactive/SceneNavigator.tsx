"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";

const scenes = {
  ru: [
    ["signal", "Сигнал"],
    ["identity", "Автор"],
    ["systems", "Системы"],
    ["work", "Работы"],
    ["intelligence", "AI"],
    ["protocol", "Метод"],
    ["contact", "Контакт"],
  ],
  en: [
    ["signal", "Signal"],
    ["identity", "Identity"],
    ["systems", "Systems"],
    ["work", "Work"],
    ["intelligence", "AI"],
    ["protocol", "Method"],
    ["contact", "Contact"],
  ],
} as const;

export default function SceneNavigator({ lang }: { lang: Locale }) {
  const items = scenes[lang];
  const [active, setActive] = useState("signal");

  useEffect(() => {
    const elements = items
      .map(([id]) => document.getElementById(id))
      .filter((item): item is HTMLElement => Boolean(item));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-18% 0px -56%", threshold: [0.08, 0.25, 0.5] }
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [items]);

  const activeIndex = Math.max(0, items.findIndex(([id]) => id === active));

  return (
    <nav className="scene-index" aria-label={lang === "ru" ? "Главы страницы" : "Page chapters"}>
      <div className="scene-index__progress" aria-hidden>
        <i style={{ transform: `scaleY(${(activeIndex + 1) / items.length})` }} />
      </div>
      <ol>
        {items.map(([id, label], index) => (
          <li key={id}>
            <a href={`#${id}`} aria-current={active === id ? "location" : undefined}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{label}</strong>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
