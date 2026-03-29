# TODO.md — Roadmap

## In Progress
_(none)_

## Backlog

### Screen rebuilds (wireframe-driven — already shipped, needs code update)

Screens already in production that need to be updated to match the revised wireframes (`docs/archives/wireframes_1.md` v2, 2026-03-29):

1. [x] **S2 — Session screen** — ✅ done
2. [x] **S3 — Answer feedback** — ✅ done
3. [x] **S6 — Progress dashboard** — ✅ done
4. [x] **S11 — Session complete** — ✅ done

5. [x] **S17 — Subject browser** (`src/pages/topics.tsx`) — ✅ done
6. [x] **S18 — Topic list** (`src/pages/topic-list.tsx`, `src/components/topics/topic-row.tsx`) — ✅ done

### Screens (build in this order)
1. [ ] **Topic detail** — topic info, start session, mastery status
   - Wireframe: `docs/archives/wireframes_1.md` Screen 12
2. [ ] **Mastery gate** — gate UI shown when advancing between levels
   - Wireframe: `docs/archives/wireframes_1.md` Screen 16
3. [ ] **Onboarding** — three-step flow + diagnostic results (Screens 7–10)
   - Wireframe: `docs/archives/wireframes_1.md` Screens 7, 8, 9, 10
   - Note: S8 shows only Matematika SMP as selectable; other subjects greyed "Segera hadir"
4. [ ] **Settings + Export** — preferences, data portability
   - Wireframe: `docs/archives/wireframes_1.md` Screens 13, 14
5. [ ] **Remediation drill** — two sub-screens: gate prompt (5a) + drill in progress (5b)
   - Wireframe: `docs/archives/wireframes_1.md` Screen 5

### Future
- [ ] **Learning lab / opt-in study pipeline** — consent UX, minimal de-identified events, experiment assignment (per [docs/strategy/product-strategy.md](strategy/product-strategy.md); infrastructure TBD)
- [ ] **Dependency UX** then **skill tree** — ship prerequisite/blocked/next-step UI first; full visual topic-dependency map deferred until 50+ questions exist *(see [product-strategy.md](strategy/product-strategy.md) Pillar 5 phase split)*
- [ ] API integration layer
- [ ] Authentication
- [ ] Testing coverage — unit tests for engines, E2E for session loop
- [ ] PWA — offline support, installability
- [ ] Push notifications — streak reminders
- [ ] Content creator tooling — admin UI for authoring questions (move up if content bottleneck persists)

## Completed
- **S17 + S18 wireframe rebuild** (2026-03-29) — Subject browser: *Subjek saat ini*, Indonesian chrome, inactive-card switch warning (`AlertTriangle`), CTAs *Lihat Daftar Topik* / *Ganti ke subjek ini*; topic list: *Prasyarat* / *Butuh* with names, no empty 0% progress strip, Indonesian group labels; return to `/topics` via header back only (footer duplicate removed) — `topics.tsx`, `subject-card.tsx`, `topic-list.tsx`, `topic-row.tsx`; UX sweep: [`docs/audits/s17-s18-wireframe-2026-03-29.md`](audits/s17-s18-wireframe-2026-03-29.md)
- **S6 + S11 wireframe rebuild** (2026-03-29) — Progress: overdue alert at top (*Kartu perlu ditinjau*) with `AlertCircle` + *Tinjau Sekarang* CTA, duplicate review CTA removed from retention block — `src/pages/progress.tsx`. Session complete: section order weak areas → *Jadwal berikutnya*, Indonesian next-review day via `formatNextReviewDateId`, topic line *kartu*, CTA *Tinjau lebih lanjut*, `streakGoalDays` on `LearnerState` (default 30) — `session-complete-view.tsx`, `session.tsx`, `types`, `learnerStore`, `session-complete-aggregates.ts`
- **S2 + S3 session screen rebuild** (2026-03-29) — wireframe v2 alignment: removed back button (quit-only exit), difficulty label shows "Easy · 2/5", quit dialog Indonesian copy, modal feedback panel replaced with inline banner + left-border choice accents + inline explanation + Indonesian choice labels, response time hidden from UI — `src/pages/session.tsx`
- **Home + progress dashboard UX audit** (2026-03-28) — 1 Critical + 3 High + 2 Medium fixes: `learnerStore` localStorage persistence, "Start new topic" → `/topics`, EmptyState duplicate CTA removed, XP unit redundancy, motivational message for returning users, TopicCard 0% neutral track; report: [docs/ux-audit-dashboard-2026-03-28.md](ux-audit-dashboard-2026-03-28.md)
- **Topic browser** (wireframes 17, 18) — `src/pages/topics.tsx`, `src/pages/topic-list.tsx`, `src/components/topics/` (subject-card, topic-row), `src/lib/hooks/use-topic-browser.ts`; routes `/topics` and `/topics/:subject`; UX audit + 3 fixes applied
- **Dashboard / Home** (wireframes 01, 06) — `src/pages/home.tsx`, `src/pages/progress.tsx`, `src/components/dashboard/` (header, stats-bar, today-session-card, topic-card, skeleton); routes `/` and `/progress`
- Session complete **UI polish** (2026-03): streak pluralization, first-streak copy, band left-border accent, XP display fix, "Next due" copy, topic bar uses overall mastery — `src/components/session/session-complete-view.tsx`
- Session complete **audit + dogfood follow-ups** (2026-03): multi-topic headline/copy, `<main>` + heading focus + `document.title`, summary skeleton, Confirm scroll + instant scroll on feedback — see [docs/audits/session-complete-screen-ux-audit-2026-03-28.md](audits/session-complete-screen-ux-audit-2026-03-28.md)
- Session complete screen (wireframe 11) — `src/components/session/session-complete-view.tsx`, `src/lib/session-complete-aggregates.ts`, wired from `src/pages/session.tsx` (streak update, metrics, next due, weak areas)
- Session screen — `src/pages/session.tsx` — answering + feedback phases, choice randomization, XP award; routes `/session` and `/session/:topicId`
- Project initialization with Vite + React 19 + TypeScript
- Routing: wouter 3.x (committed; replaced TanStack Router from original spec)
- Tailwind CSS v4 setup
- Context Protocol files created
- Business logic engines (mastery, XP, FSRS, session, FIRe, recommendations, interleaving, remediation, diagnostic, dashboard, exportImport)
- Design tokens defined in src/index.css (Nature theme, light + dark)
- shadcn/ui initialized and base components installed (button, card, badge, input, dialog, tabs, progress, tooltip, avatar, scroll-area, separator)
- Rebuilt learner state — src/store/learnerStore.ts
- UI primitive refinement — removed all VISUAL-SPEC violations
- Font setup — Montserrat (sans), Merriweather (serif), Source Code Pro (mono) via @fontsource
- Enabled strict TypeScript (`strict: true` in tsconfig.json)
- Removed dead dependencies: `@base-ui/react`, `framer-motion`
- CONTEXT.md rewritten to reflect actual project state
- Analytics simplified: deleted `analytics.ts` and `engines/dashboard.ts`; consolidated stats into `use-dashboard-stats.ts`
