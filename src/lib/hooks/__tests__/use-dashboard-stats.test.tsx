import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { useDashboardStats } from '../use-dashboard-stats'
import { learnerStore, learnerActions } from '@/store/learnerStore'

describe('useDashboardStats', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    const initialState = learnerStore.getState()
    learnerStore.setState(() => ({
      ...initialState,
      xp: 0,
      streak: 0,
      topics: {},
      cards: {},
    }))
  })

  it('should subscribe to store changes', () => {
    const { result } = renderHook(() => useDashboardStats())
    
    const initialXP = result.current.totalXP
    
    // Update store
    act(() => {
      learnerActions.addXP(100)
    })
    
    // Should reflect the update
    expect(result.current.totalXP).toBe(initialXP + 100)
  })

  it('should update streak when store changes', () => {
    const { result } = renderHook(() => useDashboardStats())
    
    const initialStreak = result.current.streak
    
    // Update streak
    act(() => {
      learnerActions.updateStreak()
    })
    
    // Streak should increment
    expect(result.current.streak).toBe(initialStreak + 1)
  })

  it('should return correct stats structure', () => {
    const { result } = renderHook(() => useDashboardStats())
    
    expect(result.current).toHaveProperty('topics')
    expect(result.current).toHaveProperty('isLoading')
    expect(result.current).toHaveProperty('error')
    expect(result.current).toHaveProperty('streak')
    expect(result.current).toHaveProperty('totalXP')
    expect(result.current).toHaveProperty('completedCount')
    expect(result.current).toHaveProperty('totalTopics')
    expect(result.current).toHaveProperty('totalDue')
    expect(result.current).toHaveProperty('topicsWithDue')
    expect(result.current).toHaveProperty('getTopicProgress')
    expect(result.current).toHaveProperty('getTopicDueCount')
    expect(result.current).toHaveProperty('getSortedTopics')
  })
})