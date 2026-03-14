import { v4 as uuidv4 } from 'uuid'
import type { CardState, Rating, ReviewLog } from '@/types'

const DEFAULT_BASE_EASE = 2.5

export function ratingToMultiplier(rating: Rating): { interval: number; ease: number } {
  const multipliers = {
    again: { interval: 0.5, ease: -0.2 },
    hard: { interval: 1.2, ease: -0.15 },
    good: { interval: 2.5, ease: 0 },
    easy: { interval: 4, ease: 0.15 },
  }
  return multipliers[rating]
}

export function processReview(
  currentCard: CardState,
  questionId: string,
  rating: Rating
): { nextCard: CardState; reviewLog: ReviewLog } {
  const { interval, ease } = ratingToMultiplier(rating)
  
  let newDifficulty = currentCard.difficulty + ease
  newDifficulty = Math.max(1.3, Math.min(10, newDifficulty))
  
  let newStability: number
  if (rating === 'again') {
    newStability = Math.max(0, currentCard.stability * 0.5)
  } else {
    newStability = currentCard.stability + (1 + (11 - newDifficulty) / 10) * (interval - 1)
    newStability = Math.max(0, newStability)
  }
  
  const newScheduledDays = Math.max(1, Math.round(currentCard.scheduledDays * interval))
  
  const now = new Date()
  const due = new Date(now.getTime() + newScheduledDays * 24 * 60 * 60 * 1000)
  
  const nextCard: CardState = {
    due: due.toISOString(),
    stability: newStability,
    difficulty: newDifficulty,
    elapsedDays: currentCard.elapsedDays + 1,
    scheduledDays: newScheduledDays,
    reps: currentCard.reps + 1,
    lapses: rating === 'again' ? currentCard.lapses + 1 : currentCard.lapses,
    state: rating === 'again' ? 'relearning' : 'review',
  }
  
  const reviewLog: ReviewLog = {
    cardId: `${questionId}_card`,
    questionId,
    rating,
    due: due.toISOString(),
    stability: newStability,
    difficulty: newDifficulty,
    elapsedDays: currentCard.elapsedDays + 1,
    scheduledDays: newScheduledDays,
    reviewDate: new Date().toISOString(),
  }
  
  return { nextCard, reviewLog }
}

export function getNextDueDate(card: CardState): Date {
  return new Date(card.due)
}

export function isDue(card: CardState): boolean {
  return new Date(card.due) <= new Date()
}

export function getDueCards(cards: Record<string, CardState>): CardState[] {
  return Object.values(cards).filter(isDue)
}

export function createNewCard(questionId: string): { cardId: string; state: CardState } {
  const cardId = `${questionId}_${uuidv4().slice(0, 8)}`
  const now = new Date().toISOString()
  
  return {
    cardId,
    state: {
      due: now,
      stability: 0,
      difficulty: DEFAULT_BASE_EASE,
      elapsedDays: 0,
      scheduledDays: 0,
      reps: 0,
      lapses: 0,
      state: 'new' as const,
    },
  }
}
