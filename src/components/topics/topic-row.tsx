import { Link } from 'wouter'
import { ArrowRight } from 'lucide-react'
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
        Locked
      </Button>
    )
  }

  const label =
    topic.status === 'mastered'
      ? 'Review'
      : topic.status === 'inProgress' && topic.dueCount > 0
        ? 'Continue'
        : topic.status === 'inProgress'
          ? 'Study'
          : 'Start'

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
  const pct = topic.masteryProgress?.current ?? 0
  const showBar = topic.status === 'inProgress' || topic.status === 'mastered'
  const isLocked = topic.status === 'locked'

  return (
    <div className={cn('flex flex-col gap-2 p-4', isLocked && 'opacity-60')}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-start gap-2">
          <StatusIcon status={topic.status} />
          <div className="flex min-w-0 flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-foreground text-sm font-medium leading-snug">{topic.title}</span>
              {topic.dueCount > 0 && (
                <Badge variant="tag-primary">{topic.dueCount} due</Badge>
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
                    Prereqs:{' '}
                    {topic.prereqInfo.map((p, i) => (
                      <span key={p.topicId}>
                        {i > 0 && ' · '}
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
                    {topic.nextReviewDays === 0 ? 'Due today' : `Review in ${topic.nextReviewDays}d`}
                  </span>
                )}
              </div>
            )}

            {/* Available: prereq satisfied list */}
            {topic.status === 'available' && topic.prereqInfo.length > 0 && (
              <p className="text-muted-foreground text-xs">
                Prereqs:{' '}
                {topic.prereqInfo.map((p, i) => (
                  <span key={p.topicId}>
                    {i > 0 && ' · '}
                    <span className="text-success">✓</span> {p.title}
                  </span>
                ))}
              </p>
            )}

            {/* Locked: unsatisfied prereqs */}
            {topic.status === 'locked' && topic.prereqInfo.length > 0 && (
              <p className="text-muted-foreground text-xs">
                Needs:{' '}
                {topic.prereqInfo
                  .filter((p) => !p.satisfied)
                  .map((p, i) => (
                    <span key={p.topicId}>
                      {i > 0 && ' · '}
                      {p.title} ({p.currentPct}%)
                    </span>
                  ))}
              </p>
            )}
          </div>
        </div>
        <CtaButton topic={topic} />
      </div>

      {showBar && (
        pct === 0 ? (
          <div className="h-1.5 w-full rounded-full bg-border" />
        ) : (
          <Progress value={pct} className="h-1.5" />
        )
      )}
    </div>
  )
}
