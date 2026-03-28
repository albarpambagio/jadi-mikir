# CONTEXT.md — Current State

## Current Focus
Building screens. All backend engines, state, primitives, and design tokens are complete. The next task is building UI screens one-by-one, starting with the session loop.

## Design / Figma
Figma: [link to file or key screen]. Use for layout and hierarchy when implementing or reviewing UI.

## What's Complete
- **Business logic engines** (`src/lib/engines/`): FSRS, mastery, XP, session, interleaving, remediation, diagnostic, FIRe, dashboard, recommendations, exportImport — all 11 engines done
- **Storage**: IndexedDB (`src/lib/storage/indexedDB.ts`) + hybrid adapter (`src/lib/storage/hybrid.ts`)
- **State**: `src/store/learnerStore.ts` — learner progress, session state, streaks
- **Design tokens**: `src/index.css` — Nature theme, light + dark mode, full token set
- **UI primitives** (`src/components/ui/`): button, card, badge, input, dialog, tabs, progress, tooltip, avatar, scroll-area, separator — all themed to VISUAL-SPEC
- **Layout shell**: `src/components/layout/layout.tsx`
- **Routing**: wouter 3.x — committed router
- **Fonts**: Montserrat (sans), Merriweather (serif), Source Code Pro (mono)
- **Content fetching**: `src/lib/content.ts` — TanStack Query hooks for `/content/*.json`

## Active Constraints
- Figma is the source of truth for visual decisions — fetch design context before writing any markup
- shadcn/ui before custom components
- Follow UI constraints in TECH_STACK.md (4px grid, max 2 accents, no decorative gradients, no resting shadows)

## Next Steps (in order)
1. [ ] Session screen — question display → answer selection → feedback (wireframes 02, 03)
2. [ ] Session complete screen (wireframe 11)
3. [ ] Dashboard / home (wireframes 01, 06)
4. [ ] Topic browser — all topics, topics within subject (wireframes 17, 18)
5. [ ] Skill tree (wireframe 04) — defer until content volume justifies it (50+ questions minimum)

## Recent Updates
- Enabled `strict: true` in tsconfig.json (was `strict: false`)
- Removed dead dependencies: `@base-ui/react`, `framer-motion`
- Router committed to wouter 3.x; TanStack Router removed from spec
- CONTEXT.md rewritten to reflect actual state (was incorrectly showing "full clean slate")
