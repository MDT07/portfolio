"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { WorkEntry } from "@/lib/mdx";
import { withLocale, type Locale } from "@/lib/i18n";

export default function BuildEngineArchive({
  works,
  lang,
}: {
  works: WorkEntry[];
  lang: Locale;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = works[activeIndex];

  if (!active) return null;

  const concept = lang === "ru" ? "Концепт · рабочий прототип" : "Concept · working prototype";

  return (
    <div className="build-engine">
      <header className="build-engine__header">
        <div><i aria-hidden /> {lang === "ru" ? "Архив систем" : "System archive"}</div>
        <span>{lang === "ru" ? "Выберите проект для разбора" : "Select a project to inspect"}</span>
      </header>

      <div className="build-engine__workspace">
        <div className="build-engine__index" role="group" aria-label={lang === "ru" ? "Проекты" : "Projects"}>
          {works.map((work, index) => (
            <button
              key={work.slug}
              type="button"
              aria-pressed={index === activeIndex}
              onClick={() => setActiveIndex(index)}
              onPointerEnter={() => setActiveIndex(index)}
              onFocus={() => setActiveIndex(index)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{work.frontmatter.title}</strong>
              <small>{work.frontmatter.tags.slice(0, 2).join(" / ")}</small>
              <i aria-hidden>↗</i>
            </button>
          ))}
        </div>

        <article className="build-engine__preview" key={active.slug}>
          <Link href={withLocale(lang, `/works/${active.slug}`)} className="build-engine__visual">
            <Image
              src={active.frontmatter.cover}
              alt=""
              fill
              priority={activeIndex === 0}
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover"
            />
            <span className="build-engine__scan" aria-hidden />
            <span className="build-engine__open">
              {lang === "ru" ? "Открыть кейс" : "Open case"} <i aria-hidden>↗</i>
            </span>
          </Link>
          <div className="build-engine__meta">
            <div>
              <span>{concept}</span>
              <span>{active.frontmatter.year}</span>
            </div>
            <h2>{active.frontmatter.title}</h2>
            <p>{active.frontmatter.description}</p>
            <ul aria-label={lang === "ru" ? "Технологии" : "Technologies"}>
              {active.frontmatter.tags.map((tag) => <li key={tag}>{tag}</li>)}
            </ul>
          </div>
        </article>
      </div>

      <footer className="build-engine__pipeline" aria-label={lang === "ru" ? "Этапы разработки" : "Development stages"}>
        {(lang === "ru"
          ? ["Контекст", "Архитектура", "Интерфейс", "Разработка", "Проверка", "Запуск"]
          : ["Context", "Architecture", "Interface", "Development", "Validation", "Launch"]
        ).map((step, index) => <span key={step}><i>{String(index + 1).padStart(2, "0")}</i>{step}</span>)}
      </footer>
    </div>
  );
}
