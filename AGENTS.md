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

**UX copy (microcopy, labels, errors, empty states, CTAs, confirmations, tooltips, onboarding, loading copy):** Before writing or reviewing user-facing strings, read `.agents/skills/ux-copy/SKILL.md` and follow its principles and **Output** structure (recommended copy, alternatives table, rationale, localization notes). When implementing copy in UI, still follow Figma and shadcn rules above.

**Product strategy design sessions** (roadmap, positioning, `docs/strategy/` docs, critiques, master project plan, pre-implementation vetting): Use `.agents/skills/grill-me/SKILL.md` for the session — stress-test the plan through systematic questioning (one question at a time, recommended answer each time); explore the codebase when it resolves a question. Do not skip this workflow when the user is explicitly in a strategy design or review session.

## Self-improvement (learning logs)

Use the [pskoett self-improvement](https://skills.sh/pskoett/self-improving-agent/self-improvement) skill: read `.agents/skills/self-improvement/SKILL.md` for the full quick reference, entry formats, and resolution workflow.

**OpenCode:** Skills under `.agents/skills/` are discovered automatically ([OpenCode skills](https://opencode.ai/docs/skills)). Use the native **skill** tool to load `self-improvement` when you need the full checklist; this file (`AGENTS.md`) is listed in `opencode.json` so session instructions already include the workflow below.

**Logs live in** `.learnings/`:

| File | Use for |
|------|---------|
| `LEARNINGS.md` | User corrections, knowledge gaps, best practices |
| `ERRORS.md` | Failed commands, exceptions, API/tool failures |
| `FEATURE_REQUESTS.md` | Requested capabilities not yet built |

**IDs**: `LRN-YYYYMMDD-XXX`, `ERR-YYYYMMDD-XXX`, `FEAT-YYYYMMDD-XXX` (see skill).

**When to append** (non-exhaustive): non-obvious failures, user corrections (“actually…”), outdated docs discovered, integration gotchas, recurring confusion worth recording.

**Promotion**: When a learning is broadly applicable, distill it and add it to the right doc — conventions and standards → `docs/TECH_STACK.md`; current project truth and focus → `docs/CONTEXT.md`; agent workflow rules → this file (`AGENTS.md`). Update the original `.learnings/` entry status to `promoted` (see skill).

**Git**: `.learnings/*.md` are **tracked** in this repo so the team and agents share the same memory. Do not add `.learnings/` to `.gitignore` unless the team explicitly switches to personal-only logs.

**Other repositories**: Run `npx skills add https://github.com/pskoett/self-improving-agent --skill self-improvement -y`, add the same `.learnings/` files (copy templates from `.agents/skills/self-improvement/assets/` or this repo), and paste the self-improvement subsection above into that project’s `AGENTS.md` (or a shared template).

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
| A learning was promoted from `.learnings/` | Target doc per Self-improvement section above; update the learning entry status |
| Strategy or roadmap shifted | `docs/strategy/product-strategy.md` or `docs/strategy/master-project-plan.md` |

Never leave `docs/CONTEXT.md` stale — it is the primary context file read by all AI tools at the start of every session. A stale CONTEXT.md causes incorrect assumptions and wasted work.

## What NOT to do
- Never use hex colors — only Tailwind tokens
- Never use arbitrary px values — only 4px grid
- Never use gradients on interactive elements
