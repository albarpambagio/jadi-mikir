import { Link, useLocation } from 'wouter'
import { ArrowRight } from 'lucide-react'
import { toSlug } from '@/lib/hooks/use-topic-browser'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import type { TopicWithStatus } from '@/lib/hooks/use-topic-browser'

interface TopicRowProps {
  topic: TopicWithStatus
}

function StatusIcon({ status }: { status: TopicWithStatus['status'] }) {
  if (status === 'inProgress') {
    return <span className="bg-primary mt-0.5 size-2 shrink-0 rounded-full" aria-hidden />
  }
  if (status === 'mastered') {
    return <span className="bg-success mt-0.5 size-2 shrink-0 rotate-45 rounded-sm" aria-hidden />
  }
  if (status === 'available') {
    return (
      <span className="border-muted-foreground mt-0.5 size-2 shrink-0 rounded-full border-2" aria-hidden />
    )
  }
  // locked
  return (
    <span className="border-border mt-0.5 size-2 shrink-0 rounded-full border-2 opacity-40" aria-hidden />
  )
}

function CtaButton({ topic }: { topic: TopicWithStatus }) {
  if (topic.status === 'locked') {
    return (
      <Button size="sm" variant="outline" disabled className="shrink-0">
        Terkunci
      </Button>
    )
  }

  const label =
    topic.status === 'mastered'
      ? 'Tinjau'
      : topic.status === 'inProgress' && topic.dueCount > 0
        ? 'Lanjut'
        : topic.status === 'inProgress'
          ? 'Belajar'
          : 'Mulai'

  return (
    <Button
      size="sm"
      variant={topic.status === 'available' ? 'default' : 'outline'}
      asChild
      className="shrink-0"
    >
      <Link href={`/session/${topic.id}`}>
        {label}
        <ArrowRight aria-hidden />
      </Link>
    </Button>
  )
}

export function TopicRow({ topic }: TopicRowProps) {
  const [location] = useLocation()
  const pct = topic.masteryProgress?.current ?? 0
  const showBar =
    topic.status === 'mastered' ||
    (topic.status === 'inProgress' && pct > 0)
  const isLocked = topic.status === 'locked'

  const prereqSep = ', '

  return (
    <div className={cn('flex flex-col gap-2 p-4', isLocked && 'opacity-60')}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-start gap-2">
          <StatusIcon status={topic.status} />
          <div className="flex min-w-0 flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/topics/${toSlug(topic.subject)}/${topic.id}?from=${encodeURIComponent(location)}`}
                className="cursor-pointer text-foreground hover:text-primary text-sm leading-snug font-medium underline-offset-2 hover:underline"
              >
                {topic.title}
              </Link>
              {topic.dueCount > 0 && (
                <Badge variant="tag-primary">{topic.dueCount} jatuh</Badge>
              )}
            </div>

            {/* In-progress: prereqs + mastery % */}
            {topic.status === 'inProgress' && (
              <div className="flex flex-col gap-0.5">
                {topic.masteryProgress && (
                  <span className="text-muted-foreground text-xs tabular-nums">{pct}%</span>
                )}
                {topic.prereqInfo.length > 0 && (
                  <p className="text-muted-foreground text-xs">
                    Prasyarat:{' '}
                    {topic.prereqInfo.map((p, i) => (
                      <span key={p.topicId}>
                        {i > 0 && prereqSep}
                        <span className="text-success">✓</span> {p.title}
                      </span>
                    ))}
                  </p>
                )}
              </div>
            )}

            {/* Mastered: % + next review hint */}
            {topic.status === 'mastered' && (
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                {topic.masteryProgress && (
                  <span className="text-muted-foreground text-xs tabular-nums">{pct}%</span>
                )}
                {topic.nextReviewDays !== null && (
                  <span className="text-muted-foreground text-xs">
                    {topic.nextReviewDays === 0
                      ? 'Jatuh tempo hari ini'
                      : `Tinjau dalam ${topic.nextReviewDays} hari`}
                  </span>
                )}
              </div>
            )}

            {/* Available: prereq satisfied list */}
            {topic.status === 'available' && topic.prereqInfo.length > 0 && (
              <p className="text-muted-foreground text-xs">
                Prasyarat:{' '}
                {topic.prereqInfo.map((p, i) => (
                  <span key={p.topicId}>
                    {i > 0 && prereqSep}
                    <span className="text-success">✓</span> {p.title}
                  </span>
                ))}
              </p>
            )}

            {/* Locked: unsatisfied prereqs */}
            {topic.status === 'locked' && topic.prereqInfo.length > 0 && (
              <p className="text-muted-foreground text-xs">
                Butuh:{' '}
                {topic.prereqInfo
                  .filter((p) => !p.satisfied)
                  .map((p, i) => (
                    <span key={p.topicId}>
                      {i > 0 && prereqSep}
                      <span className="text-destructive">✗</span> {p.title} ({p.currentPct}%)
                    </span>
                  ))}
              </p>
            )}
          </div>
        </div>
        <CtaButton topic={topic} />
      </div>

      {showBar && <Progress value={pct} className="h-1.5" />}
    </div>
  )
}
