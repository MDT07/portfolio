"use client";

import { useId, useState } from "react";
import type { Dictionary } from "@/lib/dictionaries/ru";

type ExpertiseGroup = Dictionary["home"]["expertise"]["groups"][number];

export default function ExpertiseExplorer({
  groups,
  label,
}: {
  groups: ExpertiseGroup[];
  label: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const id = useId();
  const active = groups[activeIndex];

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number
  ) {
    let nextIndex = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (index + 1) % groups.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (index - 1 + groups.length) % groups.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = groups.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    setActiveIndex(nextIndex);
    const tabs = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>(
      '[role="tab"]'
    );
    tabs?.[nextIndex]?.focus();
  }

  return (
    <div className="expertise-explorer">
      <div
        className="expertise-tabs"
        role="tablist"
        aria-label={label}
      >
        {groups.map((group, index) => (
          <button
            key={group.label}
            type="button"
            role="tab"
            id={`${id}-tab-${index}`}
            aria-selected={activeIndex === index}
            aria-controls={`${id}-panel`}
            tabIndex={activeIndex === index ? 0 : -1}
            onClick={() => setActiveIndex(index)}
            onKeyDown={(event) => handleKeyDown(event, index)}
          >
            <span aria-hidden>{String(index + 1).padStart(2, "0")}</span>
            {group.label}
          </button>
        ))}
      </div>

      <div
        key={active.label}
        id={`${id}-panel`}
        role="tabpanel"
        aria-labelledby={`${id}-tab-${activeIndex}`}
        className="expertise-panel"
      >
        <div className="expertise-panel__copy">
          <p className="editorial-label">{active.label}</p>
          <h3>{active.title}</h3>
          <p>{active.description}</p>
        </div>

        <ul className="expertise-panel__stack" role="list">
          {active.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <p className="expertise-panel__proof">
          <span aria-hidden>↳</span>
          {active.proof}
        </p>
      </div>
    </div>
  );
}
