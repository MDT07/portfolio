"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/dictionaries/ru";

type AIWorksDictionary = Dictionary["aiWorks"];

export default function AIProcessDiagram({
  process,
  scenarios,
}: {
  process: AIWorksDictionary["process"];
  scenarios: AIWorksDictionary["scenarios"];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = scenarios.items[activeIndex];

  return (
    <div className="mt-10 border-y border-surface-3 py-6 md:py-8">
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label={scenarios.label}
      >
        {scenarios.items.map((scenario, index) => (
          <button
            key={scenario.title}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-pressed={index === activeIndex}
            className="border border-surface-3 px-4 py-2.5 text-left text-sm text-text-secondary transition-[color,background-color,border-color] duration-150 hover:border-text-tertiary hover:text-text-primary aria-pressed:border-accent aria-pressed:bg-accent-subtle aria-pressed:text-text-primary"
          >
            {scenario.title}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(15rem,0.45fr)] md:items-end">
        <h3 className="font-display text-2xl leading-tight md:text-3xl">
          {active.title}
        </h3>
        <p className="leading-relaxed text-text-secondary md:text-sm">
          {active.description}
        </p>
      </div>

      <ol
        key={activeIndex}
        className="ai-process-flow mt-9"
        aria-label={`${process.title}: ${active.title}`}
      >
        {active.steps.map((step, index) => (
          <li key={step} className="ai-process-step">
            <div className="ai-process-node">
              <strong className="block text-sm font-medium leading-snug">
                {step}
              </strong>
              <span className="mt-2 block text-xs leading-relaxed text-text-tertiary">
                {process.steps[index]?.description}
              </span>
            </div>
            {index < active.steps.length - 1 && (
              <span className="ai-process-connector" aria-hidden>
                <span className="ai-process-stroke" />
              </span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
