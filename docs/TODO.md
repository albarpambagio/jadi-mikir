# TODO.md — Roadmap

## In Progress
- [ ] Define design tokens in src/index.css

## Backlog

### Foundation
- [ ] Add shadcn/ui (init + install base components)
- [ ] Rebuild UI primitives via shadcn (button, card, badge, input, dialog, tabs, progress, tooltip)
- [ ] Rebuild layout — header, sidebar, main-layout
- [ ] Rebuild learner state — src/store/learnerStore.ts

### Screens
- [ ] Dashboard page — stats row, today's session, continue learning
- [ ] Skill tree page
- [ ] Topic detail / study session page

### Future
- [ ] API integration layer
- [ ] Authentication
- [ ] Remediation engine (postponed)
- [ ] Onboarding engine (postponed)
- [ ] Testing coverage

## Completed
- Project initialization with Vite + React 19 + TypeScript
- TanStack Router configuration
- Tailwind CSS v4 setup
- Context Protocol files created
- Business logic engines (mastery, XP, FSRS, session, fire, recommendations)
- Full UI reset — all previous components, layout, state, tokens deleted
- Established rules: Figma = visual source of truth, shadcn/ui before custom
