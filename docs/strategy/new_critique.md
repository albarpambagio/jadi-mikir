> **Note (2026-03-28):** External feedback preserved below. For the current strategy, see [product-strategy.md](product-strategy.md) v2.0; some items here are superseded or partially addressed there.

from: claude
I've read through the JadiMikir strategy doc. Here's my honest assessment — strengths and the harder criticisms.

## What's Strong

**The core thesis is coherent.** Privacy-first + FSRS + adaptive remediation is a genuinely differentiated combo. You're not just slapping a privacy label on a quiz app — the local-first architecture actually *enables* the zero-friction onboarding, which reinforces the value prop structurally.

**Learning science integration is serious.** Citing FSRS, interleaving, automaticity signals, mastery gates — these aren't buzzwords here, they map to actual features. Most EdTech products gesture at "adaptive learning" and mean "we show you your score."

**The roadmap is honest.** Deferring the educator persona, flagging that baselines are TBD, noting the 2-sigma claim shouldn't appear in marketing copy — this shows self-awareness that's rare in product docs.

---

## The Real Criticisms

### 1. The privacy moat is fragile
Privacy is currently your #1 differentiator, but it's also the easiest thing to copy. Anki is already local-first. If Quizlet adds a "no account" mode tomorrow, your positioning weakens significantly. The *sustainable* moat is the learning science quality — but the strategy underweights it in positioning and overweights privacy. Privacy should be framed as **enabling trust**, not as the core differentiator.

### 2. Content is the actual product, and it's underaddressed
The strategy says "the question engine is the product" — but a brilliant engine with thin content is useless. You have one paragraph on content quality and a Phase 3 note about authoring tools. This is likely your biggest practical risk, bigger than any technical feature. What subjects? Who writes the questions? What's the quality bar? How many questions are needed before FSRS has enough signal to be useful? This deserves its own strategy section.

### 3. FSRS without sufficient item volume won't work as advertised
FSRS needs a reasonably large item pool per topic to do meaningful spaced repetition. If a topic has 20 questions, users will see repeats quickly and the "scheduling" becomes obvious to the learner. The strategy doesn't address minimum viable content density per topic, which matters a lot for whether the core learning science claims hold up.

### 4. The success metrics are measuring activity, not learning
"Questions per session ≥ 20" and "session length ≥ 10 min" are engagement metrics. The learning outcome metrics (mastery rate, retention at 30 days) are better — but they're listed second and the methodology is vague. How will you measure retention at 30 days in a local-only, no-account product? There's no user identity to track cohorts against. This is a real measurement architecture problem, not just a "refine post-launch" issue.

### 5. "Privacy-conscious educator" deferral may be premature
You defer the educator persona to Phase 3, but educators are actually your most efficient distribution channel for the primary persona (students). A teacher recommending JadiMikir to 30 students is 30 users you didn't have to acquire individually. Deferring the feature work is reasonable — but deferring the *relationship* with educators entirely until Phase 3 means you're leaving viral loops on the table early.

### 6. The knowledge graph feature is scoped like a UI widget, not a learning intervention
The skill tree section describes a visualization — nodes, colors, zoom controls. But it doesn't address the harder question: **what does the graph actually teach the learner about how to study?** If students just look at it and feel good, it's decoration. The strategy should specify what behavior the graph is meant to drive (e.g., "user chooses remediation path instead of skipping prerequisite") and how success is measured.

### 7. localStorage risk is underplayed
You list it as a medium-risk item but the mitigation is weak ("plan for IndexedDB migration"). For a product whose entire value prop is "your data is safe and yours," a browser clearing state and destroying months of learning history is a **trust-destroying event**. The export feature helps, but most users won't export proactively. This needs a more aggressive mitigation — either prominent, repeated nudges to export, or a more robust local persistence story before launch, not Phase 2.

---

## The Underlying Tension

The doc positions JadiMikir as serving *individual self-directed learners* with a local-first, no-account product — but the success metrics assume you can measure cohort retention, mastery rates, and engagement patterns. These two things are in tension. You'll either need to accept you'll be operating somewhat blind on outcomes, or introduce some form of opt-in telemetry earlier than planned. The strategy should make a deliberate choice here rather than leaving it unresolved.

---

Overall this is a well-thought-out document for an early-stage product. The criticisms above are mostly about gaps worth addressing *now* rather than flaws in the core concept.

from: gemini
Your product strategy for JadiMikir is robust and exceptionally well-aligned with modern learning science and privacy trends. In a 2026 landscape where data sovereignty is a top-tier user concern, a local-only, "zero-account" adaptive platform is highly differentiated.Below is an evaluation of your strategy, highlighting its strengths and critical risks you should address.Strengths & Strategic Alignment1. Algorithm & Retention (FSRS)The Advantage: Using FSRS (Free Spaced Repetition Scheduler) over older models like SM-2 is a major win. It is more accurate at predicting the "forgetting curve" and reduces the review load by roughly 20% while maintaining the same retention level.Scientific Fidelity: Your focus on retrievability, stability, and difficulty (the DSR model) allows the app to simulate future workloads, helping users manage their study time more effectively than simple "flashcard" apps.2. Learning Science SynergyInterleaving (SKILL 3): Research confirms that interleaving—switching between related topics—can lead to median performance improvements of 50% to 125% over "blocked" practice.Targeted Remediation (SKILL 5): This mirrors the behavior of a high-quality tutor by identifying prerequisite gaps. Research shows that personalized assessment of "readiness" before moving to harder content is critical for effective inclusion and long-term mastery.3. Privacy & Zero-Friction OnboardingInstant Start: By eliminating the account requirement, you bypass the "onboarding wall" that kills most apps.Data Sovereignty: Local-only storage directly addresses the growing 2026 concern regarding "incessant gathering of delicate learner information" by centralized cloud platforms.Critical Criticisms & Risks1. Technical Vulnerability of "Local-Only"Data Fragility: localStorage and IndexedDB are susceptible to being cleared by the browser during "storage pressure" or when a user clears their cache.Criticism: Without an automated cloud backup, one "Clear History" click could destroy months of a student's progress. Your "Export/Import" feature (P1) must be promoted as a core daily habit, not just a utility.Performance Bottlenecks: localStorage is synchronous and can slow down the UI if the question bank or history grows large.Recommendation: Move to IndexedDB immediately for Phase 1 to ensure the app stays snappy as the user's history grows.2. The "MCQ Illusion" vs. Active RecallRecognition vs. Recall: Multiple-choice questions (MCQs) are often criticized by "serious learners" for testing recognition rather than active recall.Criticism: Even with "plausible distractors," a student can often guess the right answer without truly knowing the material.Recommendation: Consider adding a "Confidence Rating" (similar to Brainscape) or a text-input mode for some questions to ensure they aren't just gaming the choices.3. Knowledge Graph ComplexityUX Overload: Visualizing a complex "Skill Tree" can become cluttered and demotivating if not managed carefully.Recommendation: Implement "Focused Paths" or "Collapsible Branches" to prevent the graph from looking like an overwhelming "spiderweb" of unearned nodes.Market Positioning & MetricsElementFeedbackSecondary PersonaYou’ve deferred the "Educator." While wise for an MVP, note that 2026 trends show teachers are the #1 driver for student adoption of "no-data-collection" tools.Success MetricsYour Retention after 30 days target (80%) is excellent. However, add a "Friction Metric": how many users actually use the Export/Import feature? This is your biggest churn risk.DifferentiationYou are competing with Anki (precision) and Duolingo (engagement). Your unique wedge is "Precision + Engagement + Privacy."