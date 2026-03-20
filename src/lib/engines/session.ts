import { learnerStore, learnerActions } from '@/store/learnerStore'
import { isDue } from './fsrs'
import type { Question, Rating } from '@/types'
import { processReview, createNewCard } from './fsrs'

export interface SessionConfig {
  maxQuestions: number
  newQuestionsLimit: number
  reviewLimit: number
}

const DEFAULT_CONFIG: SessionConfig = {
  maxQuestions: 20,
  newQuestionsLimit: 5,
  reviewLimit: 15,
}

export interface Session {
  id: string
  topicId: string
  questions: Question[]
  currentIndex: number
  answers: Map<string, string>
  startTime: Date
  endTime: Date | null
  xpEarned: number
}

let currentSession: Session | null = null

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function selectQuestionsForSession(
  questions: Question[],
  config: SessionConfig = DEFAULT_CONFIG
): Question[] {
  const state = learnerStore.get()
  const now = new Date()

  const newQuestions: Question[] = []
  const reviewQuestions: Question[] = []

  for (const question of questions) {
    const cardId = `${question.id}_card`
    const card = state.cards[cardId]

    if (!card) {
      newQuestions.push(question)
    } else if (isDue(card)) {
      reviewQuestions.push(question)
    }
  }

  const selectedNew = shuffleArray(newQuestions).slice(0, config.newQuestionsLimit)
  const selectedReview = shuffleArray(reviewQuestions).slice(0, config.reviewLimit)

  const interleaved = interleaveQuestions(selectedNew, selectedReview)

  return interleaved.slice(0, config.maxQuestions)
}

function interleaveQuestions(newQuestions: Question[], reviewQuestions: Question[]): Question[] {
  const result: Question[] = []
  let newIdx = 0
  let reviewIdx = 0

  while (newIdx < newQuestions.length || reviewIdx < reviewQuestions.length) {
    if (reviewIdx < reviewQuestions.length && (newIdx >= newQuestions.length || reviewIdx % 3 !== 0)) {
      result.push(reviewQuestions[reviewIdx++])
    } else if (newIdx < newQuestions.length) {
      result.push(newQuestions[newIdx++])
    }
  }

  return result
}

export function startSession(topicId: string, questions: Question[]): Session {
  const selectedQuestions = selectQuestionsForSession(questions)

  currentSession = {
    id: crypto.randomUUID(),
    topicId,
    questions: selectedQuestions,
    currentIndex: 0,
    answers: new Map(),
    startTime: new Date(),
    endTime: null,
    xpEarned: 0,
  }

  learnerActions.updateStreak()

  return currentSession
}

export function getCurrentQuestion(): Question | null {
  if (!currentSession) return null
  return currentSession.questions[currentSession.currentIndex] ?? null
}

export function submitAnswer(choiceId: string): void {
  if (!currentSession) return

  const question = currentSession.questions[currentSession.currentIndex]
  const isCorrect = question.choices.find(c => c.id === choiceId)?.isCorrect ?? false

  currentSession.answers.set(question.id, choiceId)

  const cardId = `${question.id}_card`
  const state = learnerStore.get()
  const existingCard = state.cards[cardId]

  if (!existingCard) {
    const { cardId: newCardId, state: newCardState } = createNewCard(question.id)
    learnerActions.createCard(newCardId, question.id)
  }

  const rating: Rating = isCorrect ? 'good' : 'hard'
  const currentCard = existingCard || state.cards[`${question.id}_card`]

  if (currentCard) {
    const { nextCard, reviewLog } = processReview(currentCard, question.id, rating)
    learnerActions.updateCard(cardId, nextCard)
    learnerActions.addReviewLog(reviewLog)
  }

  const xpGain = isCorrect ? 10 : 2
  currentSession.xpEarned += xpGain
  learnerActions.addXP(xpGain)
}

export function nextQuestion(): Question | null {
  if (!currentSession) return null

  currentSession.currentIndex++

  if (currentSession.currentIndex >= currentSession.questions.length) {
    return null
  }

  return currentSession.questions[currentSession.currentIndex]
}

export function endSession(): { xpEarned: number; questionsAnswered: number; duration: number } | null {
  if (!currentSession) return null

  currentSession.endTime = new Date()
  const duration = Math.floor((currentSession.endTime.getTime() - currentSession.startTime.getTime()) / 1000)

  const result = {
    xpEarned: currentSession.xpEarned,
    questionsAnswered: currentSession.answers.size,
    duration,
  }

  currentSession = null

  return result
}

export function getSessionProgress(): { current: number; total: number } | null {
  if (!currentSession) return null
  return {
    current: currentSession.currentIndex + 1,
    total: currentSession.questions.length,
  }
}

export function isSessionActive(): boolean {
  return currentSession !== null
}
