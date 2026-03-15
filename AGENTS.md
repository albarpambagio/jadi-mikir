# AGENTS.md — Agent Behavior Rules

## Universal Prompt (for all AI tools)
Always read the Context Protocol files in docs/ folder before suggesting any code changes:
- docs/CONTEXT.md — Current project state
- docs/TECH_STACK.md — Project standards and UI constraints
- docs/ARCHITECTURE.md — Project map and data flow
- docs/TODO.md — Roadmap and progress

When suggesting UI changes:
- **Figma is the source of truth for visual design.** If a Figma link is provided (in the request or in docs/CONTEXT.md), always fetch the Figma design context first. Use it for layout, hierarchy, spacing, and any custom visual treatment. Never invent visuals that contradict the Figma design.
- **Use shadcn/ui before building from scratch.** When a standard UI primitive is needed (button, input, card, dialog, table, select, etc.), install it from shadcn/ui. Only build a custom component if shadcn/ui has no equivalent, or the Figma design requires behavior shadcn cannot provide.
- Apply tokens and rules from TECH_STACK.md and VISUAL-SPEC.md on top of the shadcn base.

## Agent Behavior
- Be concise — answer directly, avoid preamble/postamble
- Run lint before committing: npm run lint && npm run lint:css
- Never violate UI constraints in TECH_STACK.md
- When uncertain, ask before proceeding

## What NOT to do
- Never use hex colors — only Tailwind tokens
- Never use arbitrary px values — only 4px grid
- Never use gradients on interactive elements
