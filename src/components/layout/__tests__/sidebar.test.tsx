import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Sidebar } from '../sidebar'

describe('Sidebar', () => {
  it('renders without errors', () => {
    const { container } = render(<Sidebar />)
    
    expect(container.querySelector('aside')).toBeInTheDocument()
  })

  it('applies collapsed class when collapsed prop is true', () => {
    const { container } = render(<Sidebar collapsed={true} />)
    
    const aside = container.querySelector('aside')
    expect(aside).toHaveClass('w-16')
  })

  it('applies expanded class when collapsed prop is false', () => {
    const { container } = render(<Sidebar collapsed={false} />)
    
    const aside = container.querySelector('aside')
    expect(aside).toHaveClass('w-64')
  })

  it('renders navigation items', () => {
    const { getByText } = render(<Sidebar collapsed={false} />)
    
    expect(getByText('Dashboard')).toBeInTheDocument()
    expect(getByText('Progress')).toBeInTheDocument()
    expect(getByText('Settings')).toBeInTheDocument()
    expect(getByText('User Profile')).toBeInTheDocument()
  })

  it('hides text when collapsed', () => {
    const { queryByText } = render(<Sidebar collapsed={true} />)
    
    expect(queryByText('Dashboard')).not.toBeInTheDocument()
    expect(queryByText('Progress')).not.toBeInTheDocument()
    expect(queryByText('Settings')).not.toBeInTheDocument()
    expect(queryByText('User Profile')).not.toBeInTheDocument()
  })
})