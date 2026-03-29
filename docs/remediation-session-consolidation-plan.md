# Remediation & Session Consolidation Plan

**Date:** 2026-03-30  
**Status:** Analysis Complete — Implementation Pending  
**Related:** Screen 2 (Session), Screen 5 (Remediation Drill), Screen 11 (Session Complete)

---

## Executive Summary

This plan resolves a critical navigation loop bug, addresses functionality gaps, and consolidates duplicated code between the regular session flow (`src/pages/session.tsx`) and the remediation drill flow (`src/pages/remediation-drill.tsx`). The remediation system triggered after prerequisite failures must not trap users in a navigation loop and must update mastery to prevent indefinite re-triggering.

The plan is divided into:

1. **Problem Analysis** — root causes and discrepancies (31 items)
2. **Phase 1 Fixes** — critical navigation & mastery updates (must ship together)
3. **Phase 2 Refactor** — shared components, UX alignment, wireframe compliance
4. **Decisions & Rationale** — answers to key design questions

---

## 1. Problem Analysis

### 1.1 Navigation Loop (Critical Bug)

**Scenario:** User completes remediation drill and clicks "Quit session" → stuck bouncing between `/session/:topicId` and `/remediation/drill`.

**Root Cause:**

- `session.tsx` quit handlers use `window.history.back()` to return to the previous page
- `remediation-drill.tsx` exit handlers use `navigate()` which **adds** a new history entry
- History stack after drill completion: `[... , session, remediation/gate?, remediation/drill, session]`
- "Quit session" on the resumed session goes back to drill (still in history) → loop

**Affected flows:**

- `session.tsx` lines 587–602 (`handleQuit`, `exitSession`)
- `remediation-drill.tsx` lines 338–356 (`exitDrill`, `handleDone`)
- `remediation-gate.tsx` line 58 (`handleSkip`)

---

### 1.2 Mastery Not Updated

**Scenario:** User answers prerequisite topic questions incorrectly → remediation prompt appears → completes drill → still shows low prerequisite mastery → remediation prompt reappears when session ends → potentially re-triggered indefinitely.

**Root Cause:** `remediation-drill.tsx` does not update `TopicMastery` for the prerequisite topic (`params.topicId`) after drill completion. The condition `accuracy < 60%` persists because mastery data is unchanged.

**Missing logic:** After drill completes (line 382), compute accuracy and call `learnerActions.updateTopicMastery` for the prerequisite topic. The regular session already does this blending (lines 470–497).

---

### 1.3 Discrepancies Overview (31 items)

#### Critical (3)

1. Navigation loop (1.1)
2. Mastery not updated (1.2)
3. Code duplication: `QuestionArea`, `FeedbackBanner`, `DifficultyLabel`, `QuitDialog` are near-identical copies across both pages

#### UX Inconsistencies (8)

4. Exit button text: "Quit session" (EN) vs "Keluar sesi" (ID)
5. FeedbackBanner XP display: inline `+50 XP` (session) vs separate line `+25 XP` (drill)
6. XP award amount: 50 (session) vs 25 (drill)
7. Complete screen: rich `SessionCompleteView` vs minimal "Latihan selesai!" card
8. Context header: drill shows "Konteks: Setelah latihan ini..." (wireframe 5b) — absent in regular session when returning from remediation
9. Session tags footer (interleaving indicator) — present only in regular session
10. Next button labels: "Selesaikan sesi" vs "Selesaikan latihan"
11. Header title: topic title vs prerequisite topic title

#### Missing Features (drill vs session) (7)

12. Streak update on complete (correctly absent for drill)
13. Topic rollup aggregation
14. Tag rollup for weak area detection
15. Weak area section card
16. Remediation prompt re-check (drill doesn't check if parent session still has remediation needs)
17. Next review schedule (FSRS due dates)
18. "Practice again" CTA ("Tinjau lebih lanjut")

#### Accessibility (2)

19. `aria-live` on FeedbackBanner — present in session, missing in drill
20. Heading hierarchy differences in complete screens

#### Wireframe Compliance (3)

21. Screen 5b context line implemented in drill, missing in regular session (when resuming from remediation)
22. Complete screen: wireframe 11 shows rich complete screen; drill uses minimal card — should be unified
23. Exit button: wireframe 5b says "[Keluar latihan]" but code says "Keluar sesi" — consistent preference

#### Code Quality (2)

24. Duplicated question cap logic (`getSessionQuestionCap` vs `getDrillQuestionCap`)
25. Duplicated state management (different hooks, separate implementations)

#### Subtle Behavior Gaps (4)

26. Scroll-into-view on confirm: both have it, but session uses `useEffect` while drill uses another — should be consistent
27. Skeleton loading: session has `SessionCompleteSummarySkeleton`; drill has none
28. Error/empty states: similar but not identical wording
29. Session tags: shown only in answering phase in session; drill never shows (likely correct)
30. Progress bar: both use same pattern — OK
31. Dialogue styling: essentially identical — OK

---

## 2. Phase 1 Fixes (Critical — Must Ship Together)

### 2.1 Navigation Loop Fix

**Approach:** Use `{ replace: true }` when navigating from remediation pages back to the session. This removes the remediation page from the history stack, so `history.back()` from the session goes to the page before remediation started.

**File Changes:**

#### `src/pages/remediation-gate.tsx`

- Line 49 (`handleStartDrill`):  
  `navigate(`/remediation/drill?${qs.toString()}`, { replace: true })`

- Line 58 (`handleSkip`):  
  `navigate(`/session/${params.fromTopicId}?${qs.toString()}`, { replace: true })`

#### `src/pages/remediation-drill.tsx`

- Line 347 (`exitDrill`):  
  `navigate(`/session/${params.fromTopicId}?${qs.toString()}`, { replace: true })`

- Line 355 (`handleDone`):  
  `navigate(`/session/${params.fromTopicId}?${qs.toString()}`, { replace: true })`

**Rationale:** Keeps `session.tsx` quit behavior unchanged; prevents remediation pages from lingering in history.

---

### 2.2 Mastery Update After Drill Completion

**Approach:** In `remediation-drill.tsx`, when `phase === 'complete'`, compute the drill accuracy and update `TopicMastery` for the prerequisite topic (`params.topicId`). Reuse the blending approach from `session.tsx` for consistency.

**Implementation Details:**

- **Data needed:** `allTopics` (already fetched), `params.topicId` (prerequisite), `correctCount`, `questions.length`
- **Action:** Call `learnerActions.updateTopicMastery` with blended ratio:
  - `prev = learnerStore.get().topics[prereqId]`
  - If `prev` doesn't exist, initialize with `initializeTopicMastery`
  - `prevRatio = prev.masteredQuestions / prev.totalQuestions` (or 0 if 0)
  - `sessionAcc = correctCount / questions.length`
  - `blended = prev.masteredQuestions > 0 ? prevRatio * 0.5 + sessionAcc * 0.5 : sessionAcc`
  - `nextMastered = Math.min(totalQuestions, Math.round(blended * totalQuestions))`
  - `updateTopicMastery(prereqId, { totalQuestions, masteredQuestions: Math.max(prev.masteredQuestions, nextMastered), lastPracticed: now })`
- **Streak:** Do not update streak; drill is part of the parent session's streak

**Code Location:** Insert into `remediation-drill.tsx` inside the `if (phase === 'complete')` block before returning the completion UI (around line 386).

---

## 3. Phase 2 Refactor (Shared Components & UX Alignment)

**Goal:** Eliminate duplication, align UX, meet wireframe specs.

### 3.1 Extract Shared Components

Create `src/components/session/shared/`:

- `question-area.tsx` — merge from `session.tsx:107-217` and `remediation-drill.tsx:60-166`
  - Props: `randomized`, `phase`, `selectedChoiceId`, `onSelectChoice`
  - No mode-specific differences; keep unified
- `difficulty-label.tsx` — identical in both; move to shared
  - Props: `difficulty`
- `feedback-banner.tsx` — unify with:
  - Props: `isCorrect`, `xpAwarded`
  - Always render XP inline when `xpAwarded > 0`
  - Include `aria-live="polite"` wrapper for screen readers (match `session.tsx`)
  - Use consistent styling: success color border for correct, destructive for wrong
- `quit-dialog.tsx` — both are identical; extract and use single component

**Post-extraction:** Both `SessionPage` and `RemediationDrillPage` import and use these shared components.

---

### 3.2 UX Alignment

#### 3.2.1 Exit Button Text Consistency

**Decision:** Use "Keluar sesi" across both (Indonesian, matches wireframes).  
**Change:** `session.tsx` line 778 — replace "Quit session" with "Keluar sesi".

---

#### 3.2.2 XP Award Consistency

**Decision:** Keep 25 XP for drills (shorter, focused); 50 XP for regular sessions. Document this as intentional.

---

#### 3.2.3 Complete Screen Unification

**Decision:** Use `SessionCompleteView` for both regular sessions and drills.

**Implementation:**

- Enhance `SessionCompleteView` to support drill context:
  - Add optional prop `drillTopicTitle?: string` to override primary heading
  - When `drillTopicTitle` provided, show "Latihan Selesai" heading and the drill topic title as the section header
  - Hide sections not relevant to drill: weak area, next review schedule, "Tinjau lebih lanjut" CTA
  - Show single CTA: "Kembali ke sesi" (hook to `onDone`)
  - Stats: show only Pertanyaan, Akurasi, XP, Waktu (same)
  - Streak: hide or show as read-only? Drill does not affect streak — show current streak but no "→" arrow
  - Topic rows: single row (prerequisite topic) with session accuracy only (no overall mastery needed)
- Modify `remediation-drill.tsx:382-403` to render `SessionCompleteView` instead of the minimal card
- Pass props:
  - `primaryTopicTitle`: `prereqTitle`
  - `isMultiTopicSession`: `false`
  - `totalQuestions`, `correct`, `accuracyPercent`, `xpEarned`
  - `timeLabel`: compute from `Date.now() - startTimeRef.current` (similar to session)
  - `streakBefore`/`streakAfter`: both `learnerStore.get().streak`
  - `streakGoalDays`: `learnerState.streakGoalDays ?? 30`
  - `topicRows`: single row with `{ topicId: params.topicId, title: prereqTitle, correct: correctCount, attempted: questions.length, overallMasteryPercent: null }`
  - `nextReviewSummary`: `null`
  - `dueTopicsLine`: `null`
  - `weakArea`: `null`
  - `onDismissWeakArea`: no-op
  - `onPracticeWeakArea`: no-op
  - `remediationPrompt`: `null`
  - `onStartRemediation`/`onSkipRemediation`: no-op
  - `onDone`: `handleDone` (return to parent session)
  - `onAnotherSession`: no-op or hide CTA

**Note:** This also requires computing `timeLabel` for drill complete. Add `formatSessionDurationId` import from `session-complete-aggregates`.

---

#### 3.2.4 Context Header in Regular Session

**Wireframe 5b** shows: "Konteks: Setelah latihan ini, kamu kembali ke [topic], soal N."  
Consider adding similar context when regular session resumes after remediation (`?resumeAt=` present).  
**Recommendation:** Add optional context banner in `SessionPage` near the top when `resumeAtIndex != null`, showing "Melanjutkan dari soal {resumeAtIndex}" or similar.

---

#### 3.2.5 Session Tags in Drill

Drill is single-topic, so interleaving tags are not applicable. The session tags footer should remain session-only (already the case if we extract components correctly).

---

#### 3.2.6 Button Labels

- Regular session confirm: "Konfirmasi jawaban" (already Indonesian)  
- Drill confirm: same (already matches)
- Next button: unify to show "Pertanyaan berikutnya" when not complete; "Selesaikan sesi" vs "Selesaikan latihan" — with complete screen unification, the button label can be the same pattern, or keep as is since complete screen provides final CTAs.

---

### 3.3 Wireframe Compliance

- Complete screen should match wireframe 11 style for both modes (addressed by 3.2.3)
- Exit button on drill screen 5b: wireframe says "[Keluar latihan]" — decision from 3.2.1 applies; choose one consistently.

---

## 4. Decisions & Answers

| Question | Decision | Rationale |
|----------|----------|-----------|
| Mastery update formula | Use blended 50/50 (same as regular session) | Consistent behavior; drill contributes equally to mastery |
| Complete screen | Use full `SessionCompleteView` | Single source of truth; reduces duplication; already supports multi-topic |
| XP award | Keep 25 XP for drill, 50 XP for session | Recognizes drill length and focus; maintainable difference |
| Exit button text | "Keluar sesi" (consistent Indonesian) | Avoids mixed EN/ID; wireframe uses Indonesian |
| Consolidation approach | Extract shared components (Strategy A) | Safer incremental refactor; easier review; does not merge routing concerns |

---

## 5. Implementation Checklist

### Phase 1 (Critical)

- [ ] Add `{ replace: true }` to remediation→session navigations (4 locations)
- [ ] Implement mastery update in drill completion (reuse blending logic)
- [ ] Verify loop is broken: test flow session → remediation gate → drill → quit → back navigation works
- [ ] Verify mastery updates: check learnerStore after drill completes

### Phase 2 (Refactor)

- [ ] Create `src/components/session/shared/` directory
- [ ] Extract `question-area.tsx`
- [ ] Extract `difficulty-label.tsx`
- [ ] Extract `feedback-banner.tsx` (include `aria-live`)
- [ ] Extract `quit-dialog.tsx`
- [ ] Update `session.tsx` to use shared components
- [ ] Update `remediation-drill.tsx` to use shared components (and remove duplicate code)
- [ ] Change `session.tsx` exit button text to "Keluar sesi"
- [ ] Enhance `SessionCompleteView` to support drill mode (props: `drillTopicTitle`, hide irrelevant sections)
- [ ] Replace drill complete card with `SessionCompleteView`
- [ ] Compute `timeLabel` in drill and pass to `SessionCompleteView`
- [ ] Ensure `onDone` in drill complete navigates correctly with `{ replace: true }`
- [ ] Add context banner in `SessionPage` when resuming from remediation (optional but recommended)
- [ ] Run lint and typecheck (`npm run lint && npm run lint:css`)

---

## 6. Acceptance Criteria

1. **No navigation loop:** After completing drill and quitting, back navigation goes to page before the session started (e.g., topic detail or home)
2. **Mastery improves:** Prerequisite topic mastery increases after successful drill completion; remediation prompt does not reappear immediately on session end if threshold met
3. **Code quality:** Shared components used; duplication eliminated
4. **UX consistency:** Exit button text, feedback banner, and complete screens are visually aligned
5. **Wireframe alignment:** Complete screen matches wireframe 11; drill complete uses same design language
6. **Accessibility:** Both feedback banners have `aria-live`; heading hierarchy consistent

---

## 7. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| `{ replace: true }` breaks expected back behavior in some edge cases | Medium | Test thoroughly: from home → topic → session → remediation → back to home |
| Mastery blending formula too aggressive or too weak for drill | Medium | Use same formula as session; monitor in testing; can be tuned later |
| `SessionCompleteView` changes break drill integration | Medium | Add drill-specific handling carefully; keep existing session behavior unchanged |
| Shared component extraction introduces regressions in styling | Low | Verify visually; match existing styles exactly |

---

## 8. Post-Implementation Validation

- Manual test scenarios:
  1. Start session on Topic A → answer question on prerequisite Topic B incorrectly → see remediation prompt → complete drill → verify mastery of Topic B increased → finish session → no remediation prompt
  2. Quit drill at any point → back navigation goes to expected page without looping
  3. Complete drill → see complete screen with proper stats and "Kembali ke sesi" button
  4. Complete regular session → unchanged behavior

- Automated tests (future): unit tests for mastery blending, integration tests for navigation flow

---

## 9. Related Documents

- Wireframes: `docs/archives/wireframes_1.md` (Screens 2, 5, 11)
- Context: `docs/CONTEXT.md`
- Architecture: `docs/ARCHITECTURE.md`
- UX Audit: `docs/audits/session-screen-ux-audit.md`, `docs/audits/topic-detail-s12-2026-03-29.md`
- Educational tooltips spec: `docs/superpowers/specs/2026-03-29-educational-tooltips-design.md`

---

## 10. Changelog

- 2026-03-30: Analysis + plan created (31 discrepancies, 2-phase fix)
