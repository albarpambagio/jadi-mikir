import { learnerStore, learnerActions } from '@/store/learnerStore'
import type { Question, Topic } from '@/types'

export interface DiagnosticResult {
  topicId: string
  placementLevel: 'beginner' | 'intermediate' | 'advanced'
  confidence: number
  questionsAnswered: number
  correctCount: number
  recommendedMasteryTarget: number
}

export interface DiagnosticQuestion {
  question: Question
  difficulty: 'easy' | 'medium' | 'hard'
}

const DIAGNOSTIC_CONFIG = {
  questionsPerTopic: 5,
  easyThreshold: 0.8,
  intermediateThreshold: 0.6,
  minConfidence: 0.7,
}

export function selectDiagnosticQuestions(
  topic: Topic,
  questions: Question[],
  count: number = DIAGNOSTIC_CONFIG.questionsPerTopic
): DiagnosticQuestion[] {
  const byDifficulty = {
    easy: questions.filter(q => q.difficulty === 'easy').slice(0, 2),
    medium: questions.filter(q => q.difficulty === 'medium').slice(0, 2),
    hard: questions.filter(q => q.difficulty === 'hard').slice(0, 1),
  }
  
  const selected: DiagnosticQuestion[] = []
  
  const difficultyOrder: ('easy' | 'medium' | 'hard')[] = ['easy', 'medium', 'hard']
  
  for (let i = 0; i < count; i++) {
    const difficulty = difficultyOrder[i % 3]
    const pool = byDifficulty[difficulty]
    if (pool.length > 0) {
      selected.push({ question: pool.shift()!, difficulty })
    }
  }
  
  return selected
}

export function calculatePlacement(
  topicId: string,
  answers: Map<string, boolean>
): DiagnosticResult {
  const state = learnerStore.get()
  const entries = Array.from(answers.entries())
  const correctCount = entries.filter(([, correct]) => correct).length
  const total = entries.length
  const ratio = total > 0 ? correctCount / total : 0
  
  let placementLevel: 'beginner' | 'intermediate' | 'advanced'
  let recommendedMasteryTarget: number
  
  if (ratio >= DIAGNOSTIC_CONFIG.easyThreshold) {
    placementLevel = 'advanced'
    recommendedMasteryTarget = 0.8
  } else if (ratio >= DIAGNOSTIC_CONFIG.intermediateThreshold) {
    placementLevel = 'intermediate'
    recommendedMasteryTarget = 0.6
  } else {
    placementLevel = 'beginner'
    recommendedMasteryTarget = 0.4
  }
  
  const confidence = Math.min(1, total / DIAGNOSTIC_CONFIG.questionsPerTopic)
  
  return {
    topicId,
    placementLevel,
    confidence,
    questionsAnswered: total,
    correctCount,
    recommendedMasteryTarget,
  }
}

export function applyDiagnosticPlacement(
  result: DiagnosticResult,
  totalQuestions: number
): void {
  let initialMastery: number
  
  switch (result.placementLevel) {
    case 'advanced':
      initialMastery = Math.floor(totalQuestions * 0.6)
      break
    case 'intermediate':
      initialMastery = Math.floor(totalQuestions * 0.3)
      break
    default:
      initialMastery = 0
  }
  
  learnerActions.initializeTopicMastery(result.topicId, totalQuestions)
  learnerActions.updateTopicMastery(result.topicId, {
    masteredQuestions: initialMastery,
  })
}

export function shouldRunDiagnostic(topicId: string): boolean {
  const state = learnerStore.get()
  const mastery = state.topics[topicId]
  
  if (!mastery) return true
  if (mastery.masteredQuestions === 0) return true
  
  return false
}

export function getDiagnosticRecommendations(
  result: DiagnosticResult,
  topics: Topic[]
): string[] {
  const recommendations: string[] = []
  
  if (result.placementLevel === 'beginner') {
    recommendations.push('Start with foundational concepts')
    recommendations.push('Take your time with each question')
  } else if (result.placementLevel === 'intermediate') {
    recommendations.push('Good baseline knowledge detected')
    recommendations.push('Focus on strengthening weak areas')
  } else {
    recommendations.push('Strong foundation detected')
    recommendations.push('You can skip basic drills and focus on advanced problems')
  }
  
  return recommendations
}
