import { useEffect, useLayoutEffect, useRef } from 'react'
import { ArrowRight, Flame } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { SectionLabel } from '@/components/ui/section-label'
import { StatDisplay } from '@/components/ui/stat-display'
import { cn } from '@/lib/utils'

const DOC_TITLE_PREFIX = 'JadiMikir — '

const PERFORMANCE_BANDS = [
  {
    min: 90,
    label: 'Perfect score!',
    color: 'text-success',
    message: 'Flawless. This topic is firmly in your memory.',
    messageMulti:
      'Flawless work across multiple topics in this session. Keep the momentum going.',
  },
  {
    min: 70,
    label: 'Well done!',
    color: 'text-primary',
    message: 'Strong session. A few more like this and it sticks for good.',
    messageMulti:
      'Strong session across these topics. A few more like this and it sticks for good.',
  },
  {
    min: 40,
    label: 'Good effort',
    color: 'text-foreground',
    message: "You're making progress. Consistency will get you there.",
    messageMulti: "You're making progress. Consistency will get you there.",
  },
  {
    min: 0,
    label: 'Keep at it',
    color: 'text-foreground',
    message: 'Tough one. Each attempt builds the pattern — come back tomorrow.',
    messageMulti: 'Tough one. Each attempt builds the pattern — come back tomorrow.',
  },
] as const

export interface TopicProgressRow {
  topicId: string
  title: string
  correct: number
  attempted: number
  overallMasteryPercent: number | null
}

export interface WeakAreaPayload {
  tagLabel: string
  missed: number
  total: number
}

export interface SessionCompleteViewProps {
  primaryTopicTitle: string
  /** True when the session included questions from more than one topic. */
  isMultiTopicSession: boolean
  totalQuestions: number
  correct: number
  accuracyPercent: number
  xpEarned: number
  timeLabel: string
  streakBefore: number
  streakAfter: number
  streakGoalDays: number
  topicRows: TopicProgressRow[]
  nextReviewSummary: string | null
  dueTopicsLine: string | null
  weakArea: WeakAreaPayload | null
  weakAreaDismissed: boolean
  onDismissWeakArea: () => void
  onPracticeWeakArea: () => void
  onDone: () => void
  onAnotherSession: () => void
}

function humanizeTag(tag: string): string {
  if (tag === 'General') return tag
  return tag
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export function SessionCompleteView({
  primaryTopicTitle,
  isMultiTopicSession,
  totalQuestions,
  correct: _correct,
  accuracyPercent,
  xpEarned,
  timeLabel,
  streakBefore,
  streakAfter,
  streakGoalDays,
  topicRows,
  nextReviewSummary,
  dueTopicsLine,
  weakArea,
  weakAreaDismissed,
  onDismissWeakArea,
  onPracticeWeakArea,
  onDone,
  onAnotherSession,
}: SessionCompleteViewProps) {
  const band = PERFORMANCE_BANDS.find((b) => accuracyPercent >= b.min) ?? PERFORMANCE_BANDS[3]
  const bandMessage = isMultiTopicSession ? band.messageMulti : band.message
  const streakIncreased = streakAfter > streakBefore
  const streakProgress = Math.min(100, Math.round((streakAfter / streakGoalDays) * 100))

  const streakLabel = streakIncreased
    ? streakBefore === 0
      ? 'You started your streak today'
      : `Streak: ${streakBefore} day${streakBefore === 1 ? '' : 's'} → ${streakAfter} day${streakAfter === 1 ? '' : 's'}`
    : `Streak: ${streakAfter} day${streakAfter === 1 ? '' : 's'}`

  const bandBorderClass =
    accuracyPercent >= 90
      ? 'border-l-4 border-success pl-4'
      : accuracyPercent >= 70
        ? 'border-l-4 border-primary pl-4'
        : ''

  const headingRef = useRef<HTMLHeadingElement>(null)

  useLayoutEffect(() => {
    headingRef.current?.focus()
  }, [])

  useEffect(() => {
    const prev = document.title
    document.title = isMultiTopicSession
      ? `${DOC_TITLE_PREFIX}Session complete`
      : `${DOC_TITLE_PREFIX}${primaryTopicTitle}`
    return () => {
      document.title = prev
    }
  }, [isMultiTopicSession, primaryTopicTitle])

  const primaryHeadingText = isMultiTopicSession ? 'Your results' : primaryTopicTitle

  return (
    <main
      id="session-complete-main"
      aria-labelledby="session-complete-heading"
      className="mx-auto flex max-w-2xl flex-col gap-8 py-8"
    >
      <div className={cn('border-border flex flex-col gap-2 border-b pb-6', bandBorderClass)}>
        <p className="text-muted-foreground text-sm font-medium">Session complete</p>
        <h1
          ref={headingRef}
          id="session-complete-heading"
          tabIndex={-1}
          className="text-foreground focus-visible:ring-ring rounded-sm text-2xl font-semibold tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          {primaryHeadingText}
        </h1>
        <p className={cn('text-xl font-semibold', band.color)}>{band.label}</p>
        <p className="text-muted-foreground text-sm leading-relaxed">{bandMessage}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="border-border bg-surface-raised rounded-lg border p-4">
          <StatDisplay value={totalQuestions} label="Questions" size="sm" />
        </div>
        <div className="border-border bg-surface-raised rounded-lg border p-4">
          <StatDisplay value={accuracyPercent} unit="%" label="Accuracy" size="sm" />
        </div>
        <div className="border-border bg-surface-raised rounded-lg border p-4">
          <StatDisplay value={xpEarned} unit="xp" label="XP earned" size="sm" />
        </div>
        <div className="border-border bg-surface-raised rounded-lg border p-4">
          <StatDisplay value={timeLabel} label="Time spent" size="sm" />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Flame className="text-primary size-5 shrink-0" aria-hidden />
          <span className="text-foreground text-sm font-medium">{streakLabel}</span>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-muted-foreground flex justify-between text-xs font-medium">
            <span>
              {streakAfter}/{streakGoalDays} day goal
            </span>
          </div>
          <Progress value={streakProgress} className="h-2" />
        </div>
      </div>

      <section className="flex flex-col gap-4">
        <SectionLabel>Topic progress this session</SectionLabel>
        <div className="flex flex-col gap-4">
          {topicRows.map((row) => {
            const sessionPct =
              row.attempted > 0 ? Math.round((row.correct / row.attempted) * 100) : 0
            const barValue = row.overallMasteryPercent ?? sessionPct
            return (
              <div key={row.topicId} className="flex flex-col gap-2">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="text-foreground text-sm font-medium">{row.title}</span>
                  <span className="text-muted-foreground font-mono text-xs tabular-nums">
                    {row.correct}/{row.attempted} this session
                    {row.overallMasteryPercent !== null && (
                      <span className="text-muted-foreground ml-2 font-sans tabular-nums">
                        · Overall {row.overallMasteryPercent}%
                      </span>
                    )}
                  </span>
                </div>
                <Progress value={barValue} className="h-2" />
              </div>
            )
          })}
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <SectionLabel>Next due</SectionLabel>
        {nextReviewSummary ? (
          <>
            <p className="text-foreground text-sm leading-relaxed">
              Next review: <span className="font-medium">{nextReviewSummary}</span>
            </p>
            {dueTopicsLine && (
              <p className="text-muted-foreground text-sm leading-relaxed">{dueTopicsLine}</p>
            )}
          </>
        ) : (
          <p className="text-muted-foreground text-sm leading-relaxed">
            Finish a few more sessions and we'll set up your review schedule automatically.
          </p>
        )}
      </section>

      {weakArea && !weakAreaDismissed && (
        <Card className="border-border bg-surface-raised p-4">
          <p className="text-foreground text-sm leading-relaxed">
            You missed {weakArea.missed}/{weakArea.total} questions on:{' '}
            <span className="font-medium">{humanizeTag(weakArea.tagLabel)}</span>
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Button type="button" size="sm" onClick={onPracticeWeakArea}>
              Practice this area now
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={onDismissWeakArea}>
              Remind me next session
            </Button>
          </div>
        </Card>
      )}

      <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-between">
        <Button type="button" variant="outline" onClick={onDone}>
          Back to home
        </Button>
        <Button type="button" onClick={onAnotherSession}>
          Another session
          <ArrowRight />
        </Button>
      </div>
    </main>
  )
}
