# JadiMahir Product Strategy

## Executive Summary

**JadiMahir** is a privacy-first, local-only MCQ learning platform that brings tutor-level personalization to self-study through adaptive spaced repetition, targeted remediation, and interleaved practice—all without requiring user accounts or data transmission.

The platform targets self-directed learners who want efficient, scientifically-grounded study tools without compromising privacy. Its core value: **2 standard deviation improvement potential** (matching one-on-one tutoring) through an intelligent question engine that adapts to individual performance.

---

## Target Users

### Primary Persona: The Self-Driven Learner

- **Demographics**: Students (high school to professional certification), lifelong learners, exam candidates
- **Behaviors**: Considers study efficiency important, uncomfortable sharing data with third parties, prefers mobile-first access, values visible progress tracking
- **Pain Points**: 
  - Generic quiz apps don't adapt to actual understanding
  - Flashcard apps lack intelligent scheduling
  - Privacy concerns with cloud-based learning tools
  - Block-based study feels unproductive

### Secondary Persona: The Privacy-Conscious Educator

- **Demographics**: Teachers, tutors, corporate trainers
- **Behaviors**: Recommends study tools to students, values evidence-based methods
- **Pain Points**: 
  - Can't recommend tools that harvest student data
  - Lack of control over content quality in consumer apps

---

## Value Proposition

| For | Karena | Bukti |
|---|---|---|
| Learners | Achieve tutor-level retention efficiency | FSRS algorithm + 10 learning principles |
| Learners | Own their data completely | Zero account, local-only storage |
| Learners | See real progress, not just scores | Mastery gates + XP + streak systems |
| Educators | Recommend with confidence | No data collection, evidence-based |

---

## Market Positioning

### Category
**Privacy-First Adaptive Learning Platform**

### Differentiation Matrix

| Competitor | JadiMahir Advantage |
|---|---|
| Quizlet/Anki | Privacy-first (no account), intelligent scheduling (FSRS), targeted remediation |
| Khan Academy | Fully local, mastery gates, interleaving |
| Duolingo | More rigorous learning science (mastery > gamification), unlimited practice |
| Traditional LMS | Lightweight, personal, no institutional overhead |

### Positioning Statement
> "Untuk learner yang menghargai privasi dan ingin hasil setara tutor privat, JadiMahir adalah platform belajar MCQ yang mengadaptasi metode belajar berdasarkan performa individual—tanpa perlu membuat akun atau menyimpan data di server."

---

## Product Pillars

### 1. Adaptivity (Core Engine)
The question engine is the product. Every answer updates the learner's model:
- **FSRS** for optimal spaced repetition scheduling
- **Targeted remediation** on prerequisite gaps
- **Interleaving + non-interference** for retention
- **Response time tracking** for automaticity signals

### 2. Privacy-First Architecture
- Zero account requirement
- All data on-device (localStorage/IndexedDB)
- Full data portability (export/import)
- No tracking, no analytics

### 3. Visible Mastery
- Clear mastery gates (not "good enough")
- Progress metrics that reflect real learning (XP, streak, mastery scores)
- Diagnostic placement to skip what you know

### 4. Content Quality
- Rigorous content validation (SKILL 11)
- Deliberately plausible distractors
- Distractor-specific explanations

---

## Success Metrics

### Engagement Metrics
| Metric | Target | Rationale |
|---|---|---|
| Daily Active Users (DAU) | TBD (early stage) | Baseline engagement |
| Session Length | ≥10 minutes/session | Indicates productive practice |
| Questions per Session | ≥20 questions | Active retrieval volume |
| Return Rate | ≥60% within 7 days | Habit formation |

### Learning Outcome Metrics
| Metric | Target | Rationale |
|---|---|---|
| Mastery Rate | ≥70% of started topics mastered | Core value delivery |
| Retention after 30 days | ≥80% of mastered topics still due/not lapsed | Spaced repetition working |
| Time to Mastery | ≤3x content size (e.g., 300 questions for 100-topic course) | Efficiency benchmark |

### Product Health Metrics
| Metric | Target | Rationale |
|---|---|---|
| Export Usage | ≥10% of users export at least once | Data ownership awareness |
| Remediation Completion | ≥50% of triggered remediations completed | Remediation working as intended |
| Diagnostic Completion | ≥80% of new users complete diagnostic | Onboarding effectiveness |

---

## Roadmap Framework

### Phase 1: Foundation (MVP)
**Objective**: Deliver core learning loop with FSRS and mastery gates

| Feature | Priority | Dependencies |
|---|---|---|
| TanStack stack setup (Query/Router/Store) | P0 | None |
| Topic/Question data model + content validation | P0 | None |
| Mastery Gate (SKILL 1) | P0 | Store setup |
| FSRS Spaced Repetition (SKILL 2) | P0 | Mastery Gate |
| Basic Question UI + answer feedback | P0 | Content model |
| Session scheduler (SKILL 3) | P1 | FSRS |
| Choice randomization (SKILL 6) | P1 | Question UI |
| XP + Streak system (SKILL 8) | P1 | Session scheduler |

**Success Criteria**: User can complete a session, mastery advances based on performance, due reviews appear on return

### Phase 2: Learning Optimization
**Objective**: Maximize retention through interleaving, remediation, and diagnostics

| Feature | Priority | Dependencies |
|---|---|---|
| Interleaving + Non-Interference (SKILL 3) | P0 | Session scheduler |
| Targeted Remediation (SKILL 5) | P0 | Mastery tracking |
| FIRe (SKILL 10) | P1 | Topic dependency graph |
| Diagnostic Placement (SKILL 7) | P1 | Topic content |
| Data Export/Import (SKILL 13) | P1 | Store |
| Progress Dashboard | P1 | Store |

**Success Criteria**: Sessions mix topics intelligently, failures trigger prerequisite drills, new users bypass known content

### Phase 3: Scale & Polish
**Objective**: Improve UX, add content management, expand platform

| Feature | Priority | Dependencies |
|---|---|---|
| Mobile responsive polish | P0 | Phase 1-2 |
| Offline PWA support | P1 | Service worker |
| Content creator tooling (authoring UI) | P1 | Content validation |
| Multiple subject tracks | P1 | Topic routing |
| Streak notifications (browser) | P2 | PWA |

**Success Criteria**: Product feels polished, content can be added without code, users return habitually

---

## Key Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Content creation bottleneck | High | Build authoring tool in Phase 3; consider community contributions |
| User confusion about "no account" | Medium | Clear onboarding messaging about local-only storage |
| localStorage limits (5-10MB) | Medium | Plan for IndexedDB migration; compress state |
| Browser clearing state | Medium | Emphasize export feature; consider optional sync (future) |
| Mastery gates feel too hard | Medium | Ensure remediation is helpful, not punitive; communicate "why" |

---

## Competitive Advantages to Protect

1. **FSRS + Remediation combo**: Unique vs. simple flashcard apps
2. **Local-first + Data portability**: Unique vs. all major competitors
3. **Learning science fidelity**: 10 principles integrated, not bolted on
4. **Content validation**: Ensures quality, differentiates from user-generated content platforms

---

## Next Steps

1. **Validate target users** — Interview 5-10 potential users about privacy concerns and study habits
2. **Define MVP scope** — Finalize Phase 1 features with technical feasibility review
3. **Create content pipeline** — Identify subject matter and authoring workflow
4. **Set up analytics** — Even local-first can have opt-in anonymous telemetry for product decisions
5. **Plan measurement** — Define baselines for success metrics before launch

---

*Document Version: 1.0*  
*Created: Product Strategy Review*  
*Reference: PRD.md, learning-science.md*
