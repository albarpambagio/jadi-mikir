# UI Development Plan

## Why the Previous Attempt Broke

Built **bottom-up** — isolated atomic components first (Storybook-driven), with mock data baked into each component, disconnected from the real data layer. When assembled into a screen, nothing fit together cleanly.

---

## What Already Exists — Do Not Rebuild

| Layer | Location | What it provides |
|---|---|---|
| Design tokens | `src/index.css` | Colors, spacing, typography, radius, shadows |
| UI primitives | `src/components/ui/` | `button`, `card`, `badge`, `progress`, `input`, `dialog`, `tooltip`, `tabs`... |
| Layout | `src/components/layout/` | `header`, `sidebar`, `main-layout` |
| Business logic | `src/lib/engines/` | mastery, XP, FSRS, session, fire, recommendations |
| State | `src/store/learnerStore.ts` | Learner state (XP, streak, cards, topics) |
| Data hook | `src/lib/hooks/use-dashboard-stats.ts` | Returns streak, XP, completedCount, totalDue, sortedTopics |

The data layer already returns everything the wireframe needs. The UI primitives already exist. **Nothing needs to be created from scratch except the dashboard page itself.**

---

## The Rule

> Build one visible section → verify in browser → lint → commit → repeat.

Never move to the next section until the current one is clean.

---

## Phase 0 — Verify the Shell

Before writing any dashboard code:

1. Confirm `src/components/layout/main-layout.tsx` typechecks cleanly
2. Wire `router.tsx` to use `MainLayout` as the layout wrapper (currently has an inline `Layout` function)
3. Run `npm run dev` — confirm the shell renders with no errors in the browser

**Gate:** app loads, layout renders, no TypeScript or console errors.

---

## Phase 1 — Dashboard Page Scaffold

Create `src/pages/dashboard.tsx` as the single entry point:

```
src/pages/dashboard.tsx
  └── calls useDashboardStats() once
  └── passes stats as props to section components
  └── renders 3 sections in order
```

Update `router.tsx` — point the `'/'` route at `DashboardPage` from `src/pages/dashboard.tsx`.

**Hard rule:** `useDashboardStats()` is called **once**, at the page level. Section components receive data as props — they never fetch their own data.

**Gate:** page renders placeholder for each section, no errors.

---

## Phase 2 — Build Sections In Order

Each section lives in `src/components/dashboard/`. Each section:
- accepts typed props (no internal data fetching, no inline mock data)
- uses only existing primitives from `src/components/ui/`
- passes `npm run lint` before moving to the next

### Section 1 — Stats Row

File: `src/components/dashboard/stats-row.tsx`

Wireframe region:
```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  🔥 Streak   │  │  ⭐ XP Total │  │  Topics Done │  │ Due Today    │
│   12 days    │  │   4,820 xp   │  │   18 / 42    │  │  14 cards    │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
```

Props: `streak`, `totalXP`, `completedCount`, `totalTopics`, `totalDue`
Primitives: `<Card>` from `src/components/ui/card.tsx`

### Section 2 — Today's Session

File: `src/components/dashboard/today-session.tsx`

Wireframe region:
```
┌─────────────────────────────────────────────────────────────────┐
│  [▶  Start Review Session]   14 due cards across 5 topics       │
│  ──────────────────────────────────────────────────────────── │
│  [+  Start New Topic]        Browse all topics in skill tree    │
└─────────────────────────────────────────────────────────────────┘
```

Props: `totalDue`, `topicsWithDue`
Primitives: `<Button>` (primary variant for Review, secondary for New Topic), `<Card>`

### Section 3 — Continue Learning

File: `src/components/dashboard/continue-learning.tsx`

Wireframe region:
```
┌────────────────────────────┐  ┌────────────────────────────┐
│  Sistem Persamaan Linear   │  │  Trigonometri Dasar        │
│  ████████░░░░  62%         │  │  ██░░░░░░░░  12%           │
│  In Progress · 8 due       │  │  Just started              │
│  [Continue →]              │  │  [Start →]                 │
└────────────────────────────┘  └────────────────────────────┘
```

Props: `topics` (sorted array from `getSortedTopics`)
Primitives: `<Card>`, `<Progress>`, `<Badge>`, `<Button>` (secondary variant)

---

## Phase 3 — Footer Actions

Add below the topic grid in `dashboard.tsx`:

```
[View Skill Tree →]                    [View All Topics →]
```

Use `<Button variant="ghost">` or a plain `<Link>` styled as secondary. No new components needed.

---

## Hard Rules (apply to every section)

| Rule | Why |
|---|---|
| `useDashboardStats()` called once at page level only | Prevents data duplication, makes components testable |
| Use existing `src/components/ui/` primitives | Never write `<div className="bg-surface-raised border ...">` when `<Card>` exists |
| `npm run lint` must pass before next section | Catches token violations and class ordering issues early |
| Build in the running app, not in isolation | You see real data and real layout context immediately |
| One commit per section | Small, reviewable, easy to revert |
| No mock data inside components | Mock data belongs in `router.tsx` (temp) or the store only |

---

## Token Quick Reference

Use these tokens — never hardcode hex values or arbitrary sizes.

| Purpose | Token |
|---|---|
| Page background | `bg-background` |
| Card / raised surface | `bg-surface-raised` |
| Muted section background | `bg-muted` |
| Primary text | `text-foreground` |
| Secondary text | `text-muted-foreground` |
| Primary brand color | `bg-primary`, `text-primary` |
| Borders | `border-border` |
| Primary button | `bg-primary text-primary-foreground hover:bg-primary-hover` |
| Card container | `bg-surface-raised border border-border rounded-lg p-4` or `p-6` |
| Shadow on hover | `hover:shadow-sm` (interactive cards only) |

---

## Checklist Before Calling a Screen "Done"

- [ ] Renders correctly at 1280px desktop width
- [ ] No console errors or TypeScript errors
- [ ] `npm run lint` passes with zero errors
- [ ] All text uses token-based classes (no `text-[#...]`, no `text-[14px]`)
- [ ] All spacing uses 4px grid (no `gap-5`, `p-5`, `m-7`, etc.)
- [ ] Interactive elements have visible focus states
- [ ] Empty state handled (what shows when `topics` is undefined or empty)
