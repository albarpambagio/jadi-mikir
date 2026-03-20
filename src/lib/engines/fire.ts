import { learnerStore } from '@/store/learnerStore'
import { isDue } from './fsrs'
import type { Topic, Question } from '@/types'

export interface FireConfig {
  retrievalRatio: number
  maxRetrievalPerBlock: number
  includeRelatedTopics: boolean
}

const DEFAULT_CONFIG: FireConfig = {
  retrievalRatio: 0.3,
  maxRetrievalPerBlock: 3,
  includeRelatedTopics: true,
}

export interface FireBlock {
  type: 'retrieval' | 'study'
  questions: Question[]
  topicId: string
}

export interface RetrievalCandidate {
  question: Question
  priority: number
  reason: string
}

export function getRetrievalCandidates(
  topic: Topic,
  allQuestions: Question[],
  limit: number = 10
): RetrievalCandidate[] {
  const state = learnerStore.get()
  const candidates: RetrievalCandidate[] = []

  const topicQuestions = allQuestions.filter(q => q.topicId === topic.id)

  for (const q of topicQuestions) {
    const cardId = `${q.id}_card`
    const card = state.cards[cardId]

    if (!card) {
      candidates.push({
        question: q,
        priority: 1,
        reason: 'New question - not yet learned',
      })
      continue
    }

    if (isDue(card)) {
      const overdueDays = Math.floor(
        (Date.now() - new Date(card.due).getTime()) / (1000 * 60 * 60 * 24)
      )
      candidates.push({
        question: q,
        priority: 10 + overdueDays,
        reason: `Due for review (${overdueDays} days overdue)`,
      })
      continue
    }

    const recentFailures = state.reviewLogs.filter(
      log => log.questionId === q.id && log.rating === 'again'
    ).length

    if (recentFailures > 0) {
      candidates.push({
        question: q,
        priority: 5 + recentFailures,
        reason: `Struggled previously (${recentFailures} failures)`,
      })
    }
  }

  return candidates
    .sort((a, b) => b.priority - a.priority)
    .slice(0, limit)
}

export function getRelatedTopics(
  topic: Topic,
  allTopics: Topic[]
): Topic[] {
  const related: Topic[] = []

  for (const t of allTopics) {
    if (t.id === topic.id) continue

    if (topic.prerequisites?.includes(t.id)) {
      related.push(t)
    }

    if (t.prerequisites?.includes(topic.id)) {
      related.push(t)
    }
  }

  return related
}

export function buildFireSession(
  primaryTopic: Topic,
  allTopics: Topic[],
  allQuestions: Question[],
  config: FireConfig = DEFAULT_CONFIG
): FireBlock[] {
  const blocks: FireBlock[] = []
  
  const primaryQuestions = allQuestions.filter(q => q.topicId === primaryTopic.id)
  const retrievalCandidates = getRetrievalCandidates(primaryTopic, allQuestions)
  
  const retrievalQuestions = retrievalCandidates
    .slice(0, config.maxRetrievalPerBlock)
    .map(c => c.question)
  
  const studyQuestions = primaryQuestions.filter(
    q => !retrievalQuestions.includes(q)
  )

  let retrievalIndex = 0
  let studyIndex = 0
  let blockIndex = 0

  while (retrievalIndex < retrievalQuestions.length || studyIndex < studyQuestions.length) {
    const isRetrievalBlock = blockIndex % Math.ceil(1 / config.retrievalRatio) === 0

    if (isRetrievalBlock && retrievalIndex < retrievalQuestions.length) {
      const blockSize = Math.min(
        config.maxRetrievalPerBlock,
        retrievalQuestions.length - retrievalIndex
      )
      blocks.push({
        type: 'retrieval',
        questions: retrievalQuestions.slice(retrievalIndex, retrievalIndex + blockSize),
        topicId: primaryTopic.id,
      })
      retrievalIndex += blockSize
    } else if (studyIndex < studyQuestions.length) {
      const blockSize = Math.min(5, studyQuestions.length - studyIndex)
      blocks.push({
        type: 'study',
        questions: studyQuestions.slice(studyIndex, studyIndex + blockSize),
        topicId: primaryTopic.id,
      })
      studyIndex += blockSize
    }

    blockIndex++
  }

  if (config.includeRelatedTopics) {
    const related = getRelatedTopics(primaryTopic, allTopics)
    
    for (const relatedTopic of related.slice(0, 2)) {
      const relatedRetrieval = getRetrievalCandidates(relatedTopic, allQuestions, 2)
      
      if (relatedRetrieval.length > 0) {
        blocks.push({
          type: 'retrieval',
          questions: relatedRetrieval.map(c => c.question),
          topicId: relatedTopic.id,
        })
      }
    }
  }

  return blocks
}

export function selectFireQuestions(
  topic: Topic,
  allTopics: Topic[],
  allQuestions: Question[],
  targetCount: number = 20
): Question[] {
  const blocks = buildFireSession(topic, allTopics, allQuestions)

  const result: Question[] = []
  for (const block of blocks) {
    result.push(...block.questions)
    if (result.length >= targetCount) break
  }

  return result.slice(0, targetCount)
}

export function getFireStats(): {
  retrievalCount: number
  studyCount: number
  averagePriority: number
} {
  const state = learnerStore.get()
  
  const retrievalLogs = state.reviewLogs.filter(log => 
    log.rating !== 'again'
  ).length

  return {
    retrievalCount: retrievalLogs,
    studyCount: state.reviewLogs.length - retrievalLogs,
    averagePriority: 5,
  }
}
