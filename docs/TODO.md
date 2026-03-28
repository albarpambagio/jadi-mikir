# TODO.md — Roadmap

## In Progress
- [ ] Session complete screen — results summary, XP earned, streak update
  - Wireframe: `docs/wireframes/screen-11-session-complete.md`

## Backlog

### Screens (build in this order)
1. [ ] **Dashboard / Home** — stats row, today's session, continue learning
   - Wireframes: `docs/wireframes/screen-01-home-dashboard.md`, `screen-06-progress-dashboard.md`
3. [ ] **Topic browser** — all topics list, topics within a subject
   - Wireframes: `docs/wireframes/screen-17-all-topics-browser.md`, `screen-18-topic-list-within-subject.md`
4. [ ] **Topic detail** — topic info, start session, mastery status
   - Wireframe: `docs/wireframes/screen-12-topic-detail.md`
5. [ ] **Mastery gate** — gate UI shown when advancing between levels
   - Wireframe: `docs/wireframes/screen-16-mastery-gate.md`
6. [ ] **Onboarding** — three-step flow + diagnostic results completion state
   - Wireframes: `docs/wireframes/screen-07-onboarding-step-1.md`, `screen-08-onboarding-step-2.md`, `screen-09-onboarding-step-3.md` *(screen-09 includes diagnostic results)*
7. [ ] **Settings + Export** — preferences, data portability (export/import covered in Settings)
   - Wireframe: `docs/wireframes/screen-13-settings.md`
8. [ ] **Remediation drill** — mid-session interrupt for prerequisite gaps
   - Wireframe: `docs/wireframes/screen-02-active-question-session.md` *(remediation variant section)*

### Future
- [ ] Skill tree — visual topic dependency map *(defer until 50+ questions exist; wireframe removed)*
- [ ] API integration layer
- [ ] Authentication
- [ ] Testing coverage — unit tests for engines, E2E for session loop
- [ ] PWA — offline support, installability
- [ ] Push notifications — streak reminders
- [ ] Content creator tooling — admin UI for authoring questions (move up if content bottleneck persists)

## Completed
- Session screen — `src/pages/session.tsx` — answering + feedback phases, choice randomization, XP award, session complete inline summary; routes `/session` and `/session/:topicId`
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
