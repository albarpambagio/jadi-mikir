import { useEffect, useState, useMemo } from 'react'
import { useLocation } from 'wouter'
import { CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { OnboardingLayout } from '@/components/layout/onboarding-layout'
import { OnboardingProgress } from '@/components/ui/onboarding-progress'
import { learnerActions, learnerStore } from '@/store/learnerStore'
import { SKIP_THRESHOLD } from '@/lib/onboarding-config'
import { useTopicsQuery } from '@/lib/content'
import type { Topic, Question } from '@/types'

interface DiagnosticAnswer {
  questionId: string
  topicId: string
  selectedChoice: string
  isCorrect: boolean
}

interface DiagnosticResults {
  answers: DiagnosticAnswer[]
  skipped: boolean
}

interface TopicResult {
  topic: Topic
  correct: number
  total: number
  percent: number
  status: 'skipped' | 'learning'
}

function calculateTimeEstimate(skippedTopics: number, totalTopics: number): string {
  if (skippedTopics === 0) {
    return '~8–10 minggu (20 menit/hari)'
  }
  if (skippedTopics >= 3) {
    return '~6–8 minggu (20 menit/hari)'
  }
  return '~7–9 minggu (20 menit/hari)'
}

export function OnboardingResults() {
  const [, setLocation] = useLocation()
  const { data: topics, isLoading: topicsLoading } = useTopicsQuery()

  const [results, setResults] = useState<DiagnosticResults | null>(null)

  useEffect(() => {
    document.title = 'JadiMikir - Hasil Tes Penempatan'
    const state = learnerStore.get()
    if (state.onboardingStep !== 'diagnostic' && state.onboardingStep !== 'results') {
      setLocation('/onboarding/subject')
      return
    }
    learnerActions.setOnboardingStep('results')
  }, [setLocation])

  useEffect(() => {
    const stored = sessionStorage.getItem('diagnosticResults')
    if (stored) {
      setResults(JSON.parse(stored))
    } else {
      setResults({ answers: [], skipped: true })
    }
  }, [])

  const subject = learnerStore.get().selectedSubject || 'Matematika'

  const topicResults = useMemo(() => {
    if (!topics || !results) return []

    const foundational = topics
      .filter((t) => t.subject === subject && t.prerequisites.length === 0)
      .slice(0, 4)

    if (results.skipped) {
      return foundational.map((topic) => ({
        topic,
        correct: 0,
        total: 0,
        percent: 0,
        status: 'learning' as const,
      }))
    }

    return foundational.map((topic) => {
      const topicAnswers = results.answers.filter((a) => a.topicId === topic.id)
      const correct = topicAnswers.filter((a) => a.isCorrect).length
      const total = topicAnswers.length
      const percent = total > 0 ? Math.round((correct / total) * 100) : 0

      const isSkipped = total >= SKIP_THRESHOLD.MIN_ANSWERS && correct >= SKIP_THRESHOLD.MIN_CORRECT

      return {
        topic,
        correct,
        total,
        percent,
        status: isSkipped ? 'skipped' : 'learning' as const,
      }
    })
  }, [topics, results])

  const skippedCount = topicResults.filter((r) => r.status === 'skipped').length
  const learningCount = topicResults.filter((r) => r.status === 'learning').length

  const handleStart = () => {
  const subject = learnerStore.get().selectedSubject || 'Matematika'
    learnerActions.completeOnboarding(subject)
    sessionStorage.removeItem('diagnosticResults')
    setLocation('/')
  }

  if (topicsLoading || !results) {
    return (
      <OnboardingLayout>
        <div className="flex h-64 items-center justify-center">
          <div className="text-muted-foreground">Memuat...</div>
        </div>
      </OnboardingLayout>
    )
  }

  return (
    <OnboardingLayout>
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setLocation('/onboarding/diagnostic')}
            className="flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-1 size-4" aria-hidden />
            Kembali
          </button>
          <OnboardingProgress currentStep={4} totalSteps={4} />
        </div>

        <div className="text-center">
          <div className="flex justify-center">
            <CheckCircle className="size-16 text-success" aria-hidden />
          </div>
          <h1 className="mt-4 text-xl font-semibold text-foreground">Tes penempatan selesai!</h1>
        </div>

        {results.skipped ? (
          <div className="rounded-lg border border-border bg-surface-raised p-6 text-center">
            <p className="text-foreground">
              Kamu memilih untuk mulai dari awal. Semua topik tersedia.
            </p>
          </div>
        ) : (
          <>
            <div className="rounded-lg border border-border bg-surface-raised p-6 text-center">
              <p className="text-foreground">
                {skippedCount > 0
                  ? `Kamu bisa melewati ${skippedCount} topik — menghemat sekitar ${skippedCount * 7} hari belajar.`
                  : 'Selamat! Kamu siap memulai dari awal.'}
              </p>
              {topicResults.length > 0 && topicResults[0].status === 'skipped' && (
                <p className="mt-2 text-sm text-muted-foreground">
                  Ini titik mulaimu: {topicResults.find((r) => r.status === 'learning')?.topic.title || topicResults[0].topic.title}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-4">
              <h2 className="text-sm font-medium text-muted-foreground">Detail penempatan</h2>
              <div className="rounded-lg border border-border bg-surface-raised overflow-hidden">
                <div className="grid grid-cols-2 gap-4 border-b border-border bg-neutral-50 p-3 text-sm font-medium text-muted-foreground">
                  <div>Sudah dikuasai (dilewati)</div>
                  <div>Akan dipelajari</div>
                </div>
                <div className="flex flex-col">
                  {topicResults.map((result, index) => (
                    <div
                      key={result.topic.id}
                      className={`flex justify-between p-3 text-sm ${
                        index < topicResults.length - 1 ? 'border-b border-border' : ''
                      }`}
                    >
                      {result.status === 'skipped' ? (
                        <>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="size-4 text-success" aria-hidden />
                            <span className="text-foreground">{result.topic.title}</span>
                          </div>
                          <div className="text-muted-foreground">—</div>
                        </>
                      ) : (
                        <>
                          <div className="text-muted-foreground">—</div>
                          <div className="text-foreground">
                            → {result.topic.title}
                            {index === learningCount - 1 && ' (mulai)'}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                  <div className="flex justify-between border-t border-border bg-neutral-50 p-3 text-sm">
                    <div className="text-muted-foreground">{skippedCount} topik dilewati</div>
                    <div className="text-muted-foreground">→ {Math.max(0, (topics?.length ?? 0) - skippedCount)} topik tersisa</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {!results.skipped && (
          <p className="text-center text-sm text-muted-foreground">
            Estimasi untuk menguasai seluruh track: {calculateTimeEstimate(skippedCount, 24)}
            <br />
            (dihitung berdasarkan hasil tes penempatan kamu)
          </p>
        )}

        <Button className="w-full" onClick={handleStart}>
          Mulai Belajar
          <ArrowRight className="ml-2 size-4" aria-hidden />
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          Preferensi sesi harian dapat diubah kapan saja di Pengaturan.
        </p>
      </div>
    </OnboardingLayout>
  )
}
