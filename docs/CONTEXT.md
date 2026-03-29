# CONTEXT.md — Current State

## Current Focus
S2–S3, S6, and S11 wireframe rebuilds complete. Next: screen rebuilds S17, S18, then Topic detail (screen 12).

## Design / Figma
Figma: [link to file or key screen]. Use for layout and hierarchy when implementing or reviewing UI.

## What's Complete
- **Business logic engines** (`src/lib/engines/`): FSRS, mastery, XP, session, interleaving, remediation, diagnostic, FIRe, recommendations, exportImport — 10 engines (dashboard.ts removed; stats computed in hook)
- **Storage**: IndexedDB (`src/lib/storage/indexedDB.ts`) + hybrid adapter (`src/lib/storage/hybrid.ts`)
- **State**: `src/store/learnerStore.ts` — learner progress, session state, streaks, `streakGoalDays` (default 30; Settings UI TBD)
- **Design tokens**: `src/index.css` — Nature theme, light + dark mode, full token set
- **UI primitives** (`src/components/ui/`): button, card, badge, input, dialog, tabs, progress, tooltip, avatar, scroll-area, separator — all themed to VISUAL-SPEC
- **Session screen** (`src/pages/session.tsx`): answering + inline feedback phases (wireframe v2), quit-only exit with confirm dialog (no back button), `StepCounter` progress, difficulty dots with Indonesian labels (e.g. *Mudah · 2/5*), stem label *Soal*, CTAs *Konfirmasi jawaban* / *Keluar sesi*, inline feedback banner + left-border choice accents + Indonesian row labels, choice randomization, XP award (+50 per correct), `updateStreak()` on finish; routes `/session` and `/session/:topicId`
- **Session complete UI** (`src/components/session/session-complete-view.tsx` + `src/lib/session-complete-aggregates.ts`): wireframe 11 v2 — learner-facing copy in Indonesian (performance bands, stats *Pertanyaan* / *Akurasi* / *XP* / *Waktu*, `formatSessionDurationId` for time); streak bar from `streakGoalDays` in store (*Tujuan: N/30 hari*), topic progress, **Area lemah** then **Jadwal berikutnya** (Indonesian day-only via `formatNextReviewDateId`), *Tinjau lebih lanjut* / *Kembali ke beranda*; multi-topic headline *Hasilmu*; `<main>` + heading focus + `document.title`; skeleton in `session.tsx`
- **Layout shell**: `src/components/layout/layout.tsx`
- **Routing**: wouter 3.x — committed router
- **Fonts**: Montserrat (sans), Merriweather (serif), Source Code Pro (mono)
- **Content fetching**: `src/lib/content.ts` — TanStack Query hooks for `/content/*.json`
- **Home dashboard** (`src/pages/home.tsx`, `src/components/dashboard/`): wireframe 01 — greeting, 4-stat bar (streak/XP/topics/due), today's session card, continue-learning topic grid (up to 6), empty state (with "browse all topics" link); routes `/`
- **Progress dashboard** (`src/pages/progress.tsx`): wireframe 06 v2 — page chrome and stats in Indonesian (*Dashboard progres*, *Ringkasan*, *Penguasaan per topik*, *Kesehatan retensi*, etc.), top overdue alert (*Kartu perlu ditinjau*, `AlertCircle`, *Tinjau Sekarang*) when `totalDue > 0`, summary stats, mastery-by-topic + `MasteryBar`, retention health (overdue count line), export; routes `/progress`
- **Topic browser** (`src/pages/topics.tsx`, `src/pages/topic-list.tsx`, `src/components/topics/`, `src/lib/hooks/use-topic-browser.ts`): wireframes 17, 18 — subject grid with active/inactive differentiation, topic list grouped by status (in progress / mastered / available to start / locked), due badge, locked collapse, "Review in N days" for mastered; routes `/topics` and `/topics/:subject`

## Active Constraints
- **Self-improvement logs**: Non-obvious corrections, errors, and feature wishes go to `.learnings/` per `.agents/skills/self-improvement/SKILL.md` and `AGENTS.md`; promote stable learnings to `docs/` or `AGENTS.md`
- **UX copy**: For user-facing strings, follow `.agents/skills/ux-copy/SKILL.md` (see AGENTS.md, `.cursor/rules/ux-copy.mdc`)
- **UX audit + dogfood**: Integrated workflow — ranked findings / walkthroughs → **ux-audit** (`docs/`); repro evidence / agent-browser → **dogfood** (`./dogfood-output/`); combined pipeline in `AGENTS.md` and `docs/WORKFLOW.md` (see `.cursor/rules/ux-audit.mdc`, `.cursor/rules/dogfood.mdc`). **When to run** (vs the screenshot loop, milestones): [docs/WORKFLOW.md](WORKFLOW.md) — *QA vs the screenshot loop*, *After Each Screen*.
- **Product strategy sessions**: Use `.agents/skills/grill-me/SKILL.md` for strategy design and review work in `docs/strategy/` and related roadmap/positioning discussions (see AGENTS.md, `.cursor/rules/grill-me-strategy.mdc`)
- Figma is the source of truth for visual decisions — fetch design context before writing any markup
- shadcn/ui before custom components
- Follow UI constraints in TECH_STACK.md (4px grid, max 2 accents, no decorative gradients, no resting shadows)
- **Positioning (strategy)**: **Product-led** — lead with efficiency and mastery outcomes; privacy and learning science are supporting proof (see [docs/strategy/product-strategy.md](strategy/product-strategy.md))
- **Learning lab**: **Opt-in research studies** may eventually send minimal de-identified events/aggregates for A/B and impact evaluation; **not shipped yet**—no default telemetry. See [docs/strategy/product-strategy.md](strategy/product-strategy.md) (Evaluation & experimentation)

## Next Steps (in order)
1. [ ] Topic detail (wireframe 12)
2. [ ] Mastery gate (wireframe 16)
4. [ ] **Dependency UX** (prerequisites, blocked/ready, path copy on topic detail and related flows) in Phase 2; **full skill tree / graph screen** (wireframe 04) deferred until content volume justifies it (50+ questions minimum) — see [product-strategy.md](strategy/product-strategy.md) (Pillar 5 phase split)

## Recent Updates
- **S6–S11 UX audit + Indonesian copy pass** (2026-03-30): Scoped audit [`docs/audits/ux-audit-s6-s11-2026-03-30.md`](audits/ux-audit-s6-s11-2026-03-30.md); copy inventory [`docs/ux-copy-rebuilds-s2-s11-2026-03-30.md`](ux-copy-rebuilds-s2-s11-2026-03-30.md). Session, progress dashboard, and session complete aligned to Indonesian learner-facing strings (`formatSessionDurationId`, bands, weak area, footers).
- **S6 + S11 wireframe rebuild** (2026-03-29): Progress dashboard overdue card moved above Summary; session complete reordered (weak areas before schedule), Indonesian *Jadwal berikutnya* / *Review berikutnya* / *Besok* etc. via `formatNextReviewDateId`, `streakGoalDays` on `LearnerState`, secondary CTA *Tinjau lebih lanjut*.
- **S2 + S3 session screen rebuild** (2026-03-29): wireframe v2 alignment — removed back button (quit-only exit with Indonesian confirm dialog), difficulty label now shows "Easy · 2/5" format (easy=2 filled dots), modal bottom-sheet feedback panel replaced with inline `FeedbackBanner` + left-border choice accents (`border-l-4 border-l-success/destructive`) + inline explanation panel + inline next button, response time hidden from UI (kept as internal FSRS signal), choice row labels updated to Indonesian ("Jawaban benar" / "Jawaban kamu"), session mix tags hidden during feedback, "Quit session" button hidden during feedback phase. All in `src/pages/session.tsx`.
- **Home + progress dashboard audit** (2026-03-28): CRITICAL — `learnerStore` was not persisted (no `loadState`/`saveState` wiring); fixed by loading from localStorage on init and subscribing to save changes. HIGH — "Start new topic" linked to `/session` (now `/topics`); duplicate EmptyState CTA removed, replaced with Indonesian "Jelajahi topik dulu → /topics"; XP `unit="xp"` redundancy in StatsBar removed. MEDIUM — motivational message handles `streak=0` for returning users; `TopicCard` 0% progress bar now uses neutral track. See [docs/ux-audit-dashboard-2026-03-28.md](ux-audit-dashboard-2026-03-28.md).
- **Topic browser** (2026-03): subject grid (`/topics`) and topic list (`/topics/:subject`) — active card left-border accent + "Continue" CTA, inactive card topic name preview, due count `tag-primary` badge, locked group collapse, "Review in N days" for mastered, "Available to start" group label. UX audit found and fixed: no path to /topics from empty state home, "1 topics" grammar, raw slug as 404 heading. See [docs/ux-audit-topics-2026-03-28.md](ux-audit-topics-2026-03-28.md).
- **Home + progress dashboards** (2026-03): home dashboard (wireframe 01) with greeting, 4-stat bar, today's session card, continue-learning grid, empty state; progress dashboard (wireframe 06) with summary stats, mastery-by-topic list, retention health, export. `MasteryBar` helper fixes 0%-looks-full bug. Routes `/` and `/progress`.
- **Session complete UI polish** (2026-03): streak pluralization fix + first-streak copy ("You started your streak today"), performance-band left-border accent (success/primary/none), XP StatDisplay redundancy removed, "Next due" fallback copy rewritten, topic progress bar now uses `overallMasteryPercent`.
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
