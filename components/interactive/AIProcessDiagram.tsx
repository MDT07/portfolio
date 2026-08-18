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

        <div className="ai-process-graph">
          <svg viewBox="0 0 1000 360" preserveAspectRatio="none" aria-hidden="true">
            <path className="ai-process-graph__base" d="M95 180 H295 C345 180 350 90 410 90 H590 C650 90 650 270 710 270 H905" />
            <path className="ai-process-graph__signal" d="M95 180 H295 C345 180 350 90 410 90 H590 C650 90 650 270 710 270 H905" />
            <path className="ai-process-graph__branch" d="M500 90 V270 M295 180 V300 H500 M710 270 V70 H860" />
          </svg>

          <ol className="ai-process-flow" aria-label={`${process.title}: ${active.title}`}>
            {active.steps.map((step, index) => (
              <li
                key={step}
                className={`ai-process-step ai-process-step--${index + 1}`}
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

          <div className="ai-process-graph__legend" aria-hidden>
            <span>CONTEXT</span><i /><span>CONTROL</span><i /><span>ACTION</span>
          </div>
        </div>

        <footer aria-live="polite">
          <span>{process.steps.at(-1)?.label}</span>
          <strong>{active.steps.at(-1)}</strong>
        </footer>
      </div>
    </div>
  );
}
