#!/usr/bin/env node

import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const NEXT_BIN = join(ROOT, "node_modules", "next", "dist", "bin", "next");
const WORKS_DATA_PATH = join(ROOT, "lib", "work-data.json");
const PUBLIC_DIR = join(ROOT, "public");
const WORKS_DATA = JSON.parse(readFileSync(WORKS_DATA_PATH, "utf8"));
const failures = [];
let checks = 0;

const pass = (message) => {
  checks += 1;
  console.log(`  ✓ ${message}`);
};

const fail = (message) => {
  checks += 1;
  failures.push(message);
  console.error(`  ✗ ${message}`);
};

const assert = (condition, message) => (condition ? pass(message) : fail(message));

async function freePort() {
  const server = createServer();
  await new Promise((resolveReady, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolveReady);
  });
  const address = server.address();
  const port = typeof address === "object" && address ? address.port : 4317;
  await new Promise((resolveClose) => server.close(resolveClose));
  return port;
}

function localizedSlugs() {
  return Object.keys(WORKS_DATA).sort();
}

function frontmatterAssetPaths() {
  const assets = new Set(["/images/portfolio-og.png"]);
  for (const work of Object.values(WORKS_DATA)) {
    if (typeof work.cover === "string") assets.add(work.cover);
    if (typeof work.demo === "string") assets.add(work.demo);
  }
  return [...assets];
}

async function waitUntilReady(baseUrl, child) {
  let lastObservation = "no response";
  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (child.exitCode !== null) {
      throw new Error(`Next.js server exited with code ${child.exitCode}`);
    }
    try {
      const response = await fetch(baseUrl, { redirect: "manual" });
      if (response.status === 200) return;
      lastObservation = `HTTP ${response.status}`;
    } catch (error) {
      lastObservation = error instanceof Error ? error.message : String(error);
    }
    await new Promise((resolveWait) => setTimeout(resolveWait, 250));
  }
  throw new Error(`Next.js production server did not become ready in 20 seconds (${lastObservation})`);
}

async function checkHtml(baseUrl, path, markers) {
  const response = await fetch(`${baseUrl}${path}`, { redirect: "manual" });
  assert(response.status === 200, `${path} returns 200`);
  const html = await response.text();
  assert(
    response.headers.get("content-type")?.includes("text/html"),
    `${path} returns HTML`
  );
  for (const marker of markers) {
    assert(html.includes(marker), `${path} contains ${marker}`);
  }
  assert((html.match(/<h1(?:\s|>)/g) ?? []).length === 1, `${path} has exactly one h1`);
  assert(/<title>[^<]+<\/title>/.test(html), `${path} has a document title`);
  assert(/<meta name="description" content="[^"]+"/.test(html), `${path} has a meta description`);
  assert(/<link rel="canonical" href="[^"]+"/.test(html), `${path} has a canonical URL`);
  assert(!html.includes("ecommerce-cover.png"), `${path} has no removed cover reference`);
  assert(!html.includes("AI WORKS — Creative AI Agency"), `${path} has no legacy AI template copy`);
  return html;
}

async function main() {
  assert(existsSync(join(ROOT, ".next", "BUILD_ID")), "production build exists");
  assert(existsSync(NEXT_BIN), "local Next.js binary exists");
  assert(existsSync(WORKS_DATA_PATH), "structured case-study data exists");

  const slugs = localizedSlugs();
  assert(slugs.length > 0, "case-study data records exist");
  assert(!slugs.includes("ai"), "legacy AI case is absent from the work collection");
  assert(!slugs.includes("pulse") && !slugs.includes("volt"), "removed PULSE and VOLT cases stay absent");

  const globalCss = readFileSync(join(ROOT, "app", "globals.css"), "utf8");
  assert(globalCss.includes("@media (max-width: 767px)"), "mobile layout rules exist");
  assert(globalCss.includes("@media (prefers-reduced-motion: reduce)"), "reduced-motion rules exist");
  assert(!globalCss.includes("cinematic-camera"), "legacy pinned cinematic CSS is absent");

  const packageJson = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
  for (const removedDependency of [
    "gsap",
    "@gsap/react",
    "simplex-noise",
    "stats-js",
    "tone",
    "gray-matter",
    "next-mdx-remote",
  ]) {
    assert(!packageJson.dependencies?.[removedDependency], `unused dependency is absent: ${removedDependency}`);
  }

  for (const asset of frontmatterAssetPaths()) {
    assert(existsSync(join(PUBLIC_DIR, asset.replace(/^\//, ""))), `asset exists: ${asset}`);
  }

  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const server = spawn(process.execPath, [NEXT_BIN, "start", "-H", "127.0.0.1", "-p", String(port)], {
    cwd: ROOT,
    env: { ...process.env, PORT: String(port) },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let serverOutput = "";
  server.stdout.on("data", (chunk) => { serverOutput += chunk.toString(); });
  server.stderr.on("data", (chunk) => { serverOutput += chunk.toString(); });

  try {
    try {
      await waitUntilReady(baseUrl, server);
    } catch (error) {
      throw new Error(`${error instanceof Error ? error.message : String(error)}\n${serverOutput.trim()}`);
    }

    const ruHome = await checkHtml(baseUrl, "/", [
      "id=\"home-title\"",
      "application/ld+json",
      "id=\"services\"",
      "id=\"contact\"",
      "project-brief",
      "digital-experience",
      "signal-core",
      "project-reel",
      "scene-index",
      "CV Эмир Семенов [ПРОФИ.РУ]",
    ]);
    const enHome = await checkHtml(baseUrl, "/en", [
      "id=\"home-title\"",
      "application/ld+json",
      "digital-experience",
      "signal-core",
      "project-reel",
    ]);
    assert(ruHome.includes('lang="ru"'), "Russian root declares ru language");
    assert(enHome.includes('lang="en"'), "English root declares en language");

    await checkHtml(baseUrl, "/works", ["Archive /", "<h1", "build-engine"]);
    await checkHtml(baseUrl, "/en/works", ["Archive /", "<h1", "build-engine"]);
    await checkHtml(baseUrl, "/ai-works", ["ai-works-page", "AI Works", "CRMP"]);
    await checkHtml(baseUrl, "/en/ai-works", ["ai-works-page", "AI Works", "CRMP"]);

    for (const slug of slugs) {
      await checkHtml(baseUrl, `/works/${slug}`, ["case-study", "Interactive evidence", "application/ld+json"]);
      await checkHtml(baseUrl, `/en/works/${slug}`, ["case-study", "Interactive evidence", "application/ld+json"]);
    }

    for (const [legacy, destination] of [
      ["/works/ai", "/ai-works"],
      ["/en/works/ai", "/en/ai-works"],
    ]) {
      const response = await fetch(`${baseUrl}${legacy}`, { redirect: "manual" });
      assert(response.status === 308, `${legacy} returns permanent redirect`);
      assert(new URL(response.headers.get("location"), baseUrl).pathname === destination, `${legacy} redirects to ${destination}`);
    }

    const sitemapResponse = await fetch(`${baseUrl}/sitemap.xml`);
    const sitemap = await sitemapResponse.text();
    assert(sitemapResponse.status === 200, "/sitemap.xml returns 200");
    assert(sitemap.includes("/ai-works"), "sitemap contains AI Works");
    assert(!sitemap.includes("/works/ai"), "sitemap excludes legacy AI route");
    for (const slug of slugs) {
      assert(sitemap.includes(`/works/${slug}`), `sitemap contains ${slug} case`);
    }

    const robotsResponse = await fetch(`${baseUrl}/robots.txt`);
    const robots = await robotsResponse.text();
    assert(robotsResponse.status === 200, "/robots.txt returns 200");
    assert(robots.includes("Sitemap:"), "robots declares sitemap");

    for (const asset of frontmatterAssetPaths()) {
      const response = await fetch(`${baseUrl}${asset}`);
      const type = response.headers.get("content-type") ?? "";
      assert(response.status === 200, `${asset} returns 200`);
      assert(
        asset.endsWith(".html") ? type.includes("text/html") : type.startsWith("image/"),
        `${asset} has a valid content type`
      );
    }

    assert(!/error|warn/i.test(serverOutput), "production server emitted no warnings or errors");
  } finally {
    server.kill("SIGTERM");
    await new Promise((resolveExit) => {
      if (server.exitCode !== null) resolveExit();
      else {
        server.once("exit", resolveExit);
        setTimeout(() => resolveExit(), 3000);
      }
    });
  }

  if (failures.length > 0) {
    console.error(`\nQA failed: ${failures.length}/${checks} checks`);
    process.exit(1);
  }
  console.log(`\nQA passed: ${checks} checks`);
}

main().catch((error) => {
  console.error(`QA could not run: ${error.message}`);
  process.exit(1);
});
