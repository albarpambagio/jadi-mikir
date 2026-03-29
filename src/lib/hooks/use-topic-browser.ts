import { useMemo, useState, useEffect } from 'react'
import { useTopicsQuery } from '@/lib/content'
import { learnerStore } from '@/store/learnerStore'
import { getMasteryProgress, canAccessTopic, calculateMasteryLevel } from '@/lib/engines/mastery'
import { isDue } from '@/lib/engines/fsrs'
import type { LearnerState, Topic } from '@/types'
import type { TopicWithProgress } from '@/lib/hooks/use-dashboard-stats'

export interface PrereqInfo {
  topicId: string
  title: string
  currentPct: number
  satisfied: boolean
}

export interface TopicWithStatus extends TopicWithProgress {
  status: 'inProgress' | 'mastered' | 'available' | 'locked'
  prereqInfo: PrereqInfo[]
  nextReviewDays: number | null
}

export interface SubjectGroup {
  subject: string
  slug: string
  totalTopics: number
  totalCards: number
  startedCount: number
  masteredCount: number
  totalDue: number
  isActive: boolean
  topicTitles: string[]
}

export interface CategorizedTopics {
  inProgress: TopicWithStatus[]
  mastered: TopicWithStatus[]
  available: TopicWithStatus[]
  locked: TopicWithStatus[]
}

export function toSlug(subject: string): string {
  return subject.toLowerCase().replace(/\s+/g, '-')
}

function getDueCountFromCards(topicId: string, cards: LearnerState['cards']): number {
  let count = 0
  for (const [cardId, card] of Object.entries(cards)) {
    if (cardId.startsWith(`${topicId}_`) && isDue(card)) count++
  }
  return count
}

function getNextReviewDays(topicId: string, cards: LearnerState['cards']): number | null {
  let minDue: Date | null = null
  for (const [cardId, card] of Object.entries(cards)) {
    if (cardId.startsWith(`${topicId}_`)) {
      const due = new Date(card.due)
      if (minDue === null || due < minDue) minDue = due
    }
  }
  if (!minDue) return null
  const diffMs = minDue.getTime() - Date.now()
  return diffMs > 0 ? Math.ceil(diffMs / (1000 * 60 * 60 * 24)) : 0
}

function getTopicStatus(
  topic: Topic,
  learnerTopics: LearnerState['topics'],
): 'inProgress' | 'mastered' | 'available' | 'locked' {
  const mastery = learnerTopics[topic.id]
  if (mastery) {
    const level = calculateMasteryLevel(mastery)
    return level >= 5 ? 'mastered' : 'inProgress'
  }
  const accessible = canAccessTopic(topic.id, topic.prerequisites, learnerTopics)
  return accessible ? 'available' : 'locked'
}

export function useTopicBrowserData(): {
  subjects: SubjectGroup[]
  isLoading: boolean
  getTopicsBySubject: (subject: string) => CategorizedTopics
  findTopicWithStatus: (topicId: string) => TopicWithStatus | null
} {
  const { data: topics, isLoading } = useTopicsQuery()
  const [learnerState, setLearnerState] = useState(() => learnerStore.get())

  useEffect(() => {
    const sub = learnerStore.subscribe((s) => setLearnerState(s))
    return () => sub.unsubscribe()
  }, [])

  // Enrich every topic with masteryProgress + dueCount + status + nextReviewDays
  const enrichedTopics = useMemo<TopicWithStatus[]>(() => {
    if (!topics) return []
    const { topics: learnerTopics, cards } = learnerState
    return topics.map((topic) => {
      const mastery = learnerTopics[topic.id]
      const masteryProgress = mastery ? getMasteryProgress(mastery) : null
      const dueCount = getDueCountFromCards(topic.id, cards)
      const status = getTopicStatus(topic, learnerTopics)
      const nextReviewDays = status === 'mastered' ? getNextReviewDays(topic.id, cards) : null
      return { ...topic, masteryProgress, dueCount, status, prereqInfo: [], nextReviewDays }
    })
  }, [topics, learnerState])

  // Build topic lookup by id for prereq resolution
  const topicById = useMemo<Map<string, Topic>>(() => {
    if (!topics) return new Map()
    return new Map(topics.map((t) => [t.id, t]))
  }, [topics])

  // Build per-subject groups (with topicTitles preview)
  const subjects = useMemo<SubjectGroup[]>(() => {
    if (!topics) return []

    // Collect topics per subject first (for title preview)
    const topicsBySubject = new Map<string, string[]>()
    for (const topic of enrichedTopics) {
      if (!topicsBySubject.has(topic.subject)) topicsBySubject.set(topic.subject, [])
      topicsBySubject.get(topic.subject)!.push(topic.title)
    }

    const groupMap = new Map<string, SubjectGroup>()

    for (const topic of enrichedTopics) {
      if (!groupMap.has(topic.subject)) {
        const allTitles = topicsBySubject.get(topic.subject) ?? []
        const topicTitles = [...allTitles].sort().slice(0, 4)
        groupMap.set(topic.subject, {
          subject: topic.subject,
          slug: toSlug(topic.subject),
          totalTopics: 0,
          totalCards: 0,
          startedCount: 0,
          masteredCount: 0,
          totalDue: 0,
          isActive: false,
          topicTitles,
        })
      }
      const group = groupMap.get(topic.subject)!
      group.totalTopics += 1
      group.totalCards += topic.questionCount
      group.totalDue += topic.dueCount
      if (topic.status === 'inProgress' || topic.status === 'mastered') {
        group.startedCount += 1
        group.isActive = true
      }
      if (topic.status === 'mastered') {
        group.masteredCount += 1
      }
    }

    return [...groupMap.values()].sort((a, b) => {
      if (a.isActive !== b.isActive) return a.isActive ? -1 : 1
      return a.subject.localeCompare(b.subject)
    })
  }, [topics, enrichedTopics])

  // Returns topics for a given subject, categorized by status with prereq info attached
  const getTopicsBySubject = useMemo(() => {
    return (subject: string): CategorizedTopics => {
      const forSubject = enrichedTopics
        .filter((t) => t.subject === subject)
        .map((topic) => {
          const prereqInfo: PrereqInfo[] = topic.prerequisites.map((prereqId) => {
            const prereqTopic = topicById.get(prereqId)
            const prereqMastery = learnerState.topics[prereqId]
            const currentPct = prereqMastery
              ? Math.round((prereqMastery.masteredQuestions / prereqMastery.totalQuestions) * 100)
              : 0
            const satisfied = prereqMastery
              ? getMasteryProgress(prereqMastery).level >= 3
              : false
            return {
              topicId: prereqId,
              title: prereqTopic?.title ?? prereqId,
              currentPct,
              satisfied,
            }
          })
          return { ...topic, prereqInfo }
        })

      const result: CategorizedTopics = {
        inProgress: [],
        mastered: [],
        available: [],
        locked: [],
      }
      for (const topic of forSubject) {
        result[
          topic.status === 'inProgress' ? 'inProgress'
          : topic.status === 'mastered' ? 'mastered'
          : topic.status === 'available' ? 'available'
          : 'locked'
        ].push(topic)
      }
      // Sort each group
      result.inProgress.sort((a, b) => (b.dueCount - a.dueCount) || a.title.localeCompare(b.title))
      result.mastered.sort((a, b) => (a.nextReviewDays ?? 999) - (b.nextReviewDays ?? 999))
      result.available.sort((a, b) => a.title.localeCompare(b.title))
      result.locked.sort((a, b) => a.title.localeCompare(b.title))

      return result
    }
  }, [enrichedTopics, topicById, learnerState.topics])

  const findTopicWithStatus = useMemo(() => {
    return (topicId: string): TopicWithStatus | null =>
      enrichedTopics.find((t) => t.id === topicId) ?? null
  }, [enrichedTopics])

  return { subjects, isLoading, getTopicsBySubject, findTopicWithStatus }
}
