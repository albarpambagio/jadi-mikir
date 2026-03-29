import { getCardBucketStats, type SubtopicRow } from '@/lib/topic-detail-aggregates'
import type { CardState } from '@/types'

/** Kartu yang masih perlu diperkuat: jatuh tempo + mendatang (not yet stable review). */
export function countCardsNeedingWork(
  questionIds: string[],
  cards: Record<string, CardState>,
): number {
  const b = getCardBucketStats(questionIds, cards)
  return b.jatuhTempo + b.mendatang
}

export interface WeakestSubtopicLine {
  tagKey: string
  displayLabel: string
  accuracyPercent: number
}

/** Up to two weakest subtopics by accuracy (non-null accuracy first). */
export function getTwoWeakestSubtopics(rows: SubtopicRow[]): WeakestSubtopicLine[] {
  const ranked = [...rows]
    .filter((r) => r.accuracyPercent !== null)
    .sort((a, b) => (a.accuracyPercent ?? 100) - (b.accuracyPercent ?? 100))
  const top = ranked.slice(0, 2)
  return top.map((r) => ({
    tagKey: r.tagKey,
    displayLabel: r.displayLabel,
    accuracyPercent: r.accuracyPercent ?? 0,
  }))
}
