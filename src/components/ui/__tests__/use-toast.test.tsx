import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useToast } from '../use-toast'

describe('useToast', () => {
  it('should not cause infinite loop', () => {
    const { result } = renderHook(() => useToast())
    
    // Should not throw or hang
    expect(result.current.toasts).toEqual([])
    
    // Should be able to add toast without infinite loop
    act(() => {
      result.current.toast({ title: 'Test' })
    })
    
    expect(result.current.toasts.length).toBe(1)
  })

  it('should update toast state correctly', () => {
    const { result } = renderHook(() => useToast())
    
    act(() => {
      result.current.toast({ title: 'Test Toast', description: 'Test Description' })
    })
    
    expect(result.current.toasts[0].title).toBe('Test Toast')
    expect(result.current.toasts[0].description).toBe('Test Description')
  })

  it('should dismiss toast correctly', () => {
    const { result } = renderHook(() => useToast())
    
    let toastId: string
    act(() => {
      const toast = result.current.toast({ title: 'Test' })
      toastId = toast.id
    })
    
    expect(result.current.toasts.length).toBe(1)
    
    act(() => {
      result.current.dismiss(toastId!)
    })
    
    // Toast should be marked as dismissed (open: false)
    expect(result.current.toasts[0].open).toBe(false)
  })
})