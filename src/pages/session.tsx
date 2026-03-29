import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { useParams, useLocation, useSearch } from 'wouter'
import { ArrowRight, X, CheckCircle2, XCircle, Shuffle } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
import { getMasteryProgress } from '@/lib/engines/mastery'
import {
  buildDueTopicsLine,
  findWeakTag,
  formatNextReviewDateId,
  formatSessionDurationId,
  getEarliestDueDate,
  type TopicRollup,
  type TagRollup,
} from '@/lib/session-complete-aggregates'
import { primaryTag } from '@/lib/topic-detail-aggregates'
import { SessionCompleteView } from '@/components/session/session-complete-view'
import { Skeleton } from '@/components/ui/skeleton'
import { learnerStore, learnerActions } from '@/store/learnerStore'
import {
  useChoiceRandomization,
  getDisplayLetter,
  type RandomizedQuestion,
} from '@/lib/hooks/useChoiceRandomization'
import type { Question } from '@/types'

/**
 * Local QA: in dev, sessions use at most 3 questions unless overridden.
 * Set `VITE_SESSION_QUESTION_LIMIT` in `.env.local` (number ≥1), or `0` to disable the cap.
 * Production builds ignore the dev default and use the full queue unless the env is set.
 */
function getSessionQuestionCap(): number | null {
  const v = import.meta.env.VITE_SESSION_QUESTION_LIMIT
  if (v !== undefined && v !== '') {
    const n = Number(v)
    if (!Number.isFinite(n)) return import.meta.env.DEV ? 3 : null
    if (n <= 0) return null
    return Math.floor(n)
  }
  return import.meta.env.DEV ? 3 : null
}

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
        <SectionLabel>Soal</SectionLabel>
        <div className="border-border bg-muted/20 rounded-lg border p-6">
          <p className="text-foreground text-base leading-relaxed">{randomized.stem}</p>
        </div>
      </div>

      {/* Choice cards */}
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
// FeedbackBanner — inline result banner shown above question during feedback
// ---------------------------------------------------------------------------

interface FeedbackBannerProps {
  isCorrect: boolean
  xpAwarded: number
}

function FeedbackBanner({ isCorrect, xpAwarded }: FeedbackBannerProps) {
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
      <span
        className={cn(
          'text-base font-semibold',
          isCorrect ? 'text-success' : 'text-destructive',
        )}
      >
        {isCorrect ? 'Jawaban benar!' : 'Belum tepat.'}
      </span>
      {isCorrect && (
        <span className="text-success font-mono text-sm font-semibold tabular-nums">
          +{xpAwarded} XP
        </span>
      )}
      <div aria-live="polite" className="sr-only">
        {isCorrect
          ? `Jawaban benar. ${xpAwarded} XP.`
          : 'Belum tepat.'}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// QuitSessionDialog — confirm before leaving with progress at risk
// ---------------------------------------------------------------------------

interface QuitSessionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirmExit: () => void
}

function QuitSessionDialog({ open, onOpenChange, onConfirmExit }: QuitSessionDialogProps) {
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


// ---------------------------------------------------------------------------
// Session complete — loading skeleton (matches summary layout)
// ---------------------------------------------------------------------------

function SessionCompleteSummarySkeleton() {
  return (
    <div
      className="mx-auto flex max-w-2xl flex-col gap-8 py-8"
      aria-busy="true"
      aria-label="Memuat ringkasan sesi…"
    >
      <div className="border-border flex flex-col gap-2 border-b pb-6">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-64 max-w-full" />
        <Skeleton className="h-6 w-48 max-w-full" />
        <Skeleton className="h-4 w-full max-w-lg" />
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="border-border bg-surface-raised rounded-lg border p-4">
            <Skeleton className="mb-2 h-8 w-12" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-5 w-56" />
        <Skeleton className="h-2 w-full" />
      </div>
      <div className="flex flex-col gap-4">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-2 w-full" />
        <Skeleton className="h-2 w-full" />
      </div>
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-full max-w-md" />
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
  const search = useSearch()

  const tagFilter = useMemo(() => {
    const q = search.startsWith('?') ? search.slice(1) : search
    return new URLSearchParams(q).get('tag')
  }, [search])

  // One hook call per data source at page level (WORKFLOW rule 8)
  const { data: rawQuestions = [], isLoading, isError } = useQuestionsQuery(topicId)
  const sessionCap = getSessionQuestionCap()
  const questions = useMemo(() => {
    let list = sessionCap == null ? rawQuestions : rawQuestions.slice(0, sessionCap)
    if (tagFilter) {
      const filtered = list.filter(
        (q) => q.tags.includes(tagFilter) || primaryTag(q) === tagFilter,
      )
      if (filtered.length > 0) list = filtered
    }
    return list
  }, [rawQuestions, sessionCap, tagFilter])
  const { data: topic } = useTopicQuery(topicId ?? '')
  const { data: allTopics = [] } = useTopicsQuery()

  const [learnerState, setLearnerState] = useState(() => learnerStore.get())
  useEffect(() => {
    const sub = learnerStore.subscribe((s) => setLearnerState(s))
    return () => sub.unsubscribe()
  }, [])

  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null)
  const [phase, setPhase] = useState<SessionPhase>('answering')
  const [elapsedTime, setElapsedTime] = useState(0)
  const [stats, setStats] = useState<SessionStats>({ correct: 0, xpEarned: 0 })
  const [quitDialogOpen, setQuitDialogOpen] = useState(false)
  const [topicRollup, setTopicRollup] = useState<Record<string, TopicRollup>>({})
  const [tagRollup, setTagRollup] = useState<Record<string, TagRollup>>({})
  const [sessionRunId, setSessionRunId] = useState(0)
  const [sessionEndMeta, setSessionEndMeta] = useState<{
    streakAfter: number
    durationMs: number
  } | null>(null)
  const [weakAreaDismissed, setWeakAreaDismissed] = useState(false)

  const startTimeRef = useRef<number>(Date.now())
  const sessionWallStartRef = useRef<number | null>(null)
  const sessionStreakStartRef = useRef(0)
  const confirmActionsRef = useRef<HTMLDivElement>(null)
  /** Prevents double-applying mastery updates (e.g. React Strict Mode). */
  const masteryAppliedSessionRunId = useRef<number | null>(null)

  const currentQuestion = questions[currentIndex] ?? null
  const randomized = useChoiceRandomization(currentQuestion)

  useEffect(() => {
    if (questions.length === 0) return
    sessionWallStartRef.current = Date.now()
    sessionStreakStartRef.current = learnerStore.get().streak
  }, [questions, sessionRunId])

  // Reset timer when entering a new question
  useEffect(() => {
    if (phase === 'answering') {
      startTimeRef.current = Date.now()
    }
  }, [currentIndex, phase])

  // Keep Confirm answer in view after a choice is selected (short viewports + agent-browser)
  useEffect(() => {
    if (phase !== 'answering' || !selectedChoiceId) return
    confirmActionsRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [phase, selectedChoiceId])

  // Ensure TopicMastery exists for this topic so progress / mastery gate reflect sessions.
  useEffect(() => {
    if (!topicId || !topic) return
    const existing = learnerStore.get().topics[topicId]
    if (existing) return
    learnerActions.initializeTopicMastery(topicId, topic.questionCount)
  }, [topicId, topic])

  // Blend session accuracy into topic mastery when a run finishes (see plan: mastery sync).
  useEffect(() => {
    if (phase !== 'complete' || !sessionEndMeta) return
    if (masteryAppliedSessionRunId.current === sessionRunId) return
    masteryAppliedSessionRunId.current = sessionRunId

    const now = new Date().toISOString()
    for (const [tid, roll] of Object.entries(topicRollup)) {
      const meta = allTopics.find((t) => t.id === tid)
      if (!meta || roll.attempted === 0) continue
      const totalQ = meta.questionCount
      const sessionAcc = roll.correct / roll.attempted
      let prev = learnerStore.get().topics[tid]
      if (!prev) {
        learnerActions.initializeTopicMastery(tid, totalQ)
        prev = learnerStore.get().topics[tid]
      }
      if (!prev) continue
      const prevRatio = prev.totalQuestions > 0 ? prev.masteredQuestions / prev.totalQuestions : 0
      const blended =
        prev.masteredQuestions > 0 ? prevRatio * 0.5 + sessionAcc * 0.5 : sessionAcc
      const nextMastered = Math.min(totalQ, Math.round(blended * totalQ))
      learnerActions.updateTopicMastery(tid, {
        totalQuestions: totalQ,
        masteredQuestions: Math.max(prev.masteredQuestions, nextMastered),
        lastPracticed: now,
      })
    }
  }, [phase, sessionEndMeta, topicRollup, allTopics, sessionRunId])

  const topicTitle = useCallback(
    (id: string) => allTopics.find((t) => t.id === id)?.title ?? id,
    [allTopics],
  )

  const handleConfirm = useCallback(() => {
    if (!selectedChoiceId || !currentQuestion || phase !== 'answering') return

    const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000)
    setElapsedTime(elapsed)

    const isCorrect =
      currentQuestion.choices.find((c) => c.id === selectedChoiceId)?.isCorrect ?? false

    const tid = currentQuestion.topicId
    setTopicRollup((prev) => {
      const cur = prev[tid] ?? { correct: 0, attempted: 0 }
      return {
        ...prev,
        [tid]: {
          correct: cur.correct + (isCorrect ? 1 : 0),
          attempted: cur.attempted + 1,
        },
      }
    })

    const tagKey = currentQuestion.tags[0] ?? 'General'
    setTagRollup((prev) => {
      const cur = prev[tagKey] ?? { correct: 0, total: 0, topicId: tid }
      return {
        ...prev,
        [tagKey]: {
          correct: cur.correct + (isCorrect ? 1 : 0),
          total: cur.total + 1,
          topicId: cur.topicId || tid,
        },
      }
    })

    if (isCorrect) {
      learnerActions.addXP(50)
      setStats((prev) => ({ correct: prev.correct + 1, xpEarned: prev.xpEarned + 50 }))
    }

    setPhase('feedback')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [selectedChoiceId, currentQuestion, phase])

  const handleNext = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    if (currentIndex + 1 >= questions.length) {
      learnerActions.updateStreak()
      setSessionEndMeta({
        streakAfter: learnerStore.get().streak,
        durationMs: Date.now() - (sessionWallStartRef.current ?? Date.now()),
      })
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

  const exitSession = useCallback(() => {
    setQuitDialogOpen(false)
    navigate('/')
  }, [navigate])

  const shouldConfirmQuit =
    currentIndex > 0 ||
    phase === 'feedback' ||
    selectedChoiceId !== null ||
    stats.correct > 0 ||
    stats.xpEarned > 0

  const requestExit = useCallback(() => {
    if (shouldConfirmQuit) {
      setQuitDialogOpen(true)
    } else {
      exitSession()
    }
  }, [shouldConfirmQuit, exitSession])

  const handlePracticeAgain = useCallback(() => {
    setCurrentIndex(0)
    setSelectedChoiceId(null)
    setPhase('answering')
    setStats({ correct: 0, xpEarned: 0 })
    setTopicRollup({})
    setTagRollup({})
    setSessionEndMeta(null)
    setWeakAreaDismissed(false)
    setSessionRunId((n) => n + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handlePracticeWeakArea = useCallback(
    (practiceTopicId: string) => {
      navigate(`/session/${practiceTopicId}`)
    },
    [navigate],
  )

  const progressPercent =
    questions.length > 0
      ? Math.round(((currentIndex + 1) / questions.length) * 100)
      : 0

  // Unique topic tags across all session questions for the session mix footer
  const sessionTags = Array.from(new Set(questions.flatMap((q) => q.tags))).slice(0, 6)

  // ── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-muted-foreground text-sm">Memuat soal…</p>
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
        <p className="text-muted-foreground text-sm">Tidak ada soal untuk sesi ini.</p>
        <Button variant="outline" onClick={handleQuit}>
          Kembali
        </Button>
      </div>
    )
  }

  // ── Session complete ─────────────────────────────────────────────────────
  if (phase === 'complete' && !sessionEndMeta) {
    return <SessionCompleteSummarySkeleton />
  }

  if (phase === 'complete' && sessionEndMeta) {
    const accuracyPercent =
      questions.length > 0 ? Math.round((stats.correct / questions.length) * 100) : 0
    const timeLabel = formatSessionDurationId(sessionEndMeta.durationMs)
    const topicOrder = [...new Set(questions.map((q) => q.topicId))]
    const topicRows = topicOrder.map((tid) => {
      const r = topicRollup[tid] ?? { correct: 0, attempted: 0 }
      const m = learnerState.topics[tid]
      let overallMasteryPercent: number | null = null
      if (m && m.totalQuestions > 0) {
        overallMasteryPercent = getMasteryProgress(m).current
      }
      return {
        topicId: tid,
        title: topicTitle(tid),
        correct: r.correct,
        attempted: r.attempted,
        overallMasteryPercent,
      }
    })
    const earliest = getEarliestDueDate(
      questions.map((q) => q.id),
      learnerState.cards,
    )
    const nextReviewSummary = earliest ? formatNextReviewDateId(earliest) : null
    const dueLines = buildDueTopicsLine(questions, learnerState.cards, topicTitle)
    const dueTopicsLine =
      dueLines.length > 0
        ? dueLines.map((d) => `${d.title} (${d.dueCount} kartu)`).join(' · ')
        : null
    const weak = findWeakTag(tagRollup)
    const primaryTopicTitle =
      topic?.title ??
      (questions[0] ? topicTitle(questions[0].topicId) : null) ??
      'Sesi tinjauan'

    return (
      <SessionCompleteView
        primaryTopicTitle={primaryTopicTitle}
        isMultiTopicSession={topicRows.length > 1}
        totalQuestions={questions.length}
        correct={stats.correct}
        accuracyPercent={accuracyPercent}
        xpEarned={stats.xpEarned}
        timeLabel={timeLabel}
        streakBefore={sessionStreakStartRef.current}
        streakAfter={sessionEndMeta.streakAfter}
        streakGoalDays={learnerState.streakGoalDays ?? 30}
        topicRows={topicRows}
        nextReviewSummary={nextReviewSummary}
        dueTopicsLine={dueTopicsLine}
        weakArea={
          weak
            ? { tagLabel: weak.tag, missed: weak.missed, total: weak.total }
            : null
        }
        weakAreaDismissed={weakAreaDismissed}
        onDismissWeakArea={() => setWeakAreaDismissed(true)}
        onPracticeWeakArea={() => weak && handlePracticeWeakArea(weak.topicId)}
        onDone={handleQuit}
        onAnotherSession={handlePracticeAgain}
      />
    )
  }

  if (!currentQuestion || !randomized) return null

  const selectedIsCorrect =
    currentQuestion.choices.find((c) => c.id === selectedChoiceId)?.isCorrect ?? false

  return (
    <>
      <div
        className="mx-auto flex max-w-2xl flex-col gap-6"
        aria-hidden={quitDialogOpen}
      >
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-4">
            <span className="text-foreground min-w-0 truncate text-sm font-medium">
              {topic?.title ?? 'Sesi tinjauan'}
            </span>

            <div className="flex shrink-0 items-center gap-4">
              <StepCounter
                current={currentIndex + 1}
                total={questions.length}
                prefix="Q"
                size="sm"
              />
              {phase === 'answering' && (
                <Button variant="outline" size="sm" onClick={requestExit}>
                  <X />
                  Quit session
                </Button>
              )}
            </div>
          </div>

          <Progress value={progressPercent} className="h-1.5" />
        </div>

        {phase === 'feedback' && (
          <FeedbackBanner
            isCorrect={selectedIsCorrect}
            xpAwarded={selectedIsCorrect ? 50 : 0}
          />
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
                className={
                  selectedIsCorrect
                    ? 'bg-success text-success-foreground hover:bg-success/90 focus-visible:ring-success/30'
                    : undefined
                }
              >
                {currentIndex + 1 >= questions.length
                  ? 'Selesaikan sesi'
                  : 'Pertanyaan berikutnya'}
                <ArrowRight />
              </Button>
            </div>
          </>
        )}

        {sessionTags.length > 0 && phase === 'answering' && (
          <div className="border-border flex flex-col gap-2 border-t pt-4">
            <div className="text-muted-foreground flex items-center gap-1.5">
              <Shuffle className="size-3.5 shrink-0" />
              <span className="text-xs font-medium">Topik dalam sesi ini</span>
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
      <QuitSessionDialog
        open={quitDialogOpen}
        onOpenChange={setQuitDialogOpen}
        onConfirmExit={exitSession}
      />
    </>
  )
}
