# Aesthetic Quality Implementation Plan
**Project**: JadiMahir  
**Context**: Solo dev, no dedicated designer  
**Goal**: Systematically prevent and catch AI-generated UI slop without a human design review gate  
**Priority order**: Token enforcement → Visual spec → Human review gate → AI prompt constraints

---

## The core problem, restated

The existing workflow (Storybook + Agent Browser + Playwright) catches functional regressions. It has no signal for aesthetic quality — gradient overuse, incoherent color, typographic chaos, and decorative noise all pass CI with flying colors. With no designer on the team, the only viable fix is to **encode taste as constraints** that run before and during generation, not after.

---

## Phase 1 — Design token enforcement (weeks 1–2)

**Goal**: Make bad aesthetic choices impossible to commit, not just discouraged.

### 1.1 Audit and lock the token set

Tailwind 4 uses CSS-first configuration (`@theme` in your main CSS file). Lock it down to a minimal, intentional set. No color should exist in the codebase that isn't in this file.

```css
/* src/styles/tokens.css */
@theme {
  /* Neutral scale — all grays derive from one hue */
  --color-neutral-50:  oklch(98% 0.004 265);
  --color-neutral-100: oklch(95% 0.006 265);
  --color-neutral-200: oklch(90% 0.008 265);
  --color-neutral-300: oklch(82% 0.010 265);
  --color-neutral-400: oklch(70% 0.012 265);
  --color-neutral-500: oklch(58% 0.014 265);
  --color-neutral-600: oklch(46% 0.014 265);
  --color-neutral-700: oklch(35% 0.012 265);
  --color-neutral-800: oklch(24% 0.010 265);
  --color-neutral-900: oklch(14% 0.006 265);

  /* Brand — max 2 accent hues */
  --color-brand-500: oklch(62% 0.19 258);
  --color-brand-600: oklch(54% 0.19 258);
  --color-brand-700: oklch(46% 0.19 258);

  --color-accent-500: oklch(68% 0.18 142);

  /* Semantic — derived, never invented */
  --color-surface:     var(--color-neutral-50);
  --color-surface-raised: white;
  --color-border:      var(--color-neutral-200);
  --color-text:        var(--color-neutral-900);
  --color-text-muted:  var(--color-neutral-500);
  --color-primary:     var(--color-brand-600);
  --color-primary-hover: var(--color-brand-700);

  /* Spacing — 4px base, named steps only */
  --spacing-1: 4px;
  --spacing-2: 8px;
  --spacing-3: 12px;
  --spacing-4: 16px;
  --spacing-6: 24px;
  --spacing-8: 32px;
  --spacing-12: 48px;
  --spacing-16: 64px;

  /* Typography — one type scale, no exceptions */
  --font-sans: 'Geist', system-ui, sans-serif;
  --font-mono: 'Geist Mono', monospace;

  --text-xs:   clamp(11px, 1.1vw, 12px);
  --text-sm:   clamp(13px, 1.3vw, 14px);
  --text-base: clamp(15px, 1.5vw, 16px);
  --text-lg:   clamp(17px, 1.7vw, 18px);
  --text-xl:   clamp(20px, 2vw, 22px);
  --text-2xl:  clamp(24px, 2.4vw, 28px);
  --text-3xl:  clamp(30px, 3vw, 36px);

  /* Radius — three levels, no more */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;

  /* Elevation — flat-first, shadow is earned */
  --shadow-sm: 0 1px 2px oklch(0% 0 0 / 0.06);
  --shadow-md: 0 2px 8px oklch(0% 0 0 / 0.08);
}
```

**Why oklch?** Perceptually uniform — colors at the same lightness value look equally light. Prevents the accidental dark-on-dark or bright-on-bright combinations that AI generators produce constantly.

### 1.2 ESLint rules to ban hardcoded values

Install `eslint-plugin-tailwindcss` and add custom no-restricted-syntax rules:

```js
// eslint.config.js — add to existing config
import tailwind from 'eslint-plugin-tailwindcss'

export default [
  ...tailwind.configs['flat/recommended'],
  {
    rules: {
      // Ban hardcoded hex/rgb in className strings
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Literal[value=/\\#[0-9a-fA-F]{3,8}/]',
          message: 'Use a design token instead of a hardcoded hex value.',
        },
        {
          selector: 'Literal[value=/rgb\\(|rgba\\(/]',
          message: 'Use a design token instead of hardcoded rgb().',
        },
        {
          selector: 'JSXAttribute[name.name="style"] > JSXExpressionContainer > ObjectExpression > Property[key.name="boxShadow"]',
          message: 'Use shadow tokens (shadow-sm, shadow-md) instead of inline box-shadow.',
        },
      ],
      // Tailwind class ordering (catches disorganised AI output)
      'tailwindcss/classnames-order': 'warn',
      // Ban arbitrary Tailwind values like bg-[#ff0000]
      'tailwindcss/no-arbitrary-value': 'error',
    },
  },
]
```

Add to `package.json` scripts:
```json
"lint:tokens": "eslint src --rule 'tailwindcss/no-arbitrary-value: error' --ext .tsx,.ts"
```

### 1.3 Stylelint for CSS files

```bash
npm install --save-dev stylelint stylelint-config-standard
```

```js
// .stylelintrc.js
export default {
  extends: ['stylelint-config-standard'],
  rules: {
    'color-no-invalid-hex': true,
    // Disallow any color that isn't a var()
    'color-named': 'never',
    'declaration-property-value-disallowed-list': {
      'box-shadow': ['/^(?!var\\()/'],  // must use var() or none
      'background': ['/gradient/'],      // no gradients in CSS files
      'background-image': ['/.+/'],      // all backgrounds via tokens
    },
    'unit-disallowed-list': ['vmax'],    // AI loves vmax for no reason
  },
}
```

### 1.4 Add to CI quality gate

```yaml
# .github/workflows/test.yml — add these steps
- name: Lint design tokens
  run: npm run lint:tokens

- name: Lint CSS
  run: npx stylelint "src/**/*.css"
```

**Definition of done for Phase 1**: `npm run lint` fails if any component introduces a hardcoded color, arbitrary Tailwind value, or gradient outside of the token file.

---

## Phase 2 — Visual spec / style guide (weeks 2–4)

**Goal**: A written document the AI reads before generating code, plus a Storybook reference implementation it can't deviate from. For key screens and flows, use Figma as the visual spec: create frames that define layout, hierarchy, and balance. Keep token definitions in code and VISUAL-SPEC; use Figma for composition and structure. When generating UI from a Figma link, agents use get_design_context and map to project tokens.

### 2.1 Create `VISUAL-SPEC.md` at repo root

This is the single most important file for an AI-assisted solo workflow. Every time you prompt an AI to generate or modify UI, this file goes in context. Structure:

```markdown
# JadiMahir Visual Specification

## Design principles (non-negotiable)
1. Flat-first. No gradient is decorative. Gradients only encode data (progress, temperature, status).
2. One shadow level per interaction state: resting = no shadow, hover = shadow-sm, active = shadow-md.
3. Two accent colors maximum on any screen. If you need a third, revisit the layout.
4. Every text element uses a named type scale step. No arbitrary font sizes.
5. Spacing follows the 4px grid. No 5px, 7px, 11px, 15px values.

## Color usage rules
- Backgrounds: surface or surface-raised only. Never brand or accent colors as page backgrounds.
- Text: text (primary) or text-muted only. Brand color is for interactive elements, not labels.
- Borders: border token only. No colored borders except validation states (error/success).
- Never use opacity to create color variations — use the token scale.

## Typography rules
- Body text: text-base, font-sans, leading-relaxed (1.625)
- Labels / UI chrome: text-sm, font-medium
- Headings: text-xl through text-3xl, font-semibold — never bold (700+)
- Maximum 3 type sizes per screen section
- No uppercase text except keyboard shortcuts and table headers

## Component rules

### Buttons
- Primary: bg-primary text-white, hover:bg-primary-hover, no shadow
- Secondary: bg-transparent border-border text-text, hover:bg-neutral-100
- Destructive: bg-transparent border-red text-red, hover:bg-red-50
- No icon-only buttons without a tooltip
- Never more than 2 button variants in one form

### Cards
- bg-surface-raised, border border-border, rounded-lg
- Padding: p-4 (compact) or p-6 (default)
- No shadow by default. shadow-sm on hover if the card is interactive.
- Never nest cards more than one level deep.

### Form inputs
- Height: 36px (h-9)
- Border: border-border, focus:border-primary, focus:ring-2 focus:ring-primary/20
- Error state: border-red-400, bg-red-50/30
- Never use colored backgrounds on inputs (no blue inputs, no gradient inputs)

## What AI-generated slop looks like (avoid these)
- border-radius: 16px or larger on non-pill elements
- Multiple box-shadows stacked on the same element
- Gradient backgrounds on buttons or cards
- More than 3 font weights in one component
- Hover states that change color AND shadow AND scale simultaneously
- Placeholder text styled as a label substitute
```

#### Figma (key screens and flows)

- **What to put in Figma:** Key screens or flows (wireframes or simple hi-fi). Focus on layout, hierarchy, spacing, and placement. Do not define token values in Figma—those stay in code and VISUAL-SPEC.
- **Where to store links:** docs/CONTEXT.md or the PR/ticket description so agents and devs can reference the design.
- **Design-to-code:** When implementing from a Figma link, use get_design_context for layout and structure; map all colors, spacing, and typography to the project token scale and VISUAL-SPEC.

### 2.2 Add a Storybook "Design system" story section

Create a dedicated design system reference story — not for testing, but as a living visual inventory that serves as the ground truth:

```typescript
// src/stories/DesignSystem.stories.tsx
import type { Meta } from '@storybook/react-vite'

export default {
  title: 'Design system/Visual spec',
  parameters: { layout: 'padded' },
} satisfies Meta

export const ColorTokens = () => (
  <div className="grid grid-cols-5 gap-3">
    {['50','100','200','300','400','500','600','700','800','900'].map(n => (
      <div key={n}>
        <div className={`h-10 rounded-md bg-neutral-${n} border border-border`}/>
        <p className="text-xs text-muted mt-1">neutral-{n}</p>
      </div>
    ))}
  </div>
)

export const TypeScale = () => (
  <div className="space-y-4">
    {(['3xl','2xl','xl','lg','base','sm','xs'] as const).map(size => (
      <div key={size} className="flex items-baseline gap-4">
        <span className="text-xs text-muted w-12">text-{size}</span>
        <span className={`text-${size}`}>The quick brown fox</span>
      </div>
    ))}
  </div>
)

export const SpacingScale = () => (
  <div className="space-y-2">
    {[1,2,3,4,6,8,12,16].map(n => (
      <div key={n} className="flex items-center gap-3">
        <span className="text-xs text-muted w-16">spacing-{n}</span>
        <div className={`h-4 bg-brand-500 rounded-sm`} style={{width: `${n * 4}px`}}/>
        <span className="text-xs text-muted">{n * 4}px</span>
      </div>
    ))}
  </div>
)

export const ElevationLevels = () => (
  <div className="flex gap-6 p-8">
    {[
      { label: 'Flat (default)', cls: 'bg-surface-raised border border-border' },
      { label: 'Hover', cls: 'bg-surface-raised border border-border shadow-sm' },
      { label: 'Active / focus', cls: 'bg-surface-raised border border-border shadow-md' },
    ].map(({ label, cls }) => (
      <div key={label} className={`${cls} rounded-lg p-4 w-36`}>
        <p className="text-sm text-muted">{label}</p>
      </div>
    ))}
  </div>
)
```

This story section gives you (and any AI you paste screenshots to) a concrete visual reference for what "correct" looks like.

### 2.3 Add a Storybook "Bad examples" story

Counterintuitive but highly effective for solo devs. Capture what slop looks like in the codebase so you can recognise it:

```typescript
// src/stories/AntiPatterns.stories.tsx
export const GradientButton = () => (
  <button style={{background: 'linear-gradient(135deg, #667eea, #764ba2)', borderRadius: 16}}>
    Click me {/* DON'T DO THIS */}
  </button>
)

export const TooManyShadows = () => (
  <div style={{boxShadow: '0 2px 4px rgba(0,0,0,0.1), 0 8px 16px rgba(0,0,0,0.1), 0 16px 32px rgba(0,0,0,0.08)'}}>
    Card {/* DON'T DO THIS */}
  </div>
)
```

Tag these stories as `tags: ['anti-pattern']` and exclude them from your Chromatic baseline. They exist purely for documentation.

---

## Phase 3 — Human review gate (week 4, lightweight)

**Goal**: Make review fast enough that a solo dev actually does it, rather than skipping it.

Given there's no dedicated designer, the gate must be self-administered. The trick is making it structured and time-boxed.

### 3.1 Aesthetic checklist in PR template

```markdown
<!-- .github/PULL_REQUEST_TEMPLATE.md -->

## Aesthetic review (UI changes only — skip if backend-only)

Run `npm run storybook` and open each changed story. Check each in 60 seconds:

- [ ] No hardcoded colors or magic pixel values (lint passes)
- [ ] Max 2 accent colors visible on screen at once
- [ ] No gradient on interactive elements (buttons, inputs, cards)
- [ ] Shadows only on elevated/interactive states, not resting
- [ ] Font sizes all come from the type scale (xs through 3xl)
- [ ] Spacing looks regular — no element visually "floats" or feels crowded
- [ ] Hover/focus states change one thing, not three simultaneously
- [ ] Component looks plausible in both light and dark mode (use Storybook backgrounds addon)

If any box is unchecked, add a note explaining why it's intentional.
```

This takes under 5 minutes per PR once you've done it a few times. The key is that it's checklist-based, not open-ended critique — much easier to self-administer.

### 3.2 Storybook backgrounds addon for the dark mode check

Add to `.storybook/preview.ts`:

```typescript
export const globalTypes = {
  backgrounds: {
    default: 'light',
    values: [
      { name: 'light', value: '#ffffff' },
      { name: 'dark', value: '#0f0f0f' },
      { name: 'surface', value: '#f8f8f7' },
    ],
  },
}
```

Dark mode is the fastest way to catch AI slop — gradient buttons, hardcoded white text, and decorative shadows all reveal themselves immediately on a dark background.

---

## Phase 4 — AI prompt constraints (ongoing)

**Goal**: Prevent slop at generation time, not catch it after. This pays the highest dividend per unit of effort.

### 4.1 Create `.agents/prompts/ui-generation.md`

A system prompt fragment to prepend whenever using an AI agent to generate or modify components:

```markdown
# UI generation constraints for JadiMahir

You are generating React/TypeScript UI components for JadiMahir. Before writing any code, read VISUAL-SPEC.md in the repo root.

Hard constraints — never violate these:
- All colors must use Tailwind tokens from the @theme config. Never use hex, rgb(), or Tailwind arbitrary values like bg-[#abc].
- No gradients on interactive elements (buttons, cards, inputs). Gradients only for data visualisation.
- Border radius: rounded-sm (4px), rounded-md (8px), or rounded-lg (12px) only. Never rounded-xl, rounded-2xl, or rounded-full on non-pill elements.
- Box shadows: shadow-sm or shadow-md only. Never stacked shadows. Never shadow on resting state cards.
- Typography: use the type scale classes (text-xs through text-3xl). Never arbitrary font sizes.
- Spacing: use Tailwind spacing scale. Never arbitrary px values outside the 4px grid.
- No more than 2 font weights in a single component (regular + medium, or regular + semibold).

When generating a new component:
1. State which CVA variants you'll create and why.
2. Identify which design tokens you're using.
3. Write the component.
4. Write the Storybook story covering all variants.
5. State any visual decisions that might need review.
```

### 4.2 Add a pre-generation checklist to AGENTS.md

Update `AGENTS.md` (or create it) with a required preamble for any AI session touching UI:

```markdown
## Before generating or modifying UI components

1. Read VISUAL-SPEC.md
2. Read the existing component in src/components/ui/ most similar to what you're building
3. Confirm: does the new component introduce any color not in tokens.css?
4. Confirm: does it use any shadow not in the shadow token set?
5. If yes to either — stop and use the existing tokens instead.
```

### 4.3 Chromatic visual regression (deferred but set up now)

Once you have a stable Storybook with the token-enforced components, add Chromatic to lock the baseline:

```bash
npm install --save-dev chromatic
```

```yaml
# .github/workflows/chromatic.yml
name: Chromatic
on: [push]
jobs:
  chromatic:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - run: npm ci
      - uses: chromaui/action@latest
        with:
          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
          onlyChanged: true  # only test stories affected by the diff
```

After this, any AI-generated change that visually deviates from the approved baseline requires explicit acceptance in Chromatic's UI — making the human review async and diff-focused rather than requiring a full Storybook audit.

---

## Summary timeline

| Week | Deliverable | Effort |
|------|-------------|--------|
| 1 | `tokens.css` locked, ESLint + Stylelint rules added, CI gates updated | ~4h |
| 2 | `VISUAL-SPEC.md` written, `lint:tokens` passing on existing codebase | ~3h |
| 3 | Design system Storybook stories, anti-pattern stories, backgrounds addon | ~3h |
| 4 | PR template checklist, `.agents/prompts/ui-generation.md`, AGENTS.md updated | ~2h |
| Ongoing | Chromatic baseline set, any new component auto-reviewed against it | ~1h setup |

**Total setup cost**: ~13 hours  
**Ongoing cost per PR**: ~5 minutes for the aesthetic checklist

---

## What this still won't catch

Be honest with yourself about the limits:

- **Compositional slop** — individual components pass all rules but the page layout feels wrong (too many competing focal points, no visual hierarchy). Only fixable with page-level screenshots and a trained eye.
- **Motion slop** — overly bouncy animations, hover effects that feel theatrical. Add `@media (prefers-reduced-motion)` as a lint rule and keep animation tokens minimal, but taste still matters here.
- **Copy-driven layout problems** — placeholder text hides the real problem; only apparent with real content. Use realistic data in Storybook stories.

For a solo dev without a designer budget, the token + spec + prompt constraint stack will eliminate ~80% of AI slop before it ever reaches a story. The remaining 20% is the cost of not having a designer — and the PR checklist is your honest gate for that.

---

*Document version: 1.0 — March 15, 2026*  
*Owner: UI Development Team*
