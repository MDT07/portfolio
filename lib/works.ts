import workData from "./work-data.json";
import type { Locale } from "./i18n";

export interface WorkFrontmatter {
  title: string;
  description: string;
  tags: string[];
  year: string;
  role: string;
  stack: string[];
  cover: string;
  demo?: string;
  status?: string;
  featured?: boolean;
}

export interface WorkSection {
  title: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface WorkEntry {
  slug: string;
  frontmatter: WorkFrontmatter;
}

interface LocalizedRecord {
  title: string;
  description: string;
  status: string;
  sections: WorkSection[];
}

interface WorkRecord {
  featured: boolean;
  year: string;
  role: string;
  tags: string[];
  stack: string[];
  cover: string;
  demo: string;
  ru: LocalizedRecord;
  en: LocalizedRecord;
}

const records = workData as Record<string, WorkRecord>;

export function getWorkSlugs(): string[] {
  return Object.keys(records);
}

function resolveWork(slug: string, lang: Locale) {
  const record = records[slug];
  if (!record) return null;
  const localized = record[lang];
  const frontmatter: WorkFrontmatter = {
    title: localized.title,
    description: localized.description,
    status: localized.status,
    featured: record.featured,
    year: record.year,
    role: record.role,
    tags: record.tags,
    stack: record.stack,
    cover: record.cover,
    demo: record.demo,
  };
  return { slug, frontmatter, sections: localized.sections };
}

export function getAllWorks(lang: Locale): WorkEntry[] {
  return getWorkSlugs()
    .map((slug) => resolveWork(slug, lang))
    .filter((work): work is NonNullable<typeof work> => Boolean(work))
    .map(({ slug, frontmatter }) => ({ slug, frontmatter }))
    .sort((a, b) => {
      if (Boolean(a.frontmatter.featured) !== Boolean(b.frontmatter.featured)) {
        return a.frontmatter.featured ? -1 : 1;
      }
      return b.frontmatter.year.localeCompare(a.frontmatter.year);
    });
}

export function getWork(slug: string, lang: Locale) {
  return resolveWork(slug, lang);
}
