import React from 'react'

interface OnboardingLayoutProps {
  children: React.ReactNode
}

export function OnboardingLayout({ children }: OnboardingLayoutProps) {
  return (
    <div className="bg-background min-h-screen flex items-center justify-center">
      <div className="w-full max-w-lg px-6 py-12">{children}</div>
    </div>
  )
}
