import { useEffect } from 'react'
import { useLocation } from 'wouter'
import { Lock, Brain, TrendingUp, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { OnboardingLayout } from '@/components/layout/onboarding-layout'
import { OnboardingProgress } from '@/components/ui/onboarding-progress'
import { learnerActions } from '@/store/learnerStore'

const ONBOARDING_TITLES = {
  welcome: 'JadiMikir - Mulai Perjalanan Belajarmu',
  subject: 'JadiMikir - Pilih Subjek',
  diagnostic: 'JadiMikir - Tes Penempatan',
  results: 'JadiMikir - Hasil Tes Penempatan',
} as const

const FEATURES = [
  {
    icon: Lock,
    title: 'Datamu milikmu sepenuhnya',
    description: 'Tidak ada akun. Tidak ada data yang dikirim ke server.',
  },
  {
    icon: Brain,
    title: 'Belajar seperti punya tutor pribadi',
    description: 'Algoritma FSRS menyesuaikan jadwal belajar dengan pemahamanmu.',
  },
  {
    icon: TrendingUp,
    title: 'Lihat kemajuan yang nyata',
    description: 'Mastery, XP, dan streak membuat progres terasa berwujud.',
  },
]

export function OnboardingWelcome() {
  const [, setLocation] = useLocation()

  useEffect(() => {
    document.title = ONBOARDING_TITLES.welcome
    learnerActions.setOnboardingStep('welcome')
  }, [])

  return (
    <OnboardingLayout>
      <div className="flex flex-col gap-8">
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-foreground">JadiMikir</h1>
          <p className="mt-2 text-muted-foreground">Belajar lebih cerdas. Tanpa akun. Tanpa server.</p>
        </div>

        <div className="flex flex-col gap-6 rounded-lg border border-border bg-surface-raised p-6">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10">
                <feature.icon className="size-5 text-primary" aria-hidden />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-medium text-foreground">{feature.title}</span>
                <span className="text-sm text-muted-foreground">{feature.description}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <OnboardingProgress currentStep={1} totalSteps={4} />

          <Button className="w-full" onClick={() => setLocation('/onboarding/subject')}>
            Mulai
            <ArrowRight className="ml-2 size-4" aria-hidden />
          </Button>
        </div>
      </div>
    </OnboardingLayout>
  )
}
