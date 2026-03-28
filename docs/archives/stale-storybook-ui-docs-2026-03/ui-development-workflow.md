# UI Development Workflow with Current Setup

## Overview

This document explains the complete UI development workflow for the JadiMahir project, covering component-based development with Storybook, AI agent-driven testing with Agent Browser, and the integration of all development tools.

## Architecture

### Development Workflow Pipeline

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        Development Workflow                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│ 0. Design (Figma) → 1. Component Development → 2. Storybook → 3. AI Testing │
│ 4. Quality Gates → 5. Integration → 6. Deployment                            │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Tool Stack

| Tool | Purpose | Location |
|------|---------|----------|
| **Figma** | Key screens / layout spec | External; link in docs/CONTEXT.md or PR |
| **React 19** | UI Framework | `src/` |
| **Vite 6** | Build System | `vite.config.ts` |
| **TypeScript 5.7** | Type Safety | `tsconfig.json` |
| **Tailwind CSS 4** | Styling | `src/index.css` (tokens) |
| **Storybook 10.2.19** | Component Documentation | `.storybook/` |
| **Agent Browser 0.20.5** | AI Agent Testing | Global + `.agents/skills/` |
| **Playwright 1.58.2** | Unit/Integration Tests | `vitest.config.ts` |
| **Vitest 4.1.0** | Testing Framework | `vitest.config.ts` |
| **ESLint 9** | Code Quality | `eslint.config.js` |
| **Stylelint 17** | CSS Quality | `.stylelintrc.js` |
| **Chromatic** | Visual Regression | `.storybook/` |

> **Note**: Storybook 10.2.19 and Vitest 4.1.0 are current versions as of March 2026. These versions include recent releases with ESM-only distribution (Storybook 10) and V8 code coverage improvements (Vitest 4).

---

## 0. Design (Figma)

Before implementing new screens or flows, define layout and hierarchy in Figma so implementation has a clear visual target.

### When to use

- New screen or user flow
- Major layout or composition change
- Not required for small component tweaks or existing screens with no design change

### What to put in Figma

- **Key screens or flows** — wireframes or simple hi-fi frames. Focus on layout, hierarchy, spacing, and placement of major blocks.
- **Do not** duplicate the full component library in Figma.
- **Do not** define token values (colors, spacing scale, type scale) in Figma; those live in `src/index.css` and VISUAL-SPEC.md.

### Output

- A Figma link (and optionally node Id) for the frame or screen.
- Store the link in [docs/CONTEXT.md](docs/CONTEXT.md) or in the ticket/PR description so agents and developers can reference it.

### Design-to-code

When generating or reviewing UI, if the user or CONTEXT provides a Figma URL:

1. Use the Figma MCP `get_design_context` with the file key and node Id from the URL to get a screenshot and hints.
2. Implement in code using **project tokens and VISUAL-SPEC.md** — adapt to existing components and conventions.
3. Use the Figma output for layout and hierarchy only; map colors, spacing, and typography to the locked token set.

---

## 1. Component Development

### 1.1 Component Structure

Location: `src/components/ui/`

```
src/components/
├── ui/                    # 21 UI primitives
│   ├── accordion.tsx
│   ├── alert-dialog.tsx
│   ├── alert.tsx
│   ├── avatar.tsx
│   ├── badge.tsx
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   ├── dropdown-menu.tsx
│   ├── empty.tsx
│   ├── input.tsx
│   ├── progress.tsx
│   ├── separator.tsx
│   ├── skeleton.tsx
│   ├── spinner.tsx
│   ├── tabs.tsx
│   ├── textarea.tsx
│   ├── toast.tsx
│   ├── toaster.tsx
│   ├── tooltip.tsx
│   └── use-toast.ts      # Hook for toast notifications
├── layout/               # Layout components
│   ├── header.tsx
│   ├── main-layout.tsx
│   └── sidebar.tsx
└── questions/            # Question-specific
    └── FeedbackPanel.tsx
```

### 1.2 Component Pattern (shadcn-style)

```typescript
// src/components/ui/button.tsx
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

export const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: React.ComponentProps<typeof ButtonPrimitive> & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
```

### 1.3 Component Development Steps

0. **Design intent**: If this is a new screen or flow, ensure a Figma frame or link exists; reference it when implementing.
1. **Create Component File**: `src/components/ui/my-component.tsx`
2. **Implement Logic**: Use CVA for variants, cn for classes
3. **Export Types**: Export component and variant types
4. **Add Stories**: Create `my-component.stories.tsx`
5. **Test Locally**: Use Storybook + Agent Browser
6. **Run Quality Checks**: Lint, type check, and test
7. **Commit & Push**: Add to version control

---

## 2. Storybook Development

### 2.1 Storybook Configuration

Location: `.storybook/main.ts`

```typescript
import type { StorybookConfig } from "@storybook/react-vite"

const config: StorybookConfig = {
  stories: [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding",
    "@storybook/addon-viewport",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
}
export default config
```

### 2.2 Creating Component Stories

Location: `src/components/ui/*.stories.tsx`

```typescript
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from './button'

const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    variant: 'default',
    children: 'Button',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Button',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Button',
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Button',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Button',
  },
}
```

### 2.3 Storybook Scripts

```json
{
  "scripts": {
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  }
}
```

### 2.4 Story Organization

```
src/
├── components/
│   ├── ui/
│   │   ├── button.stories.tsx
│   │   ├── card.stories.tsx
│   │   ├── input.stories.tsx
│   │   └── ...
│   ├── layout/
│   │   └── main-layout.stories.tsx
│   └── questions/
└── stories/
    ├── Button.stories.ts
    ├── Header.stories.ts
    └── Page.stories.ts
```

---

## 3. AI Agent-Driven Testing

### 3.1 Agent Browser Installation

```bash
# Global installation
npm install -g agent-browser
agent-browser install  # Download Chrome for Testing

# Verify installation
agent-browser --version  # Should show 0.20.5
```

### 3.2 Skill Integration

```bash
# Add agent-browser skill to OpenCode
npx skills add vercel-labs/agent-browser --yes

# Skill location
.agents/skills/agent-browser/SKILL.md
```

**UX copy (Anthropic):** For writing or reviewing interface copy, agents use `.agents/skills/ux-copy/SKILL.md` (install: `npx skills add https://github.com/anthropics/knowledge-work-plugins --skill ux-copy --yes`). See AGENTS.md and `.cursor/rules/ux-copy.mdc`.

**Grill-me (Matt Pocock):** Required for **product strategy design sessions** (see AGENTS.md, `.cursor/rules/grill-me-strategy.mdc`). Stress-tests plans through systematic Q&A via `.agents/skills/grill-me/SKILL.md` (install: `npx skills add https://github.com/mattpocock/skills --skill grill-me --yes`). See [skills.sh/mattpocock/skills/grill-me](https://skills.sh/mattpocock/skills/grill-me).

**Self-improvement (pskoett):** Learning logs under `.learnings/`; skill at `.agents/skills/self-improvement/SKILL.md` (install: `npx skills add https://github.com/pskoett/self-improving-agent --skill self-improvement -y`). OpenCode discovers it from `.agents/skills/` and can load it with the **skill** tool; `AGENTS.md` is in `opencode.json` so the workflow is always in context. See [skills.sh/pskoett/self-improving-agent/self-improvement](https://skills.sh/pskoett/self-improving-agent/self-improvement).

### 3.3 Testing Workflow

#### Step 1: Start Storybook
```bash
npm run storybook
# Access: http://localhost:6006
```

#### Step 2: Navigate and Snapshot
```bash
# Open Storybook
agent-browser open http://localhost:6006

# Get interactive elements with refs
agent-browser snapshot -i
```

**Example Output:**
```
- button "Button" [ref=e1]
- input "Search" [ref=e2]
- link "Documentation" [ref=e3]
```

#### Step 3: Test Component Interactions
```bash
# Click button
agent-browser click @e1

# Fill input
agent-browser fill @e2 "test input"

# Take screenshot
agent-browser screenshot component-test.png
```

#### Step 4: Test Specific Stories
```bash
# Test Button Primary story
agent-browser open "http://localhost:6006/iframe.html?id=ui-button--primary"
agent-browser snapshot -i
agent-browser click @e1
agent-browser screenshot button-primary.png
```

### 3.4 Automated Testing Script

Create `scripts/test-components.sh`:

```bash
#!/bin/bash
set -e  # Exit on error

# Check if Storybook is running
if ! curl -s http://localhost:6006 > /dev/null; then
  echo "Error: Storybook is not running on http://localhost:6006"
  echo "Start Storybook with: npm run storybook"
  exit 1
fi

# Test all Button stories
for story in primary secondary disabled; do
  echo "Testing Button $story story..."
  agent-browser open "http://localhost:6006/iframe.html?id=ui-button--$story"
  
  # Check if story loaded successfully
  if agent-browser snapshot -i | grep -q "Couldn't find story"; then
    echo "Warning: Story 'ui-button--$story' not found, skipping..."
    continue
  fi
  
  agent-browser click @e1
  agent-browser screenshot "button-$story.png"
  echo "✓ Button $story test completed"
done

# Test Header component
echo "Testing Header logged-in story..."
agent-browser open "http://localhost:6006/iframe.html?id=layout-header--logged-in"

# Check if story loaded successfully
if agent-browser snapshot -i | grep -q "Couldn't find story"; then
  echo "Warning: Story 'layout-header--logged-in' not found, skipping..."
else
  agent-browser screenshot header-logged-in.png
  echo "✓ Header logged-in test completed"
fi

echo "All component tests completed successfully!"
```

### 3.5 Agent Browser Commands Reference

| Command | Description |
|---------|-------------|
| `agent-browser open <url>` | Navigate to URL |
| `agent-browser snapshot -i` | Get interactive elements with refs |
| `agent-browser click @e1` | Click element by ref |
| `agent-browser fill @e1 "text"` | Fill input by ref |
| `agent-browser screenshot <file>` | Take screenshot |
| `agent-browser close` | Close browser |

### 3.6 Authentication Patterns for Stories

For stories that require authenticated state, use Agent Browser's session persistence:

```bash
# Method 1: Session name (auto-save/restore)
agent-browser --session-name myapp open http://localhost:6006
# Login once, state persists across runs

# Method 2: Persistent profile
agent-browser --profile ~/.myapp-profile open http://localhost:6006

# Method 3: State file (manual save/load)
agent-browser open http://localhost:6006
# [Perform login in browser]
agent-browser state save ./auth.json
# Later:
agent-browser --state ./auth.json open http://localhost:6006
```

**Storybook Mock Authentication:**
For component stories requiring auth, use Storybook's parameters to mock auth state:

```typescript
// Button.stories.tsx
export const Authenticated: Story = {
  parameters: {
    msw: {
      handlers: [
        rest.get('/api/user', (req, res, ctx) => {
          return res(ctx.json({ name: 'John Doe' }))
        }),
      ],
    },
  },
  args: {
    user: { name: 'John Doe' },
  },
}
```

### 3.7 Responsive/Viewport Testing

#### Using Storybook Viewport Addon
The Viewport addon is already configured in `.storybook/main.ts`. Use it to test responsive behavior:

```typescript
// Button.stories.tsx
export const Responsive: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}
```

#### Using Agent Browser for Responsive Testing
```bash
# Test mobile viewport
agent-browser set viewport 375 667  # iPhone SE
agent-browser open http://localhost:6006
agent-browser snapshot -i
agent-browser screenshot mobile-test.png

# Test tablet viewport
agent-browser set viewport 768 1024  # iPad
agent-browser open http://localhost:6006
agent-browser screenshot tablet-test.png

# Test desktop viewport
agent-browser set viewport 1920 1080
agent-browser open http://localhost:6006
agent-browser screenshot desktop-test.png
```

#### Responsive Story Examples
```typescript
// Button.stories.tsx
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

export const Tablet: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
}

export const Desktop: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
  },
}
```

---

## 4. Quality Gates & Verification

### 4.1 Code Quality Checks

```bash
# ESLint
npm run lint

# TypeScript
npm run typecheck

# Unit Tests
npm run test
npm run test:ui
npm run test:coverage
```

### 4.2 Component Definition of Done

1. ✅ Component logic matches specification
2. ✅ Linting passes (`npm run lint`)
3. ✅ Stories created using story template
4. ✅ Tested with Agent Browser
5. ✅ Accessibility checks (Storybook a11y addon)

### 4.3 Environment-Specific Configuration

#### Storybook Environment Variables
Create `.env.storybook` for Storybook-specific environment variables:

```bash
# .env.storybook
VITE_API_URL=http://localhost:3000/api
VITE_MOCK_ENABLED=true
STORYBOOK_THEME=light
```

#### Mocking API Calls in Stories
Use Storybook's MSW (Mock Service Worker) addon for API mocking:

```typescript
// .storybook/preview.ts
import { initialize, mswLoader } from 'msw-storybook-addon'

initialize()
export const loaders = [mswLoader]

// Button.stories.tsx
import { rest } from 'msw'

export const WithApiData: Story = {
  parameters: {
    msw: {
      handlers: [
        rest.get('/api/user', (req, res, ctx) => {
          return res(ctx.json({ name: 'John Doe' }))
        }),
      ],
    },
  },
}
```

#### Environment-Specific Storybook Config
```typescript
// .storybook/main.ts
import { loadEnv } from 'vite'

const mode = process.env.NODE_ENV || 'development'
const env = loadEnv(mode, process.cwd(), '')

export default {
  // ... existing config
  env: {
    ...env,
    // Add environment-specific variables
    STORYBOOK_API_URL: env.VITE_API_URL || 'http://localhost:3000/api',
  },
}
```

### 4.5 Aesthetic Quality Enforcement

The project includes automated design token enforcement to prevent AI-generated UI slop:

#### Design Tokens
- **Location**: `src/index.css` - Locked token set using Tailwind 4 @theme
- **Tokens**: Neutral scale, brand colors, accent colors, spacing, typography, shadows, radius

#### ESLint Rules (`eslint.config.js`)
- `tailwindcss/no-arbitrary-value` - Bans arbitrary values like `bg-[#ff0000]`
- `no-restricted-syntax` - Bans hardcoded hex/rgb colors

#### Stylelint Rules (`.stylelintrc.js`)
- Bans gradients in CSS files
- Requires `var()` for colors
- Disallows arbitrary units

#### Running Quality Checks
```bash
npm run lint     # ESLint + Tailwind rules
npm run lint:css # Stylelint CSS check
```

#### Visual Reference
- `src/stories/DesignSystem.stories.tsx` - Visual token reference
- `src/stories/AntiPatterns.stories.tsx` - Examples of what to avoid
- `VISUAL-SPEC.md` - Complete visual specification

### 4.4 Verification Script

Location: `scripts/verify-storybook-fix.sh`

```bash
#!/bin/bash
echo "Running Storybook verification..."

# 1. TypeScript checks
echo "Running TypeScript checks..."
npm run typecheck

# 2. Storybook build
echo "Building Storybook..."
npm run build-storybook

# 3. Unit tests
echo "Running unit tests..."
npm run test

# 4. Component interaction tests
echo "Testing components with Agent Browser..."
agent-browser open http://localhost:6006
agent-browser snapshot -i
agent-browser close

echo "Verification complete!"
```

---

## 5. Complete Development Cycle

### 5.1 Creating a New Component

```bash
# 1. Create component file
cd src/components/ui
touch my-button.tsx

# 2. Implement component (shadcn pattern)
# [Edit my-button.tsx with component logic]

# 3. Create stories
touch my-button.stories.tsx
# [Add Storybook stories]

# 4. Test locally
npm run storybook &
agent-browser open http://localhost:6006
agent-browser snapshot -i
agent-browser click @e1
agent-browser screenshot my-button-test.png

# 5. Run quality checks
npm run lint
npm run typecheck
npm run test

# 6. Verify with script
./scripts/verify-storybook-fix.sh

# 7. Commit and push
git add .
git commit -m "Add MyButton component with stories"
```

### 5.2 Testing Existing Components

```bash
# 1. Start Storybook
npm run storybook

# 2. Test with Agent Browser
agent-browser open http://localhost:6006
agent-browser snapshot -i

# 3. Test specific components
agent-browser open "http://localhost:6006/iframe.html?id=ui-button--primary"
agent-browser click @e1
agent-browser screenshot button-test.png

# 4. Test multiple components
for component in button card input; do
  agent-browser open "http://localhost:6006/iframe.html?id=ui-$component--primary"
  agent-browser snapshot -i
  agent-browser screenshot "$component-test.png"
done
```

### 5.3 CI/CD Integration

```yaml
# .github/workflows/test.yml
name: Component Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm install
        
      - name: Install Agent Browser
        run: |
          npm install -g agent-browser
          agent-browser install
          
      - name: Start Storybook
        run: npm run storybook &
        
      - name: Wait for Storybook
        run: npx wait-on http://localhost:6006 --timeout 60000
        
      - name: Test components
        run: |
          agent-browser open http://localhost:6006
          agent-browser snapshot -i
          ./scripts/test-components.sh
          
      - name: Run quality checks
        run: |
          npm run lint
          npm run typecheck
          npm run test
```

---

## 6. Tool Coexistence Strategy

### 6.1 Complementary Tools

| Tool | Purpose | Use Case |
|------|---------|----------|
| **Agent Browser** | AI agent-driven UI testing | Storybook visual testing, CLI automation |
| **Playwright** | Unit/integration tests | Vitest integration, API testing |
| **Vitest** | Component unit tests | Logic testing, mocking |
| **Storybook** | Component documentation | Visual testing, docs generation |

### 6.2 Workflow Division

**Agent Browser:**
- Visual regression testing
- AI agent-driven UI testing
- Storybook component interaction
- Screenshot capture

**Playwright/Vitest:**
- Unit tests for component logic
- Integration tests for user flows
- API testing and mocking
- CI/CD pipeline tests

---

## 7. Key Benefits

### 7.1 Component-Based Architecture
- ✅ 22 UI primitives with consistent patterns
- ✅ CVA-based variant management
- ✅ TypeScript typing throughout
- ✅ Shadcn-style component structure

### 7.2 Storybook Integration
- ✅ Full Storybook 10.2.19 configuration
- ✅ Addons: a11y, docs, viewport, Chromatic
- ✅ Vite build system for fast HMR
- ✅ Component documentation auto-generation

### 7.3 AI Agent Testing
- ✅ Snapshot-ref pattern for deterministic testing
- ✅ CLI automation for AI agents
- ✅ Session persistence for authenticated testing
- ✅ Native Rust performance

### 7.4 Quality Assurance
- ✅ ESLint + TypeScript type checking
- ✅ Vitest unit testing
- ✅ Playwright browser testing
- ✅ Automated verification scripts

---

## 8. Quick Reference

### Development Commands

```bash
# Development
npm run dev              # Start Vite dev server
npm run storybook        # Start Storybook on port 6006

# Testing
npm run test             # Run Vitest
npm run lint             # Run ESLint + Tailwind rules
npm run lint:css         # Run Stylelint CSS check
npm run typecheck        # TypeScript check

# Build
npm run build            # Build for production
npm run build-storybook  # Build Storybook

# Agent Browser
agent-browser open http://localhost:6006
agent-browser snapshot -i
agent-browser click @e1
agent-browser screenshot test.png
```

### File Locations

| File/Directory | Purpose |
|----------------|---------|
| `docs/CONTEXT.md` or PR description | Figma links / key screens for current work |
| `src/components/ui/` | UI component library |
| `.storybook/` | Storybook configuration |
| `.agents/skills/agent-browser/` | AI agent skill |
| `scripts/verify-storybook-fix.sh` | Verification script |
| `AGENT-BROWSER-INTEGRATION.md` | Integration guide |
| `TEST-RESULTS.md` | Test results |
| `VISUAL-SPEC.md` | Visual specification |
| `AGENTS.md` | Agent guidelines |
| `src/stories/DesignSystem.stories.tsx` | Design token reference |
| `src/stories/AntiPatterns.stories.tsx` | Anti-pattern examples |
| `eslint.config.js` | ESLint configuration |
| `.stylelintrc.js` | Stylelint configuration |
| `.github/workflows/test.yml` | CI lint workflows |
| `.github/workflows/chromatic.yml` | Visual regression |

---

## 9. Next Steps

1. **Expand Story Coverage**: Create stories for all 22 UI components
2. **AI Agent Configuration**: Set up autonomous testing workflows
3. **Visual Regression**: Implement screenshot comparison
4. **CI/CD Integration**: Add agent-browser to GitHub Actions
5. **Documentation**: Update AGENTS.md with agent-browser usage

---

## 10. Resources

- **Agent Browser Repo**: https://github.com/vercel-labs/agent-browser
- **Storybook Docs**: https://storybook.js.org/docs
- **shadcn/ui**: https://ui.shadcn.com
- **TanStack**: https://tanstack.com

---

**Document Version**: 1.0
**Last Updated**: March 15, 2026
**Author**: UI Development Team