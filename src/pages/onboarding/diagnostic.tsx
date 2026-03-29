import { useState, useEffect, useCallback } from 'react'
import { useLocation } from 'wouter'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { OnboardingLayout } from '@/components/layout/onboarding-layout'
import { OnboardingProgress } from '@/components/ui/onboarding-progress'
import { useTopicsQuery, useQuestionsQuery } from '@/lib/content'
import { DIAGNOSTIC_CONFIG } from '@/lib/onboarding-config'
import { learnerActions, learnerStore } from '@/store/learnerStore'
import { cn } from '@/lib/utils'
import type { Question, Topic } from '@/types'

interface DiagnosticAnswer {
  questionId: string
  topicId: string
  selectedChoice: string
  isCorrect: boolean
}

function getFoundationalTopics(topics: Topic[], subject: string): Topic[] {
  return topics
    .filter((t) => t.subject === subject && t.prerequisites.length === 0)
    .slice(0, DIAGNOSTIC_CONFIG.FOUNDATIONAL_TOPICS_LIMIT)
}

function selectDiagnosticQuestions(
  topics: Topic[],
  questions: Question[],
  countPerTopic: number = DIAGNOSTIC_CONFIG.QUESTIONS_PER_TOPIC
): Question[] {
  const selected: Question[] = []
  for (const topic of topics) {
    const topicQuestions = questions
      .filter((q) => q.topicId === topic.id)
      .sort((a, b) => {
        const diffOrder = { easy: 0, medium: 1, hard: 2 }
        return diffOrder[a.difficulty] - diffOrder[b.difficulty]
      })
      .slice(0, countPerTopic)
    selected.push(...topicQuestions)
  }
  return selected
}

function getDisplayLetter(index: number): string {
  return String.fromCharCode(65 + index)
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function OnboardingDiagnostic() {
  const [, setLocation] = useLocation()
  const { data: topics, isLoading: topicsLoading, error: topicsError } = useTopicsQuery()
  const { data: allQuestions, isLoading: questionsLoading, error: questionsError } = useQuestionsQuery()

  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null)
  const [answers, setAnswers] = useState<DiagnosticAnswer[]>([])
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [randomizedChoices, setRandomizedChoices] = useState<Question['choices']>([])
  const [isComplete, setIsComplete] = useState(false)

  const subject = learnerStore.get().selectedSubject || 'Matematika'

  useEffect(() => {
    document.title = 'JadiMikir - Tes Penplacement'
    const state = learnerStore.get()
    if (state.onboardingStep !== 'subject' && state.onboardingStep !== 'diagnostic') {
      setLocation('/onboarding/subject')
      return
    }
    learnerActions.setOnboardingStep('diagnostic')
  }, [setLocation])

  useEffect(() => {
    if (topics && allQuestions && questions.length === 0) {
      const foundational = getFoundationalTopics(topics, subject)
      const selected = selectDiagnosticQuestions(foundational, allQuestions, 4)
      setQuestions(shuffleArray(selected))
    }
  }, [topics, allQuestions, questions.length])

  useEffect(() => {
    if (questions[currentIndex]) {
      setRandomizedChoices(shuffleArray(questions[currentIndex].choices))
      setSelectedChoice(null)
      setShowFeedback(false)
    }
  }, [currentIndex, questions])

  const currentQuestion = questions[currentIndex]

  const handleSelectChoice = (choiceId: string) => {
    if (showFeedback) return
    setSelectedChoice(choiceId)
  }

  const handleConfirm = () => {
    if (!selectedChoice || !currentQuestion) return

    const isCorrect = currentQuestion.choices.find((c) => c.id === selectedChoice)?.isCorrect ?? false

    const answer: DiagnosticAnswer = {
      questionId: currentQuestion.id,
      topicId: currentQuestion.topicId,
      selectedChoice,
      isCorrect,
    }

    const newAnswers = [...answers, answer]
    setAnswers(newAnswers)
    setShowFeedback(true)

    if (isCorrect) {
      const newConsecutive = consecutiveCorrect + 1
      setConsecutiveCorrect(newConsecutive)

      if (
        newConsecutive >= DIAGNOSTIC_CONFIG.CONSECUTIVE_CORRECT_TO_ADVANCE &&
        newAnswers.length < DIAGNOSTIC_CONFIG.MAX_QUESTIONS
      ) {
        setTimeout(() => finishDiagnostic(newAnswers), 1500)
        return
      }
    } else {
      setConsecutiveCorrect(0)
    }

    if (newAnswers.length >= DIAGNOSTIC_CONFIG.MAX_QUESTIONS) {
      setTimeout(() => finishDiagnostic(newAnswers), 1500)
    }
  }

  const finishDiagnostic = useCallback(
    (finalAnswers: DiagnosticAnswer[]) => {
      setAnswers(finalAnswers)
      setIsComplete(true)

      const resultsData = {
        answers: finalAnswers,
        skipped: false,
      }
      sessionStorage.setItem('diagnosticResults', JSON.stringify(resultsData))
      setLocation('/onboarding/results')
    },
    [setLocation]
  )

  const handleSkip = () => {
    const resultsData = {
      answers: [],
      skipped: true,
    }
    sessionStorage.setItem('diagnosticResults', JSON.stringify(resultsData))
    setLocation('/onboarding/results')
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1 && answers.length < DIAGNOSTIC_CONFIG.MAX_QUESTIONS) {
      setCurrentIndex((prev) => prev + 1)
    } else {
      finishDiagnostic(answers)
    }
  }

  const handleBack = () => {
    setLocation('/onboarding/subject')
  }

  if (topicsLoading || questionsLoading || !currentQuestion) {
    return (
      <OnboardingLayout>
        <div className="flex h-64 items-center justify-center">
          <div className="text-muted-foreground">Memuat...</div>
        </div>
      </OnboardingLayout>
    )
  }

  if (topicsError || questionsError) {
    return (
      <OnboardingLayout>
        <div className="flex h-64 flex-col items-center justify-center gap-4">
          <div className="text-center text-destructive">
            Gagal memuat konten. Silakan coba lagi.
          </div>
          <Button variant="secondary" onClick={() => window.location.reload()}>
            Muat Ulang
          </Button>
        </div>
      </OnboardingLayout>
    )
  }

  const correctCount = answers.filter((a) => a.isCorrect).length

  return (
    <OnboardingLayout>
      <div className="flex flex-col gap-6">
        <div>
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-4" aria-hidden />
              Kembali
            </button>
            <OnboardingProgress currentStep={3} totalSteps={4} />
          </div>
          <h1 className="mt-4 text-xl font-semibold text-foreground">Tes Penempatan Singkat</h1>
        </div>

        <div className="flex flex-col gap-2">
          <Progress value={(answers.length / DIAGNOSTIC_CONFIG.MAX_QUESTIONS) * 100} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{answers.length} soal dijawab</span>
            <span> hingga {DIAGNOSTIC_CONFIG.MAX_QUESTIONS} soal · Adaptif</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          Jawab beberapa soal supaya kami bisa melewati topik yang sudah kamu kuasai.
          Berhenti lebih awal jika levelmu sudah jelas.
        </p>

        <div className="flex flex-col gap-6">
          <div className="rounded-lg border border-border bg-surface-raised p-4">
            <p className="text-foreground leading-relaxed">{currentQuestion.stem}</p>
          </div>

          <div className="flex flex-col gap-3">
            {randomizedChoices.map((choice, index) => {
              const isSelected = selectedChoice === choice.id
              const showCorrect = showFeedback && choice.isCorrect
              const showWrong = showFeedback && isSelected && !choice.isCorrect

              return (
                <button
                  key={choice.id}
                  type="button"
                  disabled={showFeedback}
                  onClick={() => handleSelectChoice(choice.id)}
                  className={cn(
                    'flex items-center gap-3 rounded-lg border p-4 text-left transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                    isSelected && 'border-primary bg-primary/5',
                    showCorrect && 'border-success bg-success/10',
                    showWrong && 'border-destructive bg-destructive/10',
                    !isSelected && !showCorrect && !showWrong && 'border-border hover:bg-neutral-50'
                  )}
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded border text-sm font-medium">
                    {getDisplayLetter(index)}
                  </span>
                  <span className="text-foreground">{choice.text}</span>
                  {showFeedback && (
                    <span className="ml-auto text-xs">
                      {showCorrect && 'Benar'}
                      {showWrong && 'Jawabanmu'}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {showFeedback && currentQuestion.explanation && (
            <div className="rounded-lg border border-border bg-neutral-50 p-4">
              <p className="text-sm font-medium text-foreground">Penjelasan:</p>
              <p className="mt-1 text-sm text-muted-foreground">{currentQuestion.explanation}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={handleSkip}
            className="self-center text-sm text-muted-foreground hover:text-foreground hover:underline"
          >
            Tidak ingin ikut tes? Lewati tes penempatan
          </button>

          <div className="flex justify-end">
            {!showFeedback ? (
              <Button
                disabled={!selectedChoice}
                onClick={handleConfirm}
              >
                Konfirmasi
                <ArrowRight className="ml-2 size-4" aria-hidden />
              </Button>
            ) : (
              <Button onClick={handleNext}>
                {answers.length >= DIAGNOSTIC_CONFIG.MAX_QUESTIONS || currentIndex >= questions.length - 1
                  ? 'Lihat Hasil'
                  : 'Pertanyaan berikutnya'}
                <ArrowRight className="ml-2 size-4" aria-hidden />
              </Button>
            )}
          </div>
        </div>
      </div>
    </OnboardingLayout>
  )
}
