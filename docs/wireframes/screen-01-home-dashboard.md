# Screen 1 — Home / Dashboard

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│  JadiMikir                                          [Export data]  [Settings ⚙] │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  Selamat kembali kembali!                                                         │
│  ─────────────────────────────────────────────────────────────                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │  🔥 Streak   │  │  ⭐ XP Total │  │  Topics Done │  │ Due Today    │        │
│  │   12 days    │  │   4,820 xp   │  │   18 / 42    │  │  14 cards    │        │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                                                  │
│  ── Today's Session ───────────────────────────────────────────────────────────  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │  [▶  Start Review Session]   14 due cards across 5 topics               │    │
│  │  ────────────────────────────────────────────────────────────────────   │    │
│  │  [+  Start New Topic]        Browse all topics in skill tree            │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│  ── Continue Learning ─────────────────────────────────────────────────────────  │
│  ┌────────────────────────────────────────┐  ┌────────────────────────────────┐ │
│  │  Sistem Persamaan Linear               │  │  Trigonometri Dasar            │ │
│  │  ████████████░░░░░░  62%               │  │  ██░░░░░░░░░░░░░░░░░  12%       │ │
│  │  Mastery: In Progress  · 8 due         │  │  Mastery: Just started         │ │
│  │  [Continue →]                          │  │  [Start →]                     │ │
│  └────────────────────────────────────────┘  └────────────────────────────────┘ │
│                                                                                  │
│  ┌────────────────────────────────────────┐  ┌────────────────────────────────┐ │
│  │  Bilangan Bulat ✓                      │  │  Faktorisasi Prima              │ │
│  │  ████████████████████  100%            │  │  ████████████░░░░░░  58%        │ │
│  │  Mastery: Completed  · Review in 4d    │  │  Mastery: In Progress  · 3 due  │ │
│  │  [Review →]                            │  │  [Continue →]                   │ │
│  └────────────────────────────────────────┘  └────────────────────────────────┘ │
│                                                                                  │
│  [View Skill Tree →]                               [View All Topics →]          │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

**Annotations**

- **A** Stat cards: streak, XP, mastery count, due today
- **B** Primary CTA always visible above fold
- **C** Topic cards show progress bar + mastery state + due count
- **D** No account / login UI — fully local

## ✅ UI/UX Requirements for Home Dashboard

1. **Stat Card Design System**
   
   - Consistent spacing: 4px between counts/labels
   - Mastery badges with tooltips (e.g., "Complete 14/42 topics")
   - Gradient due count backgrounds

2. **Primary CTA Visibility**
   
   - Persistent "Start Review Session" button
   - High-contrast emergency buttons (3:1 ratio)
   - Accessible keyboard focus states

3. **Progress Indicators**
   
   - Color-coded bars (4 stages)
   - Mastery state badges with hover animations
   - Skill completion requirements (e.g., "Complete 3 topics")

4. **Topic Navigation**
   
   - Collapsible topic tree with smooth transitions
   - Visual hierarchy for parent topics (larger fonts)
   - Contextual help icon (❓) for complex topics

5. **Data Portability**
   
   - Export buttons with confirmation dialogs
   - Supported formats: CSV (topics), JSON (skill tree), PDF (results)
   - Remeasure size before download (max 512MB)

6. **Mode Compatibility**
   
   - 4.5:1 contrast ratio for text
   - 12px+ spacing between elements
   - 200ms transitions for light/dark mode

7. **Skill Tree Visuals**
   
   - Radial XP progress indicators
   - Animated achievement badges
   - Last-reviewed timestamps

8. **Empty States**
   
   - Skill tree template: "Add first topic" prompt
   - Error boundary: "Failed to load topics" state
   - Skeleton loading states for dynamic content

9. **State Synchronization**
   
   - Shared topic selection context
   - Progress reflection in multiple locations
   - Animation debouncing

10. **Performance Optimization**
    
    - Lazy-load topic images below fold
    - Virtualize long topic lists (500+ items)
    - Reduce progress bar render passes

---

## Variant — Empty State (First Launch)

Shown when the user has no sessions yet. Same route and header as the normal Home Dashboard; only the body content changes.

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│  JadiMikir                                          [Export data] [Settings ⚙] │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│                                                                                  │
│                          Selamat datang di JadiMikir!                           │
│                                                                                  │
│                    Kamu belum punya sesi belajar. Mulai dari sini:              │
│                                                                                  │
│             ┌─────────────────────────────────────────────────────┐             │
│             │                                                     │             │
│             │   Matematika SMP                                    │             │
│             │   42 topics · 860 cards                             │             │
│             │                                                     │             │
│             │   [▶  Mulai Belajar — ambil tes penplacement singkat] │             │
│             │                                                     │             │
│             │   [  Skip tes, mulai dari awal]                     │             │
│             │                                                     │             │
│             └─────────────────────────────────────────────────────┘             │
│                                                                                  │
│                      [Ganti subjek  ↕]                                          │
│                                                                                  │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

**Annotations**
- **A** Empty state is focused — one primary action, no noise
- **B** Diagnostic is the recommended path but not forced
- **C** Subject track change accessible if onboarding choice needs revisiting
