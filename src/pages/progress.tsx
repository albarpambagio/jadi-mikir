import { useMemo, useState, useEffect } from 'react'
import { Link } from 'wouter'
import { ArrowLeft, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { SectionLabel } from '@/components/ui/section-label'
import { StatDisplay } from '@/components/ui/stat-display'
import { cn } from '@/lib/utils'
import { useDashboardStats } from '@/lib/hooks/use-dashboard-stats'
import { learnerStore } from '@/store/learnerStore'
import { downloadExport } from '@/lib/engines/exportImport'
import type { LearnerState } from '@/types'

// Renders a neutral placeholder track when value is 0 so the bar
// doesn't read as "full" due to the bg-secondary track color.
function MasteryBar({ value, className }: { value: number; className?: string }) {
  if (value === 0) {
    return <div className={cn('h-1.5 w-full rounded-full bg-border', className)} />
  }
  return <Progress value={value} className={className} />
}

function useLearnerState(): LearnerState {
  const [state, setState] = useState(() => learnerStore.get())
  useEffect(() => {
    const sub = learnerStore.subscribe((s) => setState(s))
    return () => sub.unsubscribe()
  }, [])
  return state
}

function computeAccuracy(reviewLogs: LearnerState['reviewLogs']): number {
  if (reviewLogs.length === 0) return 0
  const correct = reviewLogs.filter(
    (log) => log.rating === 'good' || log.rating === 'easy',
  ).length
  return Math.round((correct / reviewLogs.length) * 100)
}

function computeRetentionHealth(cards: LearnerState['cards']): {
  retainedPercent: number
} {
  const reviewed = Object.values(cards).filter((c) => c.reps > 0)
  if (reviewed.length === 0) return { retainedPercent: 0 }
  const retained = reviewed.filter((c) => c.scheduledDays >= 30).length
  return {
    retainedPercent: Math.round((retained / reviewed.length) * 100),
  }
}

export function ProgressDashboardPage() {
  const { streak, totalXP, totalDue, getSortedTopics, isLoading } = useDashboardStats()
  const learnerState = useLearnerState()

  const totalQuestions = learnerState.reviewLogs.length
  const accuracyPercent = useMemo(
    () => computeAccuracy(learnerState.reviewLogs),
    [learnerState.reviewLogs],
  )
  const { retainedPercent } = useMemo(
    () => computeRetentionHealth(learnerState.cards),
    [learnerState.cards],
  )

  // Show "—" when there are no reviews yet so it reads as "no data" not "0%"
  const accuracyDisplay = totalQuestions === 0 ? '—' : String(accuracyPercent)
  const hasData = totalQuestions > 0

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8 py-8">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">
            <ArrowLeft aria-hidden />
            Back
          </Link>
        </Button>
        <h1 className="text-foreground text-xl font-semibold">Progress dashboard</h1>
      </div>

      <section className="flex flex-col gap-4">
        <SectionLabel>Summary</SectionLabel>
        {!hasData ? (
          <div className="border-border bg-surface-raised flex flex-wrap items-center justify-between gap-4 rounded-lg border p-4">
            <p className="text-muted-foreground text-sm">
              Complete your first session to see stats here.
            </p>
            <Button size="sm" asChild>
              <Link href="/session">Start session</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="border-border bg-surface-raised rounded-lg border p-4">
              <StatDisplay value={totalQuestions.toLocaleString()} label="Questions" size="sm" />
            </div>
            <div className="border-border bg-surface-raised rounded-lg border p-4">
              <StatDisplay
                value={accuracyDisplay}
                unit={hasData ? '%' : undefined}
                label="Accuracy"
                size="sm"
              />
            </div>
            <div className="border-border bg-surface-raised rounded-lg border p-4">
              <StatDisplay value={totalXP.toLocaleString()} label="XP earned" size="sm" />
            </div>
            <div className="border-border bg-surface-raised rounded-lg border p-4">
              <StatDisplay
                value={streak}
                unit={streak === 1 ? 'day' : 'days'}
                label="Streak"
                size="sm"
              />
            </div>
          </div>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <SectionLabel>Mastery by topic</SectionLabel>
        {isLoading ? (
          <p className="text-muted-foreground text-sm">Loading topics…</p>
        ) : getSortedTopics.length === 0 ? (
          <p className="text-muted-foreground text-sm">No topics started yet.</p>
        ) : (
          <div className="border-border bg-surface-raised divide-border divide-y rounded-lg border">
            {getSortedTopics.map((topic) => {
              const pct = topic.masteryProgress?.current ?? 0
              const levelName = topic.masteryProgress?.levelName ?? 'Not started'
              const isStarted = topic.masteryProgress !== null
              const isComplete = topic.masteryProgress?.level === 5

              return (
                <div key={topic.id} className="flex flex-col gap-2 p-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-foreground text-sm font-medium">{topic.title}</span>
                    <div className="flex items-baseline gap-1.5">
                      <span
                        className={`text-xs font-medium tabular-nums ${
                          isComplete
                            ? 'text-success'
                            : isStarted
                              ? 'text-primary'
                              : 'text-muted-foreground'
                        }`}
                      >
                        {isStarted ? `${pct}%` : levelName}
                      </span>
                      {isStarted && (
                        <span className="text-muted-foreground text-xs">· {levelName}</span>
                      )}
                      {topic.dueCount > 0 && (
                        <span className="text-muted-foreground text-xs tabular-nums">
                          · {topic.dueCount} due
                        </span>
                      )}
                    </div>
                  </div>
                  {isStarted && <MasteryBar value={pct} className="h-1.5" />}
                </div>
              )
            })}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <SectionLabel>Retention health</SectionLabel>
        <div className="border-border bg-surface-raised flex flex-col gap-4 rounded-lg border p-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-foreground text-sm font-medium">
                Cards retained at 30 days
              </span>
              <span className="text-muted-foreground font-mono text-xs tabular-nums">
                {retainedPercent}%
              </span>
            </div>
            <MasteryBar value={retainedPercent} className="h-2" />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-muted-foreground text-sm">
              Cards currently overdue:{' '}
              <span className="text-foreground font-medium tabular-nums">{totalDue}</span>
            </span>
            {totalDue > 0 ? (
              <Button size="sm" asChild>
                <Link href="/session">Review now</Link>
              </Button>
            ) : hasData ? (
              <Button size="sm" variant="outline" asChild>
                <Link href="/">Back to home</Link>
              </Button>
            ) : null}
          </div>
        </div>
      </section>

      <div className="pt-2">
        <Button variant="outline" onClick={downloadExport}>
          <Download aria-hidden />
          Export my data
        </Button>
      </div>
    </div>
  )
}
