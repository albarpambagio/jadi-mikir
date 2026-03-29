import { isDue } from '@/lib/engines/fsrs'
import { cardIdForQuestion } from '@/lib/session-complete-aggregates'
import type { CardState, Question, ReviewLog, Topic } from '@/types'

const WEAK_AREA_MIN_QUESTIONS = 2
const WEAK_AREA_MAX_ACCURACY_PERCENT = 49
const STRONG_MIN_ACCURACY_PERCENT = 70

/** Card stats for topic detail (wireframe S12). Card keys use `${questionId}_card` (see session engine). */
export interface CardBucketStats {
  /** Count of questions that have at least one FSRS card in storage. */
  cardsTracked: number
  jatuhTempo: number
  mendatang: number
  mastered: number
}

/**
 * Partition cards for topic questions:
 * - jatuh tempo: isDue
 * - mastered: !isDue, state review, reps > 0 (stable review queue)
 * - mendatang: everything else with a card (new/learning/relearning, or review not yet “stable”)
 * Unstarted questions (no card) are omitted from the three buckets; cardsTracked sums rows with a card.
 */
export function getCardBucketStats(
  questionIds: string[],
  cards: Record<string, CardState>,
): CardBucketStats {
  let jatuhTempo = 0
  let mendatang = 0
  let mastered = 0
  let cardsTracked = 0

  for (const qid of questionIds) {
    const card = cards[cardIdForQuestion(qid)]
    if (!card) continue
    cardsTracked += 1
    if (isDue(card)) {
      jatuhTempo += 1
    } else if (card.state === 'review' && card.reps > 0) {
      mastered += 1
    } else {
      mendatang += 1
    }
  }

  return { cardsTracked, jatuhTempo, mendatang, mastered }
}

export type SubtopicStatus = 'strong' | 'ok' | 'weak' | 'empty'

export interface SubtopicRow {
  tagKey: string
  displayLabel: string
  questionCount: number
  accuracyPercent: number | null
  status: SubtopicStatus
}

/** Primary subtopic key = first tag, same as session meta row. */
export function primaryTag(q: Question): string {
  return q.tags[0] ?? 'General'
}

export function humanizeSubtopicLabel(tag: string): string {
  if (tag === 'General') return 'Umum'
  return tag.replace(/-/g, ' ')
}

function accuracyFromReviewLogs(questionIds: Set<string>, logs: ReviewLog[]): {
  correct: number
  total: number
} {
  let correct = 0
  let total = 0
  for (const log of logs) {
    if (!questionIds.has(log.questionId)) continue
    total += 1
    if (log.rating === 'good' || log.rating === 'easy') correct += 1
  }
  return { correct, total }
}

function classifySubtopic(accuracyPercent: number | null, totalLogs: number): SubtopicStatus {
  if (totalLogs === 0) return 'empty'
  const acc = accuracyPercent ?? 0
  if (totalLogs >= WEAK_AREA_MIN_QUESTIONS && acc <= WEAK_AREA_MAX_ACCURACY_PERCENT) return 'weak'
  if (totalLogs >= WEAK_AREA_MIN_QUESTIONS && acc >= STRONG_MIN_ACCURACY_PERCENT) return 'strong'
  return 'ok'
}

/** Group questions by primary tag; accuracy from global review logs. */
export function buildSubtopicRows(questions: Question[], reviewLogs: ReviewLog[]): SubtopicRow[] {
  const byTag = new Map<string, Question[]>()
  for (const q of questions) {
    const tag = primaryTag(q)
    const list = byTag.get(tag) ?? []
    list.push(q)
    byTag.set(tag, list)
  }

  const rows: SubtopicRow[] = []
  for (const [tagKey, qs] of byTag.entries()) {
    const qids = new Set(qs.map((q) => q.id))
    const { correct, total } = accuracyFromReviewLogs(qids, reviewLogs)
    const accuracyPercent = total === 0 ? null : Math.round((correct / total) * 100)
    const status = classifySubtopic(accuracyPercent, total)
    rows.push({
      tagKey,
      displayLabel: humanizeSubtopicLabel(tagKey),
      questionCount: qs.length,
      accuracyPercent,
      status,
    })
  }

  rows.sort((a, b) => a.displayLabel.localeCompare(b.displayLabel, 'id'))
  return rows
}

/** Weakest subtopic by accuracy (min 2 attempts), aligned with session weak-area logic. */
export function findWeakestSubtopicTag(rows: SubtopicRow[]): string | null {
  let worst: { tagKey: string; accuracy: number } | null = null
  for (const row of rows) {
    if (row.status !== 'weak' || row.accuracyPercent === null) continue
    if (!worst || row.accuracyPercent < worst.accuracy) {
      worst = { tagKey: row.tagKey, accuracy: row.accuracyPercent }
    }
  }
  return worst?.tagKey ?? null
}

export interface UnlockTopic {
  topic: Topic
  subjectSlug: string
}

/** Topics that list `topicId` in prerequisites. */
export function getUnlockTopics(topicId: string, allTopics: Topic[], toSlug: (s: string) => string): UnlockTopic[] {
  return allTopics
    .filter((t) => t.prerequisites.includes(topicId))
    .map((t) => ({ topic: t, subjectSlug: toSlug(t.subject) }))
    .sort((a, b) => a.topic.title.localeCompare(b.topic.title))
}
