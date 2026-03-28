import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useLocation } from 'wouter'
import { ArrowLeft, ArrowRight, X, Clock, CheckCircle2, XCircle, Shuffle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { StepCounter } from '@/components/ui/step-counter'
import { SectionLabel } from '@/components/ui/section-label'
import { cn } from '@/lib/utils'
import { useQuestionsQuery, useTopicQuery } from '@/lib/content'
import {
  useChoiceRandomization,
  getDisplayLetter,
  type RandomizedQuestion,
} from '@/lib/hooks/useChoiceRandomization'
import { learnerActions } from '@/store/learnerStore'
import type { Question } from '@/types'

// ---------------------------------------------------------------------------
// Internal types
// ---------------------------------------------------------------------------

type SessionPhase = 'answering' | 'feedback' | 'complete'

interface SessionStats {
  correct: number
  xpEarned: number
}

// ---------------------------------------------------------------------------
// DifficultyLabel — dots + text label
// ---------------------------------------------------------------------------

const DIFFICULTY_CONFIG: Record<Question['difficulty'], { label: string; filled: number }> = {
  easy: { label: 'Easy', filled: 1 },
  medium: { label: 'Medium', filled: 3 },
  hard: { label: 'Hard', filled: 5 },
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
      <span className="text-muted-foreground text-xs font-medium">{label}</span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// QuestionArea — shared by both answering and feedback phases
// Shows the question stem + choices. Choices are interactive in answering
// mode and non-interactive (colored for correctness) in feedback mode.
// ---------------------------------------------------------------------------

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
      {/* Meta row: topic tag + difficulty */}
      <div className="flex items-center gap-3">
        {randomized.tags.length > 0 && (
          <Badge variant="tag">{randomized.tags[0]}</Badge>
        )}
        <DifficultyLabel difficulty={randomized.difficulty} />
      </div>

      {/* Question stem — tinted background, distinct from answer cards */}
      <div className="flex flex-col gap-2">
        <SectionLabel>Question</SectionLabel>
        <div className="border-border bg-muted/20 rounded-lg border p-6">
          <p className="text-foreground text-base leading-relaxed">{randomized.stem}</p>
        </div>
      </div>

      {/* Choice cards */}
      <div className="flex flex-col gap-3">
        {randomized.choices.map((choice) => {
          const letter = getDisplayLetter(choice.displayIndex)

          if (isFeedback) {
            // Non-interactive — show correctness coloring
            const isSelectedChoice = choice.id === selectedChoiceId
            const isCorrectChoice = choice.isCorrect

            const cardClass = isCorrectChoice
              ? 'border-success/30 bg-success/5'
              : isSelectedChoice
                ? 'border-destructive/30 bg-destructive/5'
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
                {isCorrectChoice && (
                  <span className="text-success shrink-0 text-xs font-medium">✓ correct</span>
                )}
                {isSelectedChoice && !isCorrectChoice && (
                  <span className="text-destructive shrink-0 text-xs font-medium">✗ your answer</span>
                )}
              </div>
            )
          }

          // Interactive — answering mode
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

// ---------------------------------------------------------------------------
// FeedbackPanel — fixed bottom sheet that slides up after confirming
// The question + colored choices remain visible above it.
// ---------------------------------------------------------------------------

interface FeedbackPanelProps {
  isCorrect: boolean
  elapsedTime: number
  xpAwarded: number
  explanation?: string
  onNext: () => void
  isLast: boolean
}

function FeedbackPanel({
  isCorrect,
  elapsedTime,
  xpAwarded,
  explanation,
  onNext,
  isLast,
}: FeedbackPanelProps) {
  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50',
        'animate-in slide-in-from-bottom duration-300',
        'border-t-4 bg-card shadow-lg',
        isCorrect ? 'border-success' : 'border-destructive',
      )}
    >
      <div className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-6">
        {/* Verdict row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isCorrect ? (
              <CheckCircle2 className="text-success size-6 shrink-0" />
            ) : (
              <XCircle className="text-destructive size-6 shrink-0" />
            )}
            <span
              className={cn(
                'text-base font-semibold',
                isCorrect ? 'text-success' : 'text-destructive',
              )}
            >
              {isCorrect ? 'Correct!' : 'Incorrect'}
            </span>
            {isCorrect && (
              <span className="text-success font-mono text-sm font-semibold tabular-nums">
                +{xpAwarded} xp
              </span>
            )}
          </div>
          <div className="text-muted-foreground flex items-center gap-1.5">
            <Clock className="size-3.5" />
            <span className="font-mono text-xs tabular-nums">{elapsedTime}s</span>
          </div>
        </div>

        {/* Explanation */}
        {explanation && (
          <p className="text-muted-foreground text-sm leading-relaxed">{explanation}</p>
        )}

        {/* Next button */}
        <div className="flex justify-end">
          <Button onClick={onNext}>
            {isLast ? 'Finish session' : 'Next question'}
            <ArrowRight />
          </Button>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// SessionComplete — performance band + stat receipt card + two CTAs
// ---------------------------------------------------------------------------

interface SessionCompleteProps {
  topicTitle: string
  stats: SessionStats
  totalQuestions: number
  onDone: () => void
  onPracticeAgain: () => void
}

const PERFORMANCE_BANDS = [
  {
    min: 90,
    label: 'Perfect score!',
    color: 'text-success' as const,
    message: 'Flawless. This topic is firmly in your memory.',
  },
  {
    min: 70,
    label: 'Well done!',
    color: 'text-primary' as const,
    message: 'Strong session. A few more like this and it sticks for good.',
  },
  {
    min: 40,
    label: 'Good effort',
    color: 'text-foreground' as const,
    message: "You're making progress. Consistency will get you there.",
  },
  {
    min: 0,
    label: 'Keep at it',
    color: 'text-foreground' as const,
    message: 'Tough one. Each attempt builds the pattern — come back tomorrow.',
  },
] as const

function SessionComplete({
  topicTitle,
  stats,
  totalQuestions,
  onDone,
  onPracticeAgain,
}: SessionCompleteProps) {
  const accuracy = totalQuestions > 0
    ? Math.round((stats.correct / totalQuestions) * 100)
    : 0

  const band = PERFORMANCE_BANDS.find((b) => accuracy >= b.min) ?? PERFORMANCE_BANDS[3]

  return (
    <div className="mx-auto flex max-w-sm flex-col items-center gap-8 py-16 text-center">
      {/* Header: label + band + topic */}
      <div className="flex flex-col gap-1">
        <p className="text-muted-foreground text-xs font-medium">Session complete</p>
        <p className={cn('text-2xl font-semibold', band.color)}>{band.label}</p>
        <p className="text-muted-foreground text-sm">{topicTitle}</p>
      </div>

      {/* Stat receipt card */}
      <div className="border-border bg-card w-full rounded-lg border">
        <div className="divide-border grid grid-cols-3 divide-x">
          <div className="flex flex-col items-center gap-1 px-4 py-6">
            <p className="text-muted-foreground text-xs font-medium">Correct</p>
            <p className="text-foreground font-mono text-2xl font-semibold tabular-nums">
              {stats.correct}
              <span className="text-muted-foreground text-base font-normal">
                /{totalQuestions}
              </span>
            </p>
          </div>
          <div className="flex flex-col items-center gap-1 px-4 py-6">
            <p className="text-muted-foreground text-xs font-medium">Accuracy</p>
            <p className="text-foreground font-mono text-2xl font-semibold tabular-nums">
              {accuracy}
              <span className="text-muted-foreground text-base font-normal">%</span>
            </p>
          </div>
          <div className="flex flex-col items-center gap-1 px-4 py-6">
            <p className="text-muted-foreground text-xs font-medium">Earned</p>
            <p className="text-primary font-mono text-2xl font-semibold tabular-nums">
              +{stats.xpEarned}
              <span className="text-muted-foreground text-base font-normal"> xp</span>
            </p>
          </div>
        </div>
      </div>

      {/* Contextual motivational message */}
      <p className="text-muted-foreground text-sm leading-relaxed">{band.message}</p>

      {/* CTAs */}
      <div className="flex w-full flex-col gap-3">
        <Button onClick={onPracticeAgain}>
          Practice again
          <ArrowRight />
        </Button>
        <Button variant="outline" onClick={onDone}>
          Back to home
        </Button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// SessionPage (main export)
// ---------------------------------------------------------------------------

export function SessionPage() {
  const params = useParams<{ topicId?: string }>()
  const topicId = params.topicId
  const [, navigate] = useLocation()

  // One hook call per data source at page level (WORKFLOW rule 8)
  const { data: questions = [], isLoading, isError } = useQuestionsQuery(topicId)
  const { data: topic } = useTopicQuery(topicId ?? '')

  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null)
  const [phase, setPhase] = useState<SessionPhase>('answering')
  const [elapsedTime, setElapsedTime] = useState(0)
  const [stats, setStats] = useState<SessionStats>({ correct: 0, xpEarned: 0 })

  const startTimeRef = useRef<number>(Date.now())

  const currentQuestion = questions[currentIndex] ?? null
  const randomized = useChoiceRandomization(currentQuestion)

  // Reset timer when entering a new question
  useEffect(() => {
    if (phase === 'answering') {
      startTimeRef.current = Date.now()
    }
  }, [currentIndex, phase])

  const handleConfirm = useCallback(() => {
    if (!selectedChoiceId || !currentQuestion || phase !== 'answering') return

    const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000)
    setElapsedTime(elapsed)

    const isCorrect =
      currentQuestion.choices.find((c) => c.id === selectedChoiceId)?.isCorrect ?? false

    if (isCorrect) {
      learnerActions.addXP(50)
      setStats((prev) => ({ correct: prev.correct + 1, xpEarned: prev.xpEarned + 50 }))
    }

    setPhase('feedback')
    // Scroll to top so all colored choices are visible above the feedback panel
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [selectedChoiceId, currentQuestion, phase])

  const handleNext = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    if (currentIndex + 1 >= questions.length) {
      setPhase('complete')
    } else {
      setCurrentIndex((prev) => prev + 1)
      setSelectedChoiceId(null)
      setPhase('answering')
    }
  }, [currentIndex, questions.length])

  const handleQuit = useCallback(() => {
    navigate('/')
  }, [navigate])

  const handlePracticeAgain = useCallback(() => {
    setCurrentIndex(0)
    setSelectedChoiceId(null)
    setPhase('answering')
    setStats({ correct: 0, xpEarned: 0 })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const progressPercent =
    questions.length > 0 ? Math.round((currentIndex / questions.length) * 100) : 0

  // Unique topic tags across all session questions for the session mix footer
  const sessionTags = Array.from(new Set(questions.flatMap((q) => q.tags))).slice(0, 6)

  // ── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-muted-foreground text-sm">Loading questions…</p>
      </div>
    )
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <p className="text-muted-foreground text-sm">Failed to load questions.</p>
        <Button variant="outline" onClick={handleQuit}>
          Go back
        </Button>
      </div>
    )
  }

  // ── Empty ────────────────────────────────────────────────────────────────
  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <p className="text-muted-foreground text-sm">No questions found for this session.</p>
        <Button variant="outline" onClick={handleQuit}>
          Go back
        </Button>
      </div>
    )
  }

  // ── Session complete ─────────────────────────────────────────────────────
  if (phase === 'complete') {
    return (
      <SessionComplete
        topicTitle={topic?.title ?? 'Session'}
        stats={stats}
        totalQuestions={questions.length}
        onDone={handleQuit}
        onPracticeAgain={handlePracticeAgain}
      />
    )
  }

  if (!currentQuestion || !randomized) return null

  const selectedIsCorrect =
    currentQuestion.choices.find((c) => c.id === selectedChoiceId)?.isCorrect ?? false

  return (
    // Extra bottom padding when feedback panel is open so content isn't hidden
    <div className={cn('mx-auto max-w-2xl flex flex-col gap-6', phase === 'feedback' && 'pb-52')}>
      {/* ── Session header ── */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          {/* Left: back + topic title */}
          <div className="flex min-w-0 items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleQuit} aria-label="Go back">
              <ArrowLeft />
            </Button>
            <span className="text-foreground truncate text-sm font-medium">
              {topic?.title ?? 'Review session'}
            </span>
          </div>

          {/* Right: step counter + quit */}
          <div className="flex shrink-0 items-center gap-4">
            <StepCounter current={currentIndex + 1} total={questions.length} prefix="Q" size="sm" />
            <Button variant="outline" size="sm" onClick={handleQuit}>
              <X />
              Quit
            </Button>
          </div>
        </div>

        {/* Progress bar */}
        <Progress value={progressPercent} className="h-1.5" />
      </div>

      {/* ── Question area (shared between answering + feedback) ── */}
      <QuestionArea
        randomized={randomized}
        phase={phase === 'feedback' ? 'feedback' : 'answering'}
        selectedChoiceId={selectedChoiceId}
        onSelectChoice={phase === 'answering' ? setSelectedChoiceId : undefined}
      />

      {/* ── Confirm button (answering only) ── */}
      {phase === 'answering' && (
        <div className="flex justify-end">
          <Button onClick={handleConfirm} disabled={!selectedChoiceId}>
            Confirm answer
            <ArrowRight />
          </Button>
        </div>
      )}

      {/* ── Feedback panel — slides up from bottom ── */}
      {phase === 'feedback' && (
        <FeedbackPanel
          isCorrect={selectedIsCorrect}
          elapsedTime={elapsedTime}
          xpAwarded={selectedIsCorrect ? 50 : 0}
          explanation={randomized.explanation}
          onNext={handleNext}
          isLast={currentIndex + 1 >= questions.length}
        />
      )}

      {/* ── Session mix footer — shows active interleaving ── */}
      {sessionTags.length > 0 && (
        <div className="border-border flex flex-col gap-2 border-t pt-4">
          <div className="text-muted-foreground flex items-center gap-1.5">
            <Shuffle className="size-3.5 shrink-0" />
            <span className="text-xs font-medium">Topics in this session</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {sessionTags.map((tag) => (
              <Badge key={tag} variant="tag">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
