# TODO.md — Roadmap

## In Progress
- [ ] Session screen — question display → answer selection → feedback → next question
  - Wireframes: `docs/wireframes/screen-02-active-question-session.md`, `screen-03-answer-feedback.md`

## Backlog

### Screens (build in this order)
1. [ ] **Session complete** — results summary, XP earned, streak update
   - Wireframe: `docs/wireframes/screen-11-session-complete.md`
2. [ ] **Dashboard / Home** — stats row, today's session, continue learning
   - Wireframes: `docs/wireframes/screen-01-home-dashboard.md`, `screen-06-progress-dashboard.md`
3. [ ] **Topic browser** — all topics list, topics within a subject
   - Wireframes: `docs/wireframes/screen-17-all-topics-browser.md`, `screen-18-topic-list-within-subject.md`
4. [ ] **Topic detail** — topic info, start session, mastery status
   - Wireframe: `docs/wireframes/screen-12-topic-detail.md`
5. [ ] **Mastery gate** — gate UI shown when advancing between levels
   - Wireframe: `docs/wireframes/screen-16-mastery-gate.md`
6. [ ] **Onboarding** — three-step onboarding flow
   - Wireframes: `docs/wireframes/screen-07-onboarding-step-1.md`, `screen-08-onboarding-step-2.md`, `screen-09-onboarding-step-3.md`
7. [ ] **Diagnostic results** — placement results after initial diagnostic
   - Wireframe: `docs/wireframes/screen-10-diagnostic-results.md`
8. [ ] **Settings + Export** — preferences, data portability
   - Wireframes: `docs/wireframes/screen-13-settings.md`, `screen-14-export-data-portability.md`
9. [ ] **Empty state** — shown when no content is loaded
   - Wireframe: `docs/wireframes/screen-15-empty-state.md`
10. [ ] **Remediation drill** — targeted practice for weak areas
    - Wireframe: `docs/wireframes/screen-05-remediation-drill.md`
11. [ ] **Skill tree** — visual topic dependency map *(defer until 50+ questions exist)*
    - Wireframe: `docs/wireframes/screen-04-skill-tree.md`

### Future
- [ ] API integration layer
- [ ] Authentication
- [ ] Testing coverage — unit tests for engines, E2E for session loop
- [ ] PWA — offline support, installability
- [ ] Push notifications — streak reminders
- [ ] Content creator tooling — admin UI for authoring questions (move up if content bottleneck persists)

## Completed
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
