# UX Audit: Session complete screen

**Original review**: 2026-03-28  
**Re-audit**: 2026-03-29  
**Scope**: [`SessionCompleteView`](../../src/components/session/session-complete-view.tsx), complete phase in [`session.tsx`](../../src/pages/session.tsx), vs [`screen-11-session-complete.md`](../wireframes/screen-11-session-complete.md).  
**Method**: Static code review (second pass). For **agent-browser** evidence and repro steps, use **dogfood** per [`AGENTS.md`](../../AGENTS.md) (UX audit + dogfood); for ranked walkthrough-style notes, **ux-audit** skill applies.

## Re-audit summary (2026-03-29)

**Update (implementation, 2026-03-29):** Multi-topic headline + band copy, accessibility (`<main>`, heading focus, `document.title`), summary loading skeleton, and Confirm-row scroll / instant scroll on feedback are **implemented** — see [Implementation follow-up](#implementation-follow-up-2026-03-29) at the end of this doc. **375px** visual QA and **Low** items below are still optional follow-ups.

Earlier static pass (before code changes): same props, same `primaryTopicTitle` logic, same `PERFORMANCE_BANDS` copy, same loading gate; **High** and **Medium** items were open. That pass also noted **focus/landmark** and **weak-area topic mapping** notes.

**Confidence**: Static review only — validate layout (375px), focus order, and streak edge cases in a live run (`npm run dev`, `http://localhost:5173/session/english-grammar` or `/session`).

---

## Summary

The screen matches the wireframe’s major blocks: four metrics, streak + goal bar, topic rows, next due, weak-area card, dual CTAs. TECH_STACK patterns (StatDisplay, SectionLabel, Progress, tokens) are consistent. Remaining issues are mainly **multi-topic semantics** (headline + band copy), **accessibility** (heading hierarchy / focus), and **optional** wireframe parity (mastery deltas, clock on next review).

## Flow score (session end)

| Metric | Assessment |
|--------|------------|
| Task completed? | Yes — user reaches summary after last question |
| Click count to leave | 1 (Back to home or Another session) |
| Decision points | Low — primary action is clear; weak-area CTAs optional |
| Would come back? | Plausible — summary reinforces progress |
| One thing twice as easy | Clarify **main heading** when multiple topics (`topicRows.length > 1`) and align **band** copy |

## Findings

### High (confirmed)

- **Headline can misrepresent multi-topic sessions**  
  *Where*: `primaryTopicTitle` in `session.tsx` (route topic or first question’s topic); passed as `h1` in `SessionCompleteView`.  
  *Issue*: `/session` with questions from several topics still shows one topic as the main title.  
  *Fix*: If `topicRows.length > 1`, use `h1` = “Session complete” / “Your results”, put topic names only under “Topic progress this session”.

- **Performance band copy is single-topic oriented**  
  *Where*: `PERFORMANCE_BANDS` in `session-complete-view.tsx` (“This topic is firmly in your memory”, etc.).  
  *Issue*: Inaccurate when the session covered multiple topics.  
  *Fix*: Branch messages when `topicRows.length > 1`.

### Medium (confirmed + one addition)

- **Document title / screen reader semantics**  
  *Where*: `h1` = topic title; eyebrow “Session complete” is not the main heading.  
  *Fix*: Prefer `h1` = session outcome + `h2` for topic; and/or `document.title` when entering complete phase.

- **Focus not moved to summary**  
  *Where*: Transition to complete phase.  
  *Issue*: Keyboard and SR users may remain focused below the fold or on no landmark after the feedback sheet closes.  
  *Fix*: `useEffect` focusing the summary heading or a “Skip to summary” pattern; wrap content in `<main>` with `aria-labelledby` pointing at the primary heading.

- **“Next due” with summary but no due-topics line**  
  *Where*: `nextReviewSummary` set, `dueTopicsLine` null.  
  *Note*: Still acceptable; confirm in browser that users parse “Next review: …” alone.

- **Transient “Loading summary…”**  
  *Where*: `phase === 'complete' && !sessionEndMeta`.  
  *Note*: Rare; replace with skeleton if it flashes in real runs.

### Low

- **Weak-area practice target**  
  *Where*: `tagRollup` stores one `topicId` per tag.  
  *Note*: If a tag appeared across topics, the associated `topicId` may not match user expectation for “practice this area” — edge case; document or refine if content uses duplicate tag names across topics.

- **Wireframe mastery deltas (62% → 74%)**  
  *Note*: Strategy A — session stats + optional overall mastery; no %→% delta (by design).

- **Next review clock**  
  *Note*: Wireframe “Tomorrow, 09.00” not shown — needs real schedule semantics.

- **XP StatDisplay**  
  *Note*: `+{xp}` + unit `xp` — verify visually for redundancy.

- **Topic section empty**  
  *Note*: With normal data, `topicRows` is non-empty whenever `questions.length > 0`. If empty, section would show a heading with no rows — defensive UI could show “No topic breakdown” (unlikely).

## Wireframe coverage

| Wireframe element | Status |
|-------------------|--------|
| Four metric tiles | Met |
| Streak + progress to goal | Met |
| Topic progress | Partial — no %→% delta |
| Next due + topic line | Met when cards exist |
| Weak area + CTAs | Met |
| Back home + Another session | Met |

## Resilience (inferred)

- Refresh on complete loses in-memory summary (expected without a dedicated route).  
- “Remind me next session” is session-local only (matches voluntary weak-area pattern).

## Recommended follow-ups (prioritized)

1. Multi-topic `h1` + `PERFORMANCE_BANDS` branching (**High**).  
2. Focus management + `<main>` / heading order (**Medium**).  
3. Visual QA at **375px** (metric grid, CTA order).  
4. Optional **dogfood** run on finish flow for screenshots and repro notes.

## Implementation follow-up (2026-03-29)

Addressed in code:

| Finding area | Change |
|--------------|--------|
| **High** — multi-topic headline + band copy | `isMultiTopicSession` (`topicRows.length > 1`): `h1` **Your results**; `PERFORMANCE_BANDS` use `messageMulti` for session-wide wording. |
| **Medium** — semantics / focus / `document.title` | `SessionCompleteView`: `<main id="session-complete-main" aria-labelledby="session-complete-heading">`, primary `h1` with `tabIndex={-1}` + `useLayoutEffect` focus; `document.title` `JadiMikir — …` (topic title if single-topic, else “Session complete”). |
| **Medium** — “Loading summary…” | Replaced with `SessionCompleteSummarySkeleton` (shadcn `Skeleton`) in `session.tsx`. |
| **Dogfood** — Confirm → feedback | `confirmActionsRef` + `scrollIntoView` when a choice is selected; `handleConfirm` uses `scrollTo` **instant** instead of smooth. |

**Still open / manual:** 375px visual QA; Low-priority audit notes (mastery delta, next-review clock, weak-area tag edge case).

## References

- [ux-audit skill](https://skills.sh/jezweb/claude-skills/ux-audit) (targeted check).  
- [AGENTS.md](../../AGENTS.md) — UX audit + dogfood pipeline.  
- [dogfood SKILL](../../.agents/skills/dogfood/SKILL.md) — agent-browser repro output.
