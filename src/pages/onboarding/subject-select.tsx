import { useState } from 'react'
import { useLocation } from 'wouter'
import { ArrowRight, ArrowLeft, BookOpen, Microscope, FileText, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { OnboardingLayout } from '@/components/layout/onboarding-layout'
import { learnerActions } from '@/store/learnerStore'
import { cn } from '@/lib/utils'

interface SubjectOption {
  id: string
  name: string
  description: string
  icon: typeof BookOpen
  enabled: boolean
  topicCount: number
}

const SUBJECTS: SubjectOption[] = [
  {
    id: 'Matematika',
    name: 'Matematika',
    description: 'Aljabar, geometri, trigonometri',
    icon: BookOpen,
    enabled: true,
    topicCount: 42,
  },
  {
    id: 'IPA',
    name: 'IPA SMP',
    description: 'Fisika, kimia, biologi',
    icon: Microscope,
    enabled: false,
    topicCount: 0,
  },
  {
    id: 'Bahasa Indonesia',
    name: 'Bahasa Indonesia',
    description: 'Tata bahasa, menulis, sastra',
    icon: FileText,
    enabled: false,
    topicCount: 0,
  },
  {
    id: 'English',
    name: 'Bahasa Inggris',
    description: 'Vocabulary, grammar, conversation',
    icon: Globe,
    enabled: false,
    topicCount: 0,
  },
]

export function OnboardingSubjectSelect() {
  const [, setLocation] = useLocation()
  const [selectedSubject, setSelectedSubject] = useState('Matematika')

  const handleContinue = () => {
    learnerActions.setSelectedSubject(selectedSubject)
    setLocation('/onboarding/diagnostic')
  }

  return (
    <OnboardingLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Pilih topik yang ingin kamu pelajari</h1>
          <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            <span>Step 2 dari 4</span>
            <span>•</span>
            <div className="flex gap-1">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <div className="h-2 w-2 rounded-full bg-primary" />
              <div className="h-2 w-2 rounded-full bg-border" />
              <div className="h-2 w-2 rounded-full bg-border" />
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          Kamu bisa ganti ini kapan saja di Pengaturan.
        </p>

        <div className="flex flex-col gap-3">
          {SUBJECTS.map((subject) => {
            const Icon = subject.icon
            const isSelected = selectedSubject === subject.id
            const isDisabled = !subject.enabled

            return (
              <button
                key={subject.id}
                type="button"
                disabled={isDisabled}
                onClick={() => subject.enabled && setSelectedSubject(subject.id)}
                className={cn(
                  'flex items-center gap-4 rounded-lg border p-4 text-left transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                  isSelected && 'border-primary bg-primary/5',
                  !isSelected && !isDisabled && 'border-border bg-surface-raised hover:bg-neutral-50',
                  isDisabled && 'cursor-not-allowed opacity-50'
                )}
              >
                <div
                  className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-md',
                    isSelected ? 'bg-primary/10' : 'bg-neutral-100'
                  )}
                >
                  <Icon
                    className={cn('size-5', isSelected ? 'text-primary' : 'text-muted-foreground')}
                    aria-hidden
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{subject.name}</span>
                    {isSelected && (
                      <span className="text-xs text-primary">(Aktif)</span>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {subject.enabled
                      ? `${subject.description} · ${subject.topicCount} topik`
                      : 'Segera hadir'}
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        <div className="flex gap-3">
          <Button
            variant="secondary"
            className="flex-1 sm:flex-none"
            onClick={() => setLocation('/onboarding')}
          >
            <ArrowLeft className="mr-2 size-4" aria-hidden />
            Kembali
          </Button>
          <Button className="flex-1 sm:flex-none" onClick={handleContinue}>
            Lanjut
            <ArrowRight className="ml-2 size-4" aria-hidden />
          </Button>
        </div>
      </div>
    </OnboardingLayout>
  )
}
