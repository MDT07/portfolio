<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:knowledge-graph -->
# Knowledge Graph — сначала граф

Перед веб-исследованием по темам дизайна (шрифты, стили, палитры, motion, UX-паттерны, чарты) или инструментов/скиллов — сначала запрос в локальный граф знаний (~3450 заметок):

```bash
python3 ~/Desktop/knowledge-graph/generators/kg.py "<запрос>" [-n 10] [--type font|skill|style|palette]
```

Веб — только за деталями из первоисточника, указанного в поле `source` заметки. Просмотр в браузере: `cd ~/Desktop/knowledge-graph/quartz && npx quartz build --serve --port 8080` → http://localhost:8080 или https://mdt07.github.io/knowledge-graph.
<!-- END:knowledge-graph -->
