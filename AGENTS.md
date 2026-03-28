# AGENTS.md — Agent Behavior Rules

## Universal Prompt (for all AI tools)
Always read the Context Protocol files in docs/ folder before suggesting any code changes:
- docs/CONTEXT.md — Current project state
- docs/TECH_STACK.md — Project standards, UI constraints, factory.ai pattern components
- docs/ARCHITECTURE.md — Project map and data flow
- docs/TODO.md — Roadmap and progress
- docs/WORKFLOW.md — How to collaborate on UI development (screen build loop, patterns, prompts)

When suggesting UI changes:
- **Figma is the source of truth for visual design.** If a Figma link is provided (in the request or in docs/CONTEXT.md), always fetch the Figma design context first. Use it for layout, hierarchy, spacing, and any custom visual treatment. Never invent visuals that contradict the Figma design.
- **Use shadcn/ui before building from scratch.** When a standard UI primitive is needed (button, input, card, dialog, table, select, etc.), install it from shadcn/ui. Only build a custom component if shadcn/ui has no equivalent, or the Figma design requires behavior shadcn cannot provide.
- Apply tokens and rules from TECH_STACK.md and VISUAL-SPEC.md on top of the shadcn base.

## Agent Behavior
- Be concise — answer directly, avoid preamble/postamble
- Run lint before committing: npm run lint && npm run lint:css
- Never violate UI constraints in TECH_STACK.md
- When uncertain, ask before proceeding

## Documentation — Keep In Sync
After any change that affects project structure, completed work, or active constraints, update the relevant docs **in the same session** before committing:

| What changed | Update these docs |
|---|---|
| A file was added, moved, renamed, or deleted | `docs/ARCHITECTURE.md` (directory structure) |
| A feature, engine, or screen was completed | `docs/TODO.md` (move to Completed), `docs/CONTEXT.md` (What's Complete) |
| Current work-in-progress changed | `docs/CONTEXT.md` (Current Focus + Next Steps) |
| A dependency was added or removed | `docs/TECH_STACK.md`, `docs/ARCHITECTURE.md` |
| A constraint or convention was established | `docs/TECH_STACK.md` or `AGENTS.md` |
| Strategy or roadmap shifted | `docs/strategy/product-strategy.md` or `docs/strategy/master-project-plan.md` |

Never leave `docs/CONTEXT.md` stale — it is the primary context file read by all AI tools at the start of every session. A stale CONTEXT.md causes incorrect assumptions and wasted work.

## What NOT to do
- Never use hex colors — only Tailwind tokens
- Never use arbitrary px values — only 4px grid
- Never use gradients on interactive elements
