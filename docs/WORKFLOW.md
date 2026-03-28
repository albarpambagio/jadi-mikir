# WORKFLOW.md — Agent-Assisted UI Development

How to collaborate with the AI agent to build screens for JadiMahir without Figma.

---

## Overview

All backend engines, state, primitives, and design tokens are complete. The remaining work is building UI screens one at a time. The agent reads wireframes, applies the factory.ai design patterns, and screenshots the result for review. You give feedback and it iterates.

```
Wireframe → Agent builds → Screenshot → You review → Feedback → Repeat
```

---

## Starting a Screen

### Minimum viable prompt

```
Build the session screen — wireframe: docs/wireframes/screen-02-active-question-session.md
```

That's enough. The agent will:
1. Read the wireframe for layout and content hierarchy
2. Read `CONTEXT.md`, `TECH_STACK.md` for constraints
3. Implement the screen file under `src/pages/` or `src/components/`
4. Apply factory.ai patterns where appropriate
5. Run lints and screenshot the result

### Requesting specific patterns

```
Build the dashboard. Use SectionLabel above each section and StatDisplay for the stats row.
```

```
Build the topic browser. Use NumberedTabsList for subject tabs.
```

```
Build the onboarding flow. Use StepCounter for the 01/03 progress indicator.
```

Or skip this — just say "apply factory.ai patterns where appropriate" and the agent decides.

### If you have a Figma link

```
Build the dashboard — Figma: https://figma.com/design/abc123/...
```

The agent will fetch design context from Figma first and use it for layout and visual decisions before writing any markup. Figma overrides wireframe layout when both exist.

---

## The Review Loop

### Screenshot on demand

After a screen is built, ask the agent to render it:

```
Screenshot the session screen
```

The agent starts the dev server, opens the browser, and returns a screenshot. You review visually and give feedback.

### Feedback that works

Be specific about what to change:

| Instead of | Say |
|---|---|
| "It doesn't look right" | "The card padding is too tight — needs p-6 not p-4" |
| "Make it better" | "The stat row values are too small, increase to text-3xl" |
| "It feels off" | "Remove the shadow on the answer option cards" |
| "Change the style" | "Swap the standard tabs for NumberedTabsList" |

### Iterating

```
The question text needs more breathing room above the answer options.
Also the progress counter should be top-right, not top-left.
```

Give all feedback in one message — the agent applies everything at once.

---

## QA: UX audit + dogfood

Two agent skills cover browser-based quality work; use **both** for release-style checks, or **one** for a lighter pass.

| Skill | Best for | Output |
|-------|----------|--------|
| **ux-audit** (`.agents/skills/ux-audit/`) | Walkthrough, friction, QA sweep, ranked findings | Reports under `docs/` per skill template |
| **dogfood** (`.agents/skills/dogfood/`) | Exploratory testing, bug hunts, repro evidence | `./dogfood-output/` + structured report |

**Suggested flow:** (1) **ux-audit** to surface and rank issues. (2) **dogfood** on Critical/High flows for screenshots and step-by-step repro. (3) Quick bug hunt → **dogfood** only. (4) UX narrative only → **ux-audit** only.

**Local app URL:** `http://localhost:5173` with `npm run dev`. Full rules: [`AGENTS.md`](../AGENTS.md) (UX audit + dogfood).

---

## Available Factory.ai Components

Built in `src/components/ui/`. Reference `TECH_STACK.md` for full usage rules.

### StepCounter

Zero-padded question/step progress. Use for session screens, onboarding, mastery gate.

```tsx
<StepCounter current={3} total={20} prefix="Q" size="md" />
// Renders:  Q  03 / 20
```

Sizes: `sm` `md` `lg`

### StatDisplay

Monospace metric readout for stats rows and session summaries.

```tsx
<StatDisplay value={120} unit="xp" label="XP earned" size="md" />
<StatDisplay value="87" unit="%" label="Accuracy" />
```

Sizes: `sm` `md` `lg`

### SectionLabel

Small eyebrow label with a primary-colored bullet (•) before section headings.

```tsx
<SectionLabel>Today's progress</SectionLabel>
// Renders:  • Today's progress

<SectionLabel showPrefix={false}>No dot</SectionLabel>
```

### NumberedTabsList + NumberedTabsTrigger

Borderless tab strip with `01 · Label` numbered format.

```tsx
<Tabs defaultValue="math">
  <NumberedTabsList>
    <NumberedTabsTrigger index={0} value="math">Matematika</NumberedTabsTrigger>
    <NumberedTabsTrigger index={1} value="ipa">IPA</NumberedTabsTrigger>
  </NumberedTabsList>
  <TabsContent value="math">...</TabsContent>
</Tabs>
```

For a **vertical** sidebar nav (settings, step wizard), render inside `flex-col gap-2` and swap `border-b-2` for `border-l-2` on the active item.

### Badge tag variants

Compact classification labels for cards and news items.

```tsx
<Badge variant="tag">Matematika</Badge>       // muted background
<Badge variant="tag-primary">New</Badge>      // primary background
```

### Dark precision mode

Near-black dark theme (factory.ai aesthetic). Apply to `<html>` instead of `dark`:

```html
<html class="dark-precision">
```

To preview a screen in this mode, tell the agent: `screenshot with dark-precision`.

---

## Screen Build Order

Build in this sequence (from `docs/TODO.md`):

| # | Screen | Key patterns | Wireframe |
|---|---|---|---|
| 1 | Session | `StepCounter`, `Badge variant=tag` | `screen-02`, `screen-03` |
| 2 | Session complete | `StatDisplay` | `screen-11` |
| 3 | Dashboard | `SectionLabel`, `StatDisplay`, `NumberedTabsList` | `screen-01`, `screen-06` |
| 4 | Topic browser | `NumberedTabsList`, `Badge variant=tag` | `screen-17`, `screen-18` |
| 5 | Topic detail | `StepCounter` (mastery level) | `screen-12` |
| 6 | Mastery gate | `StepCounter` | `screen-16` |
| 7 | Onboarding | `StepCounter` | `screen-07`, `screen-08`, `screen-09` |
| 8 | Settings | standard shadcn primitives | `screen-13` |

---

## Hard Rules (Always Applied)

The agent enforces these automatically. Listed here so your feedback aligns with them.

1. **Flat-first** — no decorative gradients on cards or buttons
2. **Two accents max** per screen — if a third color appears, something is wrong
3. **4px grid** — no `gap-5`, `p-5`, `m-7`; use `gap-4`, `p-4`, `gap-6`, `p-6`
4. **No resting shadows** — `shadow-sm` only on hover for interactive cards
5. **Monospace for metrics** — any number representing a stat uses `font-mono`
6. **Sentence case** — no uppercase text except table headers and keyboard shortcuts
7. **shadcn/ui first** — never hand-roll a primitive that shadcn already provides
8. **One call per hook at page level** — data hooks called once at the page, passed as props

---

## Prompts by Goal

| Goal | Prompt |
|---|---|
| Start a new screen | `"Build screen-02 session screen"` |
| See the current state | `"Screenshot the current app"` |
| Apply a specific pattern | `"Use StepCounter for the question progress in the session screen"` |
| Fix a spacing issue | `"The answer card padding is too tight, increase to p-6"` |
| Test dark mode | `"Screenshot the dashboard with dark-precision mode"` |
| Check lint | `"Run lint and fix any errors"` |
| Review after changes | `"Screenshot and compare against the wireframe"` |
| Mobile check | `"Screenshot at 375px width"` |

---

## Where Things Live

```
docs/
├── CONTEXT.md          ← Current state, active constraints, next steps
├── TECH_STACK.md       ← All UI rules, factory.ai pattern docs
├── ARCHITECTURE.md     ← Directory structure, data flow
├── TODO.md             ← Screen backlog with order
├── WORKFLOW.md         ← This file
└── wireframes/         ← One .md per screen (layout source of truth)

src/
├── components/
│   ├── ui/             ← All shadcn + factory.ai pattern components
│   └── layout/         ← App shell
├── pages/              ← One file per route/screen
├── store/              ← Learner state
└── lib/
    ├── engines/        ← Business logic (don't touch during UI work)
    └── hooks/          ← Data hooks consumed by pages
```

---

## After Each Screen

The agent updates docs automatically when a screen is finished:

- `docs/TODO.md` — screen moved to Completed
- `docs/CONTEXT.md` — Current Focus updated
- `docs/ARCHITECTURE.md` — new files listed

You don't need to manage these manually.
