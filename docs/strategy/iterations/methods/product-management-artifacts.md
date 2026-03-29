## Product Management Artifacts

These fall into five natural domains across a product's lifecycle.

### 1. Discovery & Research

These exist to reduce assumption risk before you build.

**User Research**
- User interview notes and synthesis
- Jobs-to-be-Done (JTBD) maps
- Persona documents (with behavioral, not just demographic, detail)
- Empathy maps
- Customer journey maps

**Market & Competitive**
- Competitive analysis matrix
- Market sizing (TAM/SAM/SOM)
- Positioning map
- Competitive teardown notes

**Assumption & Risk**
- Assumption log (with confidence and impact ratings)
- Pre-mortem document
- Risk register

---

### 2. Strategy & Direction

These exist to align the team around what you're building and why.

- Product vision statement
- Product strategy document
- North star metric definition
- OKRs (Objectives and Key Results)
- Value proposition canvas
- Business model canvas (or a lightweight version)
- Positioning statement
- Scope exclusion list ("what we are not building")

---

### 3. Planning & Roadmap

These exist to sequence work and communicate priorities.

- Product roadmap (outcome-based, not feature-list)
- Opportunity backlog
- Problem statements (per feature or initiative)
- Dependency map
- Release plan
- Capacity and resourcing plan
- MoSCoW prioritization sheet (Must / Should / Could / Won't)
- RICE scoring sheet (Reach, Impact, Confidence, Effort)

---

### 4. Execution & Delivery

These exist to translate strategy into buildable work.

**Requirements**
- Product Requirements Document (PRD) or one-pager
- User stories ("As a [user], I want [action] so that [outcome]")
- Acceptance criteria
- Edge case and error state documentation
- Functional specification

**Design & Validation**
- Wireframes and mockups
- Prototype (low or high fidelity)
- Usability test plan and findings
- Design system or component library reference

**Engineering Handoff**
- Technical specification (written with engineering)
- API contract or data model notes
- Definition of Done (DoD)

---

### 5. Measurement & Learning

These exist to close the feedback loop between shipping and deciding.

**Metrics**
- Success metrics per initiative (with baselines and targets)
- Experiment design document (hypothesis, arms, success criteria)
- A/B test results log
- Analytics instrumentation plan

**Retrospective & Review**
- Sprint retrospective notes
- Post-launch review / post-mortem
- Feature impact report ("did it move the metric?")
- Lessons learned log

---

### How They Relate

```
Discovery → Strategy → Planning → Execution → Measurement
    ↑                                               |
    └───────────── feedback loop ───────────────────┘
```

Each phase produces artifacts that feed the next. The most common failure mode — which applies to JadiMikir too — is that teams go heavy on Execution artifacts (PRDs, user stories, specs) and light on Discovery and Measurement artifacts. The work looks productive but is building on unconfirmed assumptions with no feedback loop.

---

### Minimum Viable Set for an Early-Stage Product

If you're pre-launch and resource-constrained, the artifacts that give you the most signal per hour spent are:

1. **Problem statement** — per initiative, before any spec
2. **Assumption log** — what must be true for this to work
3. **User interview synthesis** — 5–8 interviews, themes extracted
4. **North star metric definition** — one metric, with rationale
5. **Outcome-based roadmap** — phases defined by what you'll learn, not what you'll ship
6. **Experiment design doc** — even for Phase 1, state what would falsify your hypothesis
7. **Post-launch review** — a standing habit after every release

Everything else is useful. These seven are load-bearing.
