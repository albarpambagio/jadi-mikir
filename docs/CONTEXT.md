# CONTEXT.md — Current State

## Current Focus
Full clean slate — all UI layers removed. Ready to build from zero.

## Design / Figma
Figma: [link to file or key screen]. Use for layout and hierarchy when implementing or reviewing UI.

## Active Constraints
- None currently

## Next Steps
1. [ ] Define design tokens in src/index.css
2. [ ] Rebuild UI primitives in src/components/ui/
3. [ ] Rebuild layout in src/components/layout/
4. [ ] Rebuild learner state in src/store/learnerStore.ts
5. [ ] Build screens screen-by-screen following TECH_STACK.md

## Recent Updates
- Full reset: src/components/ui/, src/components/layout/, src/store/learnerStore.ts, src/components/questions/ all deleted
- src/index.css stripped to bare Tailwind directives
- main.tsx cleaned up (TooltipProvider removed)
