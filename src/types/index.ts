import { z } from 'zod'

export const TopicSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  subject: z.string().min(1),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  prerequisites: z.array(z.string()).default([]),
  questionCount: z.number().int().positive(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
})

export type Topic = z.infer<typeof TopicSchema>

export const ChoiceSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1).max(500),
  isCorrect: z.boolean(),
})

export type Choice = z.infer<typeof ChoiceSchema>

export const QuestionSchema = z.object({
  id: z.string().min(1),
  topicId: z.string().min(1),
  stem: z.string().min(1).max(1000),
  choices: z.array(ChoiceSchema).min(2).max(6),
  explanation: z.string().max(2000).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
  tags: z.array(z.string()).default([]),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
})

export type Question = z.infer<typeof QuestionSchema>

export const validateQuestion = (data: unknown): Question => {
  return QuestionSchema.parse(data)
}

export const validateQuestions = (data: unknown[]): Question[] => {
  return z.array(QuestionSchema).parse(data)
}

export const CardStateSchema = z.object({
  due: z.string().datetime(),
  stability: z.number().min(0),
  difficulty: z.number().min(0),
  elapsedDays: z.number().min(0),
  scheduledDays: z.number().min(0),
  reps: z.number().min(0),
  lapses: z.number().min(0),
  state: z.enum(['new', 'learning', 'review', 'relearning']),
})

export type CardState = z.infer<typeof CardStateSchema>

export const ReviewLogSchema = z.object({
  cardId: z.string().min(1),
  questionId: z.string().min(1),
  rating: z.enum(['again', 'hard', 'good', 'easy']),
  due: z.string().datetime(),
  stability: z.number().min(0),
  difficulty: z.number().min(0),
  elapsedDays: z.number().min(0),
  scheduledDays: z.number().min(0),
  reviewDate: z.string().datetime(),
})

export type ReviewLog = z.infer<typeof ReviewLogSchema>

export interface LearnerState {
  id: string
  xp: number
  streak: number
  /** Monthly streak goal (days); shown on session complete; default 30; Settings TBD. */
  streakGoalDays: number
  lastPracticeDate: string | null
  topics: Record<string, TopicMastery>
  cards: Record<string, CardState>
  reviewLogs: ReviewLog[]
}

export interface TopicMastery {
  topicId: string
  level: number
  totalQuestions: number
  masteredQuestions: number
  lastPracticed: string | null
  nextDueDate: string | null
}

export type MasteryLevel = 0 | 1 | 2 | 3 | 4 | 5

export const MASTERY_LEVELS: Record<MasteryLevel, { name: string; threshold: number; description: string }> = {
  0: { name: 'New', threshold: 0, description: 'Not yet started' },
  1: { name: 'Learning', threshold: 0.2, description: 'Just beginning' },
  2: { name: 'Familiar', threshold: 0.4, description: 'Some familiarity' },
  3: { name: 'Competent', threshold: 0.6, description: 'Good understanding' },
  4: { name: 'Proficient', threshold: 0.8, description: 'Strong grasp' },
  5: { name: 'Mastered', threshold: 1.0, description: 'Full mastery' },
}

export interface SessionState {
  isActive: boolean
  topicId: string | null
  questions: string[]
  currentIndex: number
  answers: Record<string, string>
  startTime: string | null
  xpEarned: number
}

export type Rating = 'again' | 'hard' | 'good' | 'easy'

export interface ContentManifest {
  version: string
  topics: string[]
  lastUpdated: string
}
