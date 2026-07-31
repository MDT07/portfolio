import * as fs from "node:fs";
import * as path from "node:path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import { mdxComponents } from "@/components/mdx/mdx-components";
import type { Locale } from "./i18n";

const contentRoot = path.join(process.cwd(), "content");

/* ---------- Типы ---------- */

export interface WorkFrontmatter {
  title: string;
  description: string;
  tags: string[];
  year: string;
  role: string;
  stack: string[];
  cover: string;
  demo?: string;
  client?: string;
  status?: string;
  featured?: boolean;
}

export interface WorkEntry {
  slug: string;
  frontmatter: WorkFrontmatter;
}

/* ---------- Низкий уровень ---------- */

function localizedFile(dir: string, slug: string, lang: Locale): string | null {
  const localized = path.join(contentRoot, dir, `${slug}.${lang}.mdx`);
  if (fs.existsSync(localized)) return localized;
  const fallback = path.join(contentRoot, dir, `${slug}.mdx`);
  if (fs.existsSync(fallback)) return fallback;
  return null;
}

function listSlugs(dir: string): string[] {
  const abs = path.join(contentRoot, dir);
  if (!fs.existsSync(abs)) return [];
  return fs
    .readdirSync(abs)
    .filter((f) => f.endsWith(".mdx") && !/\.(en|ru)\.mdx$/.test(f))
    .map((f) => f.replace(/\.mdx$/, ""));
}

function readFrontmatter<T>(dir: string, slug: string, lang: Locale): T | null {
  const file = localizedFile(dir, slug, lang);
  if (!file) return null;
  const { data } = matter(fs.readFileSync(file, "utf8"));
  return data as T;
}

/* ---------- Публичное API: работы ---------- */

export function getWorkSlugs(): string[] {
  return listSlugs("works");
}

export function getAllWorks(lang: Locale): WorkEntry[] {
  return getWorkSlugs()
    .map((slug) => {
      const frontmatter = readFrontmatter<WorkFrontmatter>("works", slug, lang);
      return frontmatter ? { slug, frontmatter } : null;
    })
    .filter((w): w is WorkEntry => w !== null)
    .sort((a, b) => {
      if (!!a.frontmatter.featured !== !!b.frontmatter.featured) {
        return a.frontmatter.featured ? -1 : 1;
      }
      return b.frontmatter.year.localeCompare(a.frontmatter.year);
    });
}

export async function getWork(slug: string, lang: Locale) {
  const file = localizedFile("works", slug, lang);
  if (!file) return null;
  const source = fs.readFileSync(file, "utf8");
  const { content, frontmatter } = await compileMDX<WorkFrontmatter>({
    source,
    components: mdxComponents,
    options: { parseFrontmatter: true },
  });
  return { content, frontmatter, slug };
}
