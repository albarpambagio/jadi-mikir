# TECH_STACK.md — Project Standards

## Tech Stack
- **Framework**: React 19 + Vite 6
- **Language**: TypeScript 5
- **Routing**: wouter 3.x
- **State Management**: TanStack Query 5 + TanStack Store
- **Styling**: Tailwind CSS v4 + CVA
- **Forms**: React Hook Form + Zod
- **Testing**: Vitest + Playwright

## Component Sourcing (follow this order)

1. **shadcn/ui first** — for any standard primitive (button, input, card, dialog, select, table, tabs, badge, etc.), add it from shadcn/ui (`npx shadcn@latest add <component>`). Do not hand-roll what shadcn already provides.
2. **Figma first for visuals** — Figma is the source of truth for layout, spacing, and custom styling. When a Figma design is available, fetch its context before writing any markup. Never invent visual decisions that contradict the Figma design.
3. **Custom only when necessary** — build a component from scratch only if shadcn/ui has no equivalent, or the Figma design requires interaction/layout behavior shadcn cannot support.

## Code Conventions
- Functional components only (no classes)
- File naming: kebab-case for files, PascalCase for components
- Always use Zod for validation
- Always use cn() for conditional classes (from tailwind-merge)
- Use Lucide React for icons

## UI Constraints (from VISUAL-SPEC.md)

### Design principles (non-negotiable)
1. Flat-first. No gradient is decorative. Gradients only encode data (progress, temperature, status).
2. One shadow level per interaction state: resting = no shadow, hover = shadow-sm, active = shadow-md.
3. Two accent colors maximum on any screen. If you need a third, revisit the layout.
4. Every text element uses a named type scale step. No arbitrary font sizes.
5. Spacing follows the 4px grid. No 5px, 7px, 11px, 15px values.

### Color usage rules
- Backgrounds: surface or surface-raised only. Never brand or accent colors as page backgrounds.
- Text: text (primary) or text-muted only. Brand color is for interactive elements, not labels.
- Borders: border token only. No colored borders except validation states (error/success).
- Never use opacity to create color variations — use the token scale.

### Typography rules
- Body text: text-base, font-sans, leading-relaxed (1.625)
- Labels / UI chrome: text-sm, font-medium
- Headings: text-xl through text-3xl, font-semibold — never bold (700+)
- Maximum 3 type sizes per screen section
- No uppercase text except keyboard shortcuts and table headers

### Component rules

#### Buttons
- Primary: bg-primary text-white, hover:bg-primary-hover, no shadow
- Secondary: bg-transparent border-border text-text, hover:bg-neutral-100
- Destructive: bg-transparent border-red text-red, hover:bg-red-50
- No icon-only buttons without a tooltip
- Never more than 2 button variants in one form

#### Cards
- bg-surface-raised, border border-border, rounded-lg
- Padding: p-4 (compact) or p-6 (default)
- No shadow by default. shadow-sm on hover if the card is interactive.
- Never nest cards more than one level deep.

#### Form inputs
- Height: 36px (h-9)
- Border: border-border, focus:border-primary, focus:ring-2 focus:ring-primary/20
- Error state: border-red-400, bg-red-50/30
- Never use colored backgrounds on inputs (no blue inputs, no gradient inputs)

### What AI-generated slop looks like (avoid these)
- border-radius: 16px or larger on non-pill elements
- Multiple box-shadows stacked on the same element
- Gradient backgrounds on buttons or cards
- More than 3 font weights in one component
- Hover states that change color AND shadow AND scale simultaneously
- Placeholder text styled as a label substitute

## Factory.ai Design Patterns

These structural patterns were extracted from factory.ai's design language and adapted to work within the Nature theme. Use the components below instead of hand-rolling equivalents.

### Pattern 1 — Numbered counter (`StepCounter`)

`src/components/ui/step-counter.tsx`

Use for question progress, onboarding step indicators, mastery gate stages. Renders a zero-padded primary number in monospace with a muted total.

```tsx
<StepCounter current={3} total={20} prefix="Q" size="md" />
// Renders: Q  03 / 20
```

Rules:
- Always zero-pad to 2 digits (`padStart(2, '0')`)
- Current number: `font-mono font-semibold text-primary`
- Total and separator: `font-mono text-muted-foreground`
- Prefix label: `font-sans text-muted-foreground`

### Pattern 2 — Monospace metric readout (`StatDisplay`)

`src/components/ui/stat-display.tsx`

Use for dashboard stat rows (XP, streak, accuracy), session complete summaries. Any number representing a quantitative metric should use `font-mono` at 1 scale size above its label.

```tsx
<StatDisplay value={120} unit="xp" label="XP earned" size="md" />
<StatDisplay value="87" unit="%" label="Accuracy" />
```

Rules:
- Value: `font-mono font-semibold tabular-nums text-foreground`
- Unit: `font-mono text-muted-foreground` (same line, smaller)
- Label: `font-sans font-medium text-muted-foreground` (below value)
- Never use `font-sans` for the numeric value itself

### Pattern 3 — Section eyebrow label (`SectionLabel`)

`src/components/ui/section-label.tsx`

Use above `<h2>` or `<h3>` headings to signal section category. Sentence case only — no uppercase (constraint). A filled primary-colored bullet (•) appears before the label by default, matching factory.ai's orange dot pattern.

```tsx
<SectionLabel>Today's progress</SectionLabel>
{/* Renders:  • Today's progress */}

<SectionLabel showPrefix={false}>No dot here</SectionLabel>
<h2 className="text-xl font-semibold">Continue learning</h2>
```

Rules:
- `text-xs font-medium tracking-wider text-muted-foreground`
- Bullet: `size-1.5 rounded-full bg-primary` (filled circle, not text character)
- Always sentence case, never uppercase
- Placed directly above the section heading with `gap-1` spacing

### Pattern 3b — Classification tag badge (`tag` / `tag-primary` variant)

`src/components/ui/badge.tsx` — two new variants on the existing Badge component.

Use for category labels on cards and content items. Compact, square-ish, minimal padding. Mirrors factory.ai's `PRODUCT` / `NEW` / `CASE STUDY` news card tags.

```tsx
<Badge variant="tag">Matematika</Badge>
<Badge variant="tag-primary">New</Badge>
```

Rules:
- `rounded-sm` (not `rounded-md`) — intentionally less pill-like
- `text-[10px] font-semibold tracking-wider` — tighter than standard badge
- **Exception to the no-uppercase rule**: classification labels on cards may use uppercase since they function as category codes, not body text

### Pattern 4 — Numbered tab navigation (`NumberedTabsList` + `NumberedTabsTrigger`)

`src/components/ui/tabs.tsx` (additional exports alongside the standard shadcn Tabs)

Use for topic browser subject tabs, dashboard section tabs. Renders a borderless strip with `01 · Label` format.

```tsx
<Tabs defaultValue="math">
  <NumberedTabsList>
    <NumberedTabsTrigger index={0} value="math">Matematika</NumberedTabsTrigger>
    <NumberedTabsTrigger index={1} value="ipa">IPA</NumberedTabsTrigger>
    <NumberedTabsTrigger index={2} value="ips">IPS</NumberedTabsTrigger>
  </NumberedTabsList>
  <TabsContent value="math">...</TabsContent>
</Tabs>
```

Rules:
- Number prefix: `font-mono text-xs tabular-nums text-muted-foreground` (active: `text-primary`)
- Active tab: `text-foreground font-semibold border-b-2 border-primary`
- Inactive: `text-muted-foreground hover:text-foreground`
- List: `flex items-end gap-6 border-b border-border` — no pill background

Note: factory.ai's actual numbered nav is a **vertical sidebar list** (01 through 05 on the left). For a vertical variant (e.g., a settings sidebar or step wizard), render `NumberedTabsTrigger` items in a `flex-col` container with `gap-2` and no bottom border — swapping `border-b-2` for `border-l-2` on the active item.

## Privacy, storage, and research (strategy)

- **Default**: learner state stays **on-device** (IndexedDB / hybrid storage). No analytics module is required for core use.
- **Future opt-in studies**: when implemented, follow [docs/strategy/product-strategy.md](strategy/product-strategy.md) — **study enrollment**, minimal **de-identified** events/aggregates only, explicit scope. Extend this section when code exists (consent UI, endpoint, schema).

## Commands
- **Dev**: npm run dev
- **Build**: npm run build
- **Lint**: npm run lint
- **Lint CSS**: npm run lint:css
- **Test**: npm test
- **Test UI**: npm run test:ui
