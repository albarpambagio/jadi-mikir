import { useQuery } from '@tanstack/react-query'
import type { Topic, Question } from '../types'
import { validateContent } from './validation'

const CONTENT_BASE = '/content'

async function fetchJSON<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}`)
  }
  return response.json()
}

export const content = {
  async getTopics(): Promise<Topic[]> {
    const data = await fetchJSON<Topic[]>(`${CONTENT_BASE}/topics.json`)
    const results = data.map((t) => validateContent.topic(t))
    
    const errors = results.flatMap((r) => r.errors)
    if (errors.length > 0) {
      console.warn('Topic validation warnings:', errors)
    }
    
    return results.map((r) => r.data!).filter(Boolean)
  },

  async getTopic(topicId: string): Promise<Topic | null> {
    const topics = await this.getTopics()
    return topics.find((t) => t.id === topicId) || null
  },

  async getQuestions(topicId?: string): Promise<Question[]> {
    const data = await fetchJSON<Question[]>(`${CONTENT_BASE}/questions.json`)
    const results = data.map((q) => validateContent.question(q))
    
    const errors = results.flatMap((r) => r.errors)
    if (errors.length > 0) {
      console.warn('Question validation warnings:', errors)
    }
    
    const validQuestions = results.map((r) => r.data!).filter(Boolean)
    
    if (topicId) {
      return validQuestions.filter((q) => q.topicId === topicId)
    }
    
    return validQuestions
  },

  async getQuestion(questionId: string): Promise<Question | null> {
    const questions = await this.getQuestions()
    return questions.find((q) => q.id === questionId) || null
  },

  async getQuestionsByTopic(topicId: string): Promise<Question[]> {
    return this.getQuestions(topicId)
  },
}

export function useTopicsQuery() {
  return useQuery({
    queryKey: ['content', 'topics'],
    queryFn: content.getTopics,
  })
}

export function useTopicQuery(topicId: string) {
  return useQuery({
    queryKey: ['content', 'topic', topicId],
    queryFn: () => content.getTopic(topicId),
    enabled: !!topicId,
  })
}

export function useQuestionsQuery(topicId?: string) {
  return useQuery({
    queryKey: ['content', 'questions', topicId ?? 'all'],
    queryFn: () => content.getQuestions(topicId),
  })
}

export function useQuestionQuery(questionId: string) {
  return useQuery({
    queryKey: ['content', 'question', questionId],
    queryFn: () => content.getQuestion(questionId),
    enabled: !!questionId,
  })
}
