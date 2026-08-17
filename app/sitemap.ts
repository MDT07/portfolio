import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";
import { locales, withLocale } from "@/lib/i18n";
import { getWorkSlugs } from "@/lib/mdx";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const staticPages = ["", "/works", "/ai-works"];
  const workPages = getWorkSlugs().map((slug) => `/works/${slug}`);

  const all = [...staticPages, ...workPages];

  return locales.flatMap((lang) =>
    all.map((path) => ({
      url: `${base}${withLocale(lang, path)}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : path.split("/").length === 2 ? 0.8 : 0.6,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${base}${withLocale(l, path)}`])
        ),
      },
    }))
  );
}
