import { isDue } from '@/lib/engines/fsrs'
import type { CardState } from '@/types'

const WEAK_AREA_MIN_QUESTIONS = 2
const WEAK_AREA_MAX_ACCURACY_PERCENT = 49

export interface TopicRollup {
  correct: number
  attempted: number
}

export interface TagRollup {
  correct: number
  total: number
  topicId: string
}

/** Round session duration to a readable label (minutes, or "< 1 min"). */
export function formatSessionDuration(ms: number): string {
  if (!Number.isFinite(ms) || ms < 0) return '—'
  const minutes = Math.round(ms / 60000)
  if (minutes < 1) return '< 1 min'
  return `${minutes} min`
}

/** Indonesian duration label for session complete and learner-facing summaries. */
export function formatSessionDurationId(ms: number): string {
  if (!Number.isFinite(ms) || ms < 0) return '—'
  const minutes = Math.round(ms / 60000)
  if (minutes < 1) return '< 1 mnt'
  return `${minutes} mnt`
}

/** Card keys follow `${questionId}_card` in session / FSRS helpers. */
export function cardIdForQuestion(questionId: string): string {
  return `${questionId}_card`
}

/** Earliest due date among cards for the given question ids, or null if none. */
export function getEarliestDueDate(
  questionIds: string[],
  cards: Record<string, CardState>,
): Date | null {
  let best: Date | null = null
  for (const qid of questionIds) {
    const card = cards[cardIdForQuestion(qid)]
    if (!card) continue
    const d = new Date(card.due)
    if (!best || d < best) best = d
  }
  return best
}

/** Human-friendly next review line (date only; no fake clock). */
export function formatNextReviewDate(d: Date, now: Date = new Date()): string {
  const dayStart = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime()
  const diffDays = Math.round((dayStart(d) - dayStart(now)) / 86400000)
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' })
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Tomorrow'
  if (diffDays === -1) return 'Yesterday'
  if (diffDays >= -7 && diffDays <= 7) {
    return rtf.format(diffDays, 'day')
  }
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
}

/** Indonesian day-only next review line for session complete (wireframe S11). */
export function formatNextReviewDateId(d: Date, now: Date = new Date()): string {
  const dayStart = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime()
  const diffDays = Math.round((dayStart(d) - dayStart(now)) / 86400000)
  const rtf = new Intl.RelativeTimeFormat('id', { numeric: 'auto' })
  if (diffDays === 0) return 'Hari ini'
  if (diffDays === 1) return 'Besok'
  if (diffDays === -1) return 'Kemarin'
  if (diffDays >= -7 && diffDays <= 7) {
    return rtf.format(diffDays, 'day')
  }
  return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' })
}

export interface DueTopicLine {
  topicId: string
  title: string
  dueCount: number
}

/** Topics from this session that have at least one due card (among session questions). */
export function buildDueTopicsLine(
  questions: { id: string; topicId: string }[],
  cards: Record<string, CardState>,
  topicTitle: (topicId: string) => string,
): DueTopicLine[] {
  const byTopic = new Map<string, { due: number }>()
  for (const q of questions) {
    const card = cards[cardIdForQuestion(q.id)]
    if (!card || !isDue(card)) continue
    const cur = byTopic.get(q.topicId) ?? { due: 0 }
    cur.due += 1
    byTopic.set(q.topicId, cur)
  }
  return [...byTopic.entries()]
    .map(([topicId, { due }]) => ({
      topicId,
      title: topicTitle(topicId),
      dueCount: due,
    }))
    .filter((x) => x.dueCount > 0)
}

/** Worst tag by accuracy where total >= 2 and accuracy <= 49%. */
export function findWeakTag(
  tagRollup: Record<string, TagRollup>,
): { tag: string; missed: number; total: number; topicId: string } | null {
  let worst: { tag: string; missed: number; total: number; topicId: string; accuracy: number } | null =
    null
  for (const [tag, r] of Object.entries(tagRollup)) {
    if (r.total < WEAK_AREA_MIN_QUESTIONS) continue
    const accuracy = Math.round((r.correct / r.total) * 100)
    if (accuracy > WEAK_AREA_MAX_ACCURACY_PERCENT) continue
    const missed = r.total - r.correct
    if (!worst || accuracy < worst.accuracy) {
      worst = { tag, missed, total: r.total, topicId: r.topicId, accuracy }
    }
  }
  if (!worst) return null
  return { tag: worst.tag, missed: worst.missed, total: worst.total, topicId: worst.topicId }
}
