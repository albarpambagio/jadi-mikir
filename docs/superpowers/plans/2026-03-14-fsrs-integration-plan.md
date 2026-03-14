# FSRS Integration Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace custom SM-2 spaced repetition with ts-fsrs library, including auto-rating based on correctness + response time.

**Architecture:** Install ts-fsrs, create FSRS adapter layer, update storage model, integrate with scheduler. This is a greenfield project - no existing code to modify.

**Tech Stack:** TanStack (Query + Router + Store), TypeScript, ts-fsrs, localStorage

---

## File Structure

```
src/
├── lib/
│   └── fsrs.ts          # FSRS adapter (NEW)
├── store/
│   └── learnerStore.ts  # Learner state with FSRS fields (NEW)
├── content/
│   └── queries.ts       # TanStack Query for content (NEW)
├── scheduler/
│   └── sessionQueue.ts  # Question scheduling (NEW)
├── skills/
│   ├── mastery.ts       # SKILL 1 (NEW)
│   ├── spacedRep.ts     # SKILL 2 - REPLACE with FSRS (NEW)
│   ├── scheduler.ts    # SKILL 3 (NEW)
│   ├── feedback.ts      # SKILL 4 (NEW)
│   ├── remediation.ts   # SKILL 5 (NEW)
│   ├── randomization.ts  # SKILL 6 (NEW)
│   ├── diagnostic.ts    # SKILL 7 (NEW)
│   ├── xp.ts            # SKILL 8 (NEW)
│   ├── decay.ts         # SKILL 9 - REMOVE (FSRS handles) (NEW)
│   ├── fire.ts          # SKILL 10 (NEW)
│   ├── validation.ts    # SKILL 11 (NEW)
│   ├── sessionPriority.ts # SKILL 12 (NEW)
│   └── portability.ts   # SKILL 13 (NEW)
├── components/
│   └── ...              # UI components (NEW)
├── types/
│   └── index.ts         # TypeScript types (NEW)
└── router.ts            # TanStack Router (NEW)
```

---

## Chunk 1: Project Setup & Types

### Task 1: Initialize Project

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `index.html`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "jadi-mahir",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest"
  },
  "dependencies": {
    "@tanstack/react-query": "^5.x",
    "@tanstack/react-router": "^1.x",
    "@tanstack/react-store": "^2.x",
    "react": "^18.x",
    "react-dom": "^18.x",
    "ts-fsrs": "^4.x"
  },
  "devDependencies": {
    "@types/react": "^18.x",
    "@types/react-dom": "^18.x",
    "@vitejs/plugin-react": "^4.x",
    "typescript": "^5.x",
    "vite": "^5.x",
    "vitest": "^1.x"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Create index.html**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>JadiMahir</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 4: Commit**

```bash
git init
git add package.json tsconfig.json index.html
git commit -m "chore: scaffold project with Vite + React + TanStack"
```

---

### Task 2: Create TypeScript Types

**Files:**
- Create: `src/types/index.ts`

- [ ] **Step 1: Write the test**

```ts
import { describe, it, expect } from 'vitest'

describe('TopicState type', () => {
  it('should have FSRS fields', () => {
    const topic: TopicState = {
      id: 'test',
      status: 'available',
      masteryScore: 0,
      consecutiveCorrect: 0,
      totalAttempts: 0,
      recentAttempts: [],
      due: new Date().toISOString(),
      stability: 0,
      difficulty: 2.5,
      reps: 0,
      lapses: 0,
      state: 'new',
    }
    expect(topic.due).toBeDefined()
    expect(topic.stability).toBeDefined()
    expect(topic.state).toBe('new')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL with "Cannot find name 'TopicState'"

- [ ] **Step 3: Write types**

```ts
export type TopicStatus = 'locked' | 'available' | 'in_progress' | 'mastered' | 'needs_review'

export type FSRSState = 'new' | 'learning' | 'review' | 'relearning'

export interface TopicState {
  id: string
  status: TopicStatus
  masteryScore: number
  consecutiveCorrect: number
  totalAttempts: number
  recentAttempts: boolean[]
  // FSRS fields
  due: string
  stability: number
  difficulty: number
  reps: number
  lapses: number
  state: FSRSState
}

export interface LearnerState {
  version: '2'
  xp: number
  streak: {
    days: number
    lastActiveDate: string
  }
  remediationQueue: RemediationItem[]
  topics: Record<string, TopicState>
  exportedAt?: string
}

export interface RemediationItem {
  topicId: string
  questionsRemaining: number
  followUpTopicId: string
}

export interface SessionState {
  sessionId: string
  recentHistory: RecentHistoryItem[]
  currentQuestion: Question | null
  xpThisSession: number
}

export interface RecentHistoryItem {
  topicId: string
  isCorrect: boolean
  responseTimeMs: number
}

export interface Question {
  id: string
  topicId: string
  stem: string
  difficulty: 1 | 2 | 3 | 4 | 5
  choices: Choice[]
  explanation: string
  distractorExplanations: Record<string, string>
  subSkillTags: string[]
}

export interface Choice {
  id: string
  text: string
  isCorrect: boolean
}

export interface Topic {
  id: string
  title: string
  description: string
  topoOrder: number
  prerequisites: string[]
  encompassings: Encompassing[]
  interferenceCluster: string
}

export interface Encompassing {
  encompassedTopicId: string
  weight: number
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/types/index.ts
git commit -m "feat: add TypeScript types with FSRS fields"
```

---

## Chunk 2: FSRS Integration

### Task 3: Create FSRS Adapter

**Files:**
- Create: `src/lib/fsrs.ts`

- [ ] **Step 1: Write the test**

```ts
import { describe, it, expect } from 'vitest'
import { Rating } from 'ts-fsrs'
import { determineRating, processAnswer, createInitialTopicState } from '../lib/fsrs'

describe('determineRating', () => {
  it('returns Again for incorrect', () => {
    expect(determineRating(false, 1000)).toBe(Rating.Again)
  })

  it('returns Easy for correct + fast', () => {
    expect(determineRating(true, 3000)).toBe(Rating.Easy)
  })

  it('returns Good for correct + normal', () => {
    expect(determineRating(true, 5000)).toBe(Rating.Good)
  })

  it('returns Hard for correct + slow', () => {
    expect(determineRating(true, 10000)).toBe(Rating.Hard)
  })
})

describe('processAnswer', () => {
  it('updates FSRS fields on answer', () => {
    const state = createInitialTopicState('topic-1')
    const result = processAnswer(state, true, 5000)
    
    expect(result.reps).toBe(1)
    expect(result.due).not.toBe(state.due)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL with "Cannot find module '../lib/fsrs'"

- [ ] **Step 3: Write FSRS adapter**

```ts
import { 
  fsrs, 
  Rating, 
  Card, 
  State,
  generatorParameters 
} from 'ts-fsrs'
import type { TopicState, FSRSState } from '../types'

const params = generatorParameters({
  enable_fuzz: true,
  enable_short_term: false,
  maximum_interval: 365,
})

const f = fsrs(params)

export const RATING_THRESHOLDS = {
  FAST_MS: 4000,
  NORMAL_MS: 8000,
} as const

export function determineRating(
  isCorrect: boolean, 
  responseTimeMs: number
): Rating {
  if (!isCorrect) return Rating.Again
  
  if (responseTimeMs < RATING_THRESHOLDS.FAST_MS) return Rating.Easy
  if (responseTimeMs < RATING_THRESHOLDS.NORMAL_MS) return Rating.Good
  return Rating.Hard
}

export function createInitialTopicState(topicId: string): TopicState {
  return {
    id: topicId,
    status: 'available',
    masteryScore: 0,
    consecutiveCorrect: 0,
    totalAttempts: 0,
    recentAttempts: [],
    due: new Date().toISOString(),
    stability: 0,
    difficulty: 2.5,
    reps: 0,
    lapses: 0,
    state: 'new',
  }
}

export function processAnswer(
  currentState: TopicState,
  isCorrect: boolean,
  responseTimeMs: number
): TopicState {
  const card = topicStateToCard(currentState)
  const rating = determineRating(isCorrect, responseTimeMs)
  
  const result = f.next(card, new Date(), rating)
  const newCard = result.card
  
  const newRecentAttempts = [
    ...currentState.recentAttempts.slice(-4),
    isCorrect,
  ]
  
  const correctCount = newRecentAttempts.filter(Boolean).length
  const newMasteryScore = correctCount / newRecentAttempts.length
  
  const newConsecutiveCorrect = isCorrect 
    ? currentState.consecutiveCorrect + 1 
    : 0

  return {
    ...currentState,
    due: newCard.due.toISOString(),
    stability: newCard.stability,
    difficulty: newCard.difficulty,
    reps: newCard.reps,
    lapses: newCard.lapses,
    state: cardStateToFSRSState(newCard.state),
    totalAttempts: currentState.totalAttempts + 1,
    consecutiveCorrect: newConsecutiveCorrect,
    recentAttempts: newRecentAttempts,
    masteryScore: newRecentAttempts.length > 0 ? newMasteryScore : 0,
  }
}

function topicStateToCard(state: TopicState): Card {
  return {
    due: new Date(state.due),
    stability: state.stability,
    difficulty: state.difficulty,
    elapsed_days: 0,
    scheduled_days: 0,
    learning_steps: 0,
    reps: state.reps,
    lapses: state.lapses,
    state: fsrsStateToCardState(state.state),
    last_review: undefined,
  }
}

function fsrsStateToCardState(state: FSRSState): State {
  switch (state) {
    case 'new': return State.New
    case 'learning': return State.Learning
    case 'review': return State.Review
    case 'relearning': return State.Relearning
  }
}

function cardStateToFSRSState(state: State): FSRSState {
  switch (state) {
    case State.New: return 'new'
    case State.Learning: return 'learning'
    case State.Review: return 'review'
    case State.Relearning: return 'relearning'
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/fsrs.ts
git commit -m "feat: add FSRS adapter with auto-rating"
```

---

### Task 4: Create Learner Store

**Files:**
- Create: `src/store/learnerStore.ts`

- [ ] **Step 1: Write the test**

```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { learnerStore, buildFreshState, loadFromLocalStorage, saveToLocalStorage } from '../store/learnerStore'

describe('learnerStore', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('has initial state', () => {
    const state = learnerStore.state
    expect(state.version).toBe('2')
    expect(state.xp).toBe(0)
  })

  it('persists to localStorage', () => {
    learnerStore.setState(s => ({ ...s, xp: 100 }))
    const stored = localStorage.getItem('mcq_learner_state')
    expect(stored).toContain('"xp":100')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL with "Cannot find module '../store/learnerStore'"

- [ ] **Step 3: Write store**

```ts
import { createStore } from '@tanstack/react-store'
import type { LearnerState, TopicState } from '../types'
import { createInitialTopicState } from '../lib/fsrs'

function buildFreshState(): LearnerState {
  return {
    version: '2',
    xp: 0,
    streak: {
      days: 0,
      lastActiveDate: new Date().toISOString().split('T')[0],
    },
    remediationQueue: [],
    topics: {},
  }
}

function loadFromLocalStorage(): LearnerState | null {
  const raw = localStorage.getItem('mcq_learner_state')
  if (!raw) return null
  
  try {
    const parsed = JSON.parse(raw)
    if (parsed.version !== '2') {
      console.warn('Unsupported version, starting fresh')
      return null
    }
    return parsed
  } catch {
    return null
  }
}

function saveToLocalStorage(state: LearnerState) {
  localStorage.setItem('mcq_learner_state', JSON.stringify(state))
}

const defaultState = loadFromLocalStorage() ?? buildFreshState()

export const learnerStore = createStore<LearnerState>({
  initialState: defaultState,
  onUpdate: () => {
    saveToLocalStorage(learnerStore.state)
  },
})

export function initializeTopic(topicId: string) {
  learnerStore.setState(state => {
    if (state.topics[topicId]) return state
    
    return {
      ...state,
      topics: {
        ...state.topics,
        [topicId]: createInitialTopicState(topicId),
      },
    }
  })
}

export function getTopicState(topicId: string): TopicState | undefined {
  return learnerStore.state.topics[topicId]
}

export { buildFreshState, loadFromLocalStorage, saveToLocalStorage }
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/store/learnerStore.ts
git commit -m "feat: add learner store with localStorage persistence"
```

---

## Chunk 3: Skills Implementation

### Task 5: Implement SKILL 1 (Mastery) & SKILL 2 (FSRS)

**Files:**
- Create: `src/skills/mastery.ts`
- Create: `src/skills/spacedRep.ts`

- [ ] **Step 1: Write the tests**

```ts
import { describe, it, expect } from 'vitest'
import { isMastered, checkAndUpdateMastery } from '../skills/mastery'
import type { TopicState } from '../types'

describe('isMastered', () => {
  it('returns true for 3 consecutive correct', () => {
    const topic: TopicState = {
      ...createInitialTopicState('t1'),
      consecutiveCorrect: 3,
      masteryScore: 0.5,
      totalAttempts: 3,
    }
    expect(isMastered(topic)).toBe(true)
  })

  it('returns true for 80% over 5 attempts', () => {
    const topic: TopicState = {
      ...createInitialTopicState('t1'),
      consecutiveCorrect: 0,
      masteryScore: 0.8,
      totalAttempts: 5,
      recentAttempts: [true, true, true, false, true],
    }
    expect(isMastered(topic)).toBe(true)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL

- [ ] **Step 3: Write mastery.ts**

```ts
import type { TopicState } from '../types'

export function isMastered(topic: TopicState): boolean {
  return (
    topic.consecutiveCorrect >= 3 ||
    (topic.masteryScore >= 0.8 && topic.totalAttempts >= 5)
  )
}

export function checkAndUpdateMastery(
  topic: TopicState,
  newState: TopicState
): TopicState {
  if (isMasteryTransition(topic.status, newState.status)) {
    return {
      ...newState,
      status: 'mastered',
    }
  }
  return newState
}

function isMasteryTransition(
  oldStatus: string,
  newStatus: string
): boolean {
  return (
    oldStatus !== 'mastered' &&
    newStatus === 'mastered'
  )
}
```

- [ ] **Step 4: Write spacedRep.ts**

```ts
import { processAnswer } from '../lib/fsrs'
import { checkAndUpdateMastery } from './mastery'
import type { TopicState } from '../types'

export function handleSpacedRepetition(
  currentState: TopicState,
  isCorrect: boolean,
  responseTimeMs: number
): TopicState {
  let newState = processAnswer(currentState, isCorrect, responseTimeMs)
  newState = checkAndUpdateMastery(currentState, newState)
  
  if (newState.status === 'mastered' && currentState.status !== 'mastered') {
    // Mark for review in 3 days
    const reviewDate = new Date()
    reviewDate.setDate(reviewDate.getDate() + 3)
    newState = {
      ...newState,
      due: reviewDate.toISOString(),
    }
  }
  
  return newState
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm test`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/skills/mastery.ts src/skills/spacedRep.ts
git commit -m "feat: implement SKILL 1 (mastery) and SKILL 2 (FSRS)"
```

---

### Task 6: Implement SKILL 3 (Scheduler)

**Files:**
- Create: `src/scheduler/sessionQueue.ts`

- [ ] **Step 1: Write the test**

```ts
import { describe, it, expect } from 'vitest'
import { getSessionQueue } from '../scheduler/sessionQueue'
import type { LearnerState, TopicState } from '../types'
import { createInitialTopicState } from '../lib/fsrs'

describe('getSessionQueue', () => {
  it('puts remediation first', () => {
    const state: LearnerState = {
      version: '2',
      xp: 0,
      streak: { days: 0, lastActiveDate: '2026-01-01' },
      remediationQueue: [
        { topicId: 'remed-1', questionsRemaining: 3, followUpTopicId: 'main-1' }
      ],
      topics: {
        'remed-1': { ...createInitialTopicState('remed-1'), status: 'in_progress' },
        'topic-1': { ...createInitialTopicState('topic-1'), due: new Date().toISOString(), state: 'review' },
      },
    }
    
    const queue = getSessionQueue(state)
    expect(queue[0]).toBe('remed-1')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL

- [ ] **Step 3: Write scheduler**

```ts
import type { LearnerState, TopicState } from '../types'

export function getSessionQueue(state: LearnerState): string[] {
  const now = new Date()
  
  // 1. Remediation queue
  const remediation = state.remediationQueue.map(r => r.topicId)
  
  // 2. FSRS due: cards where due <= now and state is review
  const dueForReview = Object.entries(state.topics)
    .filter(([_, topic]) => {
      if (topic.state !== 'review') return false
      return new Date(topic.due) <= now
    })
    .sort((a, b) => 
      new Date(a[1].due).getTime() - new Date(b[1].due).getTime()
    )
    .map(([id]) => id)
  
  // 3. New cards
  const newTopics = Object.entries(state.topics)
    .filter(([_, topic]) => topic.state === 'new')
    .map(([id]) => id)
  
  return [...remediation, ...dueForReview, ...newTopics]
}

export function applyInterleaving(
  queue: string[],
  recentHistory: { topicId: string }[]
): string[] {
  if (recentHistory.length === 0) return queue
  
  const last1 = recentHistory[0]?.topicId
  const last2 = recentHistory[1]?.topicId
  
  return queue.filter(id => id !== last1 && id !== last2)
}

export function applyNonInterference(
  queue: string[],
  recentHistory: { topicId: string; interferenceCluster?: string }[],
  topics: Record<string, TopicState>
): string[] {
  if (recentHistory.length === 0) return queue
  
  const last = recentHistory[0]
  const lastCluster = last?.interferenceCluster
  
  if (!lastCluster) return queue
  
  return queue.filter(id => {
    const topic = topics[id]
    return topic?.interferenceCluster !== lastCluster
  })
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/scheduler/sessionQueue.ts
git commit -m "feat: implement SKILL 3 (scheduler with FSRS)"
```

---

## Chunk 4: Import/Export (SKILL 13)

### Task 7: Data Portability

**Files:**
- Create: `src/skills/portability.ts`

- [ ] **Step 1: Write the test**

```ts
import { describe, it, expect } from 'vitest'
import { validateImport, migrateIfNeeded } from '../skills/portability'

describe('validateImport', () => {
  it('accepts v2 data', () => {
    const data = {
      version: '2',
      xp: 100,
      topics: { 't1': {} },
      remediationQueue: [],
    }
    expect(validateImport(data)).toBe(true)
  })

  it('rejects v1 data', () => {
    const data = {
      version: '1',
      xp: 100,
      topics: { 't1': {} },
      remediationQueue: [],
    }
    expect(validateImport(data)).toBe(false)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL

- [ ] **Step 3: Write portability.ts**

```ts
import type { LearnerState } from '../types'

export function validateImport(data: any): data is LearnerState {
  if (!data) return false
  if (!data.topics) return false
  if (typeof data.xp !== 'number') return false
  if (!Array.isArray(data.remediationQueue)) return false
  
  // Accept v2 only
  return data.version === '2'
}

export function migrateIfNeeded(data: any): LearnerState {
  if (data.version === '2') {
    return data
  }
  
  throw new Error('v1 data migration not supported. Please start fresh.')
}

export function exportLearnerData(state: LearnerState): Blob {
  const payload = {
    ...state,
    version: '2',
    exportedAt: new Date().toISOString(),
  }
  
  return new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json',
  })
}

export function downloadExport(state: LearnerState): void {
  const blob = exportLearnerData(state)
  const url = URL.createObjectURL(blob)
  
  const a = document.createElement('a')
  a.href = url
  a.download = `jadi-mahir-progress-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  
  URL.revokeObjectURL(url)
}

export async function importLearnerData(
  file: File,
  setState: (state: LearnerState) => void
): Promise<void> {
  const text = await file.text()
  const data = JSON.parse(text)
  
  if (!validateImport(data)) {
    throw new Error('Invalid file format')
  }
  
  const migrated = migrateIfNeeded(data)
  setState(migrated)
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/skills/portability.ts
git commit -m "feat: implement SKILL 13 (data portability)"
```

---

## Summary

| Chunk | Tasks | Description |
|-------|-------|-------------|
| 1 | 2 | Project setup + Types |
| 2 | 2 | FSRS adapter + Store |
| 3 | 2 | Skills (Mastery, FSRS, Scheduler) |
| 4 | 1 | Import/Export |

Total: 7 tasks, ~35 steps

**Ready to execute?**
