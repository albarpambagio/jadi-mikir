import { useEffect, useMemo, useRef } from 'react'
import { Link } from 'wouter'
import { ArrowRight, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import type { WeakestSubtopicLine } from '@/lib/mastery-gate-aggregates'

export interface MasteryGatePanelProps {
  topicId: string
  /** Suffix for links, e.g. `?from=home` */
  querySuffix: string
  masteryPct: number
  thresholdPct: number
  /** Downstream topic titles (membuka …) */
  unlockTopicTitles: string[]
  cardsNeedingWork: number
  weakestSubtopics: WeakestSubtopicLine[]
  /** Focus/scroll when URL has gate=1 */
  focusOnMount?: boolean
}

export function MasteryGatePanel({
  topicId,
  querySuffix,
  masteryPct,
  thresholdPct,
  unlockTopicTitles,
  cardsNeedingWork,
  weakestSubtopics,
  focusOnMount = false,
}: MasteryGatePanelProps) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!focusOnMount) return
    rootRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    const h = rootRef.current?.querySelector('h2')
    if (h instanceof HTMLElement) h.focus()
  }, [focusOnMount])

  const firstWeak = weakestSubtopics[0]

  const sessionHref = `/session/${topicId}${querySuffix.startsWith('?') ? querySuffix : querySuffix ? `?${querySuffix}` : ''}`

  const drillHref = useMemo(() => {
    if (!firstWeak) return null
    const q = querySuffix.startsWith('?') ? querySuffix.slice(1) : querySuffix
    const params = new URLSearchParams(q)
    params.set('tag', firstWeak.tagKey)
    const s = params.toString()
    return s ? `/session/${topicId}?${s}` : `/session/${topicId}`
  }, [topicId, firstWeak, querySuffix])

  const unlockLine =
    unlockTopicTitles.length > 0
      ? unlockTopicTitles.slice(0, 3).join(', ')
      : 'topik berikutnya'

  return (
    <div ref={rootRef} className="flex flex-col gap-4">
      <Card className="border-border bg-surface-raised">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Kenapa ada mastery gate?</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground space-y-2 text-sm leading-relaxed">
          <p>
            Topik berikutnya ({unlockLine}) membutuhkan fondasi yang kuat di sini. Melanjutkan terlalu
            cepat biasanya menyebabkan frustrasi nanti. Sedikit sabar sekarang = jauh lebih mudah
            kemudian.
          </p>
          <p className="text-muted-foreground/90 text-xs">
            Threshold ({thresholdPct}%) dapat diatur di Pengaturan setelah fitur itu tersedia.
          </p>
        </CardContent>
      </Card>

      <Card className="border-primary/20">
        <CardContent className="flex flex-col gap-4 p-4 sm:p-6">
          <div className="flex items-start gap-3">
            <Trophy className="text-primary mt-0.5 size-8 shrink-0" aria-hidden />
            <div className="min-w-0 flex-1">
              <h2
                tabIndex={-1}
                className="text-foreground text-lg font-semibold outline-none"
              >
                Hampir selesai!
              </h2>
              <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                Tingkatkan penguasaan hingga minimal {thresholdPct}% untuk membuka topik berikutnya
                dengan percaya diri.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <span className="text-muted-foreground font-medium">Mastery sekarang</span>
              <span className="text-foreground font-semibold tabular-nums">
                {masteryPct}%{' '}
                <span className="text-muted-foreground font-normal">(butuh {thresholdPct}%)</span>
              </span>
            </div>
            <Progress
              value={Math.min(100, (masteryPct / Math.max(1, thresholdPct)) * 100)}
              className="h-2"
            />
          </div>

          <p className="text-muted-foreground text-sm">
            <span className="text-foreground font-medium">Kartu yang perlu diperkuat:</span>{' '}
            {cardsNeedingWork} kartu
          </p>

          {weakestSubtopics.length > 0 && (
            <p className="text-muted-foreground text-sm">
              <span className="text-foreground font-medium">Subtopik terlemah:</span>{' '}
              {weakestSubtopics.map((w, i) => (
                <span key={w.tagKey}>
                  {i > 0 ? ' · ' : ''}
                  {w.displayLabel} ({w.accuracyPercent}%)
                </span>
              ))}
            </p>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button className="sm:min-w-44" asChild>
              <Link href={sessionHref}>
                Lanjutkan review
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
            {drillHref && firstWeak ? (
              <Button variant="outline" className="sm:min-w-44" asChild>
                <Link href={drillHref}>
                  Latih {firstWeak.displayLabel} dulu
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
