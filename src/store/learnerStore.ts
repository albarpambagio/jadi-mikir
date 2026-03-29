import { createStore } from '@tanstack/store'
import { loadState, saveState } from '@/lib/storage'
import type { CardState, ReviewLog, TopicMastery, LearnerState } from '@/types'

export interface LearnerActions {
  addXP: (amount: number) => void
  updateStreak: () => void
  createCard: (cardId: string, questionId: string) => void
  updateCard: (cardId: string, card: Partial<CardState>) => void
  addReviewLog: (log: ReviewLog) => void
  updateTopicMastery: (topicId: string, mastery: Partial<TopicMastery>) => void
  initializeTopicMastery: (topicId: string, totalQuestions: number) => void
  /** Remove topic mastery, all cards for question IDs, and review logs for those questions. */
  resetTopic: (topicId: string, questionIds: string[]) => void
  setState: (state: Partial<LearnerState>) => void
  /** Mark onboarding as completed and set selected subject */
  completeOnboarding: (subject: string) => void
  /** Set the selected subject during onboarding */
  setSelectedSubject: (subject: string) => void
}

const defaultState: LearnerState = {
  id: '',
  xp: 0,
  streak: 0,
  streakGoalDays: 30,
  masteryGateThresholdPercent: 70,
  lastPracticeDate: null,
  hasCompletedOnboarding: false,
  selectedSubject: null,
  topics: {},
  cards: {},
  reviewLogs: [],
}

export const learnerStore = createStore(loadState(defaultState))

// Persist every state change to localStorage so data survives page refresh
learnerStore.subscribe((state) => {
  saveState(state)
})

export const learnerActions: LearnerActions = {
  addXP: (amount) => {
    learnerStore.setState((state) => ({
      ...state,
      xp: state.xp + amount,
    }))
  },

  updateStreak: () => {
    const today = new Date().toDateString()
    learnerStore.setState((state) => {
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      const isConsecutive = state.lastPracticeDate === yesterday
      const alreadyPracticedToday = state.lastPracticeDate === today

      return {
        ...state,
        lastPracticeDate: today,
        streak: alreadyPracticedToday ? state.streak : isConsecutive ? state.streak + 1 : 1,
      }
    })
  },

  createCard: (cardId, questionId) => {
    const newCard: CardState = {
      due: new Date().toISOString(),
      stability: 0,
      difficulty: 0,
      elapsedDays: 0,
      scheduledDays: 0,
      reps: 0,
      lapses: 0,
      state: 'new',
    }
    learnerStore.setState((state) => ({
      ...state,
      cards: {
        ...state.cards,
        [cardId]: newCard,
      },
    }))
  },

  updateCard: (cardId, card) => {
    learnerStore.setState((state) => ({
      ...state,
      cards: {
        ...state.cards,
        [cardId]: {
          ...state.cards[cardId],
          ...card,
        },
      },
    }))
  },

  addReviewLog: (log) => {
    learnerStore.setState((state) => ({
      ...state,
      reviewLogs: [...state.reviewLogs, log],
    }))
  },

  updateTopicMastery: (topicId, mastery) => {
    learnerStore.setState((state) => ({
      ...state,
      topics: {
        ...state.topics,
        [topicId]: {
          ...state.topics[topicId],
          topicId,
          level: 0,
          totalQuestions: 0,
          masteredQuestions: 0,
          lastPracticed: null,
          nextDueDate: null,
          ...mastery,
        },
      },
    }))
  },

  initializeTopicMastery: (topicId, totalQuestions) => {
    learnerStore.setState((state) => ({
      ...state,
      topics: {
        ...state.topics,
        [topicId]: {
          topicId,
          level: 0,
          totalQuestions,
          masteredQuestions: 0,
          lastPracticed: null,
          nextDueDate: null,
        },
      },
    }))
  },

  resetTopic: (topicId, questionIds) => {
    const qset = new Set(questionIds)
    learnerStore.setState((state) => {
      const topics = { ...state.topics }
      delete topics[topicId]

      const cards = { ...state.cards }
      const dropKeys = new Set<string>()
      for (const key of Object.keys(cards)) {
        for (const qid of questionIds) {
          if (key === `${qid}_card` || key.startsWith(`${qid}_`)) {
            dropKeys.add(key)
            break
          }
        }
      }
      for (const k of dropKeys) {
        delete cards[k]
      }

      const reviewLogs = state.reviewLogs.filter((log) => !qset.has(log.questionId))

      return { ...state, topics, cards, reviewLogs }
    })
  },

  setState: (newState) => {
    learnerStore.setState((state) => ({ ...state, ...newState }))
  },

  completeOnboarding: (subject) => {
    learnerStore.setState((state) => ({
      ...state,
      hasCompletedOnboarding: true,
      selectedSubject: subject,
    }))
  },

  setSelectedSubject: (subject) => {
    learnerStore.setState((state) => ({
      ...state,
      selectedSubject: subject,
    }))
  },
}

export function getState(): LearnerState {
  return learnerStore.get()
}
