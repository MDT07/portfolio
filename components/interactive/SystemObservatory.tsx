"use client";

import { useId, useState, type PointerEvent } from "react";
import type { Locale } from "@/lib/i18n";

const nodes = {
  ru: [
    { key: "ux", label: "UX / UI", detail: "Сценарий, структура и визуальная система", x: 18, y: 22 },
    { key: "web", label: "NEXT.JS", detail: "Компонентный web-интерфейс и состояние", x: 46, y: 14 },
    { key: "api", label: "API", detail: "Интеграции, webhooks и внешние действия", x: 78, y: 24 },
    { key: "data", label: "DATA", detail: "Модели данных, контекст и PostgreSQL", x: 83, y: 66 },
    { key: "ai", label: "AI / RAG", detail: "Retrieval, агенты и структурированный ответ", x: 52, y: 78 },
    { key: "quality", label: "QA", detail: "Проверка сценариев, доступности и скорости", x: 20, y: 70 },
    { key: "ship", label: "SHIP", detail: "Production-сборка, Git и Vercel", x: 49, y: 47 },
  ],
  en: [
    { key: "ux", label: "UX / UI", detail: "Flow, structure and visual system", x: 18, y: 22 },
    { key: "web", label: "NEXT.JS", detail: "Component web interface and state", x: 46, y: 14 },
    { key: "api", label: "API", detail: "Integrations, webhooks and external actions", x: 78, y: 24 },
    { key: "data", label: "DATA", detail: "Data models, context and PostgreSQL", x: 83, y: 66 },
    { key: "ai", label: "AI / RAG", detail: "Retrieval, agents and structured output", x: 52, y: 78 },
    { key: "quality", label: "QA", detail: "Flow, accessibility and performance checks", x: 20, y: 70 },
    { key: "ship", label: "SHIP", detail: "Production build, Git and Vercel", x: 49, y: 47 },
  ],
} as const;

const edges = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [0, 6], [1, 6], [2, 6], [3, 6], [4, 6], [5, 6]] as const;

export default function SystemObservatory({ lang }: { lang: Locale }) {
  const items = nodes[lang];
  const [active, setActive] = useState(6);
  const titleId = useId();
  const activeNode = items[active];

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    event.currentTarget.style.setProperty("--signal-x", `${x * 7}px`);
    event.currentTarget.style.setProperty("--signal-y", `${y * 7}px`);
  }

  function resetPointer(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.style.setProperty("--signal-x", "0px");
    event.currentTarget.style.setProperty("--signal-y", "0px");
  }

  return (
    <div
      className="signal-observatory"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
      aria-labelledby={titleId}
    >
      <header className="signal-observatory__header">
        <div>
          <span className="signal-observatory__pulse" aria-hidden />
          <span id={titleId}>{lang === "ru" ? "Карта продукта" : "Product map"}</span>
        </div>
        <span>{lang === "ru" ? "Интерактивный контур" : "Interactive system"}</span>
      </header>

      <div className="signal-observatory__stage">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {edges.map(([from, to]) => (
            <line
              key={`${from}-${to}`}
              x1={items[from].x}
              y1={items[from].y}
              x2={items[to].x}
              y2={items[to].y}
              className={from === active || to === active ? "is-active" : undefined}
            />
          ))}
        </svg>

        {items.map((node, index) => (
          <button
            key={node.key}
            type="button"
            className={`signal-node signal-node--${node.key}`}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            aria-pressed={active === index}
            onPointerEnter={() => setActive(index)}
            onFocus={() => setActive(index)}
            onClick={() => setActive(index)}
          >
            <i aria-hidden />
            <span>{node.label}</span>
          </button>
        ))}

        <div className="signal-observatory__readout" aria-live="polite">
          <span>{String(active + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span>
          <strong>{activeNode.label}</strong>
          <p>{activeNode.detail}</p>
        </div>
      </div>

      <footer className="signal-observatory__footer">
        <span>DESIGN</span><i aria-hidden /><span>ENGINEERING</span><i aria-hidden /><span>AI</span>
      </footer>
    </div>
  );
}
