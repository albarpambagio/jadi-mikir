# TODO.md — Roadmap

## In Progress
- [ ] Build screens screen-by-screen following TECH_STACK.md and Figma designs

## Backlog

### Screens
- [ ] Dashboard page — stats row, today's session, continue learning
- [ ] Skill tree page
- [ ] Topic detail / study session page

### Future
- [ ] Migrate router from wouter → TanStack Router (currently using wouter; TECH_STACK.md specifies TanStack Router)
- [ ] API integration layer
- [ ] Authentication
- [ ] Remediation engine (postponed)
- [ ] Onboarding engine (postponed)
- [ ] Testing coverage

## Completed
- Project initialization with Vite + React 19 + TypeScript
- TanStack Router configuration (currently using wouter as stand-in)
- Tailwind CSS v4 setup
- Context Protocol files created
- Business logic engines (mastery, XP, FSRS, session, fire, recommendations)
- Full UI reset — all previous components, layout, state, tokens deleted
- Established rules: Figma = visual source of truth, shadcn/ui before custom
- Design tokens defined in src/index.css (Nature theme, light + dark)
- shadcn/ui initialized and base components installed (button, card, badge, input, dialog, tabs, progress, tooltip, avatar, scroll-area, separator)
- Rebuilt learner state — src/store/learnerStore.ts
- UI primitive refinement — removed all VISUAL-SPEC violations (resting shadows, opacity-based color variations, rounded-xl on cards, brand-color tooltips, double-wrapped CSS variables, monochromatic chart tokens)
- Font setup — Montserrat (sans), Merriweather (serif), Source Code Pro (mono) via @fontsource
