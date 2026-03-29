# Educational Tooltips Design Spec

**Date:** 2026-03-29  
**Feature:** Contextual Educational Tooltips  
**Status:** Design Approved

---

## Overview

A reusable `<TooltipGuide>` component that wraps key UI elements to provide contextual education about the app's learning mechanics (FSRS, mastery gates, streaks, XP, remediation, interleaving). Uses smart triggering: first-time users see full explanations, returning users see brief hints, users struggling with a feature see action-oriented prompts.

---

## Goals

1. **Educate users on "why"** — Explain FSRS scheduling, mastery gates, streak mechanics, and other learning features
2. **Drive action when needed** — Prompt users when they're ignoring due cards, at risk of breaking streak, or hitting gates
3. **Layered engagement** — Full explanation → brief hint → action prompt based on user state

---

## User Stories

| As a | I want to | So that |
|------|-----------|---------|
| New user | See explanations when I encounter FSRS cards, mastery gates | I understand why the app schedules things |
| Returning user | See quick hints that remind me what things mean | I don't need full explanations every time |
| User with overdue cards | Get a prompt to do my reviews | I don't forget to practice |
| User about to break streak | Be reminded to practice | I keep my streak alive |

---

## Architecture

### Component Structure

```
src/components/ui/
  └── tooltip-guide.tsx    # Core component (wraps any UI element)
```

### Props Interface

```tsx
interface TooltipGuideProps {
  children: ReactNode;           // The wrapped UI element
  feature: FeatureKey;            // Which feature this tooltip is for
  variant?: 'explanation' | 'action';
  placement?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}
```

### Feature Keys

```tsx
type FeatureKey = 
  | 'fsrs-card'        // Due cards / overdue
  | 'mastery-gate'    // Locked topics, prerequisites
  | 'streak'          // Streak counter, streak at risk
  | 'xp'              // XP display, XP earned
  | 'remediation'     // Remediation drill prompt
  | 'interleaving';   // Mixed tags in session
```

### Storage Schema

Stored in localStorage (keyed to feature):

```ts
interface TooltipState {
  seen: boolean;           // Has user seen full explanation?
  dismissed: boolean;     // User clicked "Got it"
  lastShown: Date;
  interactionCount: number; // How many times user has used this feature
}
```

### Display Logic

| State | Condition | Content |
|-------|-----------|---------|
| Full explanation | `!seen` | 1-2 sentence explanation + "Got it" button |
| Brief hint | `seen && !dismissed && interactionCount < 2` | 1 line summary |
| Action prompt | `problemArea = true` (e.g., overdue > 3, streak at risk) | Action-oriented message |
| None | `dismissed && !problemArea` | No tooltip |

---

## Content Map

| Feature | First-Time (Full) | Hint | Action Prompt |
|---------|-------------------|------|---------------|
| **fsrs-card** | "Kartu ini dijadwalkan berdasarkan algoritma FSRS. Makin sering ditinjau, makin kuat memori kamu!" | "Kartu FSRS" | "Kamu punya {count} kartu jatuh tempo. Tinjau sekarang untuk jaga retensi!" |
| **mastery-gate** | "Topik ini membutuhkan penguasaan topik '{prereq}' dulu. Selesaikan terlebih dahulu untuk membuka." | "Topik terkunci" | "Hampir lulus! Tingkatkan penguasaan '{prereq}' ke {threshold}% untuk membuka." |
| **streak** | "Streak mengukur belajar harian kamu. Setiap hari berturut-turut menambah streak — jangan patahkan rantai!" | "Streak harian" | "Streak kamu akan reset kalau libur hari ini. Kerjakan 1 kartu untuk jaga streak!" |
| **xp** | "XP (XP) diberikan untuk setiap jawaban benar. Kumpulkan XP untuk lihat progress kamu." | "+XP" | — |
| **remediation** | "Latihan ini fokus ke area yang perlu diperkuat. Selesai ini, kamu bakal lebih siap untuk topik utama." | "Latihan tambahan" | — |
| **interleaving** | "Sesi ini mencampur berbagai subtopik. Ini helps otak kamu membedakan konsep!" | "Campuran subtopik" | — |

---

## UI Locations (Initial Scope)

| Screen | Element | Feature | Trigger |
|--------|---------|---------|---------|
| Home | Due today card | fsrs-card | Always (first-time) |
| Home | Streak counter | streak | On streak change |
| Home | XP display | xp | On XP change |
| Topic Detail | Prerequisite block | mastery-gate | When topic locked |
| Topic Detail | Locked indicator | mastery-gate | When < threshold |
| Session | Answer feedback | xp | On answer |
| Session | Mixed tags display | interleaving | When interleaved |
| Progress | Overdue alert | fsrs-card | When totalDue > 0 |

---

## Implementation Details

### Component API

```tsx
// Usage
<TooltipGuide feature="fsrs-card" placement="top">
  <DueCard />
</TooltipGuide>
```

### Persistence

- Key format: `jm_tooltip_{feature}` (e.g., `jm_tooltip_fsrs-card`)
- Value: JSON stringified `TooltipState`
- Load on mount, save on dismiss/interaction

### Problem Area Detection

Wired to learnerStore for real-time state:

```tsx
const problemArea = {
  fsrs-card: totalDue > 3,
  streak: daysSinceLastSession === streakGoalDays - 1,
  mastery-gate: hasUnlockedTopics && masteryBelowThreshold,
};
```

---

## Acceptance Criteria

1. **First-time experience**: User sees full explanation on first encounter of each feature
2. **Returning user**: User sees brief hint after seeing full explanation twice
3. **Action prompts**: When user has >3 overdue cards, tooltip always shows action prompt
4. **Streak at risk**: When user hasn't practiced today and has active streak, prompt appears
5. **Dismiss persists**: Clicking "Got it" hides tooltip until problem area triggers again
6. **Mobile friendly**: Tooltips work on touch (tap to show, tap outside to dismiss)
7. **Accessibility**: Tooltips readable by screen readers, keyboard navigable

---

## Future Enhancements

- "Show all tips" page in Settings for reference
- Tooltip analytics (how many users dismiss without action)
- Guided walkthrough mode (step-by-step tour for new users)
- Custom tooltip creation API for future features

---

## Out of Scope

- Push notification reminders (future work)
- Email/external reminders
- Social sharing of achievements
