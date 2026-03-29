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
    label: 'Sempurna!',
    color: 'text-success',
    message: 'Tanpa cela. Topik ini sudah melekat di ingatanmu.',
    messageMulti:
      'Tanpa cela di beberapa topik dalam sesi ini. Pertahankan ritmemu.',
  },
  {
    min: 70,
    label: 'Bagus!',
    color: 'text-primary',
    message: 'Sesi yang kuat. Beberapa lagi seperti ini dan akan menguat.',
    messageMulti:
      'Sesi yang kuat di topik-topik ini. Beberapa lagi seperti ini dan akan menguat.',
  },
  {
    min: 40,
    label: 'Usaha bagus',
    color: 'text-foreground',
    message: 'Kamu berkembang. Konsistensi akan membawamu ke sana.',
    messageMulti: 'Kamu berkembang. Konsistensi akan membawamu ke sana.',
  },
  {
    min: 0,
    label: 'Terus berlatih',
    color: 'text-foreground',
    message: 'Sulit, tapi setiap percobaan membangun pola — kembali besok.',
    messageMulti: 'Sulit, tapi setiap percobaan membangun pola — kembali besok.',
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
  if (tag === 'General') return 'Umum'
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
      ? 'Kamu memulai streak hari ini'
      : `Streak: ${streakBefore} hari → ${streakAfter} hari`
    : `Streak: ${streakAfter} hari`

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
      ? `${DOC_TITLE_PREFIX}Sesi selesai`
      : `${DOC_TITLE_PREFIX}${primaryTopicTitle}`
    return () => {
      document.title = prev
    }
  }, [isMultiTopicSession, primaryTopicTitle])

  const primaryHeadingText = isMultiTopicSession ? 'Hasilmu' : primaryTopicTitle

  return (
    <main
      id="session-complete-main"
      aria-labelledby="session-complete-heading"
      className="mx-auto flex max-w-2xl flex-col gap-8 py-8"
    >
      <div className={cn('border-border flex flex-col gap-2 border-b pb-6', bandBorderClass)}>
        <p className="text-muted-foreground text-sm font-medium">Sesi selesai</p>
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
          <StatDisplay value={totalQuestions} label="Pertanyaan" size="sm" />
        </div>
        <div className="border-border bg-surface-raised rounded-lg border p-4">
          <StatDisplay value={accuracyPercent} unit="%" label="Akurasi" size="sm" />
        </div>
        <div className="border-border bg-surface-raised rounded-lg border p-4">
          <StatDisplay value={xpEarned} unit="xp" label="XP" size="sm" />
        </div>
        <div className="border-border bg-surface-raised rounded-lg border p-4">
          <StatDisplay value={timeLabel} label="Waktu" size="sm" />
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
              Tujuan: {streakAfter}/{streakGoalDays} hari
            </span>
          </div>
          <Progress value={streakProgress} className="h-2" />
        </div>
      </div>

      <section className="flex flex-col gap-4">
        <SectionLabel>Progres topik sesi ini</SectionLabel>
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
                    {row.correct}/{row.attempted} benar di sesi ini
                    {row.overallMasteryPercent !== null && (
                      <span className="text-muted-foreground ml-2 font-sans tabular-nums">
                        · Keseluruhan {row.overallMasteryPercent}%
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

      {weakArea && !weakAreaDismissed && (
        <section className="flex flex-col gap-4">
          <SectionLabel>Area lemah</SectionLabel>
          <Card className="border-border bg-surface-raised p-4">
            <p className="text-foreground text-sm leading-relaxed">
              Kamu melewatkan {weakArea.missed}/{weakArea.total} soal pada:{' '}
              <span className="font-medium">{humanizeTag(weakArea.tagLabel)}</span>
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <Button type="button" size="sm" onClick={onPracticeWeakArea}>
                Latihan area ini sekarang
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={onDismissWeakArea}>
                Ingatkan di sesi berikutnya
              </Button>
            </div>
          </Card>
        </section>
      )}

      <section className="flex flex-col gap-2">
        <SectionLabel>Jadwal berikutnya</SectionLabel>
        {nextReviewSummary ? (
          <>
            <p className="text-foreground text-sm leading-relaxed">
              Review berikutnya:{' '}
              <span className="font-medium">{nextReviewSummary}</span>
            </p>
            {dueTopicsLine && (
              <p className="text-muted-foreground text-sm leading-relaxed">
                Topik: {dueTopicsLine}
              </p>
            )}
          </>
        ) : (
          <p className="text-muted-foreground text-sm leading-relaxed">
            Selesaikan beberapa sesi lagi — jadwal review akan terbentuk otomatis.
          </p>
        )}
      </section>

      <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-between">
        <Button type="button" variant="outline" onClick={onDone}>
          Kembali ke beranda
        </Button>
        <Button type="button" onClick={onAnotherSession}>
          Tinjau lebih lanjut
          <ArrowRight />
        </Button>
      </div>
    </main>
  )
}
