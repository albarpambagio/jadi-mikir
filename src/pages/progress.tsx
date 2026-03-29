import { useMemo, useState, useEffect } from 'react'
import { Link } from 'wouter'
import { AlertCircle, ArrowLeft, ArrowRight, Download } from 'lucide-react'
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
            Kembali
          </Link>
        </Button>
        <h1 className="text-foreground text-xl font-semibold">Dashboard progres</h1>
      </div>

      {totalDue > 0 && (
        <section className="flex flex-col gap-4">
          <SectionLabel>Kartu perlu ditinjau</SectionLabel>
          <div className="border-border bg-surface-raised flex flex-col gap-4 rounded-lg border p-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex min-w-0 flex-1 gap-3">
                <AlertCircle
                  className="text-primary mt-0.5 size-5 shrink-0"
                  aria-hidden
                />
                <div className="flex min-w-0 flex-col gap-1">
                  <p className="text-foreground text-sm font-medium">
                    {totalDue === 1
                      ? '1 kartu sudah jatuh tempo'
                      : `${totalDue.toLocaleString()} kartu sudah jatuh tempo`}
                  </p>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Tinjau sekarang untuk menjaga retensi memorimu.
                  </p>
                </div>
              </div>
              <Button size="sm" className="shrink-0" asChild>
                <Link href="/session">
                  Tinjau Sekarang
                  <ArrowRight aria-hidden />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      <section className="flex flex-col gap-4">
        <SectionLabel>Ringkasan</SectionLabel>
        {!hasData ? (
          <div className="border-border bg-surface-raised flex flex-wrap items-center justify-between gap-4 rounded-lg border p-4">
            <p className="text-muted-foreground text-sm">
              Selesaikan sesi pertama untuk melihat statistik di sini.
            </p>
            <Button size="sm" asChild>
              <Link href="/session">Mulai sesi</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="border-border bg-surface-raised rounded-lg border p-4">
              <StatDisplay value={totalQuestions.toLocaleString()} label="Pertanyaan" size="sm" />
            </div>
            <div className="border-border bg-surface-raised rounded-lg border p-4">
              <StatDisplay
                value={accuracyDisplay}
                unit={hasData ? '%' : undefined}
                label="Akurasi"
                size="sm"
              />
            </div>
            <div className="border-border bg-surface-raised rounded-lg border p-4">
              <StatDisplay value={totalXP.toLocaleString()} label="XP diperoleh" size="sm" />
            </div>
            <div className="border-border bg-surface-raised rounded-lg border p-4">
              <StatDisplay value={streak} unit="hari" label="Streak" size="sm" />
            </div>
          </div>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <SectionLabel>Penguasaan per topik</SectionLabel>
        {isLoading ? (
          <p className="text-muted-foreground text-sm">Memuat topik…</p>
        ) : getSortedTopics.length === 0 ? (
          <p className="text-muted-foreground text-sm">Belum ada topik yang dimulai.</p>
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
                          · {topic.dueCount} jatuh tempo
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
        <SectionLabel>Kesehatan retensi</SectionLabel>
        <div className="border-border bg-surface-raised flex flex-col gap-4 rounded-lg border p-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-foreground text-sm font-medium">
                Kartu yang diingat setelah 30 hari
              </span>
              <span className="text-muted-foreground font-mono text-xs tabular-nums">
                {retainedPercent}%
              </span>
            </div>
            <MasteryBar value={retainedPercent} className="h-2" />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-muted-foreground text-sm">
              Kartu terlambat saat ini:{' '}
              <span className="text-foreground font-medium tabular-nums">{totalDue}</span>
            </span>
            {totalDue === 0 && hasData ? (
              <Button size="sm" variant="outline" asChild>
                <Link href="/">Kembali ke beranda</Link>
              </Button>
            ) : null}
          </div>
        </div>
      </section>

      <div className="pt-2">
        <Button variant="outline" onClick={downloadExport}>
          <Download aria-hidden />
          Ekspor data saya
        </Button>
      </div>
    </div>
  )
}
