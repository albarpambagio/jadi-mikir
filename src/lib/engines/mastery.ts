import { MASTERY_LEVELS, type MasteryLevel, type TopicMastery, type Rating } from '@/types'

export interface MasteryConfig {
  questionsPerLevel: number
  passingScore: number
}

const DEFAULT_CONFIG: MasteryConfig = {
  questionsPerLevel: 4,
  passingScore: 0.75,
}

export function calculateMasteryLevel(
  topic: TopicMastery,
  config: MasteryConfig = DEFAULT_CONFIG
): MasteryLevel {
  if (topic.masteredQuestions === 0) {
    return 0
  }
  
  const ratio = topic.masteredQuestions / topic.totalQuestions
  
  if (ratio >= MASTERY_LEVELS[5].threshold) return 5
  if (ratio >= MASTERY_LEVELS[4].threshold) return 4
  if (ratio >= MASTERY_LEVELS[3].threshold) return 3
  if (ratio >= MASTERY_LEVELS[2].threshold) return 2
  if (ratio >= MASTERY_LEVELS[1].threshold) return 1
  return 0
}

export function canAccessTopic(
  topicId: string,
  prerequisites: string[],
  allTopics: Record<string, TopicMastery>
): boolean {
  for (const prereqId of prerequisites) {
    const prereq = allTopics[prereqId]
    if (!prereq || calculateMasteryLevel(prereq) < 3) {
      return false
    }
  }
  return true
}

export function calculateMasteryGain(
  rating: Rating,
  previousMastery: number
): number {
  const ratingMultipliers: Record<Rating, number> = {
    again: -0.1,
    hard: 0.05,
    good: 0.1,
    easy: 0.15,
  }
  
  const gain = ratingMultipliers[rating]
  return Math.max(0, Math.min(1, previousMastery + gain))
}

export function getMasteryProgress(topic: TopicMastery): {
  current: number
  target: number
  percentage: number
  level: MasteryLevel
  levelName: string
} {
  const level = calculateMasteryLevel(topic)
  const threshold = MASTERY_LEVELS[level].threshold
  const nextThreshold = level < 5 ? MASTERY_LEVELS[level + 1].threshold : 1
  
  const ratio = topic.masteredQuestions / topic.totalQuestions
  const current = ratio
  const next = nextThreshold
  
  let percentage: number
  if (level === 5) {
    percentage = 100
  } else {
    percentage = ((current - threshold) / (next - threshold)) * 100
  }
  
  return {
    current: Math.round(current * 100),
    target: Math.round(next * 100),
    percentage: Math.round(percentage),
    level,
    levelName: MASTERY_LEVELS[level].name,
  }
}

export function isGatePassed(
  topic: TopicMastery,
  requiredLevel: MasteryLevel = 3
): boolean {
  const currentLevel = calculateMasteryLevel(topic)
  return currentLevel >= requiredLevel
}

export function getGateRecommendation(
  topic: TopicMastery,
  requiredLevel: MasteryLevel = 3
): {
  passed: boolean
  missing: number
  recommendation: string
} {
  const currentLevel = calculateMasteryLevel(topic)
  
  if (currentLevel >= requiredLevel) {
    return {
      passed: true,
      missing: 0,
      recommendation: 'You have passed this gate!',
    }
  }
  
  const currentMastered = topic.masteredQuestions
  const neededAtLevel = Math.ceil(requiredLevel * topic.totalQuestions * 0.2)
  const missing = Math.max(0, neededAtLevel - currentMastered)
  
  return {
    passed: false,
    missing,
    recommendation: `Master ${missing} more questions to pass this gate`,
  }
}
