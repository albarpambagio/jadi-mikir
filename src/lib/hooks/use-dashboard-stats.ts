import { useMemo, useState, useEffect } from 'react'
import { useTopicsQuery } from '@/lib/content'
import { learnerStore, learnerActions } from '@/store/learnerStore'
import { getMasteryProgress } from '@/lib/engines/mastery'
import { isDue } from '@/lib/engines/fsrs'
import type { Topic } from '@/types'

export interface MasteryProgress {
  current: number
  target: number
  percentage: number
  level: number
  levelName: string
}

export interface TopicWithProgress extends Topic {
  masteryProgress: MasteryProgress | null
  dueCount: number
}

export interface DashboardStats {
  topics: Topic[] | undefined
  isLoading: boolean
  error: Error | null
  streak: number
  totalXP: number
  completedCount: number
  totalTopics: number
  totalDue: number
  topicsWithDue: number
}

function getDueCards(topicId: string): string[] {
  const state = learnerStore.get()
  const dueCards: string[] = []
  
  for (const [cardId, card] of Object.entries(state.cards)) {
    if (cardId.startsWith(`${topicId}_`) && isDue(card)) {
      dueCards.push(cardId)
    }
  }
  
  return dueCards
}

function getMotivationalMessage(streak: number): string {
  if (streak === 0) return "Ready to start your learning journey?"
  if (streak < 3) return "Great start! Keep the momentum going!"
  if (streak < 7) return `${streak} day streak! You're building a habit!`
  if (streak < 14) return "Impressive dedication! Keep it up!"
  return `Legendary! ${streak} days and counting!`
}

export function useDashboardStats(): DashboardStats & {
  getTopicProgress: (topicId: string) => MasteryProgress | null
  getTopicDueCount: (topicId: string) => number
  getSortedTopics: TopicWithProgress[]
  motivationalMessage: string
} {
  const { data: topics, isLoading, error } = useTopicsQuery()
  
  const [learnerState, setLearnerState] = useState(() => learnerStore.get())
  
  useEffect(() => {
    const subscription = learnerStore.subscribe((state) => {
      setLearnerState(state)
    })
    return () => subscription.unsubscribe()
  }, [])

  const streak = useMemo(() => learnerState.streak, [learnerState.streak])
  const totalXP = useMemo(() => learnerState.xp, [learnerState.xp])

  const completedCount = useMemo(() => {
    if (!topics) return 0
    return topics.filter(topic => {
      const mastery = learnerState.topics[topic.id]
      return mastery && mastery.masteredQuestions >= topic.questionCount
    }).length
  }, [topics, learnerState.topics])

  const totalTopics = useMemo(() => topics?.length || 0, [topics])

  const totalDue = useMemo(() => {
    if (!topics) return 0
    return topics.reduce((sum, topic) => {
      const dueCards = getDueCards(topic.id)
      return sum + dueCards.length
    }, 0)
  }, [topics])

  const topicsWithDue = useMemo(() => {
    if (!topics) return 0
    return topics.filter(topic => getDueCards(topic.id).length > 0).length
  }, [topics])

  const getTopicProgress = useMemo(() => {
    return (topicId: string): MasteryProgress | null => {
      const topic = topics?.find(t => t.id === topicId)
      if (!topic) return null
      const mastery = learnerState.topics[topicId]
      if (!mastery) return null
      return getMasteryProgress(mastery)
    }
  }, [topics, learnerState.topics])

  const getTopicDueCount = useMemo(() => {
    return (topicId: string): number => {
      return getDueCards(topicId).length
    }
  }, [])

  const getSortedTopics = useMemo(() => {
    if (!topics) return []
    return topics
      .map(topic => {
        const mastery = learnerState.topics[topic.id]
        const masteryProgress = mastery ? getMasteryProgress(mastery) : null
        const dueCount = getDueCards(topic.id).length
        return { ...topic, masteryProgress, dueCount } as TopicWithProgress
      })
      .sort((a, b) => {
        const levelA = a.masteryProgress?.level || 0
        const levelB = b.masteryProgress?.level || 0
        if (levelB !== levelA) return levelB - levelA
        if (b.dueCount !== a.dueCount) return b.dueCount - a.dueCount
        return a.title.localeCompare(b.title)
      })
  }, [topics, learnerState.topics])

  return {
    topics,
    isLoading,
    error,
    streak,
    totalXP,
    completedCount,
    totalTopics,
    totalDue,
    topicsWithDue,
    getTopicProgress,
    getTopicDueCount,
    getSortedTopics,
    motivationalMessage: getMotivationalMessage(streak),
  }
}
