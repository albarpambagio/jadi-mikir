import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { useSearch, useLocation } from 'wouter'
import { ArrowRight, X, CheckCircle2, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { StepCounter } from '@/components/ui/step-counter'
import { SectionLabel } from '@/components/ui/section-label'
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogHeader,
  DialogFooter,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { useQuestionsQuery, useTopicQuery, useTopicsQuery } from '@/lib/content'
import { learnerStore, learnerActions } from '@/store/learnerStore'
import {
  useChoiceRandomization,
  getDisplayLetter,
  type RandomizedQuestion,
} from '@/lib/hooks/useChoiceRandomization'
import type { Question } from '@/types'

type SessionPhase = 'answering' | 'feedback' | 'complete'

const DIFFICULTY_CONFIG: Record<Question['difficulty'], { label: string; filled: number }> = {
  easy: { label: 'Mudah', filled: 2 },
  medium: { label: 'Sedang', filled: 3 },
  hard: { label: 'Sulit', filled: 5 },
}

function DifficultyLabel({ difficulty }: { difficulty: Question['difficulty'] }) {
  const { label, filled } = DIFFICULTY_CONFIG[difficulty]
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          <div
            key={i}
            className={cn('size-1.5 rounded-full', i < filled ? 'bg-primary' : 'bg-muted-foreground/30')}
          />
        ))}
      </div>
      <span className="text-muted-foreground text-xs font-medium">{label} · {filled}/5</span>
    </div>
  )
}

interface QuestionAreaProps {
  randomized: RandomizedQuestion
  phase: 'answering' | 'feedback'
  selectedChoiceId: string | null
  onSelectChoice?: (id: string) => void
}

function QuestionArea({ randomized, phase, selectedChoiceId, onSelectChoice }: QuestionAreaProps) {
  const isFeedback = phase === 'feedback'

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        {randomized.tags.length > 0 && (
          <Badge variant="tag">{randomized.tags[0]}</Badge>
        )}
        <DifficultyLabel difficulty={randomized.difficulty} />
      </div>

      <div className="flex flex-col gap-2">
        <SectionLabel>Soal</SectionLabel>
        <div className="border-border bg-muted/20 rounded-lg border p-6">
          <p className="text-foreground text-base leading-relaxed">{randomized.stem}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {randomized.choices.map((choice) => {
          const letter = getDisplayLetter(choice.displayIndex)

          if (isFeedback) {
            const isSelectedChoice = choice.id === selectedChoiceId
            const isCorrectChoice = choice.isCorrect

            const cardClass = isCorrectChoice
              ? 'border-l-4 border-l-success border-border bg-card'
              : isSelectedChoice
                ? 'border-l-4 border-l-destructive border-border bg-card'
                : 'border-border bg-card opacity-50'

            const letterClass = isCorrectChoice
              ? 'text-success'
              : isSelectedChoice
                ? 'text-destructive'
                : 'text-muted-foreground'

            const textClass = isCorrectChoice
              ? 'text-foreground'
              : isSelectedChoice
                ? 'text-destructive'
                : 'text-muted-foreground'

            let rowLabel: string | null = null
            let rowLabelClass = ''
            if (isCorrectChoice && isSelectedChoice) {
              rowLabel = '✓ Jawaban kamu · Benar'
              rowLabelClass = 'text-success'
            } else if (isCorrectChoice) {
              rowLabel = '✓ Jawaban benar'
              rowLabelClass = 'text-success'
            } else if (isSelectedChoice) {
              rowLabel = '✗ Jawaban kamu'
              rowLabelClass = 'text-destructive'
            }

            return (
              <div
                key={choice.id}
                className={cn('flex items-center gap-4 rounded-lg border p-4', cardClass)}
              >
                <span className={cn('font-mono text-sm font-semibold shrink-0 w-5 tabular-nums', letterClass)}>
                  {letter}
                </span>
                <span className={cn('text-sm flex-1 leading-snug', textClass)}>
                  {choice.text}
                </span>
                {rowLabel && (
                  <span className={cn('shrink-0 text-xs font-medium', rowLabelClass)}>
                    {rowLabel}
                  </span>
                )}
              </div>
            )
          }

          const isSelected = choice.id === selectedChoiceId
          return (
            <button
              key={choice.id}
              type="button"
              onClick={() => onSelectChoice?.(choice.id)}
              className={cn(
                'flex items-center gap-4 w-full rounded-lg border p-4 text-left transition-colors',
                isSelected
                  ? 'border-primary bg-primary/5 hover:bg-primary/8'
                  : 'border-border bg-card hover:bg-muted/50 hover:shadow-sm',
              )}
            >
              <span
                className={cn(
                  'font-mono text-sm font-semibold shrink-0 w-5 tabular-nums',
                  isSelected ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                {letter}
              </span>
              <span className="text-foreground text-sm leading-snug">{choice.text}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

interface FeedbackBannerProps {
  isCorrect: boolean
  xpAwarded?: number
}

function FeedbackBanner({ isCorrect, xpAwarded = 0 }: FeedbackBannerProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 border-b-2 pb-4',
        isCorrect ? 'border-success' : 'border-destructive',
      )}
    >
      {isCorrect ? (
        <CheckCircle2 className="text-success size-6 shrink-0" aria-hidden />
      ) : (
        <XCircle className="text-destructive size-6 shrink-0" aria-hidden />
      )}
      <div className="flex flex-col">
        <span
          className={cn(
            'text-base font-semibold',
            isCorrect ? 'text-success' : 'text-destructive',
          )}
        >
          {isCorrect ? 'Jawaban benar!' : 'Belum tepat.'}
        </span>
        {xpAwarded > 0 && (
          <span className="text-sm font-mono text-muted-foreground">
            +{xpAwarded} XP
          </span>
        )}
      </div>
    </div>
  )
}

interface QuitDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirmExit: () => void
}

function QuitDialog({ open, onOpenChange, onConfirmExit }: QuitDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal>
      <DialogPortal>
        <DialogOverlay className="bg-black/50" />
        <DialogPrimitive.Content
          className={cn(
            'fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%]',
            'border border-border bg-card p-6 shadow-md rounded-lg',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'duration-200',
          )}
          aria-labelledby="quit-dialog-title"
          aria-describedby="quit-dialog-desc"
        >
          <DialogHeader className="text-left">
            <DialogPrimitive.Title
              id="quit-dialog-title"
              className="text-lg leading-none font-semibold tracking-tight"
            >
              Keluar sesi?
            </DialogPrimitive.Title>
            <DialogPrimitive.Description
              id="quit-dialog-desc"
              className="text-muted-foreground pt-2 text-sm"
            >
              Progress sesi ini tidak disimpan.
            </DialogPrimitive.Description>
          </DialogHeader>
          <DialogFooter className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Lanjutkan sesi
            </Button>
            <Button type="button" variant="destructive" onClick={onConfirmExit}>
              Ya, keluar
            </Button>
          </DialogFooter>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  )
}

function getDrillQuestionCap(): number | null {
  return 8
}

export function RemediationDrillPage() {
  const search = useSearch()
  const [, navigate] = useLocation()

  const params = useMemo(() => {
    const sp = new URLSearchParams(search)
    return {
      topicId: sp.get('topicId') ?? '',
      fromTopicId: sp.get('fromTopic') ?? '',
      questionIndex: parseInt(sp.get('questionIndex') ?? '0', 10),
    }
  }, [search])

  const { data: rawQuestions = [], isLoading } = useQuestionsQuery(params.topicId)
  const drillCap = getDrillQuestionCap()
  const questions = useMemo(() => {
    const list = drillCap == null ? rawQuestions : rawQuestions.slice(0, drillCap)
    return list
  }, [rawQuestions, drillCap])

  const { data: prereqTopic } = useTopicQuery(params.topicId)
  const { data: fromTopic } = useTopicQuery(params.fromTopicId)
  const { data: allTopics = [] } = useTopicsQuery()

  const fromTopicTitle = useMemo(() => {
    return fromTopic?.title ?? allTopics.find(t => t.id === params.fromTopicId)?.title ?? 'Sesi sebelumnya'
  }, [fromTopic, allTopics, params.fromTopicId])

  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null)
  const [phase, setPhase] = useState<SessionPhase>('answering')
  const [quitDialogOpen, setQuitDialogOpen] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)

  const confirmActionsRef = useRef<HTMLDivElement>(null)
  const startTimeRef = useRef<number>(Date.now())

  const currentQuestion = questions[currentIndex] ?? null
  const randomized = useChoiceRandomization(currentQuestion)

  useEffect(() => {
    if (questions.length > 0) {
      startTimeRef.current = Date.now()
    }
  }, [currentIndex])

  useEffect(() => {
    if (phase === 'answering' && selectedChoiceId) {
      confirmActionsRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }, [phase, selectedChoiceId])

  const handleConfirm = useCallback(() => {
    if (!selectedChoiceId || !currentQuestion || phase !== 'answering') return

    const isCorrect =
      currentQuestion.choices.find((c) => c.id === selectedChoiceId)?.isCorrect ?? false

    if (isCorrect) {
      setCorrectCount(prev => prev + 1)
    }

    setPhase('feedback')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [selectedChoiceId, currentQuestion, phase])

  const handleNext = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    if (currentIndex + 1 >= questions.length) {
      setPhase('complete')
    } else {
      setCurrentIndex(prev => prev + 1)
      setSelectedChoiceId(null)
      setPhase('answering')
    }
  }, [currentIndex, questions.length])

  const handleQuit = useCallback(() => {
    setQuitDialogOpen(true)
  }, [])

  const exitDrill = useCallback(() => {
    const qs = new URLSearchParams({
      topicId: params.fromTopicId,
      resumeAt: String(params.questionIndex + 1),
    })
    navigate(`/session/${params.fromTopicId}?${qs.toString()}`)
  }, [navigate, params.fromTopicId, params.questionIndex])

  const handleDone = useCallback(() => {
    const qs = new URLSearchParams({
      topicId: params.fromTopicId,
      resumeAt: String(params.questionIndex + 1),
    })
    navigate(`/session/${params.fromTopicId}?${qs.toString()}`)
  }, [navigate, params.fromTopicId, params.questionIndex])

  const progressPercent =
    questions.length > 0
      ? Math.round(((currentIndex + 1) / questions.length) * 100)
      : 0

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-muted-foreground text-sm">Memuat soal…</p>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <p className="text-muted-foreground text-sm">Tidak ada soal untuk latihan ini.</p>
        <Button variant="outline" onClick={handleDone}>
          Kembali ke sesi
        </Button>
      </div>
    )
  }

  if (phase === 'complete') {
    const accuracyPercent = questions.length > 0 
      ? Math.round((correctCount / questions.length) * 100) 
      : 0

    return (
      <div className="mx-auto flex max-w-2xl flex-col gap-6 py-8">
        <Card className="border-border bg-surface-raised p-6 sm:p-8">
          <div className="flex flex-col gap-4 text-center">
            <h1 className="text-2xl font-semibold">Latihan selesai!</h1>
            <p className="text-muted-foreground">
              Kamu menjawab {correctCount} dari {questions.length} soal dengan benar ({accuracyPercent}%)
            </p>
            <Button onClick={handleDone} className="mt-4">
              Kembali ke sesi
              <ArrowRight className="size-4" aria-hidden />
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  if (!currentQuestion || !randomized) return null

  const selectedIsCorrect =
    currentQuestion.choices.find((c) => c.id === selectedChoiceId)?.isCorrect ?? false

  const prereqTitle = prereqTopic?.title ?? 'Latihan'

  return (
    <>
      <div
        className="mx-auto flex max-w-2xl flex-col gap-6"
        aria-hidden={quitDialogOpen}
      >
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-4">
            <span className="text-foreground min-w-0 truncate text-sm font-medium">
              {prereqTitle}
            </span>

            <div className="flex shrink-0 items-center gap-4">
              <StepCounter
                current={currentIndex + 1}
                total={questions.length}
                prefix="Q"
                size="sm"
              />
              <Button variant="outline" size="sm" onClick={handleQuit}>
                <X />
                Keluar sesi
              </Button>
            </div>
          </div>

          <Progress value={progressPercent} className="h-1.5" />
        </div>

        <div className="border-border rounded-lg border bg-muted/20 p-3 text-sm text-muted-foreground">
          Setelah latihan ini, kamu kembali ke {fromTopicTitle}, soal {params.questionIndex + 1}.
        </div>

        {phase === 'feedback' && (
          <FeedbackBanner isCorrect={selectedIsCorrect} xpAwarded={selectedIsCorrect ? 25 : 0} />
        )}

        <QuestionArea
          randomized={randomized}
          phase={phase === 'feedback' ? 'feedback' : 'answering'}
          selectedChoiceId={selectedChoiceId}
          onSelectChoice={phase === 'answering' ? setSelectedChoiceId : undefined}
        />

        {phase === 'answering' && (
          <div ref={confirmActionsRef} className="flex justify-end">
            <Button onClick={handleConfirm} disabled={!selectedChoiceId}>
              Konfirmasi jawaban
              <ArrowRight />
            </Button>
          </div>
        )}

        {phase === 'feedback' && (
          <>
            {randomized.explanation && (
              <div className="border-border bg-muted/20 rounded-lg border p-4">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {randomized.explanation}
                </p>
              </div>
            )}

            <div className="flex justify-end">
              <Button
                type="button"
                onClick={handleNext}
                autoFocus
              >
                {currentIndex + 1 >= questions.length
                  ? 'Selesaikan latihan'
                  : 'Pertanyaan berikutnya'}
                <ArrowRight />
              </Button>
            </div>
          </>
        )}
      </div>
      <QuitDialog
        open={quitDialogOpen}
        onOpenChange={setQuitDialogOpen}
        onConfirmExit={exitDrill}
      />
    </>
  )
}


