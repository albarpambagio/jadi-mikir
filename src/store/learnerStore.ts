import { v4 as uuidv4 } from 'uuid'
import { loadState, saveState } from '@/lib/storage'
import type { LearnerState, TopicMastery, CardState, ReviewLog } from '@/types'

const DEFAULT_FSRS_BASE_EASE = 2.5

const createInitialState = (): LearnerState => ({
  id: uuidv4(),
  xp: 0,
  streak: 0,
  lastPracticeDate: null,
  topics: {},
  cards: {},
  reviewLogs: [],
})

let currentState = loadState(createInitialState())

const listeners = new Set<() => void>()

function notify() {
  listeners.forEach(listener => listener())
  saveState(currentState)
}

export const learnerStore = {
  getState: () => currentState,
  
  setState: (updater: (state: LearnerState) => LearnerState) => {
    currentState = updater(currentState)
    notify()
  },
  
  subscribe: (listener: () => void) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
}

export const learnerActions = {
  addXP: (amount: number) => {
    learnerStore.setState((state) => ({
      ...state,
      xp: state.xp + amount,
    }))
  },

  updateStreak: () => {
    learnerStore.setState((state) => {
      const today = new Date().toDateString()
      const lastPractice = state.lastPracticeDate
      
      if (!lastPractice) {
        return { ...state, streak: 1, lastPracticeDate: today }
      }
      
      const lastDate = new Date(lastPractice)
      const todayDate = new Date(today)
      const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (diffDays === 0) {
        return state
      }
      
      if (diffDays === 1) {
        return { ...state, streak: state.streak + 1, lastPracticeDate: today }
      }
      
      return { ...state, streak: 1, lastPracticeDate: today }
    })
  },

  initializeTopicMastery: (topicId: string, totalQuestions: number) => {
    learnerStore.setState((state) => {
      if (state.topics[topicId]) {
        return state
      }
      return {
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
      }
    })
  },

  updateTopicMastery: (topicId: string, updates: Partial<TopicMastery>) => {
    learnerStore.setState((state) => ({
      ...state,
      topics: {
        ...state.topics,
        [topicId]: {
          ...state.topics[topicId],
          ...updates,
        },
      },
    }))
  },

  createCard: (cardId: string, _questionId: string) => {
    learnerStore.setState((state) => {
      if (state.cards[cardId]) {
        return state
      }
      
      const now = new Date().toISOString()
      return {
        ...state,
        cards: {
          ...state.cards,
          [cardId]: {
            due: now,
            stability: 0,
            difficulty: DEFAULT_FSRS_BASE_EASE,
            elapsedDays: 0,
            scheduledDays: 0,
            reps: 0,
            lapses: 0,
            state: 'new' as const,
          },
        },
      }
    })
  },

  updateCard: (cardId: string, updates: Partial<CardState>) => {
    learnerStore.setState((state) => ({
      ...state,
      cards: {
        ...state.cards,
        [cardId]: {
          ...state.cards[cardId],
          ...updates,
        },
      },
    }))
  },

  addReviewLog: (log: ReviewLog) => {
    learnerStore.setState((state) => ({
      ...state,
      reviewLogs: [...state.reviewLogs.slice(-999), log],
    }))
  },

  getTopicsByMastery: () => {
    const state = learnerStore.getState()
    return Object.values(state.topics).sort((a, b) => b.level - a.level)
  },

  getDueCards: (topicId?: string) => {
    const state = learnerStore.getState()
    const now = new Date()
    
    return Object.entries(state.cards)
      .filter(([cardId, card]) => {
        if (topicId && !cardId.startsWith(topicId)) {
          return false
        }
        return new Date(card.due) <= now
      })
      .map(([cardId, card]) => ({ cardId, ...card }))
  },
}
