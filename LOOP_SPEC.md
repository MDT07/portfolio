# Loop: SIGNAL / SHIP Digital Experience

## Goal
Transform the existing bilingual Next.js portfolio into a production-ready one-page digital experience whose interface itself demonstrates Emir Semenov's verified web, motion, graphics, UX, AI-integration, architecture, accessibility, and performance capabilities. The homepage must unfold as a coherent Signal → Identity → Systems → Work → Intelligence → Method → Contact narrative; include one contextual lightweight WebGL/procedural hero with a non-WebGL fallback; provide an always-understandable scene index; present existing concepts and CRMP without fabricated facts; retain direct localized case-study URLs; remain operable by keyboard, pointer, and touch; preserve natural document flow without scroll locking or pinned section overlap; provide an equivalent reduced-motion/mobile experience; and deploy successfully to the existing production Vercel alias.

## Verification
```bash
npm run validate && npm run lint && npm run typecheck && npm run build && npm run qa:premium
```
The deterministic command is the release gate. Visual originality cannot be proven mechanically, so the weakest verification layer is an explicit human/LLM jury rubric applied to desktop, tablet, and mobile page captures when a browser surface is available: one recognizable art direction, readable five-second positioning, purposeful interactive states, coherent scene rhythm, no generic SaaS/AI clichés, no overlap or horizontal overflow, useful fallback/reduced-motion states, and visible truthful project evidence. A major rubric failure counts as a failed iteration even when the command exits 0.

## Termination
- Success: the deterministic verification exits 0, all available visual rubric checks have no major failure, the production deployment is Ready, live route smoke tests pass, and the Git working tree is clean.
- Max iterations: 8
- No-progress: stop if 2 consecutive iterations produce identical verification output and an unchanged working tree.
- Budget: prefer code-native WebGL, Canvas, SVG, CSS, and existing libraries; do not add a rendering dependency unless it solves a verified problem that cannot be handled by the current stack.

## Scope
- Allowed: `app/`, `components/`, `content/`, `lib/`, `public/`, `scripts/`, test/QA configuration, project metadata/configuration, and documentation required by this redesign.
- Preserve: truthful existing project content, working localized routing, real Telegram/PROFI.RU/CRMP links, Git history, and the current GitHub/Vercel integration.
- Forbidden: inventing clients, awards, reviews, experience, metrics, technologies, or outcomes; editing assertions only to force a pass; copying a reference website; committing secrets; force-pushing; deleting unrelated user data; scroll-jacking; mandatory audio; or shipping a 3D effect without a lightweight fallback.

## Escalation
On iteration cap or no-progress: stop immediately, report the mechanical reason and iteration history, summarize the last failure and attempted fixes, identify any unavailable browser surface or missing real-world asset/information, and wait for human review without bypassing the verifier.
