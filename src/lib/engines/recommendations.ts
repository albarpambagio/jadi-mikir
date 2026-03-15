import { learnerStore } from '@/store/learnerStore'
import type { Topic } from '@/types'
import { isDue } from './fsrs'

export interface TopicRecommendation {
  topic: Topic
  score: number
  reason: string
  priority: 'high' | 'medium' | 'low'
  questionsDue: number
  masteryPercentage: number
  estimatedMinutes: number
}

export interface OverallRecommendation {
  streakAtRisk: boolean
  streakDays: number
  message: string
  recommendations: TopicRecommendation[]
}

const WEIGHTS = {
  dueReviews: 0.30,
  streakRisk: 0.25,
  masteryGap: 0.20,
  recentActivity: 0.15,
  difficultyBalance: 0.10,
}

export function getRecommendations(topics: Topic[]): OverallRecommendation {
  const state = learnerStore.getState()
  const now = new Date()
  
  const topicScores: TopicRecommendation[] = []
  
  const dueByTopic = new Map<string, number>()
  for (const [cardId, card] of Object.entries(state.cards)) {
    if (isDue(card)) {
      const topicId = cardId.split('_')[0]
      dueByTopic.set(topicId, (dueByTopic.get(topicId) || 0) + 1)
    }
  }
  
  for (const topic of topics) {
    const mastery = state.topics[topic.id]
    const questionsDue = dueByTopic.get(topic.id) || 0
    const masteryPercentage = mastery 
      ? (mastery.masteredQuestions / mastery.totalQuestions) * 100 
      : 0
    
    const dueScore = Math.min(questionsDue * 20, 100)
    
    const masteryGapScore = masteryPercentage < 60 
      ? (60 - masteryPercentage) * 1.5 
      : masteryPercentage >= 80 ? 20 : 40
    
    const recentActivity = mastery?.lastPracticed
      ? Math.max(0, 30 - Math.floor((now.getTime() - new Date(mastery.lastPracticed).getTime()) / (1000 * 60 * 60 * 24)))
      : 50
    
    const difficultyScore = topic.difficulty === 'intermediate' ? 70 : 50
    
    const totalScore = 
      (dueScore * WEIGHTS.dueReviews) +
      (masteryGapScore * WEIGHTS.masteryGap) +
      (recentActivity * WEIGHTS.recentActivity) +
      (difficultyScore * WEIGHTS.difficultyBalance)
    
    let reason = ''
    let priority: 'high' | 'medium' | 'low' = 'low'
    
    if (questionsDue > 0) {
      reason = `${questionsDue} question${questionsDue > 1 ? 's' : ''} due for review`
      priority = 'high'
    } else if (masteryPercentage < 40) {
      reason = `${Math.round(100 - masteryPercentage)}% to reach mastery`
      priority = 'high'
    } else if (masteryPercentage < 80) {
      reason = `${Math.round(masteryPercentage)}% mastery - keep practicing`
      priority = 'medium'
    } else {
      reason = 'Maintain your progress'
      priority = 'low'
    }
    
    topicScores.push({
      topic,
      score: Math.round(totalScore),
      reason,
      priority,
      questionsDue,
      masteryPercentage: Math.round(masteryPercentage),
      estimatedMinutes: Math.max(5, questionsDue + 3),
    })
  }
  
  topicScores.sort((a, b) => b.score - a.score)
  
  const streakAtRisk = state.streak > 0 && state.streak < 3
  const streakDays = state.streak
  
  let message = ''
  if (streakAtRisk) {
    message = `⚠️ Your ${streakDays}-day streak is at risk! Practice now to keep it alive.`
  } else if (streakDays >= 7) {
    message = `🔥 Amazing! ${streakDays}-day streak! Keep the momentum going!`
  } else if (streakDays > 0) {
    message = `💪 ${streakDays} day streak! You're building a habit.`
  } else {
    message = 'Start your learning journey today!'
  }
  
  return {
    streakAtRisk,
    streakDays,
    message,
    recommendations: topicScores.slice(0, 3),
  }
}

export function getRecommendedTopic(topics: Topic[]): Topic | null {
  const { recommendations } = getRecommendations(topics)
  return recommendations[0]?.topic || null
}
