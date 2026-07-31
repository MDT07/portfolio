#!/usr/bin/env node
/**
 * validate-case.mjs — проверка демо-кейсов портфолио.
 *
 * Для каждого content/works/<slug>.mdx (ru, без .en):
 *  1. frontmatter содержит обязательные поля
 *  2. templates/<slug>/index.html существует и его inline-JS парсится
 *  3. public/templates/<slug>/index.html идентичен templates/ (sync)
 *  4. файл обложки из frontmatter существует в public/
 *  5. поле demo указывает на существующий public-шаблон
 *
 * Запуск: node scripts/validate-case.mjs  (exit 1 при любой ошибке)
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import vm from "node:vm";

const ROOT = resolve(import.meta.dirname, "..");
const REQUIRED = ["title", "description", "tags", "year", "role", "stack", "cover", "demo"];

let failures = 0;
const ok = (msg) => console.log(`  ✓ ${msg}`);
const fail = (msg) => {
  console.error(`  ✗ ${msg}`);
  failures++;
};

function parseFrontmatter(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return null;
  const data = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) data[kv[1]] = kv[2].replace(/^["']|["']$/g, "");
  }
  return data;
}

const worksDir = join(ROOT, "content", "works");
const slugs = readdirSync(worksDir)
  .filter((f) => f.endsWith(".mdx") && !f.endsWith(".en.mdx"))
  .map((f) => f.replace(/\.mdx$/, ""));

console.log(`Проверяю кейсы: ${slugs.join(", ")}\n`);

for (const slug of slugs) {
  console.log(`▸ ${slug}`);
  const mdxPath = join(worksDir, `${slug}.mdx`);
  const fm = parseFrontmatter(readFileSync(mdxPath, "utf8"));

  // 1. frontmatter
  if (!fm) {
    fail(`${slug}.mdx: нет frontmatter`);
    continue;
  }
  const missing = REQUIRED.filter((k) => !(k in fm));
  if (missing.length) fail(`frontmatter: нет полей ${missing.join(", ")}`);
  else ok("frontmatter полный");

  // 2. шаблон + JS
  const tplPath = join(ROOT, "templates", slug, "index.html");
  if (!existsSync(tplPath)) {
    fail(`нет templates/${slug}/index.html`);
  } else {
    const html = readFileSync(tplPath, "utf8");
    const scripts = [...html.matchAll(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/g)];
    let jsOk = true;
    scripts.forEach((s, i) => {
      try {
        new vm.Script(s[1]);
      } catch (e) {
        fail(`JS блок #${i + 1}: ${e.message.split("\n")[0]}`);
        jsOk = false;
      }
    });
    if (jsOk) ok(`JS валиден (${scripts.length} блок.)`);

    // 3. sync с public/
    const pubPath = join(ROOT, "public", "templates", slug, "index.html");
    if (!existsSync(pubPath)) fail(`нет public/templates/${slug}/index.html`);
    else if (readFileSync(pubPath, "utf8") !== html) fail(`public/ копия не синхронизирована с templates/${slug}/`);
    else ok("public/ синхронизирован");
  }

  // 4. обложка
  if (fm.cover) {
    const coverPath = join(ROOT, "public", fm.cover.replace(/^\//, ""));
    if (!existsSync(coverPath)) fail(`обложка не найдена: public${fm.cover}`);
    else ok(`обложка ${fm.cover}`);
  }

  // 5. demo
  if (fm.demo) {
    const demoPath = join(ROOT, "public", fm.demo.replace(/^\//, ""));
    if (!existsSync(demoPath)) fail(`demo не найдено: public${fm.demo}`);
    else ok(`demo ${fm.demo}`);
  }
  console.log();
}

if (failures) {
  console.error(`ИТОГ: ${failures} ошибок`);
  process.exit(1);
}
console.log("ИТОГ: все кейсы валидны");
