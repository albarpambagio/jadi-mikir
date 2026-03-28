# CONTEXT.md — Current State

## Current Focus
Building screens. Session + session complete (screen-11) are done. Next: Dashboard / home.

## Design / Figma
Figma: [link to file or key screen]. Use for layout and hierarchy when implementing or reviewing UI.

## What's Complete
- **Business logic engines** (`src/lib/engines/`): FSRS, mastery, XP, session, interleaving, remediation, diagnostic, FIRe, recommendations, exportImport — 10 engines (dashboard.ts removed; stats computed in hook)
- **Storage**: IndexedDB (`src/lib/storage/indexedDB.ts`) + hybrid adapter (`src/lib/storage/hybrid.ts`)
- **State**: `src/store/learnerStore.ts` — learner progress, session state, streaks
- **Design tokens**: `src/index.css` — Nature theme, light + dark mode, full token set
- **UI primitives** (`src/components/ui/`): button, card, badge, input, dialog, tabs, progress, tooltip, avatar, scroll-area, separator — all themed to VISUAL-SPEC
- **Session screen** (`src/pages/session.tsx`): answering + feedback phases, choice randomization, XP award (+50 per correct), `updateStreak()` on finish; routes `/session` and `/session/:topicId`
- **Session complete UI** (`src/components/session/session-complete-view.tsx` + `src/lib/session-complete-aggregates.ts`): wireframe 11 summary — metrics, streak goal bar, per-topic session stats + optional overall mastery, next review / due line, weak-tag CTA; multi-topic sessions use **Your results** + multi-topic band copy; `<main>` + focus on primary heading, `document.title` on complete; summary loading uses skeleton (`SessionCompleteSummarySkeleton` in `session.tsx`)
- **Layout shell**: `src/components/layout/layout.tsx`
- **Routing**: wouter 3.x — committed router
- **Fonts**: Montserrat (sans), Merriweather (serif), Source Code Pro (mono)
- **Content fetching**: `src/lib/content.ts` — TanStack Query hooks for `/content/*.json`

## Active Constraints
- **Self-improvement logs**: Non-obvious corrections, errors, and feature wishes go to `.learnings/` per `.agents/skills/self-improvement/SKILL.md` and `AGENTS.md`; promote stable learnings to `docs/` or `AGENTS.md`
- **UX copy**: For user-facing strings, follow `.agents/skills/ux-copy/SKILL.md` (see AGENTS.md, `.cursor/rules/ux-copy.mdc`)
- **UX audit + dogfood**: Integrated workflow — ranked findings / walkthroughs → **ux-audit** (`docs/`); repro evidence / agent-browser → **dogfood** (`./dogfood-output/`); combined pipeline in `AGENTS.md` and `docs/WORKFLOW.md` (see `.cursor/rules/ux-audit.mdc`, `.cursor/rules/dogfood.mdc`)
- **Product strategy sessions**: Use `.agents/skills/grill-me/SKILL.md` for strategy design and review work in `docs/strategy/` and related roadmap/positioning discussions (see AGENTS.md, `.cursor/rules/grill-me-strategy.mdc`)
- Figma is the source of truth for visual decisions — fetch design context before writing any markup
- shadcn/ui before custom components
- Follow UI constraints in TECH_STACK.md (4px grid, max 2 accents, no decorative gradients, no resting shadows)
- **Positioning (strategy)**: **Product-led** — lead with efficiency and mastery outcomes; privacy and learning science are supporting proof (see [docs/strategy/product-strategy.md](strategy/product-strategy.md))
- **Learning lab**: **Opt-in research studies** may eventually send minimal de-identified events/aggregates for A/B and impact evaluation; **not shipped yet**—no default telemetry. See [docs/strategy/product-strategy.md](strategy/product-strategy.md) (Evaluation & experimentation)

## Next Steps (in order)
1. [ ] Dashboard / home (wireframes 01, 06)
2. [ ] Topic browser — all topics, topics within subject (wireframes 17, 18)
3. [ ] Topic detail (wireframe 12)
4. [ ] **Dependency UX** (prerequisites, blocked/ready, path copy on topic detail and related flows) in Phase 2; **full skill tree / graph screen** (wireframe 04) deferred until content volume justifies it (50+ questions minimum) — see [product-strategy.md](strategy/product-strategy.md) (Pillar 5 phase split)

## Recent Updates
- **Session complete audit + dogfood follow-ups** (2026-03): multi-topic headline and performance-band messages; accessibility (landmark, heading focus, document title); skeleton while streak/meta resolves; **Confirm answer** scroll-into-view after choice + instant scroll when opening feedback (mitigates dogfood ISSUE-001). See [docs/audits/session-complete-screen-ux-audit-2026-03-28.md](audits/session-complete-screen-ux-audit-2026-03-28.md).
- **UX audit + dogfood** documented together: `AGENTS.md` table + combined pipeline, `docs/WORKFLOW.md` QA section, `.cursor/rules/dogfood.mdc`, updated `ux-audit.mdc`
- Integrated [ux-audit](https://skills.sh/jezweb/claude-skills/ux-audit) skill (`jezweb/claude-skills`): `.agents/skills/ux-audit/`, `skills-lock.json`, AGENTS.md + `.cursor/rules/ux-audit.mdc`; `.jez/` gitignored for optional screenshots
- Session complete screen (wireframe 11): `SessionCompleteView`, aggregates helper, streak on session end, topic/tag rollups, next-due from FSRS cards, weak-area banner
- Project cleanup: archived Storybook-era docs to `docs/archives/stale-storybook-ui-docs-2026-03/`; removed unused skills (`superpowers`, `senior-fullstack`, charon-fan `self-improving-agent`); reconciled `skills-lock.json` with installed skills; removed Chromatic CI workflow (no Storybook build)
- OpenCode: `opencode.json` includes `AGENTS.md` so self-improvement rules apply; skills in `.agents/skills/` (including `self-improvement`) are loaded via OpenCode’s skill tool per [OpenCode docs](https://opencode.ai/docs/skills)
- Agent workflow: integrated [pskoett self-improvement](https://skills.sh/pskoett/self-improving-agent/self-improvement) — `.learnings/` logs + `AGENTS.md` section; skill at `.agents/skills/self-improvement/`
- Product strategy: clarified Phase 2 P0 “Knowledge Graph / Skill Tree UI” as dependency UX first, full graph screen gated on content threshold (see [product-strategy.md](strategy/product-strategy.md) Pillar 5); CONTEXT/TODO aligned
- UX audit report for session screen: [docs/audits/session-screen-ux-audit.md](audits/session-screen-ux-audit.md); audit follow-ups implemented (modal feedback dialog, quit confirm, progress formula, back tooltip, XP casing; see audit doc “Implementation follow-up”).
- Enabled `strict: true` in tsconfig.json (was `strict: false`)
- Removed dead dependencies: `@base-ui/react`, `framer-motion`
- Router committed to wouter 3.x; TanStack Router removed from spec
- Analytics simplified: deleted `src/lib/analytics.ts` and `src/lib/engines/dashboard.ts` (unused, partially broken); `getMotivationalMessage` preserved in `use-dashboard-stats.ts`; emoji strings removed from `recommendations.ts` — **future opt-in study pipeline** is separate and described in product strategy (not implemented in app yet)
- Product strategy v2.0: product-led positioning, content/FSRS density, measurement model, learning lab, IndexedDB-aligned risks; educator persona deferred
