import { useMemo, useState, useEffect } from 'react'
import { useTopicsQuery } from '@/lib/content'
import { learnerStore, learnerActions } from '@/store/learnerStore'
import { getMasteryProgress } from '@/lib/engines/mastery'
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

export function useDashboardStats(): DashboardStats & {
  getTopicProgress: (topicId: string) => MasteryProgress | null
  getTopicDueCount: (topicId: string) => number
  getSortedTopics: TopicWithProgress[]
} {
  const { data: topics, isLoading, error } = useTopicsQuery()
  
  // Subscribe to learnerStore changes
  const [learnerState, setLearnerState] = useState(() => learnerStore.getState())
  
  useEffect(() => {
    const unsubscribe = learnerStore.subscribe(() => {
      setLearnerState(learnerStore.getState())
    })
    return () => {
      unsubscribe()
    }
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
      const dueCards = learnerActions.getDueCards(topic.id)
      return sum + dueCards.length
    }, 0)
  }, [topics])

  const topicsWithDue = useMemo(() => {
    if (!topics) return 0
    return topics.filter(topic => learnerActions.getDueCards(topic.id).length > 0).length
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
      return learnerActions.getDueCards(topicId).length
    }
  }, [])

  const getSortedTopics = useMemo(() => {
    if (!topics) return []
    return topics
      .map(topic => {
        const mastery = learnerState.topics[topic.id]
        const masteryProgress = mastery ? getMasteryProgress(mastery) : null
        const dueCount = learnerActions.getDueCards(topic.id).length
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
  }
}
