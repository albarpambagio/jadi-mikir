import { learnerStore } from '@/store/learnerStore'
import { isDue } from './fsrs'
import type { Topic, Question } from '@/types'

export interface TopicDependency {
  topicId: string
  prerequisites: string[]
}

export interface InterleavingConfig {
  maxNewPerTopic: number
  maxReviewPerTopic: number
  topicSwitchInterval: number
  allowMultiTopic: boolean
}

const DEFAULT_CONFIG: InterleavingConfig = {
  maxNewPerTopic: 3,
  maxReviewPerTopic: 5,
  topicSwitchInterval: 3,
  allowMultiTopic: true,
}

export function getTopicDependencies(topics: Topic[]): Map<string, string[]> {
  const deps = new Map<string, string[]>()
  
  for (const topic of topics) {
    deps.set(topic.id, topic.prerequisites || [])
  }
  
  return deps
}

export function buildTopicGraph(topics: Topic[]): Map<string, string[]> {
  return getTopicDependencies(topics)
}

export function topologicalSort(topics: Topic[]): Topic[] {
  const graph = getTopicDependencies(topics)
  const visited = new Set<string>()
  const result: Topic[] = []
  
  function visit(topicId: string) {
    if (visited.has(topicId)) return
    visited.add(topicId)
    
    const prereqs = graph.get(topicId) || []
    for (const prereq of prereqs) {
      visit(prereq)
    }
    
    const topic = topics.find(t => t.id === topicId)
    if (topic) result.push(topic)
  }
  
  for (const topic of topics) {
    visit(topic.id)
  }
  
  return result
}

export function selectQuestionsForMultiTopicSession(
  allTopics: Topic[],
  allQuestions: Question[],
  config: InterleavingConfig = DEFAULT_CONFIG
): Question[] {
  const state = learnerStore.get()
  const now = new Date()
  
  const availableTopics = allTopics.filter(topic => {
    const mastery = state.topics[topic.id]
    if (!mastery) return true
    return mastery.level < 5
  })
  
  const topicQuestions: Map<string, { new: Question[]; review: Question[] }> = new Map()
  
  for (const topic of availableTopics) {
    const topicQs = allQuestions.filter(q => q.topicId === topic.id)
    const newQs: Question[] = []
    const reviewQs: Question[] = []
    
    for (const q of topicQs) {
      const cardId = `${q.id}_card`
      const card = state.cards[cardId]
      
      if (!card) {
        newQs.push(q)
      } else if (isDue(card)) {
        reviewQs.push(q)
      }
    }
    
    topicQuestions.set(topic.id, {
      new: newQs.slice(0, config.maxNewPerTopic),
      review: reviewQs.slice(0, config.maxReviewPerTopic),
    })
  }
  
  const interleaved = interleaveMultipleTopics(topicQuestions, config)
  
  return interleaved
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function interleaveMultipleTopics(
  topicQuestions: Map<string, { new: Question[]; review: Question[] }>,
  config: InterleavingConfig
): Question[] {
  const result: Question[] = []
  const topics = shuffleArray(Array.from(topicQuestions.keys()))
  
  let topicIndex = 0
  let questionCount = 0
  const maxQuestions = 20
  
  while (result.length < maxQuestions) {
    const topicId = topics[topicIndex]
    const questions = topicQuestions.get(topicId)
    
    if (!questions) {
      topicIndex = (topicIndex + 1) % topics.length
      continue
    }
    
    let selected: Question | undefined
    
    if (questionCount % config.topicSwitchInterval === 0 && questions.review.length > 0) {
      selected = questions.review.shift()
    } else if (questions.new.length > 0) {
      selected = questions.new.shift()
    } else if (questions.review.length > 0) {
      selected = questions.review.shift()
    }
    
    if (selected) {
      result.push(selected)
      questionCount++
    }
    
    topicIndex = (topicIndex + 1) % topics.length
    
    const remaining = Array.from(topicQuestions.values()).flatMap(q => [...q.new, ...q.review])
    if (remaining.length === 0) break
  }
  
  return result
}

export function getNonInterferingTopics(
  failedTopicId: string,
  allTopics: Topic[]
): Topic[] {
  const state = learnerStore.get()
  const failedTopic = allTopics.find(t => t.id === failedTopicId)
  
  if (!failedTopic) return []
  
  const prerequisiteIds = failedTopic.prerequisites || []
  const interferingTopics = new Set<string>(prerequisiteIds)
  
  for (const topic of allTopics) {
    if (topic.prerequisites?.includes(failedTopicId)) {
      interferingTopics.add(topic.id)
    }
  }
  
  return allTopics.filter(t => !interferingTopics.has(t.id))
}
