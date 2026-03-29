Good question. Let me be direct about this.

---

## Product Management Principles Being Violated

### 1. **No validated persona split** — *"Know Your Customer" violated*

The most fundamental PM step: you haven't decided who you're building for. The strategy says "self-directed learners" but then tries to serve both **high-agency Anki-type users** and **casual learners overwhelmed by complexity** simultaneously.

In PM terms: no **Jobs-to-be-Done** analysis was done on the tension between these two groups. They have different hiring criteria for a learning tool, different drop-off moments, and different definitions of "working." Slapping progressive disclosure on top doesn't resolve this — it defers the decision.

**Skipped step**: Persona validation interviews. Even 5 conversations with real Indonesian exam candidates would likely surface which type dominates your actual user base.

---

### 2. **Solution before problem definition** — *"Problem-first thinking" violated*

The brainstorming doc jumps straight to "educational tooltips solve this" without ever clearly stating the problem in user terms. What specific moment causes a user to quit? Is it:
- Seeing a locked topic with no explanation?
- Not understanding why a card keeps coming back?
- Not knowing what to study next?

Each of these is a different problem requiring a different solution. Tooltips might address the second. They don't address the first or third.

**Skipped step**: **Problem statement framing** — "User X, in situation Y, cannot achieve Z because..." written before any solution is considered.

---

### 3. **Content risk has no owner and no mitigation timeline** — *Risk management violated*

The product strategy correctly flags content bottleneck as **High impact**. But then:
- Phase 1: no content plan
- Phase 2: no content plan
- Phase 3: "authoring tooling" ships

This is a classic PM failure — a known critical dependency is acknowledged in a risk table and then not reflected in the actual roadmap. The risk table and the roadmap are **not talking to each other**.

**Skipped step**: **Dependency mapping with dates**. Content isn't a feature — it's a prerequisite for validating the entire core engine. FSRS with 8 questions per topic doesn't prove anything. This needed a parallel workstream, not a Phase 3 footnote.

---

### 4. **No definition of a falsifiable MVP** — *Lean startup / build-measure-learn violated*

Phase 1 success criteria is: *"User can complete a session; mastery advances; due reviews return."*

That's a **functional completeness check**, not a learning goal. It tells you the software works. It doesn't tell you:
- Whether users *understand* what mastery means
- Whether they *come back* because of FSRS or despite it
- Whether the core value proposition — efficiency over generic quizzing — is perceived

**Skipped step**: **Falsifiable hypotheses per phase.** Each phase should have an assumption being tested with a clear pass/fail. Right now the phases are delivery milestones, not learning milestones.

---

### 5. **UGC decision-deferred without acknowledging the trust architecture gap** — *"Complete the mental model" violated*

UGC in a local-first, no-account product requires a completely different trust and distribution model than UGC in a cloud-synced product. The doc phases it to Phase 3 without ever resolving this architectural conflict.

In PM terms, this is **false optionality** — writing "we'll add UGC later" when the foundational architecture may need to be different *now* to support it later. If you decide in Phase 3 that UGC needs a backend, you're retrofitting privacy architecture. That's expensive.

**Skipped step**: **Architectural pre-mortem on UGC.** A one-page write-up of "if we want UGC in 18 months, what decisions made today constrain us?" This is standard for platform-level features.

---

### 6. **No competitive usage testing** — *"Steal with pride" and competitive analysis violated*

The differentiation matrix lists competitors but there's no evidence anyone on the team has deeply used Anki, Quizlet, or Khan Academy from the perspective of a target user recently. The "Anki is too complex" problem is asserted, not observed.

**Skipped step**: **Teardown sessions.** Sit with 3 target users and watch them use Anki for 20 minutes. You'll learn more about the actual complexity barriers than any amount of internal brainstorming.

---

### 7. **The learning lab is unsequenced** — *"Instrumentation before scaling" violated*

A core PM principle: you need measurement infrastructure before you scale traffic, not after. The opt-in study pipeline is Phase 2 P1. But the success metrics — mastery rate, 30-day retention — cannot be measured without it.

This means Phase 1 ships with **no feedback loop**. You won't know if FSRS is actually working for users. You're flying blind through the most critical validation period.

**Skipped step**: **Instrument minimally from day one.** Even local-only telemetry (on-device aggregates, never uploaded) would let you reason about whether mastery rates are moving in the right direction before the opt-in pipeline is ready.

---

## The Meta-Problem

Most of these violations share a root cause: **the strategy was written to align stakeholders, not to reduce uncertainty.**

A good product strategy document should make the team *less confident* — it should expose the riskiest assumptions and force prioritization of learning. This one does the opposite: it resolves tensions through synthesis ("tooltips + phasing"), presents a coherent roadmap, and leaves the hard questions as future work.

That's a common PM anti-pattern, especially in founder-led products where the founder has strong conviction. The document reads like it was written to confirm a direction, not to pressure-test it.
