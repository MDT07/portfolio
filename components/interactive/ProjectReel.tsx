"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { WorkEntry } from "@/lib/works";
import { withLocale, type Locale } from "@/lib/i18n";

export default function ProjectReel({ works, lang }: { works: WorkEntry[]; lang: Locale }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollFrameRef = useRef<number | null>(null);
  const [active, setActive] = useState(0);

  useEffect(() => () => {
    if (scrollFrameRef.current !== null) cancelAnimationFrame(scrollFrameRef.current);
  }, []);

  function move(direction: -1 | 1) {
    const track = trackRef.current;
    if (!track) return;
    const next = Math.max(0, Math.min(works.length - 1, active + direction));
    const target = track.children.item(next) as HTMLElement | null;
    target?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
    setActive(next);
  }

  function updateActive() {
    if (scrollFrameRef.current !== null) return;
    scrollFrameRef.current = requestAnimationFrame(() => {
      scrollFrameRef.current = null;
      const track = trackRef.current;
      if (!track) return;
      const children = Array.from(track.children) as HTMLElement[];
      const left = track.getBoundingClientRect().left;
      const nearest = children.reduce((best, child, index) => {
        const distance = Math.abs(child.getBoundingClientRect().left - left);
        return distance < best.distance ? { index, distance } : best;
      }, { index: 0, distance: Number.POSITIVE_INFINITY });
      setActive(nearest.index);
    });
  }

  return (
    <div className="project-reel">
      <header className="project-reel__controls">
        <div>
          <span>{String(active + 1).padStart(2, "0")}</span>
          <i aria-hidden />
          <span>{String(works.length).padStart(2, "0")}</span>
        </div>
        <div>
          <button type="button" onClick={() => move(-1)} disabled={active === 0} aria-label={lang === "ru" ? "Предыдущий проект" : "Previous project"}>←</button>
          <button type="button" onClick={() => move(1)} disabled={active === works.length - 1} aria-label={lang === "ru" ? "Следующий проект" : "Next project"}>→</button>
        </div>
      </header>

      <div
        ref={trackRef}
        className="project-reel__track"
        onScroll={updateActive}
        tabIndex={0}
        aria-label={lang === "ru" ? "Горизонтальная галерея проектов" : "Horizontal project gallery"}
      >
        {works.map((work, index) => (
          <article className="project-slide" key={work.slug}>
            <Link href={withLocale(lang, `/works/${work.slug}`)} className="project-slide__visual">
              <Image
                src={work.frontmatter.cover}
                alt=""
                fill
                sizes="(min-width: 1280px) 66vw, (min-width: 768px) 78vw, 92vw"
                priority={index === 0}
                className="object-cover"
              />
              <span className="project-slide__number" aria-hidden>{String(index + 1).padStart(2, "0")}</span>
              <span className="project-slide__view">{lang === "ru" ? "Открыть кейс" : "Open case"} ↗</span>
            </Link>
            <div className="project-slide__copy">
              <div>
                <span>{work.frontmatter.status ?? (lang === "ru" ? "Концепт · прототип" : "Concept · prototype")}</span>
                <span>{work.frontmatter.year}</span>
              </div>
              <h3>{work.frontmatter.title}</h3>
              <p>{work.frontmatter.description}</p>
              <ul aria-label={lang === "ru" ? "Технологии" : "Technologies"}>
                {work.frontmatter.tags.slice(0, 5).map((tag) => <li key={tag}>{tag}</li>)}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
