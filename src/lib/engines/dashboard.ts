import { learnerStore } from '@/store/learnerStore'
import { calculateMasteryLevel, getMasteryProgress } from './mastery'
import type { TopicMastery, Topic, ReviewLog } from '@/types'

export interface DashboardStats {
  totalXp: number
  currentStreak: number
  longestStreak: number
  totalQuestionsAnswered: number
  totalTopicsStudied: number
  averageAccuracy: number
  currentLevel: number
  levelName: string
  xpToNextLevel: number
}

export interface TopicProgress {
  topicId: string
  topicName: string
  level: number
  levelName: string
  masteredQuestions: number
  totalQuestions: number
  percentage: number
  nextDueDate: string | null
}

export interface SessionStats {
  todayQuestions: number
  todayCorrect: number
  weekQuestions: number[]
  streakHistory: number[]
}

export interface PerformanceMetrics {
  accuracyByDifficulty: Record<string, { total: number; correct: number }>
  averageTimePerQuestion: number
  weakestTopics: TopicProgress[]
  strongestTopics: TopicProgress[]
}

export function getDashboardStats(): DashboardStats {
  const state = learnerStore.get()
  
  const totalQuestionsAnswered = state.reviewLogs.length
  const correctAnswers = state.reviewLogs.filter(r => r.rating !== 'again').length
  const averageAccuracy = totalQuestionsAnswered > 0 
    ? (correctAnswers / totalQuestionsAnswered) * 100 
    : 0
  
  const level = Math.floor(Math.sqrt(state.xp / 100))
  const xpForCurrentLevel = level * level * 100
  const xpForNextLevel = (level + 1) * (level + 1) * 100
  const xpToNextLevel = xpForNextLevel - state.xp
  
  const levelNames = [
    'Novice', 'Apprentice', 'Student', 'Learner', 
    'Scholar', 'Expert', 'Master', 'Grandmaster', 'Legend'
  ]
  
  return {
    totalXp: state.xp,
    currentStreak: state.streak,
    longestStreak: state.streak,
    totalQuestionsAnswered,
    totalTopicsStudied: Object.keys(state.topics).length,
    averageAccuracy: Math.round(averageAccuracy),
    currentLevel: level,
    levelName: levelNames[Math.min(level, levelNames.length - 1)],
    xpToNextLevel,
  }
}

export function getTopicProgress(topics: Topic[]): TopicProgress[] {
  const state = learnerStore.get()
  
  return topics.map(topic => {
    const mastery = state.topics[topic.id]
    
    if (!mastery) {
      return {
        topicId: topic.id,
        topicName: topic.title,
        level: 0,
        levelName: 'New',
        masteredQuestions: 0,
        totalQuestions: topic.questionCount,
        percentage: 0,
        nextDueDate: null,
      }
    }
    
    const progress = getMasteryProgress(mastery)
    const level = calculateMasteryLevel(mastery)
    
    return {
      topicId: topic.id,
      topicName: topic.title,
      level,
      levelName: progress.levelName,
      masteredQuestions: mastery.masteredQuestions,
      totalQuestions: mastery.totalQuestions,
      percentage: progress.percentage,
      nextDueDate: mastery.nextDueDate,
    }
  })
}

export function getSessionStats(): SessionStats {
  const state = learnerStore.get()
  const today = new Date().toDateString()
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  
  const todayLogs = state.reviewLogs.filter(
    log => new Date(log.reviewDate).toDateString() === today
  )
  const todayCorrect = todayLogs.filter(r => r.rating !== 'again').length
  
  const weekQuestions: number[] = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dayLogs = state.reviewLogs.filter(
      log => new Date(log.reviewDate).toDateString() === date.toDateString()
    )
    weekQuestions.push(dayLogs.length)
  }
  
  const streakHistory: number[] = []
  let currentStreak = state.streak
  for (let i = 0; i < 30; i++) {
    streakHistory.push(currentStreak)
  }
  
  return {
    todayQuestions: todayLogs.length,
    todayCorrect,
    weekQuestions,
    streakHistory,
  }
}

export function getPerformanceMetrics(topics: Topic[]): PerformanceMetrics {
  const state = learnerStore.get()
  
  const accuracyByDifficulty: Record<string, { total: number; correct: number }> = {
    easy: { total: 0, correct: 0 },
    medium: { total: 0, correct: 0 },
    hard: { total: 0, correct: 0 },
  }
  
  let totalTime = 0
  let questionCount = 0
  
  const topicAccuracy: Map<string, { total: number; correct: number }> = new Map()
  
  for (const log of state.reviewLogs) {
    const isCorrect = log.rating !== 'again'
    
    const topic = topics.find(t => 
      t.id === log.questionId.split('_')[0] || 
      t.questionCount > 0
    )
    
    if (topic) {
      const current = topicAccuracy.get(topic.id) || { total: 0, correct: 0 }
      current.total++
      if (isCorrect) current.correct++
      topicAccuracy.set(topic.id, current)
    }
  }
  
  const topicProgress = getTopicProgress(topics)
  const sortedByAccuracy = topicProgress.sort((a, b) => a.percentage - b.percentage)
  
  return {
    accuracyByDifficulty,
    averageTimePerQuestion: questionCount > 0 ? totalTime / questionCount : 0,
    weakestTopics: sortedByAccuracy.slice(0, 3),
    strongestTopics: sortedByAccuracy.slice(-3).reverse(),
  }
}

export function getMotivationalMessage(): string {
  const stats = getDashboardStats()
  
  if (stats.currentStreak === 0) {
    return "Ready to start your learning journey?"
  } else if (stats.currentStreak < 3) {
    return "Great start! Keep the momentum going!"
  } else if (stats.currentStreak < 7) {
    return `${stats.currentStreak} day streak! You're building a habit!`
  } else if (stats.currentStreak < 14) {
    return "Impressive dedication! Keep it up!"
  } else {
    return `Legendary! ${stats.currentStreak} days and counting!`
  }
}
