# UX / Interface audit: Session screen

## Implementation follow-up (resolved in code)

The following audit items were **addressed** in [`src/pages/session.tsx`](../../src/pages/session.tsx):

- **H1 / H2:** Feedback uses Radix `Dialog` (`DialogPortal`, `DialogOverlay`, `DialogPrimitive.Content`) with modal behavior, focus trap, `aria-labelledby` / optional `aria-describedby`, `sr-only` title, `aria-live` summary, `autoFocus` on primary action; overlay click and Escape do not dismiss (user must use Next / Finish).
- **M2:** Progress bar uses `(currentIndex + 1) / questions.length`.
- **M3:** `QuitSessionDialog` confirms exit when there is session progress; `Back` / `Quit` use `requestExit`.
- **M1:** Back control wrapped in `Tooltip` (“Back”).
- **M6 / anti-patterns:** Feedback sheet drops `shadow-lg`; uses `border-t-4`, `rounded-t-lg`, and semi-transparent overlay.
- **L2:** XP shown as “XP” in feedback and session complete summary.

**Still open (by design / backlog):** M4 per-distractor explanations (schema), M5 remediation UI, L1 locale strategy, L4 `StepCounter` size at small breakpoints.

---

**Scope:** [`src/pages/session.tsx`](../../src/pages/session.tsx) and direct UI dependencies (`StepCounter`, `Progress`, shadcn primitives).  
**References:** Wireframes [screen-02](../wireframes/screen-02-active-question-session.md), [screen-03](../wireframes/screen-03-answer-feedback.md); [TECH_STACK.md](../TECH_STACK.md); [VISUAL-SPEC.md](../../VISUAL-SPEC.md).  
**Figma:** No concrete file URL in repo ([CONTEXT.md](../CONTEXT.md) placeholder only). Visual comparison vs **wireframe + tokens** only.

---

## Anti-patterns verdict

**Pass** — The screen does not read as generic “AI slop”: Nature tokens, factory patterns (`StepCounter`, `SectionLabel`, tag `Badge`), flat choice cards, and no decorative gradients on CTAs. Minor tension with VISUAL-SPEC: the feedback bottom sheet uses **`shadow-lg` at rest** ([`FeedbackPanel`](../../src/pages/session.tsx)); elevated overlays are often excepted, but it conflicts with the global “resting = no shadow” card rule unless documented as an overlay exception.

---

## Executive summary

| Severity | Count |
|----------|------:|
| Critical | 0 |
| High | 2 |
| Medium | 6 |
| Low | 4 |

**Top issues**

1. **Feedback panel** is a fixed overlay without dialog semantics, initial focus move, focus trap, or `aria-modal` — keyboard and assistive-tech users can interact with content behind the panel ([WCAG 2.4.3](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html), [4.1.2](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html)).
2. **Progress bar** uses `currentIndex / questions.length`, so the **first question shows 0%** fill while the counter correctly shows `01 / N` — misleading progress communication.
3. **Wireframe / schema gap:** [Screen 03](../wireframes/screen-03-answer-feedback.md) calls for **per-distractor “Why wrong”** copy; [`Question`](../../src/types/index.ts) only has a single optional `explanation` — current UI cannot match that spec without content model changes.

**Suggested follow-up skills:** `/harden` (a11y, focus, confirmations), `/polish` (spacing, progress semantics), `/clarify` (copy consistency), `/adapt` (small-viewport behavior).

---

## Detailed findings by severity

### Critical

*None.*

---

### High

#### H1 — Modal overlay without focus management or dialog semantics

| Field | Detail |
|-------|--------|
| **Location** | [`src/pages/session.tsx`](../../src/pages/session.tsx) — `FeedbackPanel` (~185–245), rendered when `phase === 'feedback'` |
| **Category** | Accessibility |
| **Description** | Fixed `z-50` bottom region with no `role="dialog"`, no `aria-modal="true"`, no focus trap, and no programmatic focus move to the panel. Tab order can leave the panel and reach header/choices behind it. |
| **Impact** | Keyboard users get disorienting tab order; screen reader users may not perceive an application modal. |
| **WCAG** | 2.4.3 Focus Order (AA); 4.1.2 Name, Role, Value (A) |
| **Recommendation** | Use a primitive that implements the dialog pattern (e.g. shadcn `Dialog`/`Sheet` with modal behavior), or add `role="dialog"`, `aria-modal`, `aria-labelledby`, initial focus on the primary action, focus trap, and restore focus to “Confirm” trigger on close. Consider `Escape` to dismiss only if product allows skipping feedback (usually not). |
| **Suggested command** | `/harden` |

#### H2 — No announcement of phase change for assistive technologies

| Field | Detail |
|-------|--------|
| **Location** | `setPhase('feedback')` in `handleConfirm` (~400) |
| **Category** | Accessibility |
| **Description** | Entering feedback is a major context change; there is no `aria-live` region announcing verdict or next step. |
| **Impact** | Screen reader users may not notice the bottom sheet content without exploring. |
| **WCAG** | Related to 4.1.3 Status Messages (AA) when implementing live regions |
| **Recommendation** | Add a polite `aria-live="polite"` region for the verdict + primary action label when feedback opens, or move focus into the dialog per H1 (which often suffices). |
| **Suggested command** | `/harden` |

---

### Medium

#### M1 — Icon-only back control without tooltip

| Field | Detail |
|-------|--------|
| **Location** | [`src/pages/session.tsx`](../../src/pages/session.tsx) ~493–495 (`aria-label="Go back"`) |
| **Category** | Theming / project rules |
| **Description** | [VISUAL-SPEC.md / TECH_STACK](../../VISUAL-SPEC.md): “No icon-only buttons without a tooltip.” `aria-label` helps AT but not sighted hover users. |
| **Impact** | Inconsistent with stated design system; reduced discoverability. |
| **Recommendation** | Wrap with `Tooltip` (“Back” / “Exit session” per intent) or add visible text. |
| **Suggested command** | `/normalize` or `/polish` |

#### M2 — Progress bar does not match “started session” mental model

| Field | Detail |
|-------|--------|
| **Location** | `progressPercent` ~428–429: `(currentIndex / questions.length) * 100` |
| **Category** | Responsive / UX |
| **Description** | At question 1 (`currentIndex === 0`), progress is **0%** while `StepCounter` shows `01 / N`. |
| **Impact** | Users see no bar progress until advancing; conflicts with wireframe-style “7 / 20” fullness. |
| **Recommendation** | Use `(currentIndex + 1) / questions.length` (or document intentional “completed items” semantics and align copy). |
| **Suggested command** | `/polish` |

#### M3 — Quit exits with no confirmation

| Field | Detail |
|-------|--------|
| **Location** | `handleQuit` ~416–418 → `navigate('/')` |
| **Category** | UX resilience |
| **Description** | Quit immediately leaves the session; progress is in-memory (`useState`) and not restored. |
| **Impact** | Accidental click loses session; matches neither “safe exit” nor undo. |
| **Recommendation** | Confirm dialog: “End session? Your progress in this run will be lost.” / **End session** / **Cancel**. |
| **Suggested command** | `/harden` |

#### M4 — Screen 03 wireframe: per-choice explanations not supported

| Field | Detail |
|-------|--------|
| **Location** | Data: [`QuestionSchema`](../../src/types/index.ts); UI: `QuestionArea` feedback branch |
| **Category** | Wireframe alignment |
| **Description** | Wireframe shows “Why wrong” on each distractor. Implementation shows one optional `explanation` in `FeedbackPanel` only. |
| **Impact** | Learning value from distractor-specific feedback is unavailable until schema + content exist. |
| **Recommendation** | Track as product/content backlog; extend schema if required. |
| **Suggested command** | N/A (product + content) |

#### M5 — Remediation interrupt (screen 02 variant) not implemented

| Field | Detail |
|-------|--------|
| **Location** | N/A in `src/` (engines referenced in [ARCHITECTURE.md](../ARCHITECTURE.md) but no UI) |
| **Category** | Wireframe alignment |
| **Description** | [Screen 02 variant](../wireframes/screen-02-active-question-session.md) describes FIRe-driven remediation drill; not present in app. |
| **Impact** | Expected adaptive flow from spec is absent — **product gap**, not a defect in current session UI. |
| **Recommendation** | Defer audit scoring; schedule implementation with engine integration. |

#### M6 — Feedback panel resting shadow vs flat-first rule

| Field | Detail |
|-------|--------|
| **Location** | `FeedbackPanel` className includes `shadow-lg` |
| **Category** | Theming |
| **Description** | VISUAL-SPEC: resting surfaces avoid shadow; sheet uses persistent large shadow. |
| **Impact** | Slight inconsistency with global card rules; may be intentional for elevation. |
| **Recommendation** | If overlay exception is intended, add a one-line note in VISUAL-SPEC for “fixed bottom sheets”; otherwise reduce to border-only or tokenized elevation. |
| **Suggested command** | `/normalize` |

---

### Low

#### L1 — Mixed English microcopy on potentially Indonesian content

| Field | Detail |
|-------|--------|
| **Location** | e.g. “Correct!”, “Incorrect”, “Confirm answer”, “Topics in this session”, performance band strings in `SessionComplete` |
| **Category** | Copy / localization |
| **Description** | Wireframes use Indonesian example strings; app strings are English. |
| **Impact** | Inconsistent if product targets ID-first users. |
| **Recommendation** | Align with i18n strategy when introduced. |
| **Suggested command** | `/clarify` |

#### L2 — “xp” casing inconsistency

| Field | Detail |
|-------|--------|
| **Location** | Feedback: `+{xpAwarded} xp` (~221); wireframe uses “XP” |
| **Category** | Copy |
| **Description** | Minor inconsistency with wireframe and with `SessionComplete` (“xp” in stat). |
| **Impact** | Trivial polish. |
| **Recommendation** | Standardize on “XP” for Latin abbreviation in UI. |

#### L3 — Choice card hover applies shadow + color change

| Field | Detail |
|-------|--------|
| **Location** | Answering mode `button` ~147–151 |
| **Category** | Theming |
| **Description** | TECH_STACK warns against hover that changes color **and** shadow **and** scale **simultaneously** — here, border/bg **and** `hover:shadow-sm` (no scale). |
| **Impact** | Low; within acceptable “interactive card” exception. |
| **Recommendation** | None required; optional simplification to shadow-or-tint only. |

#### L4 — `StepCounter` size `sm` on dense header

| Field | Detail |
|-------|--------|
| **Location** | ~503 `size="sm"` |
| **Category** | Responsive |
| **Description** | Wireframe emphasizes “Question 7 of ~20”; small counter may be harder on mobile. |
| **Impact** | Minor readability. |
| **Recommendation** | Try `md` on `sm` breakpoints or increase tap target around header cluster. |
| **Suggested command** | `/adapt` |

---

## Patterns and systemic issues

- **Overlay pattern:** Any future fixed overlays should reuse one accessible dialog/sheet primitive to avoid repeating H1/H2.
- **Progress + counter:** Numeric and bar progress should use one consistent formula and be documented.

---

## Positive findings

- **Choice randomization** integrated via `useChoiceRandomization` with stable letters — matches wireframe intent.
- **Feedback phase** keeps stem and choices visible with clear correct/incorrect styling and labels (“✓ correct”, “✗ your answer”).
- **Session mix footer** with `Shuffle` icon communicates interleaving without clutter.
- **Loading / error / empty** states include recovery via “Go back”.
- **Layout** provides `<main>` landmark via [`Layout`](../../src/components/layout/layout.tsx).
- **`SessionComplete`** gives structured stats and banded messaging without emoji noise.

---

## Recommendations by priority

1. **Immediate:** Fix **H1/H2** (dialog behavior + live region or focus) before claiming WCAG AA for this flow.
2. **Short term:** **M2** progress formula, **M3** quit confirmation, **M1** tooltip on back.
3. **Medium term:** **M4/M5** product backlog; **M6** shadow spec; **L1/L2** copy/i18n pass.
4. **Long term:** **L4** responsive typography for counter.

---

## UX copy supplement (key strings)

Per [`.agents/skills/ux-copy/SKILL.md`](../../.agents/skills/ux-copy/SKILL.md).

### Recommended copy (targeted fixes)

| Element | Copy |
|---------|------|
| Quit (button) | **Leave session** (stronger than “Quit”; pairs with confirm dialog) |
| Confirm CTA | **Confirm answer** (keep — clear verb; wireframe’s “Confirm Answer →” is equivalent) |
| Feedback verdict (correct) | **Correct** or **That’s right** (slightly calmer than “Correct!”) |
| Empty state | **No questions for this topic yet.** + secondary line *We’ll add some soon.* (if true) |

### Alternatives

| Option | Copy | Tone | Best for |
|--------|------|------|----------|
| A | **End session** | Neutral | Quit button label with M3 confirm |
| B | **Quit** | Short | Power users; weaker alone |
| C | **Leave** | Conversational | Mobile-first |

### Rationale

- **Leave session / End session** sets expectation that the user exits the flow (supports M3).
- Slightly reducing exclamation frequency in success copy aligns with calm, mastery-focused positioning ([CONTEXT.md](../CONTEXT.md)).

### Localization notes

- Indonesian: use **Soal** for “Question” if replacing `Q` prefix; keep **XP** as loanword or expand to **poin pengalaman** per product glossary.
- Avoid idioms in error strings; keep verb-first CTAs.

---

## Wireframe alignment summary

| Item | Screen 02 / 03 | Implementation |
|------|------------------|----------------|
| Back, title, index, quit | Yes | Yes (`Quit` not “Quit session”) |
| Progress bar + fraction | Bar + 7/20 | Bar + `StepCounter` (exact total); bar fill see **M2** |
| Topic tag + difficulty | Yes | First tag only + dots |
| Randomized choices | Yes | Yes |
| Confirm CTA | “Confirm Answer →” | “Confirm answer” + icon |
| Session mix | Footer tags | “Topics in this session” + tags |
| Feedback: XP + time | Yes | Yes |
| Per-distractor wrong reasons | Screen 03 | No (**M4**) |
| Remediation variant | Screen 02 | Not built (**M5**) |

---

*Audit completed per plan: audit skill dimensions + wireframe alignment + ux-copy review. No code changes in this document.*
