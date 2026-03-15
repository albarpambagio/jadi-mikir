import { learnerStore } from '@/store/learnerStore'
import type { Topic, TopicMastery } from '@/types'
import { calculateMasteryLevel } from './mastery'

export interface RemediationRecommendation {
  topicId: string
  topicName: string
  reason: string
  priority: number
  questionsToReview: number
}

export interface FailedTopicAnalysis {
  topicId: string
  topicName: string
  failureCount: number
  weaknessAreas: string[]
  recommendedQuestions: number
}

const WEAKNESS_THRESHOLD = 0.6

export function analyzeFailedQuestion(
  questionId: string,
  topicId: string,
  topics: Topic[]
): FailedTopicAnalysis | null {
  const state = learnerStore.getState()
  const topic = topics.find(t => t.id === topicId)
  
  if (!topic) return null
  
  const recentFailures = state.reviewLogs
    .filter(log => log.questionId === questionId && log.rating === 'again')
    .slice(-5)
  
  return {
    topicId,
    topicName: topic.title,
    failureCount: recentFailures.length,
    weaknessAreas: [],
    recommendedQuestions: Math.min(5, Math.max(2, recentFailures.length + 1)),
  }
}

export function getPrerequisiteWeaknesses(
  topicId: string,
  topics: Topic[]
): RemediationRecommendation[] {
  const state = learnerStore.getState()
  const topic = topics.find(t => t.id === topicId)
  
  if (!topic || !topic.prerequisites) return []
  
  const recommendations: RemediationRecommendation[] = []
  
  for (const prereqId of topic.prerequisites) {
    const prereq = topics.find(t => t.id === prereqId)
    const mastery = state.topics[prereqId]
    
    if (!prereq || !mastery) {
      recommendations.push({
        topicId: prereqId,
        topicName: prereq?.title || prereqId,
        reason: 'Prerequisite not started',
        priority: 1,
        questionsToReview: 5,
      })
      continue
    }
    
    const level = calculateMasteryLevel(mastery)
    
    if (level < 3) {
      const masteryRatio = mastery.masteredQuestions / mastery.totalQuestions
      
      recommendations.push({
        topicId: prereqId,
        topicName: prereq.title,
        reason: `Mastery at ${Math.round(masteryRatio * 100)}% (level ${level})`,
        priority: Math.max(1, 3 - level),
        questionsToReview: Math.ceil((0.6 - masteryRatio) * mastery.totalQuestions * 2),
      })
    }
  }
  
  return recommendations.sort((a, b) => a.priority - b.priority)
}

export function getTargetedRemediation(
  failedQuestionId: string,
  topicId: string,
  topics: Topic[]
): RemediationRecommendation[] {
  const prereqRecs = getPrerequisiteWeaknesses(topicId, topics)
  
  const topicRec: RemediationRecommendation = {
    topicId,
    topicName: topics.find(t => t.id === topicId)?.title || topicId,
    reason: 'Direct topic practice needed',
    priority: 2,
    questionsToReview: 3,
  }
  
  return [topicRec, ...prereqRecs]
}

export function getAllWeakTopics(
  topics: Topic[],
  threshold: number = WEAKNESS_THRESHOLD
): RemediationRecommendation[] {
  const state = learnerStore.getState()
  const recommendations: RemediationRecommendation[] = []
  
  for (const topic of topics) {
    const mastery = state.topics[topic.id]
    
    if (!mastery) {
      recommendations.push({
        topicId: topic.id,
        topicName: topic.title,
        reason: 'Not started',
        priority: 5,
        questionsToReview: 5,
      })
      continue
    }
    
    const ratio = mastery.masteredQuestions / mastery.totalQuestions
    const level = calculateMasteryLevel(mastery)
    
    if (ratio < threshold || level < 3) {
      recommendations.push({
        topicId: topic.id,
        topicName: topic.title,
        reason: `Mastery at ${Math.round(ratio * 100)}%`,
        priority: Math.max(1, Math.ceil((threshold - ratio) * 10)),
        questionsToReview: Math.ceil((threshold - ratio) * mastery.totalQuestions),
      })
    }
  }
  
  return recommendations.sort((a, b) => a.priority - b.priority)
}
