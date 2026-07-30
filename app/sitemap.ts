import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";
import { locales, withLocale } from "@/lib/i18n";
import { getWorkSlugs, getPostSlugs } from "@/lib/mdx";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const staticPages = ["", "/about", "/skills", "/works", "/blog", "/contact"];
  const workPages = getWorkSlugs().map((slug) => `/works/${slug}`);
  const postPages = getPostSlugs().map((slug) => `/blog/${slug}`);

  const all = [...staticPages, ...workPages, ...postPages];

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
