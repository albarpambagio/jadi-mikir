# UX Audit — Home & Progress Dashboards
**Date:** 2026-03-28  
**Auditor:** AI agent  
**Persona:** Budi, 17-year-old student, two weeks in, desktop browser  
**Screens:** `/` (Home dashboard), `/progress` (Progress dashboard)  
**Status:** All Critical/High fixed in-session

---

## Summary

| Severity | Count | In-session fix |
|----------|-------|----------------|
| Critical | 1 | ✅ Fixed |
| High | 3 | ✅ Fixed |
| Medium | 2 | ✅ Fixed |
| Low | 1 | Note only |

---

## Findings

### CRIT-01 — State not persisted across page refresh

**File:** `src/store/learnerStore.ts`  
**Screenshot:** N/A (code-level; any page refresh reproduces)

`learnerStore` was initialized with `initialState` (empty object) on every page load. There was no call to `loadState()` on startup, and no subscription calling `saveState()` on state changes. The `saveState` and `loadState` helpers in `src/lib/storage.ts` existed but were never wired up to the store. **Every page refresh silently wiped all user progress, streaks, cards, and review logs.**

**Fix applied:**
- Import `loadState` / `saveState` from `@/lib/storage` in `learnerStore.ts`
- Initialise store with `loadState(defaultState)` instead of the bare empty object
- Add a `learnerStore.subscribe()` that calls `saveState(state)` on every change

```ts
export const learnerStore = createStore(loadState(defaultState))
learnerStore.subscribe((state) => { saveState(state) })
```

---

### HIGH-01 — "Start new topic" routes to `/session`, not `/topics`

**File:** `src/components/dashboard/today-session-card.tsx`  
**Screenshot:** `repro-01-home-empty-duplicate-cta.png` (pre-fix, empty state; issue also reproduces in active state)

The "Start new topic" row in `TodaySessionCard` had button label "New topic" and description "Browse all topics in skill tree", both pointing to `/session`. The `/topics` route (Topic Browser) was available but unreachable from this card. A user trying to pick a new subject would be dropped into a review session with no topic context.

**Fix applied:** Changed `href` to `/topics` and updated copy to "Browse topics" / "Browse topics and pick what to learn next".

---

### HIGH-02 — Duplicate CTA in empty state; second button links to same destination

**File:** `src/pages/home.tsx`  
**Screenshot:** `repro-01-home-empty-duplicate-cta.png`

EmptyState had three call-to-actions:
1. "Mulai belajar" → `/session` (primary button)
2. "Lewati, mulai dari awal" → `/session` (outline button — same destination)
3. "Or browse all topics first" → `/topics` (xs text link, English)

Items 1 and 2 navigated identically, making the choice meaningless. Item 3 was visually suppressed (xs, muted, English) while being the more useful alternative path.

**Fix applied:** Removed "Lewati, mulai dari awal". Promoted the topics link to a full outline button with Indonesian copy "Jelajahi topik dulu" → `/topics`. Result: clean two-option layout with distinct destinations.

---

### HIGH-03 — XP unit redundancy in StatsBar

**File:** `src/components/dashboard/stats-bar.tsx`

`StatDisplay` was called with both `unit="xp"` and `label="XP total"`, rendering as "1 000 xp · XP total" — the word "XP" appeared twice. (The same issue was previously fixed in `session-complete-view.tsx` but not propagated to this component.)

**Fix applied:** Removed `unit="xp"` from the XP `StatDisplay`. Label "XP total" alone is sufficient.

---

### MED-01 — Wrong motivational message when streak = 0 after prior sessions

**File:** `src/lib/hooks/use-dashboard-stats.ts`

`getMotivationalMessage(0)` returned "Ready to start your learning journey?" — a new-user message. If Budi missed a day and broke his streak, he would see this message instead of something contextual like "get back on track". The function had no awareness of whether the user had prior history.

**Fix applied:** Added `hasHistory: boolean` parameter. When `streak === 0` and `hasHistory` is true (reviewLogs exist or completedCount > 0), returns "Get back on track — keep the habit alive!" instead.

---

### MED-02 — TopicCard shows `<Progress value={0}>` for unstarted topics

**File:** `src/components/dashboard/topic-card.tsx`

In the active-state dashboard, topic cards for unstarted topics (masteryProgress = null, overallPct = 0) used the raw `<Progress value={0}>` component. The `Progress` shadcn component renders the `bg-secondary` track at full width even at 0%, which can read as "partially done" rather than "not started". The same bug was already fixed in `progress.tsx` with a `MasteryBar` helper.

**Fix applied:** Extracted a local `MasteryBar` component (identical to the one in `progress.tsx`) into `topic-card.tsx`. Zero-value now renders a `bg-border` neutral track.

---

### LOW-01 — Export button visible on empty state

**File:** `src/components/dashboard/dashboard-header.tsx`

The "Export data" button is visible even when the user has no session history. Clicking it will export a near-empty JSON file (`xp: 0, streak: 0, topics: {}, cards: {}`). This is not harmful but could cause mild confusion ("why am I exporting nothing?").

**Recommendation:** Conditionally disable or hide the export button when the learner has no meaningful data. Not fixed in-session; severity is Low.

---

## Resilience checks

| Check | Result |
|-------|--------|
| Refresh on `/` | ✅ PASS (after CRIT-01 fix — localStorage now wired) |
| Refresh on `/progress` | ✅ PASS (same fix) |
| Disabled session card when 0 due | ✅ PASS — button is `disabled`, shows "No cards due right now" |
| Export download | ✅ PASS — `downloadExport()` creates a blob and triggers `<a download>` correctly |

**Note:** Before CRIT-01 was fixed, refresh always failed (entire state reset).

---

## Progress dashboard — specific checks

| Check | Result |
|-------|--------|
| Empty state nudge shows instead of 0-stat grid | ✅ PASS — `!hasData` branch renders correct nudge card |
| `MasteryBar` at 0% shows neutral track | ✅ PASS — `bg-border` div is rendered when `value === 0` |
| Accuracy shows `—` (not "0%") when no data | ✅ PASS — `accuracyDisplay = '—'` when `totalQuestions === 0` |
| "Back" navigates to `/` | ✅ PASS — `<Link href="/">` |
| Always-on CTA present | ✅ PASS — "Review now" or "Back to home" always visible when `hasData` |
| Console errors | ✅ PASS — no errors observed |

---

## Screenshots

All repro screenshots in `dogfood-output/dashboard-audit/screenshots/`:

| File | Contents |
|------|----------|
| `repro-01-home-empty-duplicate-cta.png` | Before fix: EmptyState with duplicate CTAs and English tertiary link |
| `repro-02-progress-empty-ok.png` | Progress empty state — empty-state nudge visible, topics listed as "Not started" |
| `after-01-home-empty-fixed.png` | After fix: EmptyState with two clear, distinct CTAs in Indonesian |
