import { learnerStore, learnerActions } from '@/store/learnerStore'

export interface XpReward {
  base: number
  streak: number
  mastery: number
  total: number
}

export interface StreakBonus {
  days: number
  multiplier: number
}

const XP_CONFIG = {
  correct: 10,
  incorrect: 2,
  streakBonus: [
    { days: 3, multiplier: 1.1 },
    { days: 7, multiplier: 1.25 },
    { days: 14, multiplier: 1.5 },
    { days: 30, multiplier: 2 },
    { days: 60, multiplier: 2.5 },
    { days: 100, multiplier: 3 },
  ],
  sessionCompletion: 50,
  perfectSession: 100,
  dailyPractice: 25,
}

export function calculateXpReward(isCorrect: boolean): XpReward {
  const state = learnerStore.getState()
  const base = isCorrect ? XP_CONFIG.correct : XP_CONFIG.incorrect
  
  const streakMultiplier = getStreakMultiplier(state.streak)
  
  const streakBonus = Math.floor(base * (streakMultiplier - 1))
  const masteryBonus = isCorrect ? Math.floor(base * 0.1) : 0
  
  return {
    base,
    streak: streakBonus,
    mastery: masteryBonus,
    total: base + streakBonus + masteryBonus,
  }
}

export function getStreakMultiplier(streakDays: number): number {
  let multiplier = 1
  
  for (const bonus of XP_CONFIG.streakBonus) {
    if (streakDays >= bonus.days) {
      multiplier = bonus.multiplier
    }
  }
  
  return multiplier
}

export function getStreakBonusForDays(days: number): StreakBonus | null {
  for (const bonus of XP_CONFIG.streakBonus) {
    if (days >= bonus.days) {
      return bonus
    }
  }
  return null
}

export function addXp(amount: number): void {
  learnerActions.addXP(amount)
}

export function awardSessionCompletionXp(questionsCorrect: number, totalQuestions: number): number {
  const state = learnerStore.getState()
  const isPerfect = questionsCorrect === totalQuestions
  const completionBonus = isPerfect ? XP_CONFIG.perfectSession : XP_CONFIG.sessionCompletion
  
  const totalXp = completionBonus + (questionsCorrect * 5)
  
  learnerActions.addXP(totalXp)
  
  return totalXp
}

export function awardDailyPracticeXp(): boolean {
  const state = learnerStore.getState()
  const today = new Date().toDateString()
  
  if (state.lastPracticeDate === today) {
    return false
  }
  
  learnerActions.addXP(XP_CONFIG.dailyPractice)
  return true
}

export function getXpToNextLevel(currentXp: number): { current: number; needed: number; progress: number } {
  const level = calculateLevel(currentXp)
  const currentLevelXp = getXpForLevel(level)
  const nextLevelXp = getXpForLevel(level + 1)
  
  const progress = ((currentXp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100
  
  return {
    current: currentXp - currentLevelXp,
    needed: nextLevelXp - currentXp,
    progress: Math.min(100, Math.max(0, progress)),
  }
}

export function calculateLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100))
}

export function getXpForLevel(level: number): number {
  return level * level * 100
}

export function getLevelName(level: number): string {
  const names = [
    'Novice',
    'Apprentice',
    'Student',
    'Learner',
    'Scholar',
    'Expert',
    'Master',
    'Grandmaster',
    'Legend',
  ]
  
  return names[Math.min(level, names.length - 1)] || 'Novice'
}

export { XP_CONFIG }
