# JadiMikir Project Plan

Master execution plan covering all phases from MVP through Scale & Polish.

---

## Project Overview

| Aspect | Detail |
|--------|--------|
| **Product** | Privacy-first adaptive MCQ learning platform |
| **Core Value** | 2 standard deviation improvement (tutor-level) via FSRS + mastery gates |
| **Target Users** | Self-driven learners (students, exam candidates, lifelong learners) |
| **Storage** | Local-first (localStorage → IndexedDB → PWA) |
| **Accounts** | Zero — fully local, no auth required |

---

## Phase 1: MVP Foundation

**Objective**: Deliver core learning loop with FSRS and mastery gates

### P0 - Must Have (2-3 weeks solo)

| # | Feature | SKILL | Dependencies | Status |
|---|---------|-------|--------------|--------|
| 1 | TanStack stack setup (Query/Router/Store) | - | None | ✅ Complete |
| 2 | Topic and Question data models | - | None | ✅ Complete |
| 3 | Content validation system | SKILL 11 | Data models | ✅ Complete |
| 4 | Mastery Gate system | SKILL 1 | Store setup | ✅ Complete |
| 5 | FSRS Spaced Repetition algorithm | SKILL 2 | Mastery Gate | ✅ Complete |
| 6 | Basic Question UI with answer feedback | - | Content model | ✅ Complete |
| 7 | Sample content (1 topic, 5 questions) | - | Data models | Seed for testing |

### P1 - Should Have (1-2 weeks)

| # | Feature | SKILL | Dependencies | Status |
|---|---------|-------|--------------|--------|
| 8 | Session scheduler | SKILL 3 | FSRS | |
| 9 | Choice randomization | SKILL 6 | Question UI | |
| 10 | XP + Streak system | SKILL 8 | Session scheduler | |
| 11 | Development logging | - | TanStack stack | pino/pino-pretty |

**Phase 1 Success Criteria**: User can complete a session with sample content, mastery advances based on performance, due reviews appear on return.

### Implementation Notes

- **Feedback Flow**: Simplified - no rating buttons. Correct = "good", Wrong = "hard". Auto-advance after 1.5s.
- **Content**: 5 questions for rapid prototyping (expandable)

---

## Phase 2: Learning Optimization

**Objective**: Maximize retention through interleaving, remediation, and diagnostics

### P0 - Must Have

| # | Feature | SKILL | Dependencies | Status |
|---|---------|-------|--------------|--------|
| 12 | Interleaving + Non-Interference | SKILL 3 | Session scheduler | |
| 13 | Targeted Remediation | SKILL 5 | Mastery tracking | |
| 14 | Diagnostic Placement | SKILL 7 | Topic content | |
| 15 | Data Export/Import | SKILL 13 | Store | |
| 16 | Progress Dashboard | - | Store | |

### P1 - Should Have

| # | Feature | SKILL | Dependencies | Status |
|---|---------|-------|--------------|--------|
| 17 | FIRe (Forward Interleaved Retrieval) | SKILL 10 | Topic dependency graph | |
| 18 | IndexedDB migration | - | localStorage | For >5MB state |
| 19 | Analytics (opt-in telemetry) | - | - | Local-only metrics |

**Phase 2 Success Criteria**: Sessions mix topics intelligently, failures trigger prerequisite drills, new users bypass known content.

---

## Phase 3: Scale & Polish

**Objective**: Improve UX, add content management, expand platform

### P0 - Must Have

| # | Feature | SKILL | Dependencies | Status |
|---|---------|-------|--------------|--------|
| 20 | Mobile responsive polish | - | Phase 1-2 | |
| 21 | Content creator tooling (admin UI) | SKILL 11 | Content validation | JSON editor + live validation |
| 22 | Multiple subject tracks | - | Topic routing | |

### P1 - Should Have

| # | Feature | SKILL | Dependencies | Status |
|---|---------|-------|--------------|--------|
| 23 | PWA offline support | - | Service worker | |
| 24 | Streak notifications | - | PWA | Browser notifications |
| 25 | Content sharing for educators | - | Export/Import | Shareable content packs |

**Phase 3 Success Criteria**: Product feels polished, content can be added without code, users return habitually.

---

## SKILL Implementation Order

| SKILL | Feature | Phase | Priority |
|-------|---------|-------|----------|
| SKILL 1 | Mastery Gate | 1 | P0 |
| SKILL 2 | FSRS | 1 | P0 |
| SKILL 3 | Session Scheduler + Interleaving | 1-2 | P0 |
| SKILL 5 | Targeted Remediation | 2 | P0 |
| SKILL 6 | Choice Randomization | 1 | P1 |
| SKILL 7 | Diagnostic Placement | 2 | P0 |
| SKILL 8 | XP + Streak | 1 | P1 |
| SKILL 10 | FIRe | 2 | P1 |
| SKILL 11 | Content Validation | 1 | P0 |
| SKILL 13 | Export/Import | 2 | P0 |

---

## Technical Dependencies Map

```
                    ┌─────────────┐
                    │   SKILL 2   │
                    │    FSRS     │
                    └──────┬──────┘
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
  ┌──────────┐       ┌──────────┐       ┌──────────┐
  │ SKILL 3  │       │ SKILL 1  │       │ SKILL 8  │
  │Scheduler│       │Mastery   │       │XP/Streak│
  └────┬─────┘       └────┬─────┘       └────┬─────┘
       │                  │                  │
       ▼                  │                  │
  ┌──────────┐           │                  │
  │ SKILL 5  │           │                  │
  │Remediation           │                  │
  └────┬─────┘           │                  │
       │                 │                  │
       ▼                 ▼                  ▼
  ┌──────────────────────────────────────────┐
  │              TanStack Store               │
  │         (localStorage/IndexedDB)          │
  └──────────────────────────────────────────┘
```

---

## Effort Summary

| Phase | Duration | Focus |
|-------|----------|-------|
| Phase 1 | 3-4 weeks | Core loop |
| Phase 2 | 3-4 weeks | Learning optimization |
| Phase 3 | 2-3 weeks | Polish + scale |
| **Total** | **8-11 weeks** | Full MVP to launch |

---

## Risk Register

| Risk | Phase | Mitigation |
|------|-------|-------------|
| Content creation bottleneck | All | Seed 5 questions in MVP; expand to 20+ in Phase 2; build admin UI in Phase 3 |
| localStorage limits (5-10MB) | 1-2 | Plan IndexedDB migration early |
| Browser clearing state | All | Emphasize export feature from day 1 |
| Mastery gates feel too hard | 1 | Ensure remediation is helpful, not punitive |
| FSRS tuning complexity | 1 | Budget extra time for parameter tuning |

---

## Success Metrics

| Metric | Target | Phase Measured |
|--------|--------|----------------|
| Session Length | ≥10 min | Phase 1+ |
| Questions/Session | ≥20 | Phase 1+ |
| Return Rate (7-day) | ≥60% | Phase 1+ |
| Mastery Rate | ≥70% | Phase 2 |
| Retention (30-day) | ≥80% | Phase 2 |
| Export Usage | ≥10% | Phase 2 |
| Diagnostic Completion | ≥80% | Phase 2 |

---

## Storage Roadmap

| Phase | Storage | Capacity | Trigger |
|-------|---------|----------|---------|
| 1 | localStorage | ~5MB | Default for MVP |
| 2 | IndexedDB | ~50MB+ | Automatic migration when state exceeds threshold |
| 3 | PWA + IndexedDB | Unlimited | Service worker for offline |

---

## Out of Scope (v1.0)

- User accounts / cloud sync
- Social features / leaderboards
- Video content / rich media
- AI-generated content
- Team/teacher dashboards

---

## Next Steps

1. Initialize project with TanStack stack (React 19 + Vite + TS)
2. Implement data models and content validation (SKILL 11)
3. Build core learning loop: Mastery Gate → FSRS → Question UI
4. Add sample content and test session flow
5. Iterate based on user testing

---

*Last Updated: 2026-03-14*