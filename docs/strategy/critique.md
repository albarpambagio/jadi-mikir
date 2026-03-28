# JadiMikir — Critical Evaluation

> Written: 2026-03-21

---

## 1. The Big Idea

### What's strong

- The core thesis is grounded in real learning science. FSRS is the best open-source spaced repetition algorithm available. Bloom's 2-sigma problem (the original research behind the "2 standard deviation" claim) is legitimate, and the combination of FSRS + remediation + interleaving is a defensible path toward it.
- Privacy-first, local-only is a genuinely differentiated position in edtech. Most competitors (Quizlet, Anki web, Khan Academy) have cloud-mandatory models.
- MCQ as the primary format is smart for a v1 — it's tractable, validatable, and maps cleanly to standardized testing use cases.

### What's risky or weak

**The 2-sigma claim is a credibility trap.**
Bloom's 2-sigma was about live 1:1 human tutoring. Achieving it with software has never been reproducibly demonstrated at scale. Putting it front-and-center in the strategy invites scrutiny the product cannot yet back up. It's better as an internal design north-star than a user-facing promise.

**Privacy as a core differentiator is an uphill sell.**
Privacy is a hygiene factor for a niche segment (privacy advocates, security-conscious users), not a primary motivator for most learners. The majority of the target user (students, exam candidates) will trade privacy for convenience — cross-device sync, sharing, leaderboards — without hesitation. This means:

- The "no accounts" constraint actively blocks network effects (sharing decks, educator distribution, leaderboards).
- The local-only model makes onboarding harder — there's no web link to share, no "just open this URL."
- PWA in Phase 3 mitigates this somewhat, but installation friction is real.

**Content is the actual product, and 14 questions is not a product.**
The strategy acknowledges the content bottleneck but underweights it. At 14 questions / 5 topics, there is nothing to demonstrate the learning loop end-to-end with a real user. All the engines in the world don't matter if the content isn't there. This should be treated as the single most critical unresolved risk, not a Phase 3 concern.

**The knowledge graph / skill tree pillar is scope risk.**
It's the most visually impressive feature and also the hardest to get right — it requires a well-structured ontology of topics, prerequisite relationships, and enough content to populate it meaningfully. Building a graph on 5 topics will look empty and toy-like. If the content problem isn't solved first, the skill tree will feel fake.

---

## 2. Tech Stack

### What's strong

- **React 19 + Vite 6 + TypeScript** — Correct choices. Fast DX, production-ready.
- **Tailwind CSS v4 via Vite plugin** — Idiomatic v4 setup, correct.
- **ts-fsrs** — The right library. Mature, well-tested, actively maintained.
- **IndexedDB via hybrid storage** — Correct move away from localStorage. The 5–10MB localStorage ceiling is real.
- **shadcn/ui + Radix primitives** — Strong choice for accessibility and composability.
- **Zod + React Hook Form** — Industry-standard pairing.
- **Vitest + Playwright** — Good testing foundation.

### What's problematic

**`strict: false` in tsconfig is a red flag.**

```json
"strict": false,
"strictNullChecks": true
```

`strictNullChecks` alone without full strict mode means `noImplicitAny`, `strictFunctionTypes`, and `strictPropertyInitialization` are all off. For a codebase with complex state (FSRS cards, mastery gates, session state), implicit `any` is a silent bug factory. This should be `"strict": true` from the start — retrofitting strict mode later is painful.

**TanStack Query without a server is dead weight.**
TanStack Query is designed for async server-state management (caching, deduplication, background refetching). In a fully local, synchronous app it adds bundle size and cognitive overhead with near-zero benefit. The right tools are TanStack Store (already in the stack) for reactive client state and plain async functions for IndexedDB reads. If you never hit a network endpoint, TanStack Query should be removed.

**`wouter` as a "stand-in" for TanStack Router is actual technical debt, not a placeholder.**
The APIs are fundamentally different — wouter is pattern-matching strings; TanStack Router is fully typed, file-based, with loaders. Migration isn't a find-and-replace; it's a rewrite of every route definition and navigation call. The longer this stays, the more expensive the migration. Either commit to TanStack Router now, or remove it from the spec and commit to wouter.

**`@base-ui/react` + Radix UI is redundant.**
Both packages are in `package.json`. Base UI is MUI Lab's headless primitives — a Radix competitor. Radix is already the foundation of shadcn/ui. Having both is dead bundle weight. Pick one; in this stack it should be Radix (shadcn compatibility).

**`framer-motion` is a large dependency (~100KB gzipped) for unclear ROI.**
If it's only used for simple transitions, `tailwindcss-animate` (already available via shadcn) or CSS transitions cover the use cases at zero cost. Motion should justify its weight with specific interaction designs — right now it's speculative.

**Name inconsistency is a real problem.**

| Location | Name |
|---|---|
| Repo folder | `JadiMahir` |
| `package.json` | `jadimikir` |
| Strategy docs | `JadiMikir` |

This suggests the name changed mid-development and was never reconciled. It causes confusion in tooling, documentation, and branding. Resolve it before writing more code.

---

## 3. Execution Approach

### Inverted build order

All 11 business logic engines are complete. Zero screens exist. This is backend-first thinking in a frontend product. The risk: there is no feedback loop. You don't know if the FSRS implementation *feels* right, if the mastery gate UX is appropriate, or if the session flow is motivating — because no user has ever seen it. The engines may need to be restructured once the UI reveals real interaction constraints.

**Recommended correction:** Build the minimum viable session loop (question → answer → feedback → next question) as the first screen, even if the underlying engine is simplified. Get it in front of a real user within days, not months.

### Documentation staleness is a systemic risk

`CONTEXT.md` says "full clean slate, everything deleted" but the engines, store, hooks, and UI primitives are all present and marked complete in `TODO.md`. If the agent context files are wrong, AI-assisted development (which this project clearly relies on) will make incorrect assumptions and generate conflicting code. `CONTEXT.md` needs to be the single source of truth for current state and kept in sync after every session.

### The 18-wireframe library is valuable but underused

`docs/wireframes/` has 18 detailed screen wireframes. The current TODO lists only 3 screens to build next. The wireframes should be the direct input to the UI build queue — each wireframe should map 1:1 to a build task.

---

## Summary

| Area | Verdict | Severity |
|---|---|---|
| 2-sigma marketing claim | Over-promise; reframe as internal design goal | Medium |
| Privacy-first as differentiator | Niche value prop; limits growth surface | Medium |
| Content bottleneck | Existential for v1 | High |
| `strict: false` in tsconfig | Silent bug risk in complex state | High |
| TanStack Query in local-only app | Dead weight; remove | Medium |
| wouter vs TanStack Router debt | Growing migration cost; decide now | Medium |
| `@base-ui/react` redundancy | Bundle bloat; remove | Low |
| `framer-motion` scope | Unjustified until specific interactions are designed | Low |
| Name inconsistency | Branding and tooling confusion | Medium |
| Backend-first execution order | No user feedback loop; invert the build order | High |
| Stale `CONTEXT.md` | AI context poisoning; fix immediately | High |

---

## Strategy doc status (2026-03-28)

Several themes above are **revisited in [product-strategy.md](product-strategy.md) v2.0**: product-led positioning (vs privacy-first headline), content/FSRS density, measurement architecture with **opt-in study** uploads, **learning lab** mandate, IndexedDB-aligned storage risks, educator scope deferred, and knowledge-graph **behavioral** intent. Items such as **content volume** and **2-sigma as internal-only** remain living risks—see the current strategy and [CONTEXT.md](../CONTEXT.md).
