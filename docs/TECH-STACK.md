# Tech Stack Plan - JadiMahir MCQ Platform

## Executive Summary

This document outlines a complete tech stack for the **JadiMahir** adaptive MCQ platform, optimized for **performance**, **privacy**, and **learning effectiveness**. The platform follows a local-first architecture with no server, no auth, and no account required—as specified in the PRD and Product Strategy.

---

## Alignment with Product Strategy

| Product Strategy Pillar | Tech Stack Implication |
|---|---|
| **Adaptivity (Core Engine)** | FSRS + mastery gates + interleaving + remediation logic |
| **Privacy-First Architecture** | localStorage → IndexedDB migration path, export/import, zero tracking |
| **Visible Mastery** | XP/streak tracking, progress dashboard, diagnostic placement |
| **Content Quality** | Content validation at load, authoring tooling (Phase 3) |

### Target Users & UX Priorities
- **Primary**: Self-driven learners (students, exam candidates, lifelong learners)
- **UX Priority**: Mobile-first responsive design, fast load times, offline-capable

---

## Core Architecture

### Frontend Framework

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **Framework** | React 19 + Vite 6 | Fast HMR, small bundle, modern React features |
| **Language** | TypeScript 5.7 | Type safety, better DX |
| **State** | TanStack Store v0.9 | Reactive store with auto-persistence |
| **Content Loading** | TanStack Query v5 | As specified—caches static JSON forever |
| **Routing** | TanStack Router v1 | As specified—type-safe SPA routing |
| **Spaced Repetition** | ts-fsrs | As specified—FSRS algorithm implementation |

### Build & Development

```json
{
  "devDependencies": {
    "vite": "^6.0.0",
    "typescript": "^5.7.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "eslint": "^9.0.0",
    "prettier": "^3.0.0"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@heroui/react": "^3.0.0",
    "@tanstack/react-store": "^0.9.0",
    "@tanstack/react-query": "^5.0.0",
    "@tanstack/react-router": "^1.0.0",
    "ts-fsrs": "^5.0.0",
    "idb": "^8.0.0",
    "uuid": "^10.0.0",
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.400.0"
  }
}
```

---

## Storage Architecture (Phased)

### Phase 1: localStorage (MVP)
Default storage using TanStack Store with auto-persistence.

### Phase 2: IndexedDB Migration
As learner state grows, migrate to IndexedDB for larger capacity:

### Phase 3: PWA Offline Support
Add service worker for offline capability:

```ts
// vite.config.ts
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt'],
      manifest: {
        name: 'JadiMahir',
        short_name: 'JadiMahir',
        description: 'Privacy-first adaptive learning platform',
        theme_color: '#2563EB',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
            },
          },
        ],
      },
    }),
  ],
})
```

---

## Performance Optimization

### Bundle Strategy

| Technique | Implementation |
|-----------|---------------|
| **Code Splitting** | TanStack Router's built-in lazy loading per route |
| **Static Content** | JSON files in `/public/content/`—loaded once, cached infinity |
| **Tree Shaking** | Vite + ESM ensures minimal bundle |
| **Image Optimization** | SVG icons only (no raster images needed for MCQ) |
| **Font Loading** | System fonts or self-hosted variable font (Inter) |

### Runtime Performance

| Concern | Solution |
|---------|----------|
| **State Persistence** | TanStack Store `onUpdate` hook—no manual save calls |
| **Content Cache** | `staleTime: Infinity`, `gcTime: Infinity` |
| **Re-renders** | React 19's automatic batching + TanStack Store selectors |
| **Memory** | Session scratch state not persisted—ephemeral only |
| **FSRS Calculations** | Run on main thread initially; migrate to Web Worker if session latency exceeds 16ms with >500 due cards |

### Analytics & Metrics Tracking (Privacy-Preserving)

Per Product Strategy success metrics, track key signals **locally** with opt-in anonymous telemetry:

```ts
// lib/analytics.ts
interface AnalyticsEvent {
  type: 'session_start' | 'session_complete' | 'question_answered' | 'mastery_reached' | 'export_used' | 'diagnostic_completed'
  timestamp: number
  payload: Record<string, unknown>
}

class LocalAnalytics {
  private events: AnalyticsEvent[] = []
  private optedIn = false

  optIn() {
    this.optedIn = true
    localStorage.setItem('analytics_opt', 'true')
  }

  track(event: Omit<AnalyticsEvent, 'timestamp'>) {
    if (!this.optedIn) return
    this.events.push({ ...event, timestamp: Date.now() })
  }

  getMetrics(): SessionMetrics | null {
    if (!this.optedIn) return null
    // Calculate success metrics locally
    return {
      sessionLength: this.calculateSessionLength(),
      questionsPerSession: this.calculateQuestionsPerSession(),
      masteryRate: this.calculateMasteryRate(),
      exportUsage: this.events.filter(e => e.type === 'export_used').length > 0,
    }
  }
}

export const analytics = new LocalAnalytics()
```

**Metrics Tracked** (opt-in only):

| Metric | Source | Purpose |
|---|---|---|
| Session length | `session_start` → `session_complete` | Engagement (≥10 min target) |
| Questions per session | Question events | Volume (≥20 target) |
| Return rate | LocalStorage timestamp | Habit formation (≥60% target) |
| Mastery rate | Mastery events | Learning outcomes (≥70% target) |
| Export usage | Export events | Data ownership awareness (≥10% target) |
| Remediation completion | Remediation events | Feature effectiveness (≥50% target) |
| Diagnostic completion | Diagnostic events | Onboarding effectiveness (≥80% target) |

### Core Web Vitals Targets

| Metric | Target |
|--------|--------|
| LCP | < 800ms |
| FID/INP | < 100ms |
| CLS | < 0.1 |

---

## Aesthetic Design System

### Design Philosophy

Based on the learning science principles:
- **Minimal visual clutter** — Focus on the question
- **High contrast** — Accessibility + readability
- **Smooth transitions** — Framer Motion for micro-interactions
- **No distractions** — Single-purpose UI
- **Mobile-first** — Primary persona prefers mobile access

### Styling Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **Base** | Tailwind CSS 4 | Performance (JIT), consistency, small CSS output |
| **Components** | HeroUI v3 (Beta) | Beautiful, accessible components with built-in theming |
| **Animations** | Framer Motion | Smooth 60fps animations, declarative |
| **Icons** | Lucide React | Clean, consistent, tree-shakeable |
| **Theme** | HeroUI built-in + Dark mode support |

> **Note**: HeroUI v3 is currently in Beta. Monitor for stability updates before production use.

### Color Palette

HeroUI v3 uses CSS-based theming with CSS variables. Override in your global styles:

```css
/* src/index.css */
@import "tailwindcss";
@import "@heroui/styles";

:root {
  /* Custom brand colors - primary */
  --primary: oklch(0.55 0.20 245);
  --primary-foreground: oklch(0.98 0 0);
  
  /* Custom brand colors - override defaults */
  --success: oklch(0.65 0.15 155);
  --danger: oklch(0.60 0.22 25);
  --warning: oklch(0.75 0.15 80);
}

@theme inline {
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
}
```

Usage in components:
```tsx
<Button color="primary">Start Learning</Button>
```

### Typography

HeroUI uses Inter by default. Customize via theme:

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Question Stem | Inter | 20px | 500 |
| Choices | Inter | 16px | 400 |
| Explanation | Inter | 14px | 400 |
| XP/Stats | JetBrains Mono | 14px | 600 |

### Component Design Rules

1. **Question Card** — Centered, max-width 640px, generous padding (24px)
2. **Choice Buttons** — Full-width on mobile, min-height 48px for tap targets
3. **Feedback** — Slide-in animation, color-coded (green/red/amber)
4. **Progress Bar** — Subtle, top of screen, shows session progress
5. **Mastery Indicator** — Small badge next to topic name
6. **Mobile-first breakpoints** — Test on 320px → 768px → 1024px

---

## UI Component Architecture

### Route Structure (TanStack Router)

```
/                   → Dashboard (overview, streak, XP)
/diagnostic         → Initial placement test
/session            → Active MCQ session
/progress           → Detailed mastery progress
/settings           → Export/Import, preferences
```

### Key Components

| Component | Purpose |
|-----------|---------|
| `QuestionCard` | Displays stem, choices, handles selection |
| `ChoiceButton` | Individual answer option with hover/active states |
| `FeedbackPanel` | Shows explanation after answer |
| `ProgressRing` | Circular progress for mastery |
| `XPDisplay` | Shows current XP with animation |
| `StreakCounter` | Daily streak with flame icon |
| `TopicBadge` | Status indicator (locked/available/mastered) |

### Animations (Framer Motion)

```tsx
// Question transition
<AnimatePresence mode="wait">
  <motion.div
    key={questionId}
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.2 }}
  />
</AnimatePresence>

// Feedback slide-in
<motion.div
  initial={{ height: 0, opacity: 0 }}
  animate={{ height: "auto", opacity: 1 }}
  transition={{ duration: 0.3 }}
/>

// XP increment
<motion.span
  initial={{ scale: 1 }}
  animate={{ scale: [1, 1.2, 1] }}
  transition={{ duration: 0.3 }}
/>
```

---

## Phase-Aligned Feature Implementation

### Phase 1: Foundation (MVP)
| Feature | Implementation |
|---|---|
| TanStack stack | React 19 + Vite + TanStack Query/Router/Store |
| Content loading | Static JSON in `/public/content/` |
| Sample content | 1 topic, 20 questions for MVP testing |
| Mastery gates | `lib/engines/mastery.ts` |
| FSRS scheduling | `lib/engines/fsrs.ts` + `ts-fsrs` (main thread) |
| Basic UI | QuestionCard, ChoiceButton, FeedbackPanel |
| localStorage | TanStack Store with `onUpdate` persistence |
| Logging | pino/pino-pretty for dev, production-friendly format |

### Phase 2: Learning Optimization
| Feature | Implementation |
|---|---|
| Interleaving | `lib/engines/scheduler.ts` |
| Targeted remediation | `lib/engines/remediation.ts` |
| FIRe | `lib/engines/transfer.ts` |
| Diagnostic placement | `/routes/diagnostic.tsx` |
| Export/Import | `/routes/settings.tsx` |
| Progress dashboard | `/routes/progress.tsx` |
| IndexedDB migration | `lib/storage/indexedDB.ts` |
| Analytics (opt-in) | `lib/analytics.ts` — local-only telemetry |

### Phase 3: Scale & Polish
| Feature | Implementation |
|---|---|
| Mobile polish | HeroUI responsive components |
| Content authoring UI | Separate admin route with JSON editor |
| Multiple subjects | Topic routing with subject prefix |

---

## File Structure

```
/public
  /content
    /questions
      algebra-basics.json
      linear-equations.json
      ...
    topics.json
    dependencies.json

/src
  /components
    /ui              # Reusable primitives (Button, Card, Badge)
    /questions      # Question-specific components
    /dashboard      # Dashboard widgets
    /layout         # Header, Footer, Sidebar
    /admin          # Content authoring tools (Phase 3)
  /lib
    /engines         # Mastery, FSRS, Scheduler, Remediation, Transfer
    /content.ts      # TanStack Query definitions
    /storage.ts      # localStorage helpers (Phase 1 → IndexedDB Phase 2)
    /validation.ts  # Content validation (SKILL 11)
    /analytics.ts   # Privacy-preserving metrics (opt-in)
  /store
    /learnerStore.ts # TanStack Store with persistence
    /sessionStore.ts # Ephemeral session state
  /routes
    index.tsx       # Dashboard
    diagnostic.tsx  # Placement test
    session.tsx     # Active session
    progress.tsx    # Progress view
    settings.tsx    # Export/Import, preferences
    admin.tsx       # Content authoring (Phase 3)
  /hooks
    useMastery.ts
    useScheduler.ts
    useSession.ts
  /utils
    /fsrs.ts        # FSRS wrapper
    /xp.ts          # XP calculations
  App.tsx
  main.tsx
  router.ts
  index.css         # Tailwind directives
```

---

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      Static JSON                            │
│   (topics.json, questions/*.json)                          │
└────────────────────────┬────────────────────────────────────┘
                         │ TanStack Query (cached forever)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Content Cache                            │
└────────────────────────┬────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
   ┌──────────┐    ┌──────────┐    ┌──────────┐
   │Scheduler│    │ Mastery  │    │  FSRS    │
   │ SKILL 3 │    │ SKILL 1  │    │ SKILL 2  │
   └────┬─────┘    └────┬─────┘    └────┬─────┘
        │               │               │
        └───────────────┼───────────────┘
                        ▼
┌─────────────────────────────────────────────────────────────┐
│               TanStack Store (learnerStore)                 │
│  - Persisted to localStorage on every update               │
│  - Topics, mastery, XP, streak, remediation queue           │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                     React Components                         │
│  - Dashboard, Session, Progress, Settings                   │
└─────────────────────────────────────────────────────────────┘
```

---

## Deployment Plan (Free Services)

### Primary: Cloudflare Pages

| Feature | Details |
|---------|---------|
| **Cost** | Free forever |
| **Bandwidth** | Unlimited |
| **Build minutes** | 500/min/month |
| **Edge network** | 300+ locations |
| **SSL** | Automatic |
| **Custom domain** | Free |

**Setup:**
```bash
npm install -g wrangler
wrangler pages deploy build --project-name=jadimahir
```

**Configuration (wrangler.toml):**
```toml
name = "jadimahir"
compatibility_date = "2024-01-01"
pages_build_output_dir = "dist"
```

### Alternative: Vercel

| Feature | Details |
|---------|---------|
| **Cost** | Free tier |
| **Bandwidth** | 100GB/month |
| **Build seconds** | 6,000/sec/month |
| **Edge network** | 250+ locations |
| **SSL** | Automatic |

**Setup:**
```bash
npm i -g vercel
vercel --prod
```

### Alternative: Netlify

| Feature | Details |
|---------|---------|
| **Cost** | Free tier |
| **Bandwidth** | 100GB/month |
| **Build minutes** | 300/min/month |
| **SSL** | Automatic |

### Recommended: Cloudflare Pages

**Why Cloudflare Pages is best for this project:**
1. **Unlimited bandwidth** — No concerns about traffic spikes
2. **Better privacy** — Fewer tracking/analytics defaults
3. **Fastest TTFB** — Edge network optimized for static content
4. **Simple** — Just push to GitHub, auto-deploys

### Deployment Workflow

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Develop   │───▶│   Build      │───▶│  Deploy      │
│  (Vite)     │    │  npm run build │  │ (Cloudflare)│
└──────────────┘    └──────────────┘    └──────────────┘
                                                  │
                    ┌──────────────┐              │
                    │   Git Push   │◀─────────────┘
                    │   (GitHub)   │
                    └──────────────┘
```

### CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Lint
        run: npm run lint
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: jadimahir
          directory: dist
```

---

## Development Commands

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext ts,tsx",
    "typecheck": "tsc --noEmit"
  }
}
```

---

## Content Authoring Tooling (Phase 3)

As specified in Product Strategy, content creation is a bottleneck risk. Build an admin UI:

```tsx
// routes/admin.tsx
import { useTopicsQuery, useQuestionsQuery } from '@/lib/content'

export function AdminPanel() {
  const { data: topics } = useTopicsQuery()
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  
  return (
    <div className="p-4">
      <h1>Content Authoring</h1>
      
      <TopicList topics={topics} onSelect={setSelectedTopic} />
      
      {selectedTopic && (
        <QuestionEditor 
          topicId={selectedTopic} 
          onSave={(questions) => saveQuestions(selectedTopic, questions)}
        />
      )}
      
      <ValidationReport />
    </div>
  )
}
```

Features:
- **Topic management**: Create/edit topic metadata, prerequisites
- **Question editor**: Rich form for MCQ creation
- **Live validation**: Real-time SKILL 11 validation feedback
- **Preview mode**: Test questions before publishing
- **Export/Import**: Bulk content operations via JSON

---

## Summary

| Category | Choice |
|----------|--------|
| **Framework** | React 19 + Vite 6 |
| **State** | TanStack Store + Query + Router |
| **SRS Engine** | ts-fsrs |
| **Storage** | localStorage (Phase 1) → IndexedDB (Phase 2) |
| **UI Components** | HeroUI v3 |
| **Styling** | Tailwind CSS 4 + HeroUI theming |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **Deployment** | Cloudflare Pages (free) |
| **CI/CD** | GitHub Actions |
| **Hosting** | GitHub (free) |
| **Analytics** | Local-only, opt-in (Phase 2) |

### Phase Alignment

| Phase | Focus | Key Tech Additions |
|---|---|---|
| **Phase 1** | MVP Core Loop | TanStack stack, FSRS, localStorage |
| **Phase 2** | Learning Optimization | IndexedDB, analytics, export/import |
| **Phase 3** | Scale & Polish | Content authoring, mobile polish |

This stack delivers:
- **Performance**: <100KB JS bundle, instant page loads, efficient state management
- **UI**: HeroUI for beautiful, accessible components with built-in theming
- **Privacy**: Zero account, localStorage/IndexedDB, opt-in analytics only
- **Learning effectiveness**: FSRS + mastery gates + interleaving + remediation
- **Free deployment**: Unlimited bandwidth, edge caching, zero cost
