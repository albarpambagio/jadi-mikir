import { render } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MainLayout } from '../main-layout'

describe('MainLayout', () => {
  it('renders without performance monitoring', () => {
    const consoleSpy = vi.spyOn(console, 'log')
    
    render(<MainLayout>Test Content</MainLayout>)
    
    // Should not log render count
    expect(consoleSpy).not.toHaveBeenCalledWith(
      expect.stringContaining('MainLayout render #')
    )
    
    consoleSpy.mockRestore()
  })

  it('renders children correctly', () => {
    const { getByText } = render(<MainLayout><div>Test Content</div></MainLayout>)
    
    expect(getByText('Test Content')).toBeInTheDocument()
  })

  it('has sidebar and header', () => {
    const { container } = render(<MainLayout>Test Content</MainLayout>)
    
    // Should have sidebar (aside element)
    expect(container.querySelector('aside')).toBeInTheDocument()
    
    // Should have header (header element)
    expect(container.querySelector('header')).toBeInTheDocument()
  })
})