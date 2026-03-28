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
- Figma is the source of truth for visual decisions — fetch design context before writing any markup
- shadcn/ui before custom components
- Follow UI constraints in TECH_STACK.md (4px grid, max 2 accents, no decorative gradients, no resting shadows)

## Next Steps (in order)
1. [ ] Session complete screen — results summary, XP earned, streak update (wireframe 11)
2. [ ] Dashboard / home (wireframes 01, 06)
3. [ ] Topic browser — all topics, topics within subject (wireframes 17, 18)
4. [ ] Topic detail (wireframe 12)
5. [ ] Skill tree (wireframe 04) — defer until content volume justifies it (50+ questions minimum)

## Recent Updates
- Enabled `strict: true` in tsconfig.json (was `strict: false`)
- Removed dead dependencies: `@base-ui/react`, `framer-motion`
- Router committed to wouter 3.x; TanStack Router removed from spec
- Analytics simplified: deleted `src/lib/analytics.ts` and `src/lib/engines/dashboard.ts` (unused, partially broken); `getMotivationalMessage` preserved in `use-dashboard-stats.ts`; emoji strings removed from `recommendations.ts`
