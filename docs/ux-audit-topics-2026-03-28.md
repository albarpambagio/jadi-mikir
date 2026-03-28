# UX Audit — Topic Browser Screens
**Date**: 2026-03-28
**Screens**: `/topics` (Screen 17), `/topics/:subject` (Screen 18)
**Depth**: Standard
**Persona**: Rani, 16-year-old student, first week with JadiMikir, desktop browser, wants to find and start a math topic

---

## Summary

| Severity | Count |
|---|---|
| High | 1 |
| Medium | 2 |
| Low | 0 |

**Overall verdict**: The topic browser flow works end-to-end — browsing subjects, entering a topic list, and starting a session all function correctly with no JS errors. Three fixable issues found, none blocking. The most impactful is the missing entry point from the home empty state.

---

## Findings

---

### ISSUE-001 — High
**No path to /topics from the home empty state**

**Description**: A first-time user (no sessions done) lands on the home empty state which shows only "Mulai belajar" and "Lewati, mulai dari awal". There is no link or mention of the topic browser. A student like Rani who wants to browse subjects before committing to a session has no visible path to `/topics` from home. The "View all topics" button only appears after the user has done at least one session.

**Steps to reproduce**:
1. Open the app with no prior sessions (fresh state).
2. Observe the home page — only `Mulai belajar` and `Lewati, mulai dari awal` are available.
3. There is no "Browse topics" or "View all topics" link anywhere on the empty state.

**Evidence**: `screenshots/issue-001-step-2-no-topics-link.png`

**Fix**: Add a tertiary text link "Or browse all topics first" below the two primary buttons in `EmptyState` (`src/pages/home.tsx`).

```tsx
// In EmptyState component, below the two Button elements:
<Link href="/topics" className="text-muted-foreground hover:text-foreground text-xs">
  Or browse all topics first
</Link>
```

---

### ISSUE-002 — Medium
**"1 topics" — plural not suppressed for count of 1**

**Description**: The Mathematics subject card reads "1 topics · 5 cards" when `totalTopics === 1`. This is a grammar error. The same pattern likely affects `totalCards` but only shows when a subject has exactly 1 card.

**Steps to reproduce**:
1. Navigate to `/topics`.
2. Read the Mathematics subject card subtitle.
3. Observe: "1 topics · 5 cards" — should be "1 topic".

**Evidence**: `screenshots/issue-002-grammar-1-topics.png`

**Fix**: Pluralize in `src/components/topics/subject-card.tsx`:

```tsx
// Replace:
{group.totalTopics} topics · {group.totalCards.toLocaleString()} cards

// With:
{group.totalTopics} {group.totalTopics === 1 ? 'topic' : 'topics'} · {group.totalCards.toLocaleString()} {group.totalCards === 1 ? 'card' : 'cards'}
```

---

### ISSUE-003 — Medium
**Raw URL slug rendered as page heading on invalid subject**

**Description**: Navigating to `/topics/nonexistent-slug` renders the raw slug as both the `<h1>` heading ("nonexistent-slug") and the document title ("nonexistent-slug — JadiMikir"). This looks broken and exposes internal URL structure to the user.

**Steps to reproduce**:
1. Navigate directly to `http://localhost:5174/topics/nonexistent-slug`.
2. Observe: H1 heading reads "nonexistent-slug", page title reads "nonexistent-slug — JadiMikir".
3. The "Subject not found." message appears but is visually overshadowed by the slug heading.

**Evidence**: `screenshots/issue-003-raw-slug-heading.png`

**Fix**: In `src/pages/topic-list.tsx`, when `group` is null, use a generic heading instead of the slug:

```tsx
// Replace:
const subjectTitle = group?.subject ?? subjectSlug

// With:
const subjectTitle = group?.subject ?? 'Subject Not Found'
```

This way the heading and document title both read "Subject Not Found — JadiMikir" on an invalid slug.

---

## What is working well

- **Navigation flow end-to-end**: Home → /topics → /topics/:subject → /session/:topicId works in 3 clicks. Clean and fast.
- **Back navigation**: "← All Topics" correctly routes to `/topics` (not browser history). Reliable.
- **Refresh resilience**: Refreshing on `/topics/english` restores the page correctly. No lost state.
- **No console errors**: Zero JS errors or failed network requests across all pages tested.
- **Empty subject groups hidden**: No phantom group headings for In progress / Mastered when all topics are "Available to start". Groups only appear when populated.
- **"View Skill Tree" deferred correctly**: Disabled button is present but clearly inactive — no confusion.
- **"Start" CTA routing**: Clicking Start on any available topic routes immediately to `/session/:topicId` and begins the session. No extra confirmation step, no dead ends.
- **Locked group collapse**: Pattern is in place. Not testable with current content (no locked topics given no prerequisites), but the implementation is structurally correct.
- **Subject card topic preview**: Inactive cards show topic title hints ("English Grammar Fundamentals · English Vocabulary Building") which helps Rani understand what's in each subject without clicking.

---

## Efficiency count (Rani's task: start a math topic from home)

| Step | Action |
|---|---|
| 1 | Home → click "View all topics" (from non-empty state) |
| 2 | /topics → click "Browse" on Mathematics |
| 3 | /topics/mathematics → click "Start" on Algebra Basics |
| 4 | Session begins |

**3 clicks to start a topic** — good. In empty state (ISSUE-001 fixed), it would be 4 clicks (home → browse → /topics → subject → start). Acceptable.

---

## One thing to fix first

**ISSUE-001** — the empty state has no path to the topic browser. Rani's natural instinct is to explore before committing. Right now she's forced to start a session blind or know the `/topics` URL.
