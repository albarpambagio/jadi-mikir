# skills.md
## Implementation rules for the MCQ platform
## Stack: TanStack (Query + Router + Store) · localStorage/IndexedDB · Static JSON content
## Local-first: no server, no auth, no account required

---

## Stack Integration Map

| Concern | TanStack Tool | What it does here |
|---|---|---|
| Learner state (mastery, SRS) | **TanStack Store** | Single reactive store; persisted to localStorage |
| Content loading (topics, questions) | **TanStack Query** | Fetches/caches static JSON; never re-fetches unnecessarily |
| Page/view routing | **TanStack Router** | Type-safe routes; diagnostic → session → dashboard |
| Session scratch state | **TanStack Store** (ephemeral slice) | Current question, recent history — NOT persisted |
| Data export/import | Plain functions | Read store → serialize → download / upload → rehydrate |

---

## Storage Model

**Content** (topics, questions, dependency graph) → static JSON files, loaded via TanStack Query, cached in memory. Never written to localStorage.

**Learner state** → TanStack Store, persisted to localStorage as one snapshot:

```
localStorage["mcq_learner_state"] = {
  exportedAt: ISO string,
  version: "2",
  xp: number,
  streak: { days: number, lastActiveDate: ISO string },
  remediationQueue: [ { topicId, questionsRemaining, followUpTopicId } ],
  topics: {
    [topicId]: {
      status,              // 'locked' | 'available' | 'in_progress' | 'mastered' | 'needs_review'
      masteryScore,        // rolling accuracy over last 5 attempts [0–1]
      consecutiveCorrect,
      totalAttempts,
      recentAttempts,      // boolean[], last 5
      // FSRS fields (replaces SM-2: easeFactor, intervalDays, nextReviewDate, confidenceScore)
      due,                 // ISO string, next review date
      stability,           // memory stability in days
      difficulty,          // intrinsic difficulty (0-10)
      reps,                // total review count
      lapses,              // times forgotten
      state,               // 'new' | 'learning' | 'review' | 'relearning'
    }
  }
}
```

One key, one JSON blob. Easy to export, easy to import, easy to inspect.

**Session scratch** → ephemeral TanStack Store slice, never written to localStorage:

```
sessionSlice = {
  sessionId,          // uuid, generated on session start
  recentHistory,      // last 5 { topicId, isCorrect, responseTimeMs }
  currentQuestion,
  xpThisSession,
}
```

---

## TanStack Store Setup

```ts
// store/learnerStore.ts
import { Store } from '@tanstack/store'

const defaultState = loadFromLocalStorage() ?? buildFreshState()

export const learnerStore = new Store(defaultState, {
  onUpdate: () => saveToLocalStorage(learnerStore.state)
  // every state update auto-persists — no manual save calls needed
})

// helpers
function loadFromLocalStorage() {
  const raw = localStorage.getItem('mcq_learner_state')
  return raw ? JSON.parse(raw) : null
}

function saveToLocalStorage(state) {
  localStorage.setItem('mcq_learner_state', JSON.stringify(state))
}
```

All skills below call `learnerStore.setState(updater)` — the `onUpdate` hook handles persistence automatically.

---

## TanStack Query Setup

```ts
// lib/content.ts
import { queryOptions } from '@tanstack/react-query'

export const topicsQuery = queryOptions({
  queryKey: ['topics'],
  queryFn: () => fetch('/content/topics.json').then(r => r.json()),
  staleTime: Infinity,   // static content never goes stale
  gcTime: Infinity,
})

export const questionsQuery = (topicId: string) => queryOptions({
  queryKey: ['questions', topicId],
  queryFn: () => fetch(`/content/questions/${topicId}.json`).then(r => r.json()),
  staleTime: Infinity,
})
```

Content is fetched once, cached forever for the session. No re-fetching.

---

## TanStack Router Setup

```ts
// router.ts
import { createRouter, createRoute, createRootRoute } from '@tanstack/react-router'

const rootRoute = createRootRoute({ component: RootLayout })

const routes = [
  createRoute({ path: '/',           component: Dashboard }),
  createRoute({ path: '/diagnostic', component: Diagnostic }),
  createRoute({ path: '/session',    component: Session }),
  createRoute({ path: '/progress',   component: Progress }),
  createRoute({ path: '/settings',   component: Settings }),  // home of export/import
]
```

The `/settings` route hosts the data portability UI (SKILL 13).

---

## SKILL 1: Mastery Gate

**Rule:** Never mark a topic mastered from a single correct answer.

```
on each answer:
  get topicState from learnerStore.state.topics[topicId]

  if correct → consecutiveCorrect++, push true to recentAttempts
  else       → consecutiveCorrect = 0, push false to recentAttempts
  trim recentAttempts to last 5
  masteryScore = recentAttempts.filter(true).length / recentAttempts.length

  mastered = (consecutiveCorrect >= 3)
          OR (masteryScore >= 0.80 AND totalAttempts >= 5)

  if mastered AND current status != 'mastered':
    status = 'mastered'
    nextReviewDate = today + 3 days
    intervalDays = 3

  learnerStore.setState(s => ({ topics: { ...s.topics, [topicId]: updated } }))
  // onUpdate hook persists automatically
```

---

## SKILL 2: Spaced Repetition (FSRS)

**Rule:** Use [FSRS](https://github.com/open-spaced-repetition/ts-fsrs) algorithm for optimal spaced repetition. Auto-rate based on correctness + response time.

**Installation:**
```bash
npm install ts-fsrs
```

**Rating Logic (auto-calculated):**

```
if incorrect → Rating.Again (reset to learning)
if correct AND responseTime < 4000ms → Rating.Easy   (fast, confident)
if correct AND responseTime < 8000ms → Rating.Good   (normal)
if correct AND responseTime >= 8000ms → Rating.Hard  (slow but correct)
```

**Core Algorithm:**

```ts
import { fsrs, Rating, generatorParameters } from 'ts-fsrs'

const params = generatorParameters({
  enable_fuzz: true,
  enable_short_term: false,
  maximum_interval: 365,
})

const f = fsrs(params)

function processAnswer(topicState, isCorrect, responseTimeMs) {
  const card = topicStateToCard(topicState)
  const rating = determineRating(isCorrect, responseTimeMs)
  const result = f.next(card, new Date(), rating)
  
  return {
    ...topicState,
    due: result.card.due.toISOString(),
    stability: result.card.stability,
    difficulty: result.card.difficulty,
    reps: result.card.reps,
    lapses: result.card.lapses,
    state: cardStateToFSRSState(result.card.state),
  }
}
```

FSRS handles interval scheduling, difficulty adjustment, and memory decay automatically. No manual decay needed (SKILL 9 removed).

---

## SKILL 3: Question Scheduler

**Rule:** Priority order is fixed. Interleaving and non-interference are enforced on top.

```
// reads from learnerStore + TanStack Query cache (topics content)

priority pool:
  1. remediationQueue from learnerStore.state.remediationQueue
  2. FSRS due: topics where due <= today AND state === 'review'
  3. new cards: topics where state === 'new'

filter by interleaving:
  remove topicId if it appears in recentHistory[0] or recentHistory[1]

filter by non-interference:
  remove topicId if its interferenceCluster matches recentHistory[0].interferenceCluster

fallback: if all filtered out, relax non-interference first, then interleaving

select question from winning topic via questionsQuery cache
```

---

## SKILL 4: Feedback

**Rule:** Always show an explanation. Wrong answers show a distractor-specific explanation.

```
on correct:
  show: ✓ + question.explanation

on incorrect:
  show: ✗ + question.explanation + question.distractorExplanations[chosenChoiceId]
  // never just "Wrong. The answer is X."
```

Content JSON shape (enforced by SKILL 11):

```ts
type Question = {
  id: string
  topicId: string
  stem: string
  difficulty: 1 | 2 | 3 | 4 | 5
  choices: { id: string; text: string; isCorrect: boolean }[]
  explanation: string
  distractorExplanations: Record<string, string>  // choiceId → explanation
  subSkillTags: string[]
}
```

---

## SKILL 5: Remediation

**Rule:** On failure, insert a prerequisite drill. Never lower the mastery threshold.

```
failure trigger: masteryScore < 0.60 over last 3 attempts on a topic

  subSkillTag = wrongChoice.subSkillTags[0]
  remediationTopic = find prerequisite of failedTopic covering subSkillTag
                     (from topics content JSON, topic.prerequisites field)

  learnerStore.setState(s => ({
    remediationQueue: [
      ...s.remediationQueue,
      { topicId: remediationTopic.id, questionsRemaining: 3, followUpTopicId: failedTopicId },
    ]
  }))
  // failedTopic re-enters at full mastery standard — bar is NOT lowered
```

---

## SKILL 6: Choice Randomization

**Rule:** Shuffle choices on every render. Never persist or reuse display order.

```ts
// inside QuestionCard component
const shuffled = useMemo(
  () => [...question.choices].sort(() => Math.random() - 0.5),
  [question.id]   // re-shuffle when question changes
)
```

---

## SKILL 7: Diagnostic Placement

**Rule:** First launch runs a binary search. Correct answers credit all ancestor topics.

```
load topics from useQuery(topicsQuery)
start at topics[Math.floor(topics.length / 2)] sorted by topoOrder

loop until (3 consecutive correct seen AND 2 consecutive wrong seen):
  show one question from currentTopic
  if correct:
    learnerStore.setState → mark currentTopic + all ancestors as 'mastered'
    move to harder topic (higher topoOrder)
  else:
    move to easier topic (lower topoOrder)

on complete:
  navigate('/session') via TanStack Router
```

Diagnostic state (bounds, counters) lives in component state only — not in the store.

---

## SKILL 8: XP

**Rule:** XP reflects real performance. No inflation.

```
correct answer               → +10 XP
incorrect attempt            → +3 XP
topic mastered               → +50 XP
review completed             → +25 XP
same question wrong twice in one session → -5 XP

learnerStore.setState(s => ({ xp: s.xp + delta }))
```

---

## SKILL 9: Confidence Decay (Handled by FSRS)

**Note:** This skill is no longer needed. FSRS handles decay naturally via the `due` date system. Cards become "due" automatically when past their scheduled interval — no manual decay calculation required.

---

## SKILL 10: Implicit Review Credit (FIRe)

**Rule:** Correct answer on a topic extends the review date of topics it encompasses.

```
on correct answer for topicId:
  topic = from useQuery(topicsQuery) cache
  for each { encompassedTopicId, weight } in topic.encompassings:
    state = learnerStore.state.topics[encompassedTopicId]
    if state.status in ['mastered', 'needs_review']:
      extensionDays = round(weight × state.intervalDays × 0.5)
      state.nextReviewDate += extensionDays

  learnerStore.setState(updater)  // batch all FIRe updates in one setState call
```

---

## SKILL 11: Content Validation

**Rule:** Validate static JSON at app load. Never show an invalid question.

```
// runs once in QueryClient's onSuccess for topicsQuery + questionsQuery

required per question:
  stem: non-empty string
  choices: exactly 4
  exactly 1 isCorrect = true
  explanation: non-empty string
  distractorExplanations: keys for all 3 wrong choice IDs
  difficulty: 1–5
  subSkillTags: length >= 1

invalid questions → filtered out, console.warn in dev
```

---

## SKILL 12: Session Priority

**Rule:** Session queue order is fixed. Never serve new learning before clearing remediation and due reviews.

```
// computed via useMemo from learnerStore + topicsQuery cache

sessionQueue = [
  ...remediationQueue,                  // serve first
  ...topicsDueForReview,                // sorted by most overdue
  ...unlockedUnmasteredTopics,          // new learning last
]

// then apply SKILL 3 scheduler constraints as each question is picked
```

---

## SKILL 13: Data Portability (Export / Import)

**Rule:** Users can download their full learner state as a JSON file and re-import it to restore progress after a reset.

### Why this exists
localStorage can be cleared by the browser (privacy mode, cache wipe, device change). This feature gives learners ownership of their data — no account needed.

### Export

```
// triggered by "Download my data" button in /settings

function exportLearnerData() {
  const state = learnerStore.state
  const payload = {
    ...state,
    exportedAt: new Date().toISOString(),
    version: "2",
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  // trigger download
  const a = document.createElement('a')
  a.href = url
  a.download = `mcq-progress-${formatDate(new Date())}.json`
  a.click()
  URL.revokeObjectURL(url)
}
```

Downloaded file is a plain `.json` file the user keeps locally.

### Import

```
// triggered by "Restore from file" button + file picker in /settings

function importLearnerData(file: File) {
  const reader = new FileReader()
  reader.onload = (e) => {
    const raw = JSON.parse(e.target.result)

    // 1. Validate structure
    if (!validateImport(raw)) {
      showToast("Invalid file. Make sure you're uploading a file exported from this app.")
      return
    }

    // 2. Migrate if version mismatch
    const migrated = migrateIfNeeded(raw)

    // 3. Restore state
    learnerStore.setState(() => migrated)
    // onUpdate hook writes to localStorage automatically

    showToast("Progress restored successfully.")
    navigate('/')   // back to dashboard via TanStack Router
  }
  reader.readAsText(file)
}
```

### Validation

```
function validateImport(data): boolean
  must have: version, topics (object), xp (number), remediationQueue (array)
  version must be "2" (v1 data not supported in FSRS mode)
  topics must be an object (not null)
  // don't validate every topic key — be lenient on import, strict on display
```

### Version migration

```
function migrateIfNeeded(data)
  if data.version === "2": return data          // current version, no migration needed
  if data.version === "1": throw new Error("v1 data not supported, please start fresh")
  // add future cases here as schema evolves
```

### UI (in /settings route)

```
Settings page sections:

[Data & Privacy]
  "Your progress is stored only on this device."

  [ Download my data ]          → triggers exportLearnerData()
    "Save a backup of all your mastery scores, review schedules, and XP."

  [ Restore from backup ]       → opens file picker, triggers importLearnerData()
    "Upload a previously exported file to restore your progress."
    Warning: "This will replace your current progress."

  [ Reset all progress ]        → confirm dialog → learnerStore.setState(buildFreshState())
    "Start over from scratch. This cannot be undone."
```

### What gets exported

| Field | Included | Notes |
|---|---|---|
| Topic mastery status | ✅ | status, masteryScore, consecutiveCorrect |
| SRS schedule | ✅ | due, stability, difficulty, reps, lapses, state |
| XP total | ✅ | |
| Streak | ✅ | days, lastActiveDate |
| Remediation queue | ✅ | pending drills preserved |
| Session history | ❌ | scratch state, not persisted |
| Questions/content | ❌ | ships with app, not user data |

---

## Anti-patterns

| Anti-pattern | Correct behaviour |
|---|---|
| `if (isCorrect) status = 'mastered'` | Require 3 consecutive OR 80% rolling |
| Lower mastery threshold on failure | Add prerequisite drill, keep threshold |
| Separate `saveToLocalStorage()` calls per skill | Use `onUpdate` hook in Store setup — one auto-persist |
| Call `useQuery` for content inside engine functions | Pass pre-fetched data in; keep engines pure |
| Skip decay because there's no cron | Run decay check on every app open via root `useEffect` |
| Fixed choice order across renders | Shuffle via `useMemo([question.id])` |
| Award 10 XP for wrong answers | Award 3 XP (effort only) |
| Import without version check | Always validate + migrate before `setState` |
| Export with `window.location.href = dataUrl` | Use `URL.createObjectURL` + `<a>.click()` then `revokeObjectURL` |
