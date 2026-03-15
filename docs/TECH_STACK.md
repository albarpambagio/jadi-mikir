# TECH_STACK.md — Project Standards

## Tech Stack
- **Framework**: React 19 + Vite 6
- **Language**: TypeScript 5
- **Routing**: TanStack Router 1.0
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

## Commands
- **Dev**: npm run dev
- **Build**: npm run build
- **Lint**: npm run lint
- **Lint CSS**: npm run lint:css
- **Test**: npm test
- **Test UI**: npm run test:ui
