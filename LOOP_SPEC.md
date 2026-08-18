# Loop: Premium Tech CV and Freelance Platform

## Goal
Transform the existing bilingual Next.js portfolio into a production-ready professional technology brand that, on the live Vercel deployment, communicates within the first viewport who Emir Semenov is, what full-cycle web and AI/bot products he builds, which verified capabilities support that claim, what real project evidence exists, and how a client can start a conversation. The result must provide a coherent Hero → services → selected evidence → expertise/stack → process → AI automation → professional profile → FAQ → contact narrative; reusable editorial case studies; keyboard/touch-safe interactions; intentional mobile layouts from 320px through ultrawide; WCAG-oriented semantics and focus behavior; localized RU/EN metadata and structured data; no fabricated experience, clients, reviews, awards, metrics, technologies, or outcomes; and a successful GitHub-triggered Vercel production deployment.

## Verification
```bash
npm run validate && npm run lint && npm run typecheck && npm run build && npm run qa:premium
```
The deterministic command is the release gate. Visual originality cannot be fully proven mechanically, so the weakest verification layer is an explicit human/LLM jury rubric applied to captured desktop, tablet, and mobile screenshots: clear five-second positioning, coherent editorial hierarchy, no generic AI/SaaS clichés, purposeful motion, visible project evidence, strong CTA, no overflow or broken assets, and consistent light/dark presentation. Any rubric failure is treated as a failed iteration even when the command exits 0.

## Termination
- Success: the deterministic verification exits 0, the screenshot jury rubric has no major failure, the production deployment is Ready, and live route smoke tests pass.
- Max iterations: 8
- No-progress: stop if 2 consecutive iterations produce identical verification output and an unchanged working tree.
- Budget: prefer existing dependencies and code-native visuals; add a dependency only when it materially improves verifiable accessibility or QA.

## Scope
- Allowed: `app/`, `components/`, `content/`, `lib/`, `public/`, `scripts/`, test/QA configuration, project metadata/configuration, and documentation required by this redesign.
- Preserve: truthful existing project content, working localized routing, real Telegram/PROFI.RU/CRMP links, Git history, and the current GitHub/Vercel integration.
- Forbidden: inventing professional facts or metrics; editing assertions merely to force a pass; committing credentials; force-pushing; deleting unrelated user data; copying a reference site; or adding decorative effects that reduce accessibility or Core Web Vitals.

## Escalation
On iteration cap or no-progress: stop immediately, report the mechanical reason, summarize attempts and the last failing output, identify any missing real-world information/assets/credentials, and wait for human review without bypassing the verifier.
