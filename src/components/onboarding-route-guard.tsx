import { useEffect } from 'react'
import { useLocation } from 'wouter'
import { learnerStore } from '@/store/learnerStore'

interface OnboardingRouteGuardProps {
  children: React.ReactNode
}

export function OnboardingRouteGuard({ children }: OnboardingRouteGuardProps) {
  const [, setLocation] = useLocation()

  useEffect(() => {
    const state = learnerStore.get()
    if (state.hasCompletedOnboarding) {
      setLocation('/')
    }
  }, [setLocation])

  return <>{children}</>
}
