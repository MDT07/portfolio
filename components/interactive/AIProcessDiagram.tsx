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
    <div className="ai-process-experience mt-10">
      <div className="ai-scenario-rail" role="group" aria-label={scenarios.label}>
        <p className="editorial-label">{scenarios.title}</p>
        <div className="ai-scenario-list">
          {scenarios.items.map((scenario, index) => (
            <button
              key={scenario.title}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-pressed={index === activeIndex}
            >
              <span className="ai-scenario-indicator" aria-hidden />
              <span>{scenario.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div key={activeIndex} className="ai-process-panel">
        <header>
          <div>
            <span className="editorial-label">{scenarios.label}</span>
            <h3>{active.title}</h3>
          </div>
          <p>{active.description}</p>
        </header>

        <ol className="ai-process-flow" aria-label={`${process.title}: ${active.title}`}>
          {active.steps.map((step, index) => (
            <li
              key={step}
              className="ai-process-step"
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <div className="ai-process-node">
                <span>{process.steps[index]?.label}</span>
                <strong>{step}</strong>
                <small>{process.steps[index]?.description}</small>
              </div>
              {index < active.steps.length - 1 && (
                <span className="ai-process-connector" aria-hidden>
                  <span className="ai-process-stroke" />
                </span>
              )}
            </li>
          ))}
        </ol>

        <footer aria-live="polite">
          <span>{process.steps.at(-1)?.label}</span>
          <strong>{active.steps.at(-1)}</strong>
        </footer>
      </div>
    </div>
  );
}
