"use client";

import { useState } from "react";
import { siteConfig } from "@/lib/config";
import type { Dictionary } from "@/lib/dictionaries/ru";
import type { Locale } from "@/lib/i18n";

type ContactCopy = Dictionary["home"]["contact"];
type SubmitState = "idle" | "working" | "success" | "fallback";

export default function ProjectBrief({
  copy,
  lang,
}: {
  copy: ContactCopy;
  lang: Locale;
}) {
  const [status, setStatus] = useState<SubmitState>("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const lines = [
      lang === "ru" ? "Новый проект" : "New project",
      `${copy.name}: ${String(data.get("name") ?? "")}`,
      `${copy.contact}: ${String(data.get("contact") ?? "")}`,
      `${copy.type}: ${String(data.get("type") ?? "")}`,
      `${copy.description}: ${String(data.get("description") ?? "")}`,
    ];

    setStatus("working");
    window.open(siteConfig.telegramUrl, "_blank", "noopener,noreferrer");

    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setStatus("success");
    } catch {
      setStatus("fallback");
    }
  }

  return (
    <form className="project-brief" onSubmit={handleSubmit}>
      <div className="project-brief__row">
        <label>
          <span>{copy.name}</span>
          <input name="name" autoComplete="name" required />
        </label>
        <label>
          <span>{copy.contact}</span>
          <input
            name="contact"
            autoComplete="off"
            required
          />
        </label>
      </div>

      <label>
        <span>{copy.type}</span>
        <select name="type" defaultValue={copy.types[0]}>
          {copy.types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span>{copy.description}</span>
        <textarea name="description" rows={4} minLength={12} required />
      </label>

      <div className="project-brief__actions">
        <button type="submit" disabled={status === "working"}>
          <span>{copy.submit}</span>
          <span aria-hidden>↗</span>
        </button>
        <p aria-live="polite" role="status">
          {status === "success"
            ? copy.success
            : status === "fallback"
              ? copy.fallback
              : ""}
        </p>
      </div>
    </form>
  );
}
