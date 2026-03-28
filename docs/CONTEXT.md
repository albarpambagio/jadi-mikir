# CONTEXT.md — Current State

## Current Focus
Building screens. Session screen is complete. Next: Session complete screen (screen-11), then Dashboard.

## Design / Figma
Figma: [link to file or key screen]. Use for layout and hierarchy when implementing or reviewing UI.

## What's Complete
- **Business logic engines** (`src/lib/engines/`): FSRS, mastery, XP, session, interleaving, remediation, diagnostic, FIRe, recommendations, exportImport — 10 engines (dashboard.ts removed; stats computed in hook)
- **Storage**: IndexedDB (`src/lib/storage/indexedDB.ts`) + hybrid adapter (`src/lib/storage/hybrid.ts`)
- **State**: `src/store/learnerStore.ts` — learner progress, session state, streaks
- **Design tokens**: `src/index.css` — Nature theme, light + dark mode, full token set
- **UI primitives** (`src/components/ui/`): button, card, badge, input, dialog, tabs, progress, tooltip, avatar, scroll-area, separator — all themed to VISUAL-SPEC
- **Session screen** (`src/pages/session.tsx`): answering + feedback phases, choice randomization, XP award (+50 per correct), inline session-complete summary; routes `/session` and `/session/:topicId`
- **Layout shell**: `src/components/layout/layout.tsx`
- **Routing**: wouter 3.x — committed router
- **Fonts**: Montserrat (sans), Merriweather (serif), Source Code Pro (mono)
- **Content fetching**: `src/lib/content.ts` — TanStack Query hooks for `/content/*.json`

## Active Constraints
- **Self-improvement logs**: Non-obvious corrections, errors, and feature wishes go to `.learnings/` per `.agents/skills/self-improvement/SKILL.md` and `AGENTS.md`; promote stable learnings to `docs/` or `AGENTS.md`
- **UX copy**: For user-facing strings, follow `.agents/skills/ux-copy/SKILL.md` (see AGENTS.md, `.cursor/rules/ux-copy.mdc`)
- **Product strategy sessions**: Use `.agents/skills/grill-me/SKILL.md` for strategy design and review work in `docs/strategy/` and related roadmap/positioning discussions (see AGENTS.md, `.cursor/rules/grill-me-strategy.mdc`)
- Figma is the source of truth for visual decisions — fetch design context before writing any markup
- shadcn/ui before custom components
- Follow UI constraints in TECH_STACK.md (4px grid, max 2 accents, no decorative gradients, no resting shadows)
- **Positioning (strategy)**: **Product-led** — lead with efficiency and mastery outcomes; privacy and learning science are supporting proof (see [docs/strategy/product-strategy.md](strategy/product-strategy.md))
- **Learning lab**: **Opt-in research studies** may eventually send minimal de-identified events/aggregates for A/B and impact evaluation; **not shipped yet**—no default telemetry. See [docs/strategy/product-strategy.md](strategy/product-strategy.md) (Evaluation & experimentation)

## Next Steps (in order)
1. [ ] Session complete screen — results summary, XP earned, streak update (wireframe 11)
2. [ ] Dashboard / home (wireframes 01, 06)
3. [ ] Topic browser — all topics, topics within subject (wireframes 17, 18)
4. [ ] Topic detail (wireframe 12)
5. [ ] **Dependency UX** (prerequisites, blocked/ready, path copy on topic detail and related flows) in Phase 2; **full skill tree / graph screen** (wireframe 04) deferred until content volume justifies it (50+ questions minimum) — see [product-strategy.md](strategy/product-strategy.md) (Pillar 5 phase split)

## Recent Updates
- Agent workflow: integrated [pskoett self-improvement](https://skills.sh/pskoett/self-improving-agent/self-improvement) — `.learnings/` logs + `AGENTS.md` section; skill at `.agents/skills/self-improvement/`
- Product strategy: clarified Phase 2 P0 “Knowledge Graph / Skill Tree UI” as dependency UX first, full graph screen gated on content threshold (see [product-strategy.md](strategy/product-strategy.md) Pillar 5); CONTEXT/TODO aligned
- UX audit report for session screen: [docs/audits/session-screen-ux-audit.md](audits/session-screen-ux-audit.md); audit follow-ups implemented (modal feedback dialog, quit confirm, progress formula, back tooltip, XP casing; see audit doc “Implementation follow-up”).
- Enabled `strict: true` in tsconfig.json (was `strict: false`)
- Removed dead dependencies: `@base-ui/react`, `framer-motion`
- Router committed to wouter 3.x; TanStack Router removed from spec
- Analytics simplified: deleted `src/lib/analytics.ts` and `src/lib/engines/dashboard.ts` (unused, partially broken); `getMotivationalMessage` preserved in `use-dashboard-stats.ts`; emoji strings removed from `recommendations.ts` — **future opt-in study pipeline** is separate and described in product strategy (not implemented in app yet)
- Product strategy v2.0: product-led positioning, content/FSRS density, measurement model, learning lab, IndexedDB-aligned risks; educator persona deferred
