# JadiMikir Product Strategy

## Executive Summary

**JadiMikir** is an adaptive MCQ learning platform built for **efficient paths to mastery**: tutor-level personalization through FSRS scheduling, targeted remediation, and interleaved practice. Learners get **visible progress** (mastery gates, XP, streaks) without mandatory accounts; **local-first storage** and **no default cloud sync** keep data on-device and under user control.

**Privacy** and **learning-science rigor** are **supporting proof**, not the headline: they explain *why* the experience is trustworthy and effective, while the primary promise is **outcomes and efficiency** for self-directed study.

The platform targets self-directed learners who want scientifically grounded, adaptive practice without sign-up friction. Core value: **retention and mastery** through a question engine that adapts to individual performance.

---

## Target Users

### Primary Persona: The Self-Driven Learner

- **Demographics**: Students (high school to professional certification), lifelong learners, exam candidates
- **Behaviors**: Values study efficiency, prefers low-friction tools, may be uncomfortable sharing data with third parties, prefers mobile-friendly access, wants visible progress
- **Pain Points**:
  - Generic quiz apps do not adapt to real understanding
  - Flashcard apps lack intelligent scheduling
  - Concerns about cloud-based learning tools
  - Blocked practice feels unproductive

**Educator / institutional personas** (recommendations, class packs, dashboards) are **out of scope for the current strategy**; they may be revisited when learner adoption warrants expansion.

---

## Value Proposition

| For | Karena | Bukti |
|---|---|---|
| Learners | Reach mastery faster with adaptive practice | FSRS + remediation + interleaving |
| Learners | Own their data; start without an account | Local-first storage, export/import |
| Learners | See real progress, not only scores | Mastery gates, XP, streaks, diagnostics |

---

## Market Positioning

### Category

**Adaptive MCQ learning platform** (retention and mastery first; privacy and local-first as trust and infrastructure).

### Differentiation Matrix

| Competitor | JadiMikir Advantage |
|---|---|
| Quizlet / Anki | Adaptive scheduling (FSRS), remediation, interleaving; no mandatory account for core use |
| Khan Academy | Fully local core loop, mastery gates, interleaving for chosen content |
| Duolingo | Deeper mastery signals than streak-only; unlimited practice on your content |
| Traditional LMS | Lightweight, personal, no institutional overhead |

### Positioning Statement

> "Untuk learner yang ingin belajar efisien dan melihat kemajuan nyata, JadiMikir adalah platform latihan MCQ yang menyesuaikan jadwal dan remediasi berdasarkan performa kamu—mulai langsung tanpa akun, data utamanya di perangkat kamu."

---

## Product Pillars

### 1. Adaptivity (Core Engine)

The question engine is the product. Every answer updates the learner model:

- **FSRS** for spaced repetition scheduling
- **Targeted remediation** on prerequisite gaps
- **Interleaving + non-interference** for retention
- **Response time tracking** for automaticity signals

### 2. Privacy as Trust Infrastructure

Privacy is not a gimmick—it enables **instant start**, **on-device ownership**, and **predictable risk** (no credential breach surface for core use). Framing:

- Zero account requirement for the core loop (start in seconds)
- Learner state persisted **on-device** (IndexedDB via the app storage layer; not uploaded by default)
- Full **export/import** for portability
- **No tracking or analytics for users who do not opt into research** (see [Evaluation & experimentation](#evaluation--experimentation-learning-lab))

### 3. Visible Mastery

- Clear mastery gates (not "good enough" alone)
- Progress metrics tied to learning (XP, streak, mastery scores)
- Diagnostic placement to skip known material

### 4. Content Quality

- Rigorous content validation (SKILL 11)
- Deliberately plausible distractors
- Distractor-specific explanations

### 5. Knowledge Graph / Skill Tree

A structured view of topic dependencies that should **drive behavior**, not only look impressive:

- **Intended behaviors**: learners **follow remediation paths** instead of skipping prerequisites; choose **next steps** informed by blocked vs ready topics; use the graph to **understand ordering**, not only to browse
- **Success signals** (product health): remediation completion rate, progression along intended paths—not only weekly views (see Success Metrics)
- **UI**: node graph, progress states (locked / available / in progress / mastered), pathway and prerequisite signals, optional focused "current path" to avoid clutter
- Integrates with FIRe (SKILL 10) and Targeted Remediation (SKILL 5)

---

## Content Strategy & FSRS Prerequisites

**Content is the product alongside the engine.** A strong scheduler with thin content fails in practice.

- **Subjects / tracks**: Decide initial subject scope and curriculum shape (TBD; start with one deep track before breadth)
- **Quality bar**: SKILL 11 validation, plausible distractors, explanations—non-negotiable for shipped items
- **Density & FSRS**: FSRS needs enough distinct items per topic to avoid obvious repetition and shallow scheduling. Treat **~10+ questions per topic** as a **minimum seed** for demos; **higher counts** improve scheduling quality. Align deeper visualization (e.g. skill tree UI) with [CONTEXT.md](../CONTEXT.md) deferral rules when volume is still low
- **Authoring**: Phase 3 authoring tooling addresses the bottleneck; until then, scripted JSON/content pipeline risk is explicit in roadmap

---

## Success Metrics

> **Baselines**: Targets are directional; methodology refines after launch. **Learning outcomes** are listed first; engagement supports but does not substitute for them.

### Learning Outcome Metrics

| Metric | Target | Rationale | How measured |
|---|---|---|---|
| Mastery rate | ≥70% of started topics mastered | Core value | Local state +; for **study enrollees**, optional server-side aggregation |
| Retention after 30 days | ≥80% of mastered topics still due / not lapsed | SRS working | **Non-participants**: recompute on-device from FSRS due dates and calendar elapsed time. **Study enrollees**: same definitions, may be aggregated on server for cohort reporting |
| Time to mastery | ≤3× content size (illustrative) | Efficiency | Median time per topic from local history; studies may add cohort cuts |

### Engagement Metrics

| Metric | Target | Rationale | Baseline Plan |
|---|---|---|---|
| Daily Active Users (DAU) | TBD | Baseline engagement | From launch |
| Session length | ≥10 minutes/session | Productive practice | Distribution; median target ≥10 min |
| Questions per session | ≥20 | Retrieval volume | Median ≥20 |
| Return rate | ≥60% within 7 days | Habit | Industry benchmark |

### Product Health Metrics

| Metric | Target | Rationale | Baseline Plan |
|---|---|---|---|
| Export usage | ≥10% export at least once | Data ownership | Phase 2+ when surfaced |
| Knowledge graph usefulness | Remediation completion + path progression—not only views | Graph drives behavior | Phase 2+ |
| Remediation completion | ≥50% of triggered remediations completed | Remediation works | Phase 2+ |
| Diagnostic completion | ≥80% of new users complete diagnostic | Onboarding | Phase 2+ |

### Measurement architecture

- **Default product**: learner progress stays **local**; no upload required for core use.
- **Rigorous measurement & learning lab**: users who **opt into named research studies** may send **minimal de-identified events and/or aggregates** for **arm assignment, A/B analysis, and impact evaluation**. Collection scope, retention, and opt-out are **per study** and **default off**.
- **Composition**: local-first behavior and **opt-in study uploads** are deliberate—**studies are explicit**, not silent telemetry.

---

## Evaluation & experimentation (learning lab)

JadiMikir is both the shipping learner product and an internal **learning lab**: randomized experiments (A/B and multivariate when justified), impact evaluation, and **learning-outcome-first** analysis—not only engagement dashboards.

### What we test (examples)

- Algorithm parameters (FSRS / scheduling), UI variants, onboarding, content sets, remediation policies  
- **Primary outcomes**: mastery, retention windows, calibration—not only clicks or session length

### Assignment & governance

- Document **how subjects are assigned** to arms (stable anonymous IDs for longitudinal work where needed, feature flags / experiment registry, optional pre-specified hypotheses and success metrics per study). Exact tooling is implementation; principles belong in strategy.

### Impact evaluation

- Pre/post designs, holdouts, baselines as appropriate; **minimum rigor** may start with internal dogfood, then **opt-in** panels—spelled out per study.

### Privacy & trust (studies)

- **Production path**: **opt-in enrollment** → minimal **de-identified** events/aggregates for assignment and analysis; **non-enrolled** users remain **local-only** for analytics  
- **Never collect** (non-exhaustive): account passwords we do not use; **PII** as defined in study policy; **raw full question text** or answer keys in clear if avoidable; cross-site tracking identifiers; anything beyond stated study scope  
- **Deployment model** (single app + flags vs separate lab build): **undecided**—document **tradeoffs** (velocity vs isolation, blast radius, compliance) and choose per phase or experiment

### Operational note

Implementation of pipelines, consent UI, and flags is **roadmap work**, not implied as shipped in the current app snapshot.

---

## Roadmap Framework

### Phase 1: Foundation (MVP)

**Objective**: Core learning loop with FSRS and mastery gates

| Feature | Priority | Dependencies |
|---|---|---|
| Stack setup (React 19 + Vite + wouter + TanStack Query/Store) | P0 | None |
| Topic/Question data model + content validation | P0 | None |
| Topic Dependency Graph (data model) | P0 | Content model |
| Mastery Gate (SKILL 1) | P0 | Store setup |
| FSRS Spaced Repetition (SKILL 2) | P0 | Mastery Gate |
| Basic Question UI + answer feedback | P0 | Content model |
| Session scheduler (SKILL 3) | P1 | FSRS |
| Choice randomization (SKILL 6) | P1 | Question UI |
| XP + Streak system (SKILL 8) | P1 | Session scheduler |

**Success criteria**: User can complete a session; mastery advances; due reviews return.

### Phase 2: Learning Optimization

**Objective**: Retention via interleaving, remediation, diagnostics

| Feature | Priority | Dependencies |
|---|---|---|
| Interleaving + Non-Interference (SKILL 3) | P0 | Session scheduler |
| Targeted Remediation (SKILL 5) | P0 | Mastery tracking |
| Knowledge Graph / Skill Tree UI | P0 | Topic dependency graph |
| FIRe (SKILL 10) | P1 | Topic dependency graph |
| Diagnostic Placement (SKILL 7) | P1 | Topic content |
| Data Export/Import (SKILL 13) | P1 | Store |
| Progress Dashboard | P1 | Store |
| Opt-in study pipeline (minimal events; learning lab) | P1 | Consent UX + backend TBD |

**Success criteria**: Mixed sessions, prerequisite drills, bypass known material; **measurement path** for studies defined before scaling lab traffic.

### Phase 3: Scale & Polish

**Objective**: UX polish, content management, platform expansion

| Feature | Priority | Dependencies |
|---|---|---|
| Mobile responsive polish | P0 | Phase 1–2 |
| Offline PWA support | P1 | Service worker |
| Content creator tooling (authoring UI) | P1 | Content validation |
| Multiple subject tracks | P1 | Topic routing |
| Streak notifications (browser) | P2 | PWA |

**Success criteria**: Polished experience; content addable without code; habit formation. **Educator-specific** distribution features remain **out of scope** until revisited.

---

## Design North Star

> **Internal reference only — not a user-facing claim.**

Bloom's 2-sigma problem: the most effective known learning intervention (live 1:1 human tutoring) produces roughly two standard deviations of improvement over conventional instruction. No software product has reliably reproduced this at scale.

JadiMikir uses this as a **design target**, not marketing copy. Evaluate decisions against: *does this move outcomes closer to what a good tutor would do?*

---

## Future product choices (MCQ depth)

MCQ primarily tests **recognition** among options. Later modes may include **confidence rating** (per-item) or **typed recall** for subsets of items—acknowledged as a **design space**, not MVP commitment.

---

## Key Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Content creation bottleneck | High | Authoring in Phase 3; seed content per [Content Strategy](#content-strategy--fsrs-prerequisites) |
| User confusion about "no account" | Medium | Onboarding copy: local storage, export, clearing data |
| IndexedDB / browser storage limits or pressure | Medium | Hybrid storage layer; export; monitor size; compress where needed |
| **Browser / OS clearing site data** | **High** | Treat as **trust risk**: prominent export reminders, first-run and periodic backup nudges; clear Settings messaging |
| Mastery gates feel too hard | Medium | Helpful remediation; explain "why" |
| Knowledge graph clutter | Medium | Collapsible branches, zoom, focused "current path" |
| FSRS thin item pools | Medium | Content density targets per topic; transparent repetition when pool is small |

---

## Competitive Advantages to Protect

1. **FSRS + remediation + interleaving** as an integrated engine—not a generic quiz wrapper  
2. **Local-first + portability** for learners who want control without signing up  
3. **Learning science fidelity** (principles embedded in engines, not slogans)  
4. **Content validation** discipline  
5. **Learning lab capability** (opt-in studies, outcome-led experiments) as product maturity grows

---

## Next Steps

1. Validate target users on **efficiency and mastery** messaging (privacy as secondary proof)  
2. Finalize MVP scope vs Phase 2 **study pipeline** dependencies  
3. Content pipeline: subject choice, authoring path, minimum item counts per topic  
4. Baselines for success metrics and **study** data policies before broad experiments  
5. Build roadmap per phases above  

---

*Document Version: 2.0*  
*Updated: 2026-03-28*  
*Reference: [master-project-plan.md](master-project-plan.md), [CONTEXT.md](../CONTEXT.md), learning-science materials*
